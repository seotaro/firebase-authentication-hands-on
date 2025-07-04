FROM node:20-slim
ENV NODE_ENV production

WORKDIR /workspace

COPY package.json yarn.lock ./
RUN yarn install --prod --frozen-lockfile && yarn cache clean
COPY main.js ./
COPY public ./public

CMD [ "node", "main.js" ]
