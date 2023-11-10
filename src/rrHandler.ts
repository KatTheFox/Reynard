import type { Client } from "discord.js";
import { persistantData, persistantDataHandler } from "./persistantDataHandler";

// The string will either be the emoji id (for custom emoji) or the unicode emoji.

function checkMenuDeleted() {
  for (const [message, _] of persistantData.roleMenus)
    message.fetch().catch((error) => {
      console.log(error);
      persistantData.roleMenus.delete(message);
    });
}
export async function init(client: Client): Promise<void> {
  if (!client.isReady()) return;
  await persistantDataHandler.loadData();
  checkMenuDeleted();
}
