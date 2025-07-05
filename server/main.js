"use strict";

require('dotenv').config();

const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.applicationDefault() });

(async () => {
  const fastify = require('fastify')({
    logger: true
  });

  fastify.register(require('@fastify/compress'), {
    global: true,
    encodings: ['gzip']
  });

  fastify.register(require('@fastify/cors'), {
    origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST'],
  });

  fastify.addHook('onRequest', async (request, reply) => {
    console.log(`onRequest Hook method:${request.method}, url:${request.url}, headers:${JSON.stringify(request.headers)}`);

    const token = request.headers.authorization?.split(' ')[1];
    if (!token) return reply.code(401).send({ error: 'Invalid token' });

    return admin.auth().verifyIdToken(token)
      .then(decoded => {
        return request.user = decoded;
      })
      .catch((error) => {
        return reply.code(401).send({ error: error.message });
      });
  });

  fastify.get('/api', async (request, reply) => {
    console.log('GET /api', request.user);
    return { message: 'Hello', uid: request.user.uid, name: request.user.name, email: request.user.email };
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
