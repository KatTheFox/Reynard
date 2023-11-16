import { ChannelType, SlashCommandBuilder } from "discord.js";
import type { Command } from "../types";
import {
  persistentData,
  persistentDataHandler,
} from "../features/technical/persistentDataHandler";

export const requireSpoiler: Command = {
  data: new SlashCommandBuilder()
    .setName("requirespoiler")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setRequired(true)
        .addChannelTypes(
          ChannelType.GuildText,
          ChannelType.PublicThread,
          ChannelType.PrivateThread
        )
        .setDescription("The channel to moderate")
    )
    .addBooleanOption((option) =>
      option
        .setName("moderate")
        .setDescription(
          "Whether to enable or disable the rule. Toggles if unset."
        )
        .setRequired(false)
    )
    .setDescription(
      "Adds or removes a channel from the moderation rule 'require spoiler'"
    ),
  async execute(interaction) {
    const { id } = interaction.options.getChannel("channel", true, [
      ChannelType.GuildText,
      ChannelType.PublicThread,
      ChannelType.PrivateThread,
    ]);
    const mod = interaction.options.getBoolean("moderate", false);
    let flag = 0;
    if (mod === null)
      if (persistentData.spoilerChannels.has(id)) {
        persistentData.spoilerChannels.delete(id);
        flag = 2;
      } else {
        persistentData.spoilerChannels.add(id);
        flag = 1;
      }
    else if (mod) {
      if (!persistentData.spoilerChannels.has(id)) {
        persistentData.spoilerChannels.add(id);
        flag = 1;
      }
    } else {
      persistentData.spoilerChannels.delete(id);
      flag = 2;
    }
    await persistentDataHandler.saveData();
    await interaction.reply({
      content:
        flag === 0
          ? "Channel is already being moderated by 'require spoiler'"
          : `Successfully ${
              flag === 1
                ? `added channel <#${id}> to`
                : `removed channel <#${id}> from`
            } mod rule 'require spoiler'`,
      ephemeral: true,
    });
  },
};
