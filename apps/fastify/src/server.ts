import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyHelmet from '@fastify/helmet'
import fastifyRateLimit from '@fastify/rate-limit'
import fastify from 'fastify'

import { fastifyTRPCPlugin } from '@workspace/api/server'

import { getLoggerConfig } from '#/config'
import { env } from '#/env'
import { getFastifyTRPCPluginOptions } from '#/lib/trpc'

export function createServer(): {
  server: FastifyInstance
  start: () => Promise<void>
  stop: () => Promise<void>
} {
  // Initialize Fastify
  const server: FastifyInstance = fastify({
    logger: getLoggerConfig(env.NODE_ENV) || true,
  })

  // Security plugins
  server.register(fastifyHelmet)

  server.register(fastifyCors, {
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86_400,
  })

  server.register(fastifyRateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_WINDOW,
  })

  server.register(fastifyCookie)

  server.get('/', async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({ message: 'API is running!' })
  })

  // TRPC plugin
  server.register(fastifyTRPCPlugin, getFastifyTRPCPluginOptions())

  const stop = async (): Promise<void> => {
    try {
      server.log.info('Database connection pool closed')
    } catch (error) {
      server.log.error({ err: error }, 'Error closing database connection pool')
    }

    await server.close()
  }

  const start = async (): Promise<void> => {
    try {
      const address = await server.listen({ port: env.SERVER_PORT })

      server.log.info(`Server running at ${address}`)
      server.log.info(`Environment: ${env.NODE_ENV}`)
    } catch (err) {
      server.log.error(err)
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(1)
    }
  }

  return { server, start, stop }
}
