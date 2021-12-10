import cors from 'cors'
import rateLimit from "express-rate-limit"

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 6000,
    message: "Too many requests, Try again in a minute"
})

export {
    cors,
    limiter
}