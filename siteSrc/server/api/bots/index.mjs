import { defineEventHandler, getQuery } from "h3"

export default defineEventHandler(async event => {
    console.log(event.context.session)
    return event.context.pgPool`SELECT username, avatar, botid, nsfw FROM bots WHERE public = true LIMIT 30 OFFSET 30*${Number(getQuery(event).page ?? 0)}`.catch(() => {})
})

export const schema = {
    parameters:[
        {
            name: "page",
            in: "query",
            required: false,
            content: {
                media: "application/json"
            },
            "description": "The page number of bots to show"
        }
    ],
    responses: {
        200: {
            // type: "array",
            // items: {
            //     type: "object",
            //     properties: {
            //         botid: {
            //             type: "string",
            //             // example: "685166801394335819"
            //         },
            //         username: {
            //             type: "string",
            //             // example: "TomatenKuchen"
            //         },
            //         avatar: { type: "string" }
            //     }
            // }
        }
    }
}
