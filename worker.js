export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== "/boot") {
      return new Response("Not Found", { status: 404 });
    }

    if (request.method !== "POST") {
      return new Response("Only POST allowed", { status: 405 });
    }

    let body = {};
    try { body = await request.json(); } catch (_) {}

    const result = {
      ok: true,
      message: "BOOT endpoint live and logging",
      received: body,
      timestamp: new Date().toISOString()
    };

    if (env.KV_BOOTLOG) {
      await env.KV_BOOTLOG.put(
        `boot:${Date.now()}:${crypto.randomUUID()}`,
        JSON.stringify({ t: result.timestamp, body })
      );
    }

    return new Response(JSON.stringify(result, null, 2), {
      headers: { "Content-Type": "application/json" }
    });
  }
};
