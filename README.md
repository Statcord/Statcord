# DisStat
A in-progress project by TomatoCake and numselli, which aims to replace [Statcord](https://statcord.com)
with a more stable alternative due to it being offline recently and not updated in a long time.

## Features
This allows bot owners to track usage and statistics of their bot, and allows users to view bot stats.
Bots can also set custom urls for their bot.

Tracked default statistics include guilds, users, shards, memory & cpu usage and the Discord API ping, and can be expanded to track commands, events, and more.

## Usage

- HTTP API docs: https://disstat.pages.dev/docs
- `disstat` npm package: https://npmjs.com/package/disstat

## Support
If you need help (or want to help) with the site, you can join our [**Discord** ![Discord invite banner](https://discord.com/api/guilds/1081089799324180490/widget.png?style=shield)](https://discord.gg/qsHxVUnXqr)
or open an issue on GitHub.

## TODO
- Pypi package

- Auto fetch bot lists the bot is on and display them on /bot/vote?id= or similar for owners to link to
- Vote buckets like Statcord has
- data import from Statcord
- command tracking usage
- add custom charts & use dynamic name, type, label, and enabled status
- add settings menu for chart types
- add settings menu to delete custom stats
- add setting for chart name
- amount of unique users for commands
- Clustered stats which Statcord had for whitelisted bots only https://docs.statcord.com/#/api?id=post-clustered-stats
