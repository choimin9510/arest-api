# ARestAPI

## 개발환경

* NodeJS
* Express
* TypeScript
* InversifyJS
* TypeORM
* dotenv and envalid
* cors and helmet
* jest (unit tests)

## 의존성 설치
`npm i`

## 시작
``` development
npm run dev
```

``` production
npm run build
npm start
```

### 개발 환경에서는 mysql docker 환경을 실행해주세요.
``` development
docker-compose up -d

server 접속 후 arestapi database를 생성해주세요. (추후 fakeRepository 제공 예정)
```

### env를 작성해주세요 (미작성시 기본값으로 처리)

``` .env
MYSQL_HOST=
MYSQL_PORT=
MYSQL_USERNAME=
MYSQL_PASSWORD=
MYSQL_DATABASE=
OWNERCLAN_TEST_ID=
OWNERCLAN_TEST_PASSWORD=
```
