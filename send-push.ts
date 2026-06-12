import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const FCM_URL = "https://fcm.googleapis.com/v1/projects/studio-atitude/messages:send";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, content-type",
      },
    });
  }

  try {
    const { token, title, body, criadoPor } = await req.json();

    // Pegar access token do Google via service account
    const serviceAccount = JSON.parse(Deno.env.get("FIREBASE_SERVICE_ACCOUNT") || "{}");

    const jwtHeader = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const now = Math.floor(Date.now() / 1000);
    const jwtPayload = btoa(JSON.stringify({
      iss: serviceAccount.client_email,
      scope: "https://www.googleapis.com/auth/firebase.messaging",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }));

    // Montar JWT assinado
    const encoder = new TextEncoder();
    const keyData = serviceAccount.private_key
      .replace(/-----BEGIN PRIVATE KEY-----/, "")
      .replace(/-----END PRIVATE KEY-----/, "")
      .replace(/\n/g, "");

    const binaryKey = Uint8Array.from(atob(keyData), c => c.charCodeAt(0));
    const cryptoKey = await crypto.subtle.importKey(
      "pkcs8", binaryKey,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false, ["sign"]
    );

    const sigInput = encoder.encode(`${jwtHeader}.${jwtPayload}`);
    const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, sigInput);
    const jwt = `${jwtHeader}.${jwtPayload}.${btoa(String.fromCharCode(...new Uint8Array(sig)))}`;

    // Trocar JWT por access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
    });
    const { access_token } = await tokenRes.json();

    // Enviar mensagem FCM
    const fcmRes = await fetch(FCM_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          token,
          notification: { title, body: `${body} — por ${criadoPor}` },
          webpush: {
            notification: {
              icon: "/logo.png",
              badge: "/logo.png",
              vibrate: [200, 100, 200],
            },
          },
        },
      }),
    });

    const result = await fcmRes.json();
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
