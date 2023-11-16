import { interactionCreate } from "./interactionCreate";
import { messageCreate } from "./messageCreate";
import { clientReady } from "./ready";

export const events = [interactionCreate, clientReady, messageCreate];
