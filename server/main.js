"use strict";

require('dotenv').config();
const { join } = require('path');


(async () => {
  const fastify = require('fastify')({
    logger: true
  })

  fastify.register(require('@fastify/compress'), {
    global: true,
    encodings: ['gzip']
  });

  // クライアントページをルートで返す。
  fastify.register(require('@fastify/static'), {
    root: join(process.cwd(), "public"),
    prefix: "/",
  });

  const start = async () => {
    try {
      const port = process.env.PORT || 8080;
      console.log('Listening on port:', port);
      await fastify.listen({ port, host: '0.0.0.0' })
    } catch (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  }
  start();
})();
