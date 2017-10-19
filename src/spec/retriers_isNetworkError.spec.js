// @flow

import test from 'ava'
import nock from 'nock'
import { Response } from 'node-fetch'

import jsonFetch, { retriers } from '../index'

test('accepts any errors', async (t) => {
  t.is(retriers.isNetworkError(new Error()), true)
})

test('rejects any non errors', async (t) => {
  t.is(retriers.isNetworkError(new Response('foo')), false)
  t.is(retriers.isNetworkError(new Response('')), false)
  t.is(retriers.isNetworkError(new Response('', { status: 200 })), false)
  t.is(retriers.isNetworkError(new Response('', { status: 500 })), false)
})

test('attempts to retry on a network error', async (t) => {
  const scope = nock('http://www.test.com')
    .get('/1')
    .times(6)
    .replyWithError('ECONRST')

  try {
    await jsonFetch('http://www.test.com/1', {
      shouldRetry: retriers.isNetworkError,
      retry: {
        retries: 5,
        factor: 0
      }
    })
  } catch (err) {
    t.true(scope.isDone())
    t.is(err.message, 'request to http://www.test.com/1 failed, reason: ECONRST')
    return
  }
  throw new Error('Should have failed')
})
