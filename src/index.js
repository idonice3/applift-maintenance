import maintenanceHtml from "./index.html";
import css from "./style.css";
import logo from "./applift-logo.svg";

function parseCookies(cookieHeader = "") {
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
    const cookies = parseCookies(request.headers.get("Cookie"));
    const hasAccess = cookies.dev_access === env.DEV_ACCESS_KEY;

    // If user has access, pass through to origin
    // if (hasAccess) {
    //   return fetch(request);
    // }

    if (hasAccess) {
      return new Response("Access granted! You have the dev cookie.", {
        headers: { "content-type": "text/html" },
      });
    }
    // Serve CSS file
    if (url.pathname === "/style.css") {
      return new Response(css, {
        headers: {
          "content-type": "text/css; charset=utf-8",
          "cache-control": "public, max-age=3600",
        },
      });
    }

    // Serve SVG logo
    if (url.pathname === "/applift-logo.svg") {
      return new Response(logo, {
        headers: {
          "content-type": "image/svg+xml",
          "cache-control": "public, max-age=3600",
        },
      });
    }

    // Serve maintenance HTML for all other routes
    return new Response(maintenanceHtml, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-cache",
      },
      status: 503,
    });
  },
};
