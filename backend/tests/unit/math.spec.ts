import { test } from '@japa/runner'

test.group('Math', () => {
  test('addition should work', ({ assert }) => {
    assert.equal(2 + 2, 4)
  })
})
