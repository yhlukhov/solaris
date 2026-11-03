import * as Sentry from '@sentry/nextjs'
import { EventEmitter } from 'events'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
    // Safely bump the threshold to 20 for Next.js internal event orchestration
    EventEmitter.defaultMaxListeners = 20 //* Uncomment this if EventEmitter limit errors persist in console
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}

export const onRequestError = Sentry.captureRequestError
