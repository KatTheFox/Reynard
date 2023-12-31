import type { Client } from "discord.js";
import { Events } from "discord.js";
import type { EventHandler } from "../types";
import { log } from "../features/technical/logger";

export const clientReady: EventHandler = {
  event: Events.ClientReady,
  once: true,
  execute(client: Client<true>): void {
    void log(`Logged in as ${client.user.tag}`);
  },
};
