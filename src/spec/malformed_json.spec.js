// @flow

import test from 'ava'
import nock from 'nock'

import jsonFetch from '../index'

test('throws error with malformed text', async (t) => {
  const scope = nock('http://www.test.com')
    .get('/products/1234')
    .reply(200, '{"name": "apple""}', { 'Content-Type': 'application/json' })
  try {
    await jsonFetch('http://www.test.com/products/1234')
  } catch (err) {
    t.true(err.message.includes('Unexpected string'))
    t.true(scope.isDone())
    return
  }
  throw new Error('expected to throw')
})
