import type {
  ChatInputCommandInteraction,
  Message,
  MessageReaction,
  PrivateThreadChannel,
  PublicThreadChannel,
  TextChannel,
} from "discord.js";
import { ChannelType, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Command } from "../types";

export const poll: Command = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("Text to be displayed above the poll. Usually a ping.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("What is the question")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("option1")
        .setDescription("The first poll option.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("option2")
        .setDescription("The second poll option.")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setRequired(false)
        .setDescription("What channel to create the poll in")
        .setName("channel")
        .addChannelTypes(
          ChannelType.GuildText,
          ChannelType.PublicThread,
          ChannelType.PrivateThread
        )
    )
    .addIntegerOption((option) =>
      option
        .setMinValue(1)
        .setRequired(false)
        .setMaxValue(59)
        .setDescription(
          "Minutes until poll closure. Will be added to the other time values."
        )
        .setName("minutes")
    )
    .addIntegerOption((option) =>
      option
        .setMinValue(1)
        .setRequired(false)
        .setMaxValue(23)
        .setDescription(
          "Hours until poll closure. Will be added to the other time values."
        )
        .setName("hours")
    )
    .addIntegerOption((option) =>
      option
        .setMinValue(1)
        .setRequired(false)
        .setMaxValue(6)
        .setDescription(
          "Days until poll closure. Will be added to the other time values."
        )
        .setName("days")
    )
    .addStringOption((option) =>
      option
        .setName("option3")
        .setDescription("The third poll option.")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("option4")
        .setDescription("The fourth poll option.")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("option5")
        .setDescription("The fifth poll option.")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("option6")
        .setDescription("The sixth poll option.")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("option7")
        .setDescription("The seventh poll option.")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("option8")
        .setDescription("The eighth poll option.")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("option9")
        .setDescription("The ninth poll option.")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("option10")
        .setDescription("The tenth poll option.")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("option11")
        .setDescription("The eleventh poll option.")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("option12")
        .setDescription("The twelfth poll option.")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("option13")
        .setDescription("The thirteenth poll option.")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("option14")
        .setDescription("The fourteenth poll option.")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("option15")
        .setDescription("The fifteenth poll option.")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("option16")
        .setDescription("The sixteenth poll option.")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("option17")
        .setDescription("The seventeenth poll option.")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("option18")
        .setDescription("The eighteenth poll option.")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("option19")
        .setDescription(
          "The ninteenth poll option. Due to discord's limits, no more can be added."
        )
        .setRequired(false)
    )
    .setDescription("Create a poll."),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const responses = await getPollConfig(interaction);
    if (responses === undefined) {
      await interaction.reply({
        content: "There was an error executing this command.",
        ephemeral: true,
      });
      return;
    }
    const channel = responses.channel ?? interaction.channel;
    if (channel === null) throw new TypeError("Null channel!");

    let body = `1️⃣: ${responses.options[0]}`;
    for (let i = 1; i < responses.options.length; i++)
      body += `\n${emoji[i]}: ${responses.options[i]}`;

    const pollMsg = await channel.send({
      content: responses.text,
      embeds: [
        new EmbedBuilder().setTitle(responses.question).setDescription(body),
      ],
    });
    for await (const v of emoji.slice(0, responses.options.length))
      await pollMsg.react(v);

    if (responses.minutes > 0) void pollClose(responses, pollMsg);

    void interaction.reply({
      content: `Poll created at ${pollMsg.url}`,
      ephemeral: true,
    });
  },
};
async function pollClose(responses: PollConfig, msg: Message) {
  await delay(responses.minutes * 5000);
  const pollMsg = await msg.fetch(true);
  const reactions = msg.reactions.cache;
  let highestn = 0;
  const reacts: MessageReaction[] = [];
  for (const element of reactions.values()) {
    reacts.push(element);
    if (element.count > highestn) highestn = element.count;
  }
  const highests = reactions.filter((v) => v.count === highestn);
  const results = highests.first(highests.size);
  if (
    results.reduce((a: number, b: MessageReaction) => a + b.count - 1, 0) === 0
  ) {
    let body = `1️⃣: ${responses.options[0]}`;
    for (let i = 1; i < responses.options.length; i++)
      body += `\n${emoji[i]}: ${responses.options[i]}`;

    await pollMsg.edit({
      embeds: [
        new EmbedBuilder()
          .setTitle(responses.question)
          .setDescription(`${body}\n\nNobody voted!`),
      ],
    });
  } else {
    let body = `1️⃣: ${responses.options[0]}`;
    for (let i = 1; i < responses.options.length; i++)
      body += `\n${emoji[i]}: ${responses.options[i]}`;

    const resultMsg = `Options:\n${body}\n\nResult: ${getWinnersString(
      results,
      responses
    )}\n\nDetails:${longResults(
      reactions.first(reactions.size),
      responses.options
    )}`;
    await pollMsg.edit({
      embeds: [
        new EmbedBuilder()
          .setTitle(responses.question)
          .setDescription(resultMsg),
      ],
    });
  }
}
function getWinnersString(results: MessageReaction[], responses: PollConfig) {
  if (results.length === 1)
    return `'${
      responses.options[emoji.indexOf(results[0]?.emoji.name ?? "")]
    }' wins.`;
  if (results.length === 2)
    return `'${
      responses.options[emoji.indexOf(results[0]?.emoji.name ?? "")]
    }' and '${
      responses.options[emoji.indexOf(results[1]?.emoji.name ?? "")]
    }' have tied.`;

  let r = "";
  for (let i = 0; i < results.length - 1; i++)
    r += `'${
      responses.options[emoji.indexOf(results[i]?.emoji.name ?? "")]
    }', `;

  r += `and '${
    responses.options[emoji.indexOf(results.at(-1)?.emoji.name ?? "")]
  }' have tied.`;
  return r;
}
function longResults(results: MessageReaction[], options: string[]): string {
  const totalReactions = results.reduce(
    (a: number, b: MessageReaction) => a + b.count - 1,
    0
  );
  let r = "";
  for (const element of results)
    r += `\n${element.emoji.name} ${
      options[emoji.indexOf(element.emoji.name ?? "")]
    }: ${(((element.count - 1) / totalReactions) * 100)
      .toString()
      .slice(0, 5)}%`;

  return r;
}
async function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
const emoji = [
  "1️⃣",
  "2️⃣",
  "3️⃣",
  "4️⃣",
  "5️⃣",
  "6️⃣",
  "7️⃣",
  "8️⃣",
  "9️⃣",
  "🔟",
  "🇦",
  "🇧",
  "🇨",
  "🇩",
  "🇪",
  "🇫",
  "🇬",
  "🇭",
  "🇮",
];
function getOptions(i: ChatInputCommandInteraction): string[] {
  const r: string[] = [];
  for (let j = 1; j < 20; j++) r.push(i.options.getString(`option${j}`) ?? "");

  return r.filter(Boolean);
}
async function getPollConfig(
  interaction: ChatInputCommandInteraction
): Promise<PollConfig | undefined> {
  const { id } = interaction.options.getChannel("channel", true, [
    ChannelType.GuildText,
    ChannelType.PublicThread,
    ChannelType.PrivateThread,
  ]);
  const channel = await interaction.client.channels.fetch(id);
  if (channel === null) {
    await interaction.reply({
      content: "Unable to access channel (probably a permission issue)",
      ephemeral: true,
    });
    return;
  }
  if (
    !(
      channel.type === ChannelType.GuildText ||
      channel.type === ChannelType.PublicThread ||
      channel.type === ChannelType.PrivateThread
    )
  ) {
    await interaction.reply({
      content:
        "Channel is somehow not text-based while also being a text channel. Confounding.",
      ephemeral: true,
    });
    return;
  }
  return {
    text: interaction.options.getString("text", true),
    question: interaction.options.getString("question", true),
    options: getOptions(interaction),
    minutes:
      (interaction.options.getInteger("minutes") ?? 0) +
      (interaction.options.getInteger("hours") ?? 0) * 60 +
      (interaction.options.getInteger("days") ?? 0) * 1440,
    channel,
  };
}
interface PollConfig {
  text: string;
  question: string;
  options: string[];
  minutes: number;
  channel?: TextChannel | PrivateThreadChannel | PublicThreadChannel;
}
