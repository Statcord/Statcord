import {route as oauthCallback} from './oauth/callback.mjs'
import {route as oauthLogIn} from './oauth/login.mjs'
import {route as ouathLogOut} from './oauth/logout.mjs'
import {route as oauthUser} from './oauth/user.mjs'

import {route as botAdd} from './bots/add.mjs'
import {route as botList} from './bots/list.mjs'
import {route as mybots } from './bots/mybots.mjs'
import {route as getbot} from './bots/getbot.mjs'
import {route as deleteBot} from './bots/delete.mjs'
import {route as syncBot} from './bots/sync.mjs'
import { route as  genKey} from './bots/genKey.mjs'

export default [
    oauthCallback,
    oauthLogIn,
    ouathLogOut,
    oauthUser,
    botAdd,
    botList,
    mybots,
    getbot,
    deleteBot,
    syncBot,
    genKey
]
