![](https://img.shields.io/badge/nodejs-v16.3.0-red)

`v1/oracle/mvl`

winston(logger), joi(scheme validation), Mongoose(Object Document Mapping)

## Test
jest, supertest, faker, nodemon

## Structure
Excute all processes via `pm2`
### 1) API server
Get oracle price from Redis
### 2) Watch server
Get oracle price and Save to Redis per 2 seconds. Save average price in MongoDB periodically (Write-back policy)
