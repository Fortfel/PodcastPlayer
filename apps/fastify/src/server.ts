import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyHelmet from '@fastify/helmet'
import fastifyRateLimit from '@fastify/rate-limit'
import fastify from 'fastify'

import { fastifyTRPCPlugin, initPodcastIndexApi } from '@workspace/api/server'

import { getLoggerConfig } from '#/config'
import { env } from '#/env'
import { getFastifyTRPCPluginOptions } from '#/lib/trpc'

const podcastIndexApi = initPodcastIndexApi({
  authKey: env.PI_AUTH_KEY,
  secretKey: env.PI_SECRET_KEY,
  userAgent: env.PI_USER_AGENT,
  apiEndpoint: env.PI_API_ENDPOINT,
})

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

  // Handle requests at the API base path (for health checks)
  if (env.SERVER_API_PATH !== '/') {
    server.get(env.SERVER_API_PATH, async (_request: FastifyRequest, reply: FastifyReply) => {
      return reply.send({ message: 'API is running!' })
    })
  }

  // TRPC plugin
  server.register(fastifyTRPCPlugin, getFastifyTRPCPluginOptions(podcastIndexApi))

  server.setErrorHandler((error, request, reply) => {
    const isProduction = env.NODE_ENV === 'production'

    // Log the full error server-side
    server.log.error(
      {
        err: error,
        url: request.url,
        method: request.method,
      },
      'Unhandled error',
    )

    const statusCode = error instanceof Error && 'statusCode' in error ? Number(error.statusCode) : 500

    // Send sanitized error to client
    if (isProduction) {
      reply.status(statusCode).send({
        error: {
          statusCode,
          message: 'Internal server error',
        },
      })
    } else {
      reply.status(statusCode).send({
        error: {
          statusCode,
          ...(error instanceof Error && error.name ? { name: error.name } : {}),
          ...(error instanceof Error && error.message
            ? { message: error.message }
            : { message: 'Internal server error' }),
          ...(error instanceof Error && error.cause ? { cause: error.cause } : {}),
          ...(error instanceof Error && error.stack ? { stack: error.stack } : {}),
        },
      })
    }
  })

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
      const address = await server.listen({ port: env.SERVER_PORT, host: '127.0.0.1' })

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
