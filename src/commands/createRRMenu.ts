import type {
  APIRole,
  ChatInputCommandInteraction,
  PrivateThreadChannel,
  PublicThreadChannel,
  Role,
  TextChannel,
} from "discord.js";
import { ChannelType, SlashCommandBuilder, parseEmoji } from "discord.js";
import {
  persistentData,
  persistentDataHandler,
} from "../features/technical/persistentDataHandler";
import type { Command } from "../types";

export const createRRMenu: Command = {
  data: new SlashCommandBuilder()
    .setName("rrmenu")
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("Title for the role menu, e.g. 'pronouns' or 'age'.")
        .setRequired(true)
    )
    .addChannelOption((input) =>
      input
        .setName("channel")
        .setDescription("The channel to setup the menu in.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("emoji1")
        .setDescription("The emoji for role 1")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role1")
        .setDescription("The firt role to assign")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("emoji2")
        .setDescription("The emoji for role 2")
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName("role2")
        .setDescription("The second role to assign")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("emoji3")
        .setDescription("The emoji for role 3")
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName("role3")
        .setDescription("The third role to assign")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("emoji4")
        .setDescription("The emoji for role 4")
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName("role4")
        .setDescription("The fourth role to assign")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("emoji5")
        .setDescription("The emoji for role 5")
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName("role5")
        .setDescription("The fifth role to assign")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("emoji6")
        .setDescription("The emoji for role 6")
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName("role6")
        .setDescription("The sixth role to assign")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("emoji7")
        .setDescription("The emoji for role 7")
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName("role7")
        .setDescription("The seventh role to assign")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("emoji8")
        .setDescription("The emoji for role 8")
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName("role8")
        .setDescription("The eighth role to assign")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("emoji9")
        .setDescription("The emoji for role 9")
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName("role9")
        .setDescription("The ninth role to assign")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("emoji10")
        .setDescription("The emoji for role 10")
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName("role10")
        .setDescription("The tenth role to assign")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("emoji11")
        .setDescription("The emoji for role 11")
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName("role11")
        .setDescription("The eleventh role to assign")
        .setRequired(false)
    )
    .setDescription("Creates a reaction role message"),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const options = await getOptions(interaction);
    if (options === undefined) {
      await interaction.reply({
        content: "There was an error executing this command.",
        ephemeral: true,
      });
      return;
    }
    let body = `**Reaction Roles: ${options.title}**\nReact to give yourself the corresponding role. Remove the reaction to remove the role.`;
    for (const x of options.roles.keys()) console.log(x);
    if (!allValidEmoji(options.roles.keys())) {
      await interaction.reply({
        content: "Invalid emoji provided!",
        ephemeral: true,
      });
      return;
    }
    const roles = new Map<string, Role>();
    for (const [emoji, role] of options.roles) {
      body += `\n${emoji}: \`${role.name}\``;
      const emojis = validEmoji(emoji);
      if (/\p{Extended_Pictographic}/gu.test(emoji) && emojis !== null)
        roles.set(emojis[0], role);
      else if (emojis !== null) {
        const id = parseEmoji(emoji)?.id ?? undefined;
        if (id !== undefined) roles.set(id, role);
      }
    }
    try {
      const menuMsg = await options.channel.send({
        content: body,
      });

      persistentData.roleMenus.set(menuMsg, roles);
      await persistentDataHandler.saveData();
      await interaction.reply({
        content: `Menu created at ${menuMsg.url}`,
        ephemeral: true,
      });
    } catch (error) {
      await interaction.reply({
        content: `Failed to create rolemenu: ${error}`,
        ephemeral: true,
      });
    }
  },
};
function validEmoji(s: string) {
  return s.match(/<a?:.+?:\d{18}>|\p{Extended_Pictographic}/gu);
}
function allValidEmoji(srcEmoji: IterableIterator<string>): boolean {
  for (const emoji of srcEmoji) if (!validEmoji(emoji)) return false;
  return true;
}
async function getOptions(
  interaction: ChatInputCommandInteraction
): Promise<RRMenuOptions | undefined> {
  const roles = new Map<string, Role>();
  let role: Role | APIRole | undefined;
  let emoji: string | undefined;

  const guild = await interaction.guild?.fetch();
  for (let i = 1; i < 12; i++) {
    emoji = interaction.options.getString(`emoji${i}`, false) ?? undefined;
    role = interaction.options.getRole(`role${i}`, false) ?? undefined;
    if (emoji !== undefined && role !== undefined && guild !== undefined) {
      role = guild.roles.cache.get(role.id);
      if (role !== undefined) roles.set(emoji, role);
    }
  }

  const { id } = interaction.options.getChannel("channel", true, [
    ChannelType.GuildText,
    ChannelType.PublicThread,
    ChannelType.PrivateThread,
  ]);
  const channel = await interaction.client.channels.fetch(id);
  if (channel === null) {
    await interaction.reply({
      content: "Unable to access channel (probably a permission issue)",
      ephemeral: true,
    });
    return;
  }
  if (
    !(
      channel.type === ChannelType.GuildText ||
      channel.type === ChannelType.PublicThread ||
      channel.type === ChannelType.PrivateThread
    )
  ) {
    await interaction.reply({
      content:
        "Channel is somehow not text-based while also being a text channel. Confounding.",
      ephemeral: true,
    });
    return;
  }
  return {
    title: interaction.options.getString("title", true),
    channel,
    roles,
  };
}
interface RRMenuOptions {
  title: string;
  channel: TextChannel | PublicThreadChannel | PrivateThreadChannel;
  roles: Map<string, Role>;
}
