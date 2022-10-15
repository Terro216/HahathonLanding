FROM node:16 as build-stage
WORKDIR /project
COPY . .
RUN npx jake

FROM node:16 as final-stage
EXPOSE 5000
WORKDIR /app

COPY --from=build-stage /project/app .
COPY apiKey.json apiKey.json

COPY env.sh env.sh
RUN chmod +x env.sh

CMD . ./env.sh && node src
