const GATE_ORIGIN =
  "https://irac4aucf7czz6eiz53tyvgfr7wg4rd925pwm.lnks.info/ej4t4zughqwhdax4eyjvuzfarbhuz6n92u";


export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  try {
    const check = await fetch(`${GATE_ORIGIN}/check`, {
      method: "GET",
      headers: {
        "Cookie": request.headers.get("Cookie") || "",
        "X-User-Agent": request.headers.get("User-Agent") || "",
        "X-Site": url.hostname,
        "X-Path": url.pathname
      }
    });

    if (check.status === 200) {
      return next();
    }

    const accessUrl = new URL(`${GATE_ORIGIN}/access`);
    accessUrl.searchParams.set("site", url.hostname);
    accessUrl.searchParams.set("next", url.toString());

    return Response.redirect(accessUrl.toString(), 302);
  } catch (err) {
    return new Response(
      `Gate middleware error:\n\n${err?.stack || err}`,
      {
        status: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      }
    );
  }
}
