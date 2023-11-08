# Reynard

Reynard is a multi-purpose discord bot, made out of frustration with the state of the discord bot ecosystem. Almost all bots nowadays lock critical features behind paid premium subscriptions, require you to vote on top.gg to unlock others, and/or get bought out (by botlabs/bluestacks, for example) and start doing shady things. So, I started working on my own bot, with the purpose of being the opposite of all that.

## What it is and isn't

- Reynard is free and open source. No subscriptions, no required voting, and an open GPLv3 license.
- Reynard is developed by me, in my free time. Its features are based on what I, personally need. If you have a feature request, open an issue and tag it as such- or feel free to add it yourself and submit a PR.
- Reynard is not a pre-hosted bot. You won't find a discord bot link here- you need to host your own instance somewhere. I don't have the money to host a big instance, so if you want to use the bot you'll need to figure out that part yourself.
- Reynard is not an income stream for me. In fact by design there's no way for me to monetize it. It is a personal project that will be developed at my own lesiure, so don't expect it to become some massive thing.

## How do I set this up?

This bot is made in Typescript using Nodejs, so you'll need nodejs and either npm or yarn or something similar. Clone the repo, run `npm i` or `yarn` or similar to install dependencies, then compile it with `npx tsc` and run with `node dist/index.js`. You'll also need to deploy the commands with `node dist/deploycommands.js` before the commands will work. The bot expects a discord bot token and application id (DISCORD_TOKEN and APPLICATION_ID respectively) in the environment; it's set up to use a `.env` file for them, so putting that in the project root directory will work fine.

## What features does it have?

Currently, the only feature the bot has is a poll command, since I literally started this yesterday. I'm adding more features rapidly, but it's nowhere near finished in its current state.

## What features are planned, then?

I plan to add moderation features like mutes and bans, as well as reaction roles and an autoresponder (intended for use in forum channels), plus probably a logger if I get around to it.

## Is this related to the 'Reynard' bot on top.gg?

No, it's unrelated. I had no idea it existed until after I'd chosen the name, and as of right now I don't have a better name to switch to. If that changes, I'll rename this to avoid the confusion. I named the bot 'Reynard' because the Reynard the Fox stories, in a somewhat roundabout way, contributed to my name.
