import 'server-only';

export class RequestBodyError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin || request.headers.get('sec-fetch-site') === 'cross-site') return false;
  // A fixed public origin also works behind a proxy whose internal URL differs.
  // Never derive it from client-supplied forwarding headers.
  try { return new URL(origin).origin === new URL(process.env.APP_ORIGIN || request.url).origin; }
  catch { return false; }
}

// Content-Length is only an early rejection; the stream is always counted too.
export async function readBoundedJson(request: Request, maxBytes: number): Promise<unknown> {
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    throw new RequestBodyError('Envie uma requisição JSON válida.', 415);
  }
  const length = request.headers.get('content-length');
  if (length !== null && (!/^\d+$/.test(length) || Number(length) > maxBytes)) {
    throw new RequestBodyError('A requisição excede o tamanho permitido.', 413);
  }
  if (!request.body) throw new RequestBodyError('Corpo da requisição ausente.', 400);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new RequestBodyError('Tempo de envio excedido.', 408)), 15_000);
  });
  try {
    while (true) {
      const { done, value } = await Promise.race([reader.read(), deadline]);
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        throw new RequestBodyError('A requisição excede o tamanho permitido.', 413);
      }
      chunks.push(value);
    }
  } catch (error) {
    // Cancellation is best effort: a stalled producer must not block rejection.
    void reader.cancel().catch(() => {});
    throw error;
  } finally { clearTimeout(timer); reader.releaseLock(); }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
  catch { throw new RequestBodyError('Corpo JSON inválido.', 400); }
}
