import type { MessageReaction, User } from "discord.js";
import { Events } from "discord.js";
import type { EventHandler } from "../types";
import { handleReaction } from "../features/rrHandler";

export const messageReactionAdd: EventHandler = {
  event: Events.MessageReactionAdd,
  execute(messageReaction: MessageReaction, user: User) {
    void handleReaction(messageReaction, user, true);
  },
};
