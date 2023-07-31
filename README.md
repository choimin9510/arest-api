# ARestAPI
ARestAPI 는 도매처(B2B) 통합 API 서비스 입니다.

## 주요기능 (지속적으로 추가 될 예정입니다)
- [x] 로그인 `/api/auth/login`
- [x] 로그인 체크 `/api/auth/login-check`
- [x] 주문조회 `/api/order`
- [ ] 주문 상세조회 `/api/order/:orderId`
- [ ] 상품조회 `/api/product`
- [ ] 상품 상세조회 `/api/product/:productId`
- [ ] 예치금 사용내역 조회
- [ ] 1:1 문의조회

## 지원 쇼핑몰 (지속적으로 추가 될 예정입니다)
- [x] 오너클랜 `ownerclan`


## 개발환경

* NodeJS
* Express
* TypeScript
* InversifyJS
* TypeORM
* dotenv and envalid
* cors and helmet
* jest (unit tests)
* Puppeteer
* Axios

## 의존성 설치
`npm i`

## 시작

개발환경
``` development
npm run dev
```

실서버
``` production
npm run build
npm start
```

### Mysql Server 를 3306 포트로 띄워주세요. (개발환경은 docker-compose 실행)
```development
docker-compose up -d

server 접속 후 arestapi database를 생성해주세요. (추후 fakeRepository 제공 예정)
```

### .env를 작성해주세요 (미작성시 기본값으로 처리)

``` .env
MYSQL_HOST=
MYSQL_PORT=
MYSQL_USERNAME=
MYSQL_PASSWORD=
MYSQL_DATABASE=
OWNERCLAN_TEST_ID=
OWNERCLAN_TEST_PASSWORD=
```
