import Redis from "ioredis"

export default class redisCache{
    #redis
    #prefix
    #format
    constructor(options){
        this.#redis = new Redis(6379, process.env.NODE_ENV === "production" ? "cache" : "192.168.0.21");

        this.#prefix = options?.prefix
        this.#format = options?.format

        options?.existingData?.map(async key=>{
            if (!await this.has(key.id)) this.set(key.id, key)
        })
    }


    #getKeyFormat(key){
        return this.#format.replace("c", this.#prefix).replace(":id", `:${key}`)
    }


    async get(key){
       const redisData = await this.#redis.get(this.#getKeyFormat(key));
        try {
            return JSON.parse(redisData)
        } catch (e) {
            return redisData
        }
    }

    set(key, value, expiry){
        if (expiry) this.#redis.set(this.#getKeyFormat(key), typeof value === "object" ? JSON.stringify(value) : value, expiry ? "EX" : undefined, expiry)
        else this.#redis.set(this.#getKeyFormat(key), typeof value === "object" ? JSON.stringify(value) : value)
    }

    delete(key){
        this.#redis.del(this.#getKeyFormat(key))
    }

    async has (key){
        return this.#redis.exists(this.#getKeyFormat(key))
    }

    update(data){
        this.set(data.id, data)
        return data   
    }

    destroy(){
        this.#redis.quit()
    }
}

// import redisCache from './utils/redisCache.mjs';

// this.bot.channels = new redisCache({prefix: "channelCache", format:"c:id", existingData: Array.from(this.bot.guilds.keys()).flatMap(guild=>Array.from(this.bot.guilds.get(guild).channels.values()))})
// this.bot.users = new redisCache({prefix: "userCache", format:"c:id", existingData: this.bot.users})
// this.bot.guilds = new redisCache({prefix: "guildsCache", format:"c:id", existingData: this.bot.guilds})
// this.bot.channelGuildMap = undefined
// this.bot.channels.destroy()
// this.bot.users.destroy()
// this.bot.guilds.destroy()
