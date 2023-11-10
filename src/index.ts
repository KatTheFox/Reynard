import { Client, Events, GatewayIntentBits } from "discord.js";
import { commands } from "./commands/commands";
import { config, persistantDataHandler } from "./persistantDataHandler";

persistantDataHandler
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
        ],
      });
      client.once(Events.ClientReady, (c) => {
        console.log(`Logged in as ${c.user.tag}`);
      });
      client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        const command = commands.get(interaction.commandName);
        if (command === undefined) {
          console.error(`no such command ${interaction.commandName}`);
          return;
        }
        try {
          await command.execute(interaction);
        } catch (error) {
          console.error(error);
          await interaction.reply({
            content: "There was an error executing this command",
            ephemeral: true,
          });
        }
      });
      void client.login(config.token);
    }
  })
  .catch((error) => {
    console.error(error);
  });
