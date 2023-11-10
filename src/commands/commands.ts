import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { pollCommand } from "./poll";
import { rrMenuCommand } from "./createRRMenu";

export const commands = new Map<
  string,
  {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  }
>([
  [pollCommand.data.name, pollCommand],
  [rrMenuCommand.data.name, rrMenuCommand],
]);
