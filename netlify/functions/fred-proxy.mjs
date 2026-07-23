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

  const fredPath = url.searchParams.get("path") || "";
  url.searchParams.delete("path");

  // Strip any client-supplied api_key — we inject it server-side
  url.searchParams.delete("api_key");

  const remaining = url.searchParams.toString();
  const sep = remaining ? "&" : "";
  const fredUrl = `${FRED_BASE}/${fredPath}?api_key=${apiKey}&${remaining}`;

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
  path: "/.netlify/functions/fred-proxy",
};
