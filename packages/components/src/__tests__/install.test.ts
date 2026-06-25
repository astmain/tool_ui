import { describe, expect, it } from 'vitest'
import { createApp } from 'vue'
import U1Design, {
  U1Affix,
  U1Avatar,
  U1Button,
  U1Card,
  U1Checkbox,
  U1CheckboxGroup,
  U1Dialog,
  U1Input,
  U1InputLabel,
  U1Menu,
  U1Message,
  U1MessageComponent,
  U1Radio,
  U1RadioGroup,
  U1Select,
  U1Switch,
  U1Table,
  U1Tag
} from '../index'

describe('U1Design plugin', () => {
  it('exports components and installs them globally', () => {
    const app = createApp({})
    const components = [
      U1Affix,
      U1Avatar,
      U1Button,
      U1Card,
      U1Checkbox,
      U1CheckboxGroup,
      U1Dialog,
      U1Input,
      U1InputLabel,
      U1Menu,
      U1MessageComponent,
      U1Radio,
      U1RadioGroup,
      U1Select,
      U1Switch,
      U1Table,
      U1Tag
    ]

    app.use(U1Design)

    for (const component of components) {
      expect(component.name).toMatch(/^U1/)
      expect(app.component(component.name as string)).toBeTruthy()
    }
    expect(U1Message.success).toBeTypeOf('function')
  })
})
