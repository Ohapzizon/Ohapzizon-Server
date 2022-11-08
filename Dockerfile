## declare base image - node 16
FROM node:16.14.0 AS builder
## make work directory and copy files
## 이미지를 빌드한 디렉토리의 모든 파일을 컨테이너의 app/ 디렉토리로 복사
WORKDIR /app
COPY . .
## project dependency install
RUN yarn
RUN yarn run build

FROM node:16.14.0-alpine
WORKDIR /usr/src/app
## 앞에서 build로 지정한 환경에서 파일을 가져와서 최종 이미지에 파일을 추가한다.
## 이전 단계에서 빌드된 아티팩트만 이 새 단계로 복사
COPY --from=builder /app ./

EXPOSE 3000
CMD yarn start:prod