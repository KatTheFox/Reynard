import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";
import { REST, Routes } from "discord.js";
import { commands } from "./commands/commands";
import { config } from "dotenv";

config();
const json = [] as RESTPostAPIChatInputApplicationCommandsJSONBody[];
for (const command of commands.values()) json.push(command.data.toJSON());

const token = process.env["DISCORD_TOKEN"];
const appID = process.env["APPLICATION_ID"];
if (token === undefined) throw new Error("No discord token found in env!");
else if (appID === undefined) throw new Error("No client id found in env!");
else {
  const rest = new REST({ version: "10" }).setToken(token);
  // eslint-disable-next-line unicorn/prefer-top-level-await
  void (async () => {
    try {
      console.log(`Started deploying ${json.length} commands`);
      void (await rest.put(Routes.applicationCommands(appID), {
        body: json,
      }));
      console.log(`Successfully deployed ${json.length} commands`);
    } catch (error) {
      console.error(error);
    }
  })();
}
