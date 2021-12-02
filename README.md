![](https://img.shields.io/badge/Nodejs-v16.3.0-red)
![](https://img.shields.io/badge/MongoDB-v5.0.4-blue)
![](https://img.shields.io/badge/Redis-v6.2.6-blue)  

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
