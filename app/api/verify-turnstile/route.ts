const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function POST(request: Request): Promise<Response> {
  let token: unknown;
  try {
    const body = await request.json();
    token = body?.token;
  } catch {
    token = undefined;
  }

  if (typeof token !== "string" || token.length === 0) {
    return Response.json(
      { ok: false, error: "missing_token" },
      { status: 400 }
    );
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return Response.json(
      { ok: false, error: "server_misconfigured" },
      { status: 500 }
    );
  }

  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      body: formData,
    });
    const data = (await res.json()) as { success?: boolean };
    return Response.json({ ok: data.success === true });
  } catch {
    return Response.json(
      { ok: false, error: "verify_unreachable" },
      { status: 502 }
    );
  }
}
