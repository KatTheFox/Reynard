import type { Client } from "discord.js";
import {
  persistentData,
  persistentDataHandler,
} from "./technical/persistentDataHandler";

// The string will either be the emoji id (for custom emoji) or the unicode emoji.

function checkMenuDeleted() {
  for (const [message, _] of persistentData.roleMenus)
    message.fetch().catch((error) => {
      console.error(error);
      persistentData.roleMenus.delete(message);
    });
}
export async function init(client: Client): Promise<void> {
  if (!client.isReady()) return;
  await persistentDataHandler.loadData();
  checkMenuDeleted();
}
