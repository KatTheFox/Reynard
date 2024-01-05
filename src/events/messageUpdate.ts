import type { Message } from "discord.js";
import { Events } from "discord.js";
import type { EventHandler } from "../types";
import { spoilerMod } from "../features/moderation/spoilermod";

export const messageUpdate: EventHandler = {
  event: Events.MessageUpdate,
  execute: async (_: Message, newMessage: Message) => {
    await spoilerMod(newMessage);
  },
};
