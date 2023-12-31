import { Client, GatewayIntentBits, Partials } from "discord.js";
import {
  config,
  persistentDataHandler,
} from "./features/technical/persistentDataHandler";
import { events } from "./events/events";

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
  partials: [
    Partials.Message,
    Partials.Reaction,
    Partials.Channel,
    Partials.User,
  ],
});
persistentDataHandler
  .init()
  .then((_) => {
    if (config.token === "")
      throw new Error("No discord token found in config!");
    else {
      for (const eventHandler of events)
        if (eventHandler.once ?? false)
          client.once(eventHandler.event, eventHandler.execute);
        else client.on(eventHandler.event, eventHandler.execute);

      void client.login(config.token);
    }
  })
  .catch((error) => {
    console.error(error);
  });
