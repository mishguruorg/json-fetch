// @flow

import test from 'ava'
import nock from 'nock'
import { Response } from 'node-fetch'

import jsonFetch, { retriers } from '../index'

test('accepts a 503 and 504 status codes', async (t) => {
  t.is(retriers.is5xx(new Response('', { status: 503 })), true)
  t.is(retriers.is5xx(new Response('', { status: 504 })), true)
})

test('rejects all other inputs', async (t) => {
  t.is(retriers.is5xx(new Error()), false)
  t.is(retriers.is5xx(new Response('', { status: 200 })), false)
  t.is(retriers.is5xx(new Response('', { status: 400 })), false)
  t.is(retriers.is5xx(new Response('', { status: 404 })), false)
  t.is(retriers.is5xx(new Response('', { status: 499 })), false)
  t.is(retriers.is5xx(new Response('', { status: 500 })), false)
  t.is(retriers.is5xx(new Response('', { status: 501 })), false)
  t.is(retriers.is5xx(new Response('', { status: 502 })), false)
})

test('attempts to retry on a 5xx error code', async (t) => {
  const scope = nock('http://www.test.com')
    .get('/1')
    .times(4)
    .reply(503)
  try {
    await jsonFetch('http://www.test.com/1', {
      shouldRetry: retriers.is5xx,
      retry: {
        retries: 3,
        factor: 0
      }
    })
  } catch (err) {
    t.true(scope.isDone())
    return
  }
  throw new Error('Should have failed')
})
