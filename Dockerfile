FROM node:20.10.0-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

FROM node:20.10.0-alpine as final
WORKDIR /app
COPY --from=builder /app/.env.uat /app/.env
COPY --from=builder /app/dist /app/dist
COPY package.json .
COPY yarn.lock .
RUN yarn install --production
EXPOSE 3000
CMD [ "yarn", "start" ]
