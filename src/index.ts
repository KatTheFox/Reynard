import { Client, GatewayIntentBits } from "discord.js";
import {
  config,
  persistentDataHandler,
} from "./features/technical/persistentDataHandler";
import { events } from "./events/events";

persistentDataHandler
  .init()
  .then((_) => {
    if (config.token === "")
      throw new Error("No discord token found in config!");
    else {
      const client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMembers,
          GatewayIntentBits.GuildMessageReactions,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
        ],
      });

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
