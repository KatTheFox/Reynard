import type { Interaction } from "discord.js";
import { Events } from "discord.js";
import { commands } from "../commands/commands";
import type { EventHandler } from "../types";

export const interactionCreate: EventHandler = {
  event: Events.InteractionCreate,
  async execute(interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;
    const command = commands.get(interaction.commandName);
    if (command === undefined) {
      console.error(`no such command ${interaction.commandName}`);
      return;
    }
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error executing this command",
        ephemeral: true,
      });
    }
  },
};
