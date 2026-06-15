import type { SupabaseClient } from "@supabase/supabase-js";
import JSZip from "jszip";
import { rowsToCsv } from "@/lib/privacy/csv";
import { ITEM_IMAGES_BUCKET } from "@/lib/storage/paths";

const EXPORT_FORMAT = "garde-robe-export-v2";
const IMAGE_DOWNLOAD_CONCURRENCY = 5;

const README = `Garde-robe — Export de données personnelles
=======================================

Cette archive contient une copie de vos données personnelles depuis Garde-robe.

Fichiers inclus :
- data.json       Export complet au format JSON (lisible par machine)
- items.csv       Résumé des articles de la garde-robe (compatible tableur)
- outfits.csv     Résumé des tenues enregistrées
- calendar.csv    Dates de tenues planifiées
- images/         Vos photos de garde-robe téléversées

Exporté en vertu de votre droit à la portabilité des données (RGPD).
`;

type ExportImagePaths = {
  original: string | null;
  processed: string | null;
};

type ExportItemRow = {
  id: string;
  name: string;
  item_type: string;
  category_id: string | null;
  color_id: string | null;
  brand_id: string | null;
  occasion_tags: string[] | null;
  image_path: string | null;
  processed_image_path: string | null;
  remove_background: boolean | null;
  image_processing_status: string | null;
  notes: string | null;
  price: number | null;
  currency_code: string | null;
  created_at: string;
  updated_at: string;
  categories: { id: string; name: string; item_type: string } | { id: string; name: string; item_type: string }[] | null;
  brands: { id: string; name: string } | { id: string; name: string }[] | null;
  colors: { id: string; name: string; hex_code: string | null } | { id: string; name: string; hex_code: string | null }[] | null;
  item_seasons: { seasons: { id: string; name: string } | { id: string; name: string }[] | null }[] | null;
};

type ExportOutfitRow = {
  id: string;
  name: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  outfit_items: {
    item_id: string;
    position_x: number;
    position_y: number;
    scale: number;
    rotation: number;
    z_index: number;
  }[] | null;
};

type ExportCalendarRow = {
  id: string;
  outfit_id: string;
  scheduled_date: string;
  occasion: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  outfits: { name: string } | { name: string }[] | null;
};

type MappedExportItem = {
  id: string;
  name: string;
  item_type: string;
  category: { id: string; name: string } | null;
  brand: { id: string; name: string } | null;
  color: { id: string; name: string; hex_code: string | null } | null;
  seasons: { id: string; name: string }[];
  occasion_tags: string[];
  notes: string | null;
  price: number | null;
  currency_code: string | null;
  image_paths: ExportImagePaths;
  created_at: string;
  updated_at: string;
};

function firstRelation<T>(value: T | T[] | null): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }
  return value;
}

function sanitizeFilename(path: string): string {
  return path.replace(/\//g, "_");
}

function getOutfitName(row: ExportCalendarRow): string {
  const outfits = row.outfits;
  if (Array.isArray(outfits)) {
    return outfits[0]?.name ?? "Tenue sans titre";
  }
  return outfits?.name ?? "Tenue sans titre";
}

async function downloadStorageFile(
  supabase: SupabaseClient,
  path: string,
): Promise<ArrayBuffer | null> {
  const { data, error } = await supabase.storage.from(ITEM_IMAGES_BUCKET).download(path);

  if (error || !data) {
    return null;
  }

  return data.arrayBuffer();
}

function getImagePaths(item: ExportItemRow): ExportImagePaths {
  const displayPath =
    item.remove_background &&
    item.image_processing_status === "completed" &&
    item.processed_image_path
      ? item.processed_image_path
      : item.image_path;

  return {
    original: item.image_path,
    processed: displayPath !== item.image_path ? displayPath : item.processed_image_path,
  };
}

function mapExportItem(item: ExportItemRow): MappedExportItem {
  const category = firstRelation(item.categories);
  const brand = firstRelation(item.brands);
  const color = firstRelation(item.colors);

  return {
    id: item.id,
    name: item.name,
    item_type: item.item_type,
    category: category ? { id: category.id, name: category.name } : null,
    brand: brand ? { id: brand.id, name: brand.name } : null,
    color: color ? { id: color.id, name: color.name, hex_code: color.hex_code } : null,
    seasons: (item.item_seasons ?? [])
      .map((entry) => firstRelation(entry.seasons))
      .filter((season): season is { id: string; name: string } => season !== null),
    occasion_tags: item.occasion_tags ?? [],
    notes: item.notes,
    price: item.price !== null ? Number(item.price) : null,
    currency_code: item.currency_code,
    image_paths: getImagePaths(item),
    created_at: item.created_at,
    updated_at: item.updated_at,
  };
}

function buildItemsCsv(items: MappedExportItem[]): string {
  return rowsToCsv(
    ["id", "name", "type", "category", "brand", "color", "seasons", "tags", "notes", "price", "currency"],
    items.map((item) => [
      item.id,
      item.name,
      item.item_type,
      item.category?.name ?? "",
      item.brand?.name ?? "",
      item.color?.name ?? "",
      item.seasons.map((season) => season.name).join("; "),
      item.occasion_tags.join("; "),
      item.notes ?? "",
      item.price,
      item.currency_code ?? "",
    ]),
  );
}

function buildOutfitsCsv(
  outfits: ExportOutfitRow[],
): string {
  return rowsToCsv(
    ["id", "name", "notes", "item_count", "created_at"],
    outfits.map((outfit) => [
      outfit.id,
      outfit.name,
      outfit.notes ?? "",
      outfit.outfit_items?.length ?? 0,
      outfit.created_at,
    ]),
  );
}

function buildCalendarCsv(entries: ExportCalendarRow[]): string {
  return rowsToCsv(
    ["scheduled_date", "outfit_name", "outfit_id", "notes", "occasion"],
    entries.map((entry) => [
      entry.scheduled_date,
      getOutfitName(entry),
      entry.outfit_id,
      entry.notes ?? "",
      entry.occasion ?? "",
    ]),
  );
}

async function addImagesToZip(
  supabase: SupabaseClient,
  zip: JSZip,
  items: ExportItemRow[],
): Promise<void> {
  const imagesFolder = zip.folder("images");
  const seenPaths = new Set<string>();
  const paths: string[] = [];

  for (const item of items) {
    const imagePaths = getImagePaths(item);

    for (const path of [imagePaths.original, imagePaths.processed]) {
      if (!path || seenPaths.has(path)) {
        continue;
      }

      seenPaths.add(path);
      paths.push(path);
    }
  }

  for (let i = 0; i < paths.length; i += IMAGE_DOWNLOAD_CONCURRENCY) {
    const batch = paths.slice(i, i + IMAGE_DOWNLOAD_CONCURRENCY);
    const buffers = await Promise.all(
      batch.map((path) => downloadStorageFile(supabase, path)),
    );

    batch.forEach((path, index) => {
      const buffer = buffers[index];
      if (buffer) {
        imagesFolder?.file(sanitizeFilename(path), buffer);
      }
    });
  }
}

export async function buildUserDataExport(
  supabase: SupabaseClient,
  userId: string,
  email: string,
  accountCreatedAt: string | null,
): Promise<{ filename: string; data: ArrayBuffer }> {
  const [
    profileResult,
    categoriesResult,
    brandsResult,
    itemsResult,
    outfitsResult,
    calendarResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("currency_code, created_at, updated_at")
      .eq("id", userId)
      .maybeSingle(),
    supabase.from("categories").select("id, name, item_type, created_at").order("name"),
    supabase.from("brands").select("id, name, created_at").order("name"),
    supabase
      .from("items")
      .select(`
        id,
        name,
        item_type,
        category_id,
        color_id,
        brand_id,
        occasion_tags,
        image_path,
        processed_image_path,
        remove_background,
        image_processing_status,
        notes,
        price,
        currency_code,
        created_at,
        updated_at,
        categories ( id, name, item_type ),
        brands ( id, name ),
        colors ( id, name, hex_code ),
        item_seasons ( seasons ( id, name ) )
      `)
      .order("created_at", { ascending: false }),
    supabase
      .from("outfits")
      .select(`
        id,
        name,
        notes,
        created_at,
        updated_at,
        outfit_items (
          item_id,
          position_x,
          position_y,
          scale,
          rotation,
          z_index
        )
      `)
      .order("updated_at", { ascending: false }),
    supabase
      .from("outfit_calendar_entries")
      .select("id, outfit_id, scheduled_date, occasion, notes, created_at, updated_at, outfits(name)")
      .order("scheduled_date", { ascending: true }),
  ]);

  for (const result of [
    profileResult,
    categoriesResult,
    brandsResult,
    itemsResult,
    outfitsResult,
    calendarResult,
  ]) {
    if (result.error) {
      throw new Error(result.error.message);
    }
  }

  const items = (itemsResult.data ?? []) as ExportItemRow[];
  const outfits = (outfitsResult.data ?? []) as ExportOutfitRow[];
  const calendarEntries = (calendarResult.data ?? []) as ExportCalendarRow[];
  const mappedItems = items.map(mapExportItem);
  const itemNameById = new Map(mappedItems.map((item) => [item.id, item.name]));

  const exportPayload = {
    exportedAt: new Date().toISOString(),
    format: EXPORT_FORMAT,
    account: {
      id: userId,
      email,
      created_at: accountCreatedAt,
    },
    profile: profileResult.data,
    categories: categoriesResult.data ?? [],
    brands: brandsResult.data ?? [],
    items: mappedItems,
    outfits: outfits.map((outfit) => ({
      id: outfit.id,
      name: outfit.name,
      notes: outfit.notes,
      items: (outfit.outfit_items ?? []).map((placement) => ({
        itemId: placement.item_id,
        itemName: itemNameById.get(placement.item_id) ?? null,
        x: placement.position_x,
        y: placement.position_y,
        scale: placement.scale,
        rotation: placement.rotation,
        zIndex: placement.z_index,
      })),
      created_at: outfit.created_at,
      updated_at: outfit.updated_at,
    })),
    calendarEntries: calendarEntries.map((entry) => ({
      id: entry.id,
      outfit_id: entry.outfit_id,
      outfit_name: getOutfitName(entry),
      scheduled_date: entry.scheduled_date,
      occasion: entry.occasion,
      notes: entry.notes,
      created_at: entry.created_at,
      updated_at: entry.updated_at,
    })),
  };

  const zip = new JSZip();
  zip.file("README.txt", README);
  zip.file("data.json", JSON.stringify(exportPayload, null, 2));
  zip.file("items.csv", buildItemsCsv(mappedItems));
  zip.file("outfits.csv", buildOutfitsCsv(outfits));
  zip.file("calendar.csv", buildCalendarCsv(calendarEntries));

  await addImagesToZip(supabase, zip, items);

  const data = await zip.generateAsync({
    type: "arraybuffer",
    compression: "DEFLATE",
  });

  const dateStamp = new Date().toISOString().slice(0, 10);

  return {
    filename: `garde-robe-export-${dateStamp}.zip`,
    data,
  };
}
