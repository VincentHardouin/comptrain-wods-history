FROM node:19 as builder
WORKDIR /app
COPY . .
RUN npm install

FROM node:19
WORKDIR /app
COPY --from=builder /app  .
ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT
CMD [ "npm", "start" ]
