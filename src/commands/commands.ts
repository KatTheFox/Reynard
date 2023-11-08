import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { pollCommand } from "./poll";

export const commands = new Map<
  string,
  {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  }
>([[pollCommand.data.name, pollCommand]]);
