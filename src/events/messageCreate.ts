import type { Message } from "discord.js";
import { Events } from "discord.js";
import { spoilerMod } from "../features/moderation/spoilermod";
import type { EventHandler } from "../types";

export const messageCreate: EventHandler = {
  event: Events.MessageCreate,
  async execute(message: Message) {
    await spoilerMod(message);
  },
};
