function parseCookies(cookieHeader = "") {
  return Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k, v.join("=")];
    })
  );
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const cookies = parseCookies(request.headers.get("Cookie"));
    const hasAccess = cookies.dev_access === env.DEV_ACCESS_KEY;

    // אם מצב תחזוקה כבוי או שיש גישה — תפנה לאתר החי
    if (!env.MAINTENANCE_MODE || hasAccess) {
      return fetch(env.LIVE_SITE + url.pathname);
    }

    // נשתמש ב-Assets של Cloudflare כדי לשרת קבצים מה-public
    const assetUrl = new URL(url.pathname, request.url);
    try {
      // נסה להחזיר קובץ סטטי מה-public
      return await env.ASSETS.fetch(assetUrl, request);
    } catch {
      // אם לא נמצא קובץ — החזר את index.html
      return await env.ASSETS.fetch(
        new URL("/index.html", request.url),
        request
      );
    }
  },
};
