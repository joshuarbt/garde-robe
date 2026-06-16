import { isFocusRoute } from "@/lib/navigation/focus-routes";

const TAB_BAR_PREFIXES = [
  "/wardrobe",
  "/outfits",
  "/calendar",
  "/voyages",
  "/dashboard",
  "/compte",
] as const;

function isAuthRoute(pathname: string): boolean {
  return pathname === "/login" || pathname === "/signup";
}

const PUBLIC_ROUTES = new Set([
  "/",
  "/cgu",
  "/confidentialite",
  "/account-deleted",
]);

/** Routes where the mobile bottom tab bar should appear (authenticated app shell). */
export function isTabBarRoute(pathname: string): boolean {
  if (isFocusRoute(pathname) || isAuthRoute(pathname) || PUBLIC_ROUTES.has(pathname)) {
    return false;
  }

  return TAB_BAR_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
