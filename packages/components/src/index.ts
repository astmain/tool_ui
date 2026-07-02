import type { App, Plugin } from 'vue'
import { U1Affix } from './affix'
import { U1Avatar } from './avatar'
import { U1Button } from './button'
import { U1Card } from './card'
import { U1Checkbox, U1CheckboxGroup } from './checkbox'
import { U1Confirm } from './confirm'
import { U1Dialog } from './dialog'
import { U1Icon } from './icon'
import { U1Input } from './input'
import { U1InputLabel } from './input-label'
import { U1Layout1 } from './layout'
import { U1Menu } from './menu'
import { U1Message, U1MessageComponent } from './message'
import { U1Radio, U1RadioGroup } from './radio'
import { U1Select } from './select'
import { U1Switch } from './switch'
import { U1Table } from './table'
import { U1Tag } from './tag'
import { U1Textarea } from './textarea'
import { U1ThemeEditor, U1ThemeEditorDialog } from './theme-editor'
import './styles/base.css'
import './styles/icons.css'

const components = [
  U1Affix,
  U1Button,
  U1Icon,
  U1Input,
  U1InputLabel,
  U1Layout1,
  U1Radio,
  U1RadioGroup,
  U1Checkbox,
  U1CheckboxGroup,
  U1Card,
  U1Select,
  U1Switch,
  U1Avatar,
  U1Tag,
  U1Textarea,
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
  U1Layout1,
  U1Radio,
  U1RadioGroup,
  U1Checkbox,
  U1CheckboxGroup,
  U1Card,
  U1Select,
  U1Switch,
  U1Avatar,
  U1Tag,
  U1Textarea,
  U1Message,
  U1MessageComponent,
  U1Confirm,
  U1Dialog,
  U1Table,
  U1Menu,
  U1ThemeEditor,
  U1ThemeEditorDialog
}

// 组件公共类型 (供消费方直接从包根导入, 无需本地手抄)
export type { Layout1MenuItem, Layout1Config } from './layout'

export default U1Design
