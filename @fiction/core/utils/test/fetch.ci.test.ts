/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from 'vitest'
import { fetchAdvanced } from '@fiction/core/utils/fetch'

describe('fetch', () => {
  it('has window and fetch', () => {
    expect(typeof window).toMatchInlineSnapshot('"object"')
    expect(typeof window.fetch).toMatchInlineSnapshot('"function"')
    expect(typeof fetch).toMatchInlineSnapshot('"function"')
  })
  it('fetch advanced with timeout', async () => {
    const result = await fetchAdvanced<Record<string, any>>(
      'https://jsonplaceholder.typicode.com/todos/1',
    )

    expect(result).toMatchInlineSnapshot(`
      {
        "completed": false,
        "id": 1,
        "title": "delectus aut autem",
        "userId": 1,
      }
    `)
  })
})
