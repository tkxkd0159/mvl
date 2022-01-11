import denv from "dotenv"
import path from "path"
import Joi from "joi"

denv.config({ path: path.join(__dirname, '../../.env') });


const envSchema = Joi.object()
.keys({
    NODE_ENV: Joi.string().valid("production", "development", "test").required(),
    PORT: Joi.number().default(80),
    PGHOST: Joi.string().required(),
    PGUSER: Joi.string().default(process.env.USER),
    PGPASSWORD: Joi.string().required(),
    PGPORT: Joi.number().description('port to connect to the postgreSQL server'),
})
.unknown()

const { value: envVars, error } = envSchema.validate(process.env)
if (error) {
    throw new Error(`${error} \n * Modify your environment schema`)
}

const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    pg: {
        user: envVars.PGUSER,
        host: envVars.PGHOST,
        database: 'mvl_oracle',
        password: envVars.PGPASSWORD,
        port: envVars.PGPORT
    },
    tformat: "YYYY-MM-DD HH:mm:ss"
}

export {
    config
}
