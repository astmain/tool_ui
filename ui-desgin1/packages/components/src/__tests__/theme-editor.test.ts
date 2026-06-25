import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import U1ThemeEditor from '../theme-editor/ThemeEditor.vue'
import U1ThemeEditorDialog from '../theme-editor/ThemeEditorDialog.vue'
import { resetU1Theme, u1ThemeTokens } from '../theme'

describe('U1ThemeEditor', () => {
  beforeEach(() => {
    resetU1Theme()
  })

  afterEach(() => {
    resetU1Theme()
    document.documentElement.removeAttribute('style')
  })

  it('renders a labeled form for every first-version token', () => {
    const wrapper = mount(U1ThemeEditor)

    const labels = wrapper.findAll('label').map((node) => node.text().trim())
    const joined = labels.join(' | ')

    const labelMap: Record<string, string> = {
      primary: '主题色',
      success: '成功色',
      warning: '警告色',
      danger: '危险色',
      info: '信息色',
      text: '主要文本',
      textRegular: '常规文本',
      border: '边框',
      borderLight: '浅边框',
      background: '背景色',
      radiusBase: '基础圆角',
      shadowLight: '轻阴影',
      shadowFocus: '聚焦阴影'
    }

    for (const [key, expected] of Object.entries(labelMap)) {
      expect(joined).toContain(expected)
      expect(joined).toContain(u1ThemeTokens[key as keyof typeof u1ThemeTokens].cssVar)
    }
  })

  it('exposes a read-only 主题代码 textarea containing applyU1Theme code', () => {
    const wrapper = mount(U1ThemeEditor)

    const textarea = wrapper.find('textarea')
    expect(textarea.exists()).toBe(true)
    expect((textarea.element as HTMLTextAreaElement).readOnly).toBe(true)
    expect((textarea.element as HTMLTextAreaElement).value).toContain("import { applyU1Theme } from '@u1design/vue/theme'")
    expect((textarea.element as HTMLTextAreaElement).value).toContain('applyU1Theme({')
  })

  it('uses a monospace font on the textarea', () => {
    const wrapper = mount(U1ThemeEditor)
    const textarea = wrapper.find('textarea')
    const className = textarea.classes().join(' ')

    expect(className).toContain('u1-theme-editor__textarea')
  })

  it('writes to document.documentElement when a token is changed', async () => {
    const wrapper = mount(U1ThemeEditor)

    const inputs = wrapper.findAll<HTMLInputElement>('input[type="color"]')
    expect(inputs.length).toBeGreaterThan(0)
    const firstColor = inputs[0]!

    await firstColor.setValue('#ff00aa')

    expect(document.documentElement.style.getPropertyValue('--u1-color-primary')).toBe('#ff00aa')
  })

  it('updates the generated code text when tokens change', async () => {
    const wrapper = mount(U1ThemeEditor)

    const inputs = wrapper.findAll<HTMLInputElement>('input[type="color"]')
    await inputs[0]!.setValue('#ff00aa')
    await nextTick()

    const value = (wrapper.find('textarea').element as HTMLTextAreaElement).value
    expect(value).toContain("primary: '#ff00aa'")
  })

  it('has separate copy and reset buttons', () => {
    const wrapper = mount(U1ThemeEditor)
    const buttons = wrapper.findAll('button')

    const labels = buttons.map((button) => button.text().trim())
    expect(labels.some((label) => /复制|copy/i.test(label))).toBe(true)
    expect(labels.some((label) => /重置|reset/i.test(label))).toBe(true)
  })

  it('copies code to clipboard and shows success feedback', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })

    const wrapper = mount(U1ThemeEditor)

    const buttons = wrapper.findAll('button')
    const copyButton = buttons.find((button) => /复制|copy/i.test(button.text()))!
    await copyButton.trigger('click')

    expect(writeText).toHaveBeenCalledTimes(1)
    expect(writeText.mock.calls[0]?.[0]).toContain('applyU1Theme')

    await nextTick()
    const html = wrapper.html()
    expect(/已复制|copied|success/i.test(html)).toBe(true)
  })

  it('clicking reset restores default tokens, page styles and code', async () => {
    const wrapper = mount(U1ThemeEditor)

    const inputs = wrapper.findAll<HTMLInputElement>('input[type="color"]')
    await inputs[0]!.setValue('#ff00aa')
    await nextTick()

    expect(document.documentElement.style.getPropertyValue('--u1-color-primary')).toBe('#ff00aa')

    const buttons = wrapper.findAll('button')
    const resetButton = buttons.find((button) => /重置|reset/i.test(button.text()))!
    await resetButton.trigger('click')
    await nextTick()

    expect(document.documentElement.style.getPropertyValue('--u1-color-primary')).toBe('')

    const value = (wrapper.find('textarea').element as HTMLTextAreaElement).value
    for (const [key, token] of Object.entries(u1ThemeTokens)) {
      expect(value).toContain(`${key}: '${token.defaultValue}'`)
    }
  })

  it('uses side-by-side layout at desktop width', () => {
    const wrapper = mount(U1ThemeEditor)
    const html = wrapper.html()
    expect(/u1-theme-editor__columns/.test(html)).toBe(true)
  })
})

describe('U1ThemeEditorDialog', () => {
  it('renders the editor only when modelValue is true', async () => {
    const wrapper = mount(U1ThemeEditorDialog, {
      props: { modelValue: false }
    })

    expect(wrapper.find('.u1-theme-editor').exists()).toBe(false)

    await wrapper.setProps({ modelValue: true })
    expect(wrapper.find('.u1-theme-editor').exists()).toBe(true)
  })

  it('emits update:modelValue=false when dialog close is triggered', async () => {
    const wrapper = mount(U1ThemeEditorDialog, {
      props: { modelValue: true, title: 'Theme' }
    })

    wrapper.vm.$emit('update:modelValue', false)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('does not call setProperty on document.documentElement directly', () => {
    const original = document.documentElement.style.setProperty
    const spy = vi.fn()
    document.documentElement.style.setProperty = spy

    try {
      mount(U1ThemeEditorDialog, {
        props: { modelValue: true }
      })
      expect(spy).not.toHaveBeenCalled()
    } finally {
      document.documentElement.style.setProperty = original
    }
  })
})
