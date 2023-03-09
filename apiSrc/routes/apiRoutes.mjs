import {route as main} from './root/main.mjs'
import {route as avatar} from './root/avatar.mjs'

import {route as oauthCallback} from './oauth/callback.mjs'
import {route as oauthLogIn} from './oauth/login.mjs'
import {route as ouathLogOut} from './oauth/logout.mjs'
import {route as oauthUser} from './oauth/user.mjs'

import {route as botAdd} from './bots/add.mjs'
import {route as botList} from './bots/list.mjs'
import {route as mybots } from './bots/mybots.mjs'
import {route as botGet} from './bots/get.mjs'

import {route as devGetBot} from './devRoutes/get.mjs'
import {route as devUpdateBot} from './devRoutes/update.mjs'
import {route as devPostCmd} from './devRoutes/cmd.mjs'

import {route as userGetAPIKey} from './user/getAPIKey.mjs'
import {route as userRegenAPIKey} from './user/regenAPIKey.mjs'

export default [
    main,
    avatar,
    oauthCallback,
    oauthLogIn,
    ouathLogOut,
    oauthUser,
    botAdd,
    botList,
    mybots,
    botGet,
    devGetBot,
    devUpdateBot,
    devPostCmd,
    userGetAPIKey,
    userRegenAPIKey
]
