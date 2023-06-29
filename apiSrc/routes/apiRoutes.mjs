import {route as oauthCallback} from './oauth/callback.mjs'
import {route as ouathLogOut} from './oauth/logout.mjs'
import {route as oauthUser} from './oauth/user.mjs'

import {route as botAdd} from './bots/add.mjs'
import {route as mybots} from './bots/mybots.mjs'
import {route as getbot} from './bots/getbot.mjs'
import {route as deleteBot} from './bots/delete.mjs'
import {route as syncBot} from './bots/sync.mjs'
import {route as  genKey} from './bots/genKey.mjs'

import {route as docsJson} from './docs/json.mjs'

import {route as postBotStats} from './stats/post.mjs'
import {route as getDefault} from './stats/getDefault.mjs'
import { route as chartTypes } from './stats/chartTypes.mjs'

export default [
    oauthCallback,
    ouathLogOut,
    oauthUser,
    botAdd,
    mybots,
    getbot,
    deleteBot,
    syncBot,
    genKey,
    docsJson,
    postBotStats,
    getDefault,
    chartTypes
]
