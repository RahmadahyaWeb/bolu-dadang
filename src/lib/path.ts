const base = import.meta.env.BASE_URL.replace(/\/$/, "");

/** Prefix an internal path with the deploy base (GitHub Pages project path). */
export function href(path = "/"): string {
  if (path === "/") return `${base}/`;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Remove the deploy base so active-nav comparisons use app paths. */
export function stripBase(pathname: string): string {
  if (!base) return pathname;
  return pathname.startsWith(base) ? pathname.slice(base.length) || "/" : pathname;
}
