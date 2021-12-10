import denv from "dotenv"
import path from "path"
import Joi from "joi"

denv.config({ path: path.join(__dirname, '../../.env') });

const envSchema = Joi.object()
.keys({
    NODE_ENV: Joi.string().valid("production", "development", "test").required(),
    PORT: Joi.number().default(80),
    MONGODB_URL: Joi.string().required(),

    SMTP_HOST: Joi.string(),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string(),
    SMTP_PASSWORD: Joi.string(),
    EMAIL_FROM: Joi.string(),
})
.unknown()

const { value: envVars, error } = envSchema.validate(process.env)
if (error) {
    throw new Error(`${error} \n * Modify your environment schema`)
}

const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongoose: {
        url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
    },
    },
    email: {
        smtp: {
            host: envVars.SMTP_HOST,
            port: envVars.SMTP_PORT,
            auth: {
                user: envVars.SMTP_USERNAME,
                pass: envVars.SMTP_PASSWORD,
            },
        },
        from: envVars.EMAIL_FROM
    }
}

export {
    config
}
