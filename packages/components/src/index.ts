import type { App, Plugin } from 'vue'
import { U1Affix } from './affix'
import { U1Avatar } from './avatar'
import { U1Button } from './button'
import { U1Card } from './card'
import { U1Checkbox, U1CheckboxGroup } from './checkbox'
import { U1Dialog } from './dialog'
import { U1Icon } from './icon'
import { U1Input } from './input'
import { U1InputLabel } from './input-label'
import { U1Menu } from './menu'
import { U1Message, U1MessageComponent } from './message'
import { U1Radio, U1RadioGroup } from './radio'
import { U1Select } from './select'
import { U1Switch } from './switch'
import { U1Table } from './table'
import { U1Tag } from './tag'
import { U1ThemeEditor, U1ThemeEditorDialog } from './theme-editor'
import './styles/index.css'

const components = [
  U1Affix,
  U1Button,
  U1Icon,
  U1Input,
  U1InputLabel,
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
  U1Menu,
  U1ThemeEditor,
  U1ThemeEditorDialog
]

const U1Design: Plugin = {
  install(app: App) {
    components.forEach((component) => {
      if ('install' in component && typeof component.install === 'function') {
        component.install(app)
        return
      }

      app.component(component.name as string, component)
    })
  }
}

export {
  U1Affix,
  U1Button,
  U1Icon,
  U1Input,
  U1InputLabel,
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
  U1MessageComponent,
  U1Dialog,
  U1Table,
  U1Menu,
  U1ThemeEditor,
  U1ThemeEditorDialog
}
export default U1Design
