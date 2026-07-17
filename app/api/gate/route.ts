export async function POST(req: Request) {
  const { code } = await req.json().catch(() => ({ code: "" }));
  if (code && code === process.env.GATE_CODE) {
    return Response.json({ ok: true });
  }
  return Response.json({ ok: false }, { status: 401 });
}
