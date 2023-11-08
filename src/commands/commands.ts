import {
  ChatInputCommandInteraction,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { pollCommand } from "./poll";
export const commands = new Map<
  string,
  {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => void;
  }
>([[pollCommand.data.name, pollCommand]]);
