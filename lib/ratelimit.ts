import { Redis} from '@upstash/redis'
import { Ratelimit } from "@upstash/ratelimit";

const redis = Redis.fromEnv()

export const rateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: false
})