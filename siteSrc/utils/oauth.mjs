// import RequestHandler from './RequestHandler.mjs'
import {oauth2, bot_token} from '../config.mjs'

// const requestHandler = new RequestHandler()

function encode(obj) {
	let string = "";

	for (const [key, value] of Object.entries(obj)) {
		if (!value) continue;
		string += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
	}

	return string.substring(1);
}

export const tokenRequest = (options) => {
	const obj = {
		client_id: oauth2.clientID,
		client_secret: oauth2.clientSecret,
		grant_type: "authorization_code",
		code: options.code,
		redirect_uri: options.redirectUri,
		scope: "identify"
	};

	const encoded_string = encode(obj);

	return request("POST", "/oauth2/token", encoded_string, {
		contentType: "application/x-www-form-urlencoded",
	});
}

export const getDiscordUser = (access_token) => {
	return request("GET", "/users/@me", undefined, {
		auth: {
			type: "Bearer",
			creds: access_token,
		},
	});
}

export const getBot = async(botId) => {
	const botData = await request("GET", `/users/${botId}`, undefined, {
		auth: {
			type: "Bot",
			creds: bot_token,
		},
	});

	// console.log(botData)

	return botData.bot ? botData : undefined
}


async function request(method, url, body, { auth, contentType }){
	const headers = {
		"User-Agent": "Discord-OAuth2 (https://github.com/reboxer/discord-oauth2, 2.10.0)",
		"Accept-Encoding": "gzip,deflate",
		...(contentType ? { "Content-Type": contentType } : {}),
		...(auth ? { "Authorization": `${auth.type} ${auth.creds}` } : {}),

	};

	try {
		const resp = await fetch(`https://discord.com/api/v9/${url}`, { method, body, headers})
		return await resp.json()
	} catch (err) {
		return;
	}
}