import {EventEmitter} from 'events'

export default class Store extends EventEmitter {
    constructor(redis) {
        super();
        this.redis = redis;
        this.prefix = "sess:";
        this.ttl = 7 * 24 * 60 * 60;
    }

    getKey(sessionId) {
        return `${this.prefix}${sessionId}`;
    }

    get(sid, cb) {
        this.redis.get(this.getKey(sid),(err, result) => {
            cb(null, result ? JSON.parse(result): null)
        });
    }

    async set(sid, sess, cb) {
        const key = this.getKey(sid)
        const redisTtl = await this.redis.ttl(key)
        this.redis.set(key, JSON.stringify(sess), 'EX', redisTtl === -2 ? this.ttl : redisTtl);
        cb()
    }

    destroy(sid, cb) {
        this.redis.del(this.getKey(sid));
        cb()
    }
}