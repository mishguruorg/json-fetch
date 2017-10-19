// @flow

import test from 'ava'
import nock from 'nock'

import jsonFetch from '../index'

test('does not retry by default', async (t) => {
  const scope = nock('http://www.test.com')
    .get('/1')
    .reply(200, {})
  await jsonFetch('http://www.test.com/1')
  t.true(scope.isDone())
})

test('does specified number of retries', async (t) => {
  const scope = nock('http://www.test.com')
    .get('/2')
    .times(6)
    .reply(200, {})
  try {
    await jsonFetch('http://www.test.com/2', {
      shouldRetry: () => true,
      retry: {
        retries: 5,
        factor: 0
      }
    })
  } catch (err) {
    t.is(err.request.url, 'http://www.test.com/2')
    t.is(err.request.retry.retries, 5)
    t.true(scope.isDone())
    return
  }
  throw new Error('Should have failed')
})

test('respects the shouldRetry() function', async (t) => {
  const scope = nock('http://www.test.com')
    .get('/3')
    .times(3)
    .reply(200, {})
  try {
    let count = 0
    await jsonFetch('http://www.test.com/3', {
      shouldRetry: () => ++count < 3,
      retry: {
        retries: 5,
        factor: 0
      }
    })
    t.true(scope.isDone())
  } catch (err) {
    throw new Error('Should not fail')
  }
})

test('respects the should retry function for a network error', async (t) => {
  const scope = nock('http://www.test.com')
    .get('/4')
    .times(6)
    .replyWithError('ECONRST')
  try {
    await jsonFetch('http://www.test.com/4', {
      shouldRetry: () => true,
      retry: {
        retries: 5,
        factor: 0
      }
    })
  } catch (err) {
    t.is(err.message, 'request to http://www.test.com/4 failed, reason: ECONRST')
    t.true(scope.isDone())
    return
  }
  throw new Error('Should have failed')
})
