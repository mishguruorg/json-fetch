// @flow

import test from 'ava'
import nock from 'nock'

import jsonFetch from '../index'

test('resolves with json body for 200 status codes', async (t) => {
  nock('http://www.test.com')
    .get('/products/1234')
    .reply(200, { name: 'apple' })
  const response = await jsonFetch('http://www.test.com/products/1234')
  t.deepEqual(response.body, { name: 'apple' })
  t.is(response.status, 200)
  t.is(response.statusText, 'OK')
  t.truthy(response.headers)
})

test('resolves with JSON body for 500 status codes', async (t) => {
  nock('http://www.test.com')
    .get('/products/1234')
    .reply(500, '"Something went wrong"', { 'Content-Type': 'application/json' })
  const response = await jsonFetch('http://www.test.com/products/1234')
  t.deepEqual(response.body, 'Something went wrong')
  t.is(response.status, 500)
  t.is(response.statusText, 'Internal Server Error')
  t.truthy(response.headers)
})

test('resolves with JSON body when content-type contains other values but includes application/json', async (t) => {
  nock('http://www.test.com')
    .get('/products/1234')
    .reply(204, '[{}]', { 'Content-Type': 'application/json; charset=utf-8' })
  const response = await jsonFetch('http://www.test.com/products/1234')
  t.deepEqual(response.body, [{}])
})

test('resolves with non-JSON body', async (t) => {
  nock('http://www.test.com')
    .get('/products/1234')
    .reply(200, 'This is not JSON', { 'Content-Type': 'text/plain' })
  const response = await jsonFetch('http://www.test.com/products/1234')
  t.is(response.body, undefined)
})

test('rejects when there is a connection error', async (t) => {
  nock('http://www.test.com')
    .get('/products/1234')
    .replyWithError('Something is broken!')
  let errorThrown = false
  try {
    await jsonFetch('http://www.test.com/products/1234')
  } catch (err) {
    errorThrown = true
    t.is(err.name, 'FetchError')
    t.deepEqual(err.message, 'request to http://www.test.com/products/1234 failed, reason: Something is broken!')
    t.deepEqual(err.request.url, 'http://www.test.com/products/1234')
  }
  t.true(errorThrown)
})

test('rejects with responseText when there is a json parse error', async (t) => {
  nock('http://www.test.com')
    .get('/products/1234')
    .reply(200, 'foo', { 'Content-Type': 'application/json; charset=utf-8' })
  let errorThrown = false
  try {
    await jsonFetch('http://www.test.com/products/1234')
  } catch (err) {
    errorThrown = true
    t.is(err.name, 'SyntaxError')
    t.true(/Unexpected token/.test(err.message))
    t.is(err.response.text, 'foo')
    t.is(err.response.status, 200)
    t.is(err.request.url, 'http://www.test.com/products/1234')
  }
  t.true(errorThrown)
})

test('sends json request body', async (t) => {
  nock('http://www.test.com')
    .post('/products/1234', { name: 'apple' })
    .reply(201, { _id: '1234', name: 'apple' })
  const response = await jsonFetch('http://www.test.com/products/1234', {
    method: 'POST',
    body: { name: 'apple' }
  })
  t.deepEqual(response.body, { _id: '1234', name: 'apple' })
  t.is(response.status, 201)
  t.is(response.statusText, 'Created')
  t.truthy(response.headers)
})
