![](https://img.shields.io/badge/Nodejs-v16.3.0-red)
![](https://img.shields.io/badge/PostgreSQL-v14.1-blue)
![](https://img.shields.io/badge/Redis-v6.2.6-blue)  

`v1/oracle/mvl`

winston(logger), joi(scheme validation)

## Test
jest, supertest, faker, nodemon
```
psql -U ljsku -d testdb
npx pm2 start pm2-app.json --name oracle
pm2 list
pm2 kill
pm2 stop all
pm2 restart all
```

## Structure
Excute all processes via `pm2`
### 1) API server
Get oracle price from Redis
### 2) Watch server
Get oracle price and Save to Redis per 2 seconds. Save average price in MongoDB periodically (Write-back policy)
