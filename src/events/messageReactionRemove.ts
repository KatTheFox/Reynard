import type {
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from "discord.js";
import { Events } from "discord.js";
import type { EventHandler } from "../types";
import { handleReaction } from "../features/rrHandler";

export const messageReactionAdd: EventHandler = {
  event: Events.MessageReactionRemove,
  execute(
    messageReaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ) {
    void handleReaction(messageReaction, user, false);
  },
};
