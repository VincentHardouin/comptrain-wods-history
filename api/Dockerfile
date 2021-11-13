FROM node:14 as builder
WORKDIR /app
COPY . .
RUN npm install

FROM node:14
WORKDIR /app
COPY --from=builder /app  .
ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT
CMD [ "npm", "start" ]
