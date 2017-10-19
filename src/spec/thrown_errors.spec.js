// @flow

import test from 'ava'
import nock from 'nock'

import jsonFetch from '../index'

test('does not include request headers', async (t) => {
  const scope = nock('http://www.test.com')
    .get('/products/1234')
    .reply(200, '{""}', { 'Content-Type': 'application/json' })
  try {
    await jsonFetch('http://www.test.com/products/1234', { headers: { secret: 'foo' } })
  } catch (err) {
    t.is(err.request.url, 'http://www.test.com/products/1234')
    t.falsy(err.request.headers)
    t.true(scope.isDone())
    return
  }
  throw new Error('expected to throw')
})
