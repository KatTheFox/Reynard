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
  if (roleMenu === undefined) {
    void log("rolemenu undefined!");
    return;
  }
  const role = roleMenu.get(reaction.emoji.id ?? reaction.emoji.toString());
  if (role !== undefined) {
    const message = await reaction.message.fetch();
    const guild = await message.guild?.fetch();
    if (guild === undefined) void log("Reaction role menu was not in a guild!");
    else {
      const member = await guild.members.fetch(user);
      const fetchedRole = (await guild.roles.fetch(role)) ?? { name: role };
      if (add) {
        void log(
          `adding role ${fetchedRole.name} to member ${
            member.nickname ?? member.displayName
          }`
        );
        try {
          await member.roles.add(role, "reaction role addition");
        } catch (error) {
          console.error(error);
        }
      } else {
        void log(
          `removing role ${fetchedRole.name} from member ${
            member.nickname ?? member.displayName
          }`
        );
        try {
          await member.roles.remove(role, "reaction role removal");
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
}
