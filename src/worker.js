import maintenanceHtml from "./index.html";

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
    const cookies = parseCookies(request.headers.get("Cookie"));
    const hasAccess = cookies.dev_access === env.DEV_ACCESS_KEY;

    if (!env.MAINTENANCE_MODE || hasAccess) {
      return fetch(request);
    }

    return new Response(maintenanceHtml, {
      headers: { "content-type": "text/html; charset=utf-8" },
      status: 503,
    });
  },
};
