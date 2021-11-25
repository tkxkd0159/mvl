import denv from "dotenv"
const path = require('path');
const Joi = require('joi');

denv.config({ path: path.join(__dirname, '../../.env') });