import { Knockout } from "@useknockout/node";
import { getKnockoutToken } from "@/lib/env/knockout";

export async function removeBackgroundFromBuffer(
  buffer: Buffer,
  filename: string,
): Promise<Buffer> {
  const client = new Knockout({ token: getKnockoutToken() });
  return client.remove({ file: buffer, filename });
}
