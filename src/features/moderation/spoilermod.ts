import type { Message } from "discord.js";
import { persistentData } from "../technical/persistentDataHandler";

export async function spoilerMod(message: Message): Promise<void> {
  if (await isActionNeeded(message)) {
    const { author, channel } = message;
    try {
      await Promise.all([
        channel.send(
          `<@${author.id}>, remember to spoiler tag all attachments in this channel.`
        ),
        message.delete(),
      ]);
    } catch (error) {
      console.error(error);
    }
  }
}
async function isActionNeeded(message: Message): Promise<boolean> {
  try {
    const msg = await message.fetch(true);
    if (!persistentData.spoilerChannels.has(msg.channelId)) return false;
    if (msg.attachments.size === 0) return false;
    for (const [_, attachment] of msg.attachments)
      if (!attachment.spoiler) return true;
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}
