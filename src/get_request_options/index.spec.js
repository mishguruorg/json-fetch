// @flow

import test from 'ava'

import getRequestOptions from './index'

test('populates an options object without undefined keys', (t) => {
  const expected = {
    credentials: 'include',
    headers: {
      Accept: 'application/json'
    }
  }
  const actual = getRequestOptions({})
  t.deepEqual(actual, expected)
})

test('sets content type header only when there is a body', (t) => {
  const expected = {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: '{"hi":"hello"}'
  }
  const actual = getRequestOptions({ body: { hi: 'hello' } })
  t.deepEqual(actual, expected)
})

test('includes whitelisted options', (t) => {
  const expected = {
    credentials: 'include',
    headers: {
      Accept: 'application/json'
    },
    timeout: 123
  }
  const actual = getRequestOptions({ timeout: 123 })
  t.deepEqual(actual, expected)
})

test('excluded non-whitelisted options', (t) => {
  const expected = {
    credentials: 'include',
    headers: {
      Accept: 'application/json'
    }
  }
  const actual = getRequestOptions({ foo: 'bar' })
  t.deepEqual(actual, expected)
})
