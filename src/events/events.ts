import { interactionCreate } from "./interactionCreate";
import { messageCreate } from "./messageCreate";
import { messageReactionAdd } from "./messageReactionAdd";
import { messageReactionRemove } from "./messageReactionRemove";
import { clientReady } from "./ready";

export const events = [
  interactionCreate,
  clientReady,
  messageCreate,
  messageReactionAdd,
  messageReactionRemove,
];
