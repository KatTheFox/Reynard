import { poll } from "./poll";
import { createRRMenu } from "./createRRMenu";
import type { Command } from "../types";
import { requireSpoiler } from "./requireSpoiler";

export const commands = new Map<string, Command>([
  [poll.data.name, poll],
  [createRRMenu.data.name, createRRMenu],
  [requireSpoiler.data.name, requireSpoiler],
]);
