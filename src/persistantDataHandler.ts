import type { Message, Role } from "discord.js";
import { pathExists, readJson, writeJson } from "fs-extra";
import { join } from "node:path";
import { config as deConfig } from "dotenv";

export const persistantData = {
  roleMenus: new Map<Message, Map<string, Role>>(),
};
export const config = {
  token: "",
  appID: "",
};
export const persistantDataHandler = {
  dataDir: "",
  async init(): Promise<void> {
    deConfig();
    this.dataDir = process.env["DATA_DIR"] ?? "";
    if (this.dataDir === "")
      throw new Error("Expected a data dir in the environment!");
    await this.loadData();
    await this.loadConfig();
  },
  async saveData(): Promise<void> {
    if (!(await pathExists(this.dataDir)))
      throw new Error(`Data directory ${this.dataDir} does not exist!`);
    await writeJson(join(this.dataDir, "data.json"), persistantData);
  },
  async loadConfig(): Promise<void> {
    if (!(await pathExists(this.dataDir)))
      throw new Error(`Data directory ${this.dataDir} does not exist!`);
    if (!(await pathExists(join(this.dataDir, "config.json")))) {
      console.log(
        `Config file nonexistant, creating at ${join(
          this.dataDir,
          "config.json"
        )}`
      );
      await writeJson(join(this.dataDir, "config.json"), config);
      return;
    }
    Object.assign(
      persistantData,
      await readJson(join(this.dataDir, "data.json"))
    );
  },
  async loadData(): Promise<void> {
    if (!(await pathExists(this.dataDir)))
      throw new Error(`Data directory ${this.dataDir} does not exist!`);
    if (!(await pathExists(join(this.dataDir, "data.json")))) {
      console.log(
        `Datafile nonexistant, creating at ${join(this.dataDir, "data.json")}`
      );
      await writeJson(join(this.dataDir, "data.json"), persistantData);
      return;
    }
    Object.assign(
      persistantData,
      await readJson(join(this.dataDir, "data.json"))
    );
  },
};
