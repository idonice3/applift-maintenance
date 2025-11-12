import maintenanceHtml from "./index.html";
import css from "./style.css";
import logo from "./applift-logo.svg";

function parseCookies(cookieHeader) {
  if (typeof cookieHeader !== "string" || !cookieHeader.trim()) {
    return {};
  }

  return Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k, v.join("=")];
    })
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/style.css") {
      return new Response(css, {
        headers: {
          "content-type": "text/css; charset=utf-8",
          "cache-control": "public, max-age=3600",
        },
      });
    }

    if (url.pathname === "/applift-logo.svg") {
      return new Response(logo, {
        headers: {
          "content-type": "image/svg+xml",
          "cache-control": "public, max-age=3600",
        },
      });
    }

    const cookies = parseCookies(request.headers.get("Cookie"));
    const hasAccess = cookies.dev_access === env.DEV_ACCESS_KEY;

    if (hasAccess) {
      return this.fetch(request);
    }

    return new Response(maintenanceHtml, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-cache",
      },
      status: 503,
    });
  },
};
