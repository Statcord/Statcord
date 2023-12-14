# DisStat
A in-progress project by TomatoCake and numselli, which aims to replace [Statcord](https://statcord.com)
with a more stable alternative due to it being offline recently and not updated in a long time.

## Features
This allows bot owners to track usage and statistics of their bot, and allows users to view bot stats.
Statistics include guild, user, and shard counts, and can be expanded to track commands, events, and more.

You can find it's API docs [here](https://app.swaggerhub.com/apis-docs/DisStat/DisStat/1.0.0).

## Support
If you need help (or want to help) with the site, you can join our [**Discord** ![Discord invite banner](https://discord.com/api/guilds/1081089799324180490/widget.png?style=shield)](https://discord.gg/qsHxVUnXqr)
or open an issue on GitHub.

## TODO
- Auto fetch bot lists the bot is on and display them on /bot/vote?id= or similar for owners to link to
- Vote buckets like statcord has
- Custom graphs like statcord has
- Custom urls for bots
- Pypi package
- data import from statcord
- prevent random users from adding bots they don't own by removing them after one hour or so without any stats posted
- link docs on how to setup stats somewhere after adding a bot
- show api key after bot adding
- add toggle for private in bot settings
- command tracking usage
- add customCharts & use dynamic name, type, label, and enabled status
- add settings menu for chart types
- add settings menu to delete custom stats
- add setting for chart name
- amount of unique users for commands
- instead of having a /sync api endpoint, automatically sync every few days
