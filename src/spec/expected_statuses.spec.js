// @flow

import test from 'ava'
import nock from 'nock'

import jsonFetch from '../index'

test('errors with FetchUnexpectedStatus if the response has an unexpected status code', async (t) => {
  const scope = nock('http://www.test.com')
    .get('/products/1234')
    .reply(400, 'not found')
  try {
    await jsonFetch('http://www.test.com/products/1234', { expectedStatuses: [201] })
  } catch (err) {
    t.is(err.name, 'FetchUnexpectedStatusError')
    t.is(err.message, 'Unexpected fetch response status 400')
    t.is(err.request.url, 'http://www.test.com/products/1234')
    t.is(err.response.status, 400)
    t.is(err.response.text, 'not found')
    t.true(scope.isDone())
    return
  }
  throw new Error('expected to throw')
})

test('returns a response with an expected status code', async (t) => {
  const scope = nock('http://www.test.com')
    .get('/products/1234')
    .reply(201, 'not found')
  const response = await jsonFetch('http://www.test.com/products/1234', { expectedStatuses: [201] })
  t.is(response.status, 201)
  t.true(scope.isDone())
})

test('returns a response without an expected status code', async (t) => {
  const scope = nock('http://www.test.com')
    .get('/products/1234')
    .reply(404, 'not found')
  const response = await jsonFetch('http://www.test.com/products/1234')
  t.is(response.status, 404)
  t.true(scope.isDone())
})
