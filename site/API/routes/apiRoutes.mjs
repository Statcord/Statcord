import {route as main} from './root/main.mjs'

import {route as oauthCallback} from './oauth/callback.mjs'
import {route as oauthLogIn} from './oauth/login.mjs'
import {route as ouathLogOut} from './oauth/logout.mjs'
import {route as oauthUser} from './oauth/user.mjs'

export default [
    main,
    oauthCallback,
    oauthLogIn,
    ouathLogOut,
    oauthUser
]