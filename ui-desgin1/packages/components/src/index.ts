import type { App, Plugin } from 'vue'
import { U1Avatar } from './avatar'
import { U1Button } from './button'
import { U1Card } from './card'
import { U1Checkbox, U1CheckboxGroup } from './checkbox'
import { U1Dialog } from './dialog'
import { U1Input } from './input'
import { U1Menu } from './menu'
import { U1Message } from './message'
import { U1Radio, U1RadioGroup } from './radio'
import { U1Select } from './select'
import { U1Switch } from './switch'
import { U1Table } from './table'
import { U1Tag } from './tag'
import './styles/index.css'

const components = [
  U1Button,
  U1Input,
  U1Radio,
  U1RadioGroup,
  U1Checkbox,
  U1CheckboxGroup,
  U1Card,
  U1Select,
  U1Switch,
  U1Avatar,
  U1Tag,
  U1Message,
  U1Dialog,
  U1Table,
  U1Menu
]

const U1Design: Plugin = {
  install(app: App) {
    components.forEach((component) => {
      app.component(component.name as string, component)
    })
  }
}

export {
  U1Button,
  U1Input,
  U1Radio,
  U1RadioGroup,
  U1Checkbox,
  U1CheckboxGroup,
  U1Card,
  U1Select,
  U1Switch,
  U1Avatar,
  U1Tag,
  U1Message,
  U1Dialog,
  U1Table,
  U1Menu
}
export default U1Design
