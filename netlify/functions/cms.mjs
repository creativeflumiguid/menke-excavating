import { getStore } from "@netlify/blobs";

async function isAuthorized(req) {
  const auth = req.headers.get("authorization") || "";
  const pinHeader = req.headers.get("x-admin-pin") || "";
  const configuredPin = process.env.ADMIN_PIN || "menke2026";

  // 1. If a Bearer token from Netlify Identity is provided, verify it directly against Netlify Identity (GoTrue)
  if (auth.toLowerCase().startsWith("bearer ")) {
    try {
      const verifyUrl = new URL("/.netlify/identity/user", req.url);
      const res = await fetch(verifyUrl.toString(), {
        headers: { Authorization: auth }
      });
      if (res.ok) {
        const user = await res.json();
        return { ok: true, email: user.email || "admin" };
      }
    } catch (_) {}
  }

  // 2. Check if Netlify Identity is enabled on this site.
  // If Identity is NOT enabled yet, allow access via ADMIN_PIN (default: menke2026) so handover testing works out of the box.
  let identityEnabled = false;
  try {
    const settingsUrl = new URL("/.netlify/identity/settings", req.url);
    const sRes = await fetch(settingsUrl.toString());
    identityEnabled = sRes.ok;
  } catch (_) {}

  if (!identityEnabled && pinHeader && pinHeader === configuredPin) {
    return { ok: true, email: "pin-admin" };
  }

  // Also allow ADMIN_PIN if explicitly set as an environment variable override
  if (process.env.ADMIN_PIN && pinHeader === process.env.ADMIN_PIN) {
    return { ok: true, email: "pin-admin" };
  }

  return {
    ok: false,
    reason: identityEnabled
      ? "Please sign in with your invited email account."
      : "Invalid Quick-Access PIN."
  };
}

export default async (req) => {
  const store = getStore("menke-cms");

  if (req.method === "GET") {
    try {
      const data = await store.get("site-content", { type: "json" });
      if (!data) {
        return new Response(null, { status: 204 });
      }
      return Response.json(data, {
        headers: { "Cache-Control": "no-store, max-age=0" }
      });
    } catch (err) {
      return new Response(null, { status: 204 });
    }
  }

  if (req.method === "POST") {
    const authCheck = await isAuthorized(req);
    if (!authCheck.ok) {
      return Response.json({ error: authCheck.reason }, { status: 401 });
    }
    try {
      const payload = await req.json();
      if (!payload || typeof payload !== "object") {
        return Response.json({ error: "Invalid content payload" }, { status: 400 });
      }
      payload._updatedAt = new Date().toISOString();
      payload._updatedBy = authCheck.email;
      await store.setJSON("site-content", payload);
      return Response.json({ ok: true, updatedAt: payload._updatedAt, updatedBy: authCheck.email });
    } catch (err) {
      return Response.json({ error: err.message || "Failed to save content" }, { status: 500 });
    }
  }

  if (req.method === "DELETE") {
    const authCheck = await isAuthorized(req);
    if (!authCheck.ok) {
      return Response.json({ error: authCheck.reason }, { status: 401 });
    }
    try {
      await store.delete("site-content");
      return Response.json({ ok: true, reset: true });
    } catch (err) {
      return Response.json({ error: err.message || "Failed to reset content" }, { status: 500 });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
};

export const config = {
  path: "/api/cms"
};

