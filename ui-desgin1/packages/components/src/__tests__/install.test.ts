import { describe, expect, it } from 'vitest'
import { createApp } from 'vue'
import U1Design, { U1Button, U1Card, U1Input, U1Radio, U1RadioGroup } from '../index'

describe('U1Design plugin', () => {
  it('exports components and installs them globally', () => {
    const app = createApp({})

    app.use(U1Design)

    expect(U1Button.name).toBe('U1Button')
    expect(U1Input.name).toBe('U1Input')
    expect(U1Radio.name).toBe('U1Radio')
    expect(U1RadioGroup.name).toBe('U1RadioGroup')
    expect(U1Card.name).toBe('U1Card')
    expect(app.component('U1Button')).toBeTruthy()
  })
})
