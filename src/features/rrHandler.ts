import type {
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from "discord.js";
import { persistentData } from "./technical/persistentDataHandler";
import { log } from "./technical/logger";

// The string will either be the emoji id (for custom emoji) or the unicode emoji.
export async function handleReaction(
  rawReaction: MessageReaction | PartialMessageReaction,
  rawUser: User | PartialUser,
  add: boolean
): Promise<void> {
  const reaction = rawReaction.partial
    ? await rawReaction.fetch()
    : rawReaction;
  const user = rawUser.partial ? await rawUser.fetch() : rawUser;
  const roleMenu = persistentData.roleMenus.get(reaction.message.id);
  if (roleMenu === undefined) return;
  void log("reaction added to rolemenu!");
  const role = roleMenu.get(reaction.emoji.id ?? reaction.emoji.toString());
  if (role !== undefined) {
    const message = await reaction.message.fetch();
    const guild = await message.guild?.fetch();
    if (guild === undefined) void log("Reaction role menu was not in a guild!");
    else {
      const member = await guild.members.fetch(user);
      await (add
        ? member.roles.add(role, "Reaction Role Addition")
        : member.roles.remove(role, "Reaction Role Removal"));
    }
  }
}
