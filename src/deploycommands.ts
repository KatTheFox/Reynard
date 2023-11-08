import {
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from "discord.js";
import { commands } from "./commands/commands";
import { config } from "dotenv";

config();
const json = [] as RESTPostAPIChatInputApplicationCommandsJSONBody[];
for (let command of commands.values()) {
  json.push(command.data.toJSON());
}
let token = process.env["DISCORD_TOKEN"];
let appID = process.env["APPLICATION_ID"];
if (token == undefined) {
  throw new Error("No discord token found in env!");
} else if (appID == undefined) {
  throw new Error("No client id found in env!");
} else {
  const rest = new REST({ version: "10" }).setToken(token);
  (async () => {
    try {
      console.log(`Started deploying ${json.length} commands`);
      const data = await rest.put(Routes.applicationCommands(appID), {
        body: json,
      });
      console.log(`Successfully deployed ${json.length} commands`);
    } catch (e) {
      console.error(e);
    }
  })();
}
