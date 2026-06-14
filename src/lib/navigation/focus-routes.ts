/** Routes where bottom tab bar is hidden for focus tasks (builder, long forms). */
export function isFocusRoute(pathname: string): boolean {
  if (pathname === "/outfits/new") {
    return true;
  }

  if (/^\/outfits\/[^/]+$/.test(pathname) && pathname !== "/outfits/new") {
    return true;
  }

  if (pathname === "/wardrobe/new") {
    return true;
  }

  if (/^\/wardrobe\/[^/]+\/edit$/.test(pathname)) {
    return true;
  }

  return false;
}
