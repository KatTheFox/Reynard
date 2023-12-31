import type { Role } from "discord.js";
import {
  pathExists,
  readJson,
  writeJson,
  remove,
  writeFile,
  readFile,
} from "fs-extra";
import { join } from "node:path";
import { config as deConfig } from "dotenv";
import { DateTime } from "luxon";

interface PersistentData {
  roleMenus: Map<string, Map<string, Role>>;
  spoilerChannels: Set<string>;
}
export const persistentData: PersistentData = {
  roleMenus: new Map<string, Map<string, Role>>(),
  spoilerChannels: new Set<string>(),
};
export const config = {
  token: "",
  appID: "",
  logFile: "",
};
function replacer(_: string, value: unknown) {
  if (value instanceof Map)
    return {
      dataType: "Map",
      value: [...value],
    };

  if (value instanceof Set)
    return {
      dataType: "Set",
      value: [...value],
    };
  return value;
}
function reviver(_: unknown, value: unknown) {
  if (typeof value === "object" && value !== null)
    if (
      "dataType" in value &&
      "value" in value &&
      Array.isArray(value.value) &&
      value.dataType === "Map"
    )
      return new Map(value.value);
    else if (
      "dataType" in value &&
      "value" in value &&
      Array.isArray(value.value) &&
      value.dataType === "Set"
    )
      return new Set(value.value);

  return value;
}
function jsonStringify(obj: unknown) {
  return JSON.stringify(obj, replacer);
}
function jsonParse(str: string): unknown {
  return JSON.parse(str, reviver);
}
export const persistentDataHandler = {
  initialised: false,
  dataDir: "",
  async init(): Promise<void> {
    deConfig();
    this.dataDir = process.env["DATA_DIR"] ?? "";
    if (this.dataDir === "")
      throw new Error("Expected a data dir in the environment!");
    await this.loadData();
    await this.loadConfig();
    if (config.logFile === "")
      config.logFile = join(this.dataDir, "reynard.log");
    await writeFile(
      config.logFile,
      `Reynard Initialised at ${DateTime.local().toLocaleString(
        DateTime.DATETIME_SHORT_WITH_SECONDS
      )}\n`
    );
    this.initialised = true;
  },
  async saveData(): Promise<void> {
    if (!(await pathExists(this.dataDir)))
      throw new Error(`Data directory ${this.dataDir} does not exist!`);

    await remove(join(this.dataDir, "data.json"));
    await writeFile(
      join(this.dataDir, "data.json"),
      jsonStringify(persistentData)
    );
  },
  async loadConfig(): Promise<void> {
    if (!(await pathExists(this.dataDir)))
      throw new Error(`Data directory ${this.dataDir} does not exist!`);
    if (!(await pathExists(join(this.dataDir, "config.json")))) {
      console.log(
        `Config file doesn't exist, creating at ${join(
          this.dataDir,
          "config.json"
        )}`
      );
      await writeJson(join(this.dataDir, "config.json"), config);
      return;
    }
    Object.assign(config, await readJson(join(this.dataDir, "config.json")));
  },
  async loadData(): Promise<void> {
    if (!(await pathExists(this.dataDir)))
      throw new Error(`Data directory ${this.dataDir} does not exist!`);
    if (!(await pathExists(join(this.dataDir, "data.json")))) {
      console.log(
        `Datafile doesn't exist, creating at ${join(this.dataDir, "data.json")}`
      );
      await writeJson(join(this.dataDir, "data.json"), persistentData);
      return;
    }
    const data = jsonParse(
      await readFile(join(this.dataDir, "data.json"), { encoding: "utf8" })
    ) as PersistentData;
    if (data.roleMenus.size > 0) persistentData.roleMenus = data.roleMenus;
    if (data.spoilerChannels.size > 0)
      persistentData.spoilerChannels = data.spoilerChannels;
  },
};
