const FRED_BASE = "https://api.stlouisfed.org/fred";

export default async (req) => {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "FRED_API_KEY not configured in environment" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const url = new URL(req.url);

  // Extract the FRED subpath: /fred/series/observations -> series/observations
  const fredSubpath = url.pathname.replace(/^\/fred\//, "");

  // Forward all query params from the original request, inject api_key server-side
  const params = new URLSearchParams(url.search);
  params.delete("api_key");
  params.set("api_key", apiKey);

  const fredUrl = `${FRED_BASE}/${fredSubpath}?${params.toString()}`;

  try {
    const resp = await fetch(fredUrl, {
      headers: { "User-Agent": "EconDashboard/1.0" },
    });

    const body = await resp.text();

    return new Response(body, {
      status: resp.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 502,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
};

export const config = {
  path: "/fred/*",
};
