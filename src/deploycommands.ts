import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";
import { REST, Routes } from "discord.js";
import { commands } from "./commands/commands";
import {
  config,
  persistentDataHandler,
} from "./features/technical/persistentDataHandler";
import { log } from "./features/technical/logger";

persistentDataHandler
  .init()
  .then((_) => {
    const json = [] as RESTPostAPIChatInputApplicationCommandsJSONBody[];
    for (const command of commands.values()) json.push(command.data.toJSON());

    if (config.token === "") throw new Error("No discord token in config!");
    else if (config.appID === "") throw new Error("No client id in config!");
    else {
      const rest = new REST({ version: "10" }).setToken(config.token);
      void (async () => {
        try {
          void log(`Started deploying ${json.length} commands`);
          void (await rest.put(Routes.applicationCommands(config.appID), {
            body: json,
          }));
          void log(`Successfully deployed ${json.length} commands`);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  })
  .catch((error) => {
    console.error(error);
  });
