// @flow

import test from 'ava'
import nock from 'nock'

import jsonFetch from '../index'

test('handles it gracefully', async (t) => {
  const scope = nock('http://www.test.com')
    .get('/products/1234')
    .reply(200, 'test', {})
  const response = await jsonFetch('http://www.test.com/products/1234')
  t.is(response.body, undefined)
  t.true(scope.isDone())
})
