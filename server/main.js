"use strict";

require('dotenv').config();
const { join } = require('path');

const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(require(process.env.FIREBASE_SERVICE_ACCOUNT)),
});

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

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({ error: 'Missing or invalid token' });
    }

    const idToken = authHeader.split(' ')[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      request.user = decodedToken;

    } catch (error) {
      return reply.code(401).send({ error: error.message });
    }
  });

  fastify.get('/api', async (request, reply) => {
    console.log('GET /api', request.user);
    return { message: 'Hello', uid: request.user.uid, name: request.user.name, email: request.user.email };
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
