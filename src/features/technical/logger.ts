import { writeFileSync } from "fs-extra";
import { config, persistentDataHandler } from "./persistentDataHandler";

export async function log(text: string): Promise<void> {
  if (!persistentDataHandler.initialised) await persistentDataHandler.init();
  console.log(text);
  writeFileSync(config.logFile, `${text}\n`, { flag: "a" });
}
export function logError(error: Error): void {
  void log(error.toString());
}
