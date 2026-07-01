import { createVNode, defineComponent, h, reactive, render } from 'vue'
import type { Component, PropType } from 'vue'
import MessageComponent from './Message.vue'

export type U1MessageType = 'success' | 'warning' | 'info' | 'error'
export type U1MessagePlacement = 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right'

export interface U1MessageOptions {
  message: string
  type?: U1MessageType
  duration?: number
  showClose?: boolean
  grouping?: boolean
  dangerouslyUseHTMLString?: boolean
  offset?: number
  placement?: U1MessagePlacement
  zIndex?: number
  onClose?: () => void
}

export interface U1MessageHandler {
  close: () => void
}

export interface U1MessageService {
  (options: string | U1MessageOptions): U1MessageHandler
  success: (options: string | Omit<U1MessageOptions, 'type'>) => U1MessageHandler
  warning: (options: string | Omit<U1MessageOptions, 'type'>) => U1MessageHandler
  info: (options: string | Omit<U1MessageOptions, 'type'>) => U1MessageHandler
  error: (options: string | Omit<U1MessageOptions, 'type'>) => U1MessageHandler
  closeAll: (type?: U1MessageType) => void
  install?: (app: { component: (name: string, component: typeof MessageComponent) => void }) => void
}

interface MessageInstance {
  id: number
  container: HTMLDivElement
  props: Omit<U1MessageOptions, 'onClose'> & {
    repeatNum: number
  }
  type: U1MessageType
  close: () => void
  onClose?: () => void
  closed: boolean
  timer?: number
}

type MessageState = MessageInstance['props']

const DEFAULT_OFFSET = 20
const DEFAULT_DURATION = 3000
const instances: MessageInstance[] = []
let seed = 1

const MessageRenderer = defineComponent({
  props: {
    state: {
      type: Object as PropType<MessageState>,
      required: true
    },
    close: {
      type: Function as PropType<() => void>,
      required: true
    }
  },
  setup(props) {
    return () => h(MessageComponent as Component, { ...props.state, onClose: props.close })
  }
})

function normalizeOptions(options: string | U1MessageOptions, type?: U1MessageType): U1MessageOptions {
  if (typeof options === 'string') {
    return {
      message: options,
      type: type ?? 'info'
    }
  }

  return {
    ...options,
    type: type ?? options.type ?? 'info'
  }
}

function getOffset(placement: U1MessagePlacement) {
  return instances
    .filter((instance) => instance.props.placement === placement)
    .reduce((offset, instance) => {
      const messageElement = instance.container.firstElementChild
      const height = messageElement?.getBoundingClientRect().height || 44

      return offset + height + 16
    }, DEFAULT_OFFSET)
}

function findGroupedInstance(options: U1MessageOptions) {
  return instances.find((instance) => {
    return (
      options.grouping &&
      instance.props.grouping &&
      instance.props.message === options.message &&
      instance.props.type === options.type
    )
  })
}

function closeInstance(instance: MessageInstance) {
  if (instance.closed) {
    return
  }

  instance.closed = true

  if (instance.timer !== undefined) {
    window.clearTimeout(instance.timer)
    instance.timer = undefined
  }

  const index = instances.findIndex((item) => item.id === instance.id)

  if (index !== -1) {
    instances.splice(index, 1)
  }

  render(null, instance.container)
  instance.container.remove()
  instance.onClose?.()
}

function createMessage(options: string | U1MessageOptions, type?: U1MessageType): U1MessageHandler {
  const normalized = normalizeOptions(options, type)
  const groupedInstance = findGroupedInstance(normalized)

  if (groupedInstance) {
    groupedInstance.props.repeatNum += 1
    return {
      close: groupedInstance.close
    }
  }

  const id = seed
  seed += 1

  const container = document.createElement('div')
  const placement = normalized.placement ?? 'top'
  const props = reactive({
    message: normalized.message,
    type: normalized.type ?? 'info',
    duration: normalized.duration ?? DEFAULT_DURATION,
    showClose: normalized.showClose ?? false,
    grouping: normalized.grouping ?? false,
    dangerouslyUseHTMLString: normalized.dangerouslyUseHTMLString ?? false,
    placement,
    offset: normalized.offset ?? getOffset(placement),
    repeatNum: 1
  })

  const instance: MessageInstance = {
    id,
    container,
    props,
    type: props.type,
    close: () => closeInstance(instance),
    onClose: normalized.onClose,
    closed: false
  }

  const vnode = createVNode(MessageRenderer, {
    state: props,
    close: instance.close
  })
  render(vnode, container)
  document.body.appendChild(container)
  instances.push(instance)

  if (props.duration > 0) {
    instance.timer = window.setTimeout(instance.close, props.duration)
  }

  return {
    close: instance.close
  }
}

const U1Message = createMessage as U1MessageService

U1Message.success = (options) => createMessage(options, 'success')
U1Message.warning = (options) => createMessage(options, 'warning')
U1Message.info = (options) => createMessage(options, 'info')
U1Message.error = (options) => createMessage(options, 'error')
U1Message.closeAll = (type?: U1MessageType) => {
  const closingInstances = type ? instances.filter((instance) => instance.type === type) : [...instances]

  closingInstances.forEach((instance) => instance.close())
}
U1Message.install = (app) => {
  app.component(MessageComponent.name as string, MessageComponent)
}

export const U1MessageComponent = MessageComponent
export { U1Message }
export default U1Message
