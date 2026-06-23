import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Garde-robe",
    short_name: "Garde-robe",
    description: "Gestionnaire de garde-robe personnelle",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#faf9f7",
    theme_color: "#faf9f7",
    lang: "fr",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
