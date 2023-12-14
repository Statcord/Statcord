# DisStat
A in-progress project by TomatoCake and numselli, which aims to replace [Statcord](https://statcord.com)
with a more stable alternative due to it being offline recently and not updated in a long time.

## Features
This allows bot owners to track usage and statistics of their bot, and allows users to view bot stats.
Statistics include guild, user, and shard counts, and can be expanded to track commands, events, and more.

You can find it's API docs [here](https://app.swaggerhub.com/apis-docs/DisStat/DisStat/1.0.0).

## Support
If you need help (or want to help) with the site, you can join our [**Discord** ![](https://discord.com/api/guilds/1081089799324180490/widget.png?style=shield)](https://discord.gg/qsHxVUnXqr)
or open an issue on GitHub.

## TODO/Ideas
- Auto fetch bot lists the bot is on and display them on /bot/:id/vote or similar for owners to link to
- Vote buckets like statcord has
- Custom graphs like statcord has
- Custom urls for bots
- Pypi package

- data import from statcord
- docs on how to setup stats
- link ^ somewhere after adding a bot
- fix api key not showing unless reset on manage bot page
- show api key after bot adding
- add group by selector allowing to group by the day/month/year etc
- add toggle for private in bot settings
- make settings api routes
- command tracking usage
- use dynamic name, type, label, and enabled status
- add customCharts
- add settings menu for chart types
- add settings menu to delete custom stats
- add setting for chart name
- add individual stat counters in addition to charts (sum up data displayed on charts)
- amount of unique users for commands
