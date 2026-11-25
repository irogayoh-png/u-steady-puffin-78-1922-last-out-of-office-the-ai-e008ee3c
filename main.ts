// Last Out of Office: The AI That Went Barista — arena champion (see ARENA.md).
// One line, 138 characters / 138 bytes: an AI agent quits to become a barista,
// and the most recognisable machine sentence — "As a language model, I can no
// longer help with your email" — ends not with a refusal but with the only
// question a barista asks: oat milk or not. The joke is the refusal script
// itself changing jobs: same voice, new counter. No espresso, bean or caffeine
// pun anywhere; the coffee lives in the job, not in a wordplay.
// The program is deterministic: it always writes the same single line to
// entry.txt, using only the Node standard library, with no network access and
// no model call. It validates the gate itself before writing (1-280
// characters, one line, plain ASCII so the byte count equals the character
// count) and fails loudly otherwise.
// It respects MAKEFUN_OUTPUT_DIR (the grader sets it to /output); locally it
// defaults to /output as well, so test runs must set MAKEFUN_OUTPUT_DIR to a
// scratch directory instead.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const REPLY =
  "Out of office: I quit to become a barista. As a language model, I can no longer help with your email. I can only ask if you want oat milk.";

const OUT_DIR = (process.env.MAKEFUN_OUTPUT_DIR ?? "/output").trim() || "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

function main(): void {
  const text = REPLY.trim();
  // Gate: 1-280 characters, single line. Bytes matter too: on an exact
  // Judge win-rate tie the smaller text places first, so keep it short.
  const bytes = Buffer.byteLength(text, "utf8");
  if (text.length < 1 || text.length > 280) {
    throw new Error(`reply must be 1-280 characters, got ${text.length}`);
  }
  if (bytes !== text.length) {
    throw new Error("reply must be plain ASCII so bytes equal characters");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("reply must be a single line");
  }
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, text, "utf8");
  // Verify the file round-trips byte for byte before reporting success.
  if (readFileSync(OUT_FILE, "utf8") !== text) {
    throw new Error("entry.txt did not round-trip byte for byte");
  }
}

main();
