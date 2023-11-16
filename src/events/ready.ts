import type { Client } from "discord.js";
import { Events } from "discord.js";
import type { EventHandler } from "../types";

export const clientReady: EventHandler = {
  event: Events.ClientReady,
  once: true,
  execute(client: Client<true>): void {
    console.log(`Logged in as ${client.user.tag}`);
  },
};
