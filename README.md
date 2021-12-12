![](https://img.shields.io/badge/Nodejs-v16.3.0-red)
![](https://img.shields.io/badge/PostgreSQL-v14.1-blue)
![](https://img.shields.io/badge/Redis-v6.2.6-blue)  

`v1/oracle/mvl`

winston(logger), joi(scheme validation)


## Test
jest, supertest, faker, nodemon
```
psql -U ljsku -d testdb
npx pm2 start pm2-app.json
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

# Features
* DB 세팅 및 데이터 저장(Redis (단주기) -> PostgreSQL(긴주기) 순으로 백업)
* 쿼리 자동화(fail-safe)
* pm2 사용해서 watcher, API server 프로세스 분리 실행
* DOS 방지를 위한 API rate limit 설정
* 범용 서버 에러 처리(Graceful shutdown)
* 장애상황 트랙킹을 위한 logger 설정 
