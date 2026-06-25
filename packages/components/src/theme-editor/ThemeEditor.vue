<template>
  <section class="u1-theme-editor">
    <div class="u1-theme-editor__columns">
      <div class="u1-theme-editor__form">
        <div v-for="key in tokenKeys" :key="key" class="u1-theme-editor__field">
          <label :for="`u1-theme-${key}`" class="u1-theme-editor__label">
            <span class="u1-theme-editor__name">{{ tokenLabel(key) }}</span>
            <span class="u1-theme-editor__var">{{ u1ThemeTokens[key].cssVar }}</span>
          </label>
          <div class="u1-theme-editor__control">
            <input
              v-if="isColor(key)"
              :id="`u1-theme-${key}`"
              class="u1-theme-editor__color"
              type="color"
              :value="normalizeColor(values[key])"
              @input="onColorInput(key, $event)"
            />
            <input
              v-else
              :id="`u1-theme-${key}`"
              class="u1-theme-editor__text"
              type="text"
              :value="values[key]"
              @input="onTextInput(key, $event)"
            />
            <span
              v-if="isColor(key)"
              class="u1-theme-editor__swatch"
              :style="{ background: values[key] }"
              aria-hidden="true"
            />
          </div>
        </div>

        <div class="u1-theme-editor__actions">
          <button
            class="u1-theme-editor__btn u1-theme-editor__btn--copy"
            type="button"
            @click="onCopy"
          >
            {{ copyLabel }}
          </button>
          <button
            class="u1-theme-editor__btn u1-theme-editor__btn--reset"
            type="button"
            @click="onReset"
          >
            重置默认
          </button>
        </div>
      </div>

      <div class="u1-theme-editor__code">
        <label class="u1-theme-editor__label" for="u1-theme-code">主题代码</label>
        <textarea
          id="u1-theme-code"
          class="u1-theme-editor__textarea"
          style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;"
          :value="code"
          readonly
          spellcheck="false"
        />
        <p class="u1-theme-editor__hint">
          复制到你的项目入口文件并执行，主题将在用户项目长期生效。
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { applyU1Theme, resetU1Theme, u1ThemeTokens } from '@/theme'
import { createU1ThemeCode } from '@/theme/createThemeCode'

interface Props {
  modelValue?: boolean
}

withDefaults(defineProps<Props>(), { modelValue: true })

defineOptions({ name: 'U1ThemeEditor' })

const tokenKeys = Object.keys(u1ThemeTokens) as (keyof typeof u1ThemeTokens)[]

function isColor(key: keyof typeof u1ThemeTokens): boolean {
  return key !== 'radiusBase' && key !== 'shadowLight' && key !== 'shadowFocus'
}

function tokenLabel(key: keyof typeof u1ThemeTokens): string {
  const map: Record<string, string> = {
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
  return map[key] ?? key
}

function normalizeColor(value: string): string {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value) ? value : '#000000'
}

const defaultValues = () => {
  const entries: Record<string, string> = {}
  for (const [key, token] of Object.entries(u1ThemeTokens)) {
    entries[key] = token.defaultValue
  }
  return entries
}

const values = reactive<Record<string, string>>(defaultValues())

const code = computed(() => createU1ThemeCode(values as never))

const copyLabel = ref('复制代码')
let copyResetTimer: ReturnType<typeof setTimeout> | null = null

function onColorInput(key: string, event: Event) {
  const target = event.target as HTMLInputElement
  values[key] = target.value
  applyPreview()
}

function onTextInput(key: string, event: Event) {
  const target = event.target as HTMLInputElement
  values[key] = target.value
  applyPreview()
}

function applyPreview() {
  const next: Record<string, string> = {}
  for (const [key, value] of Object.entries(values)) {
    if (value) {
      next[key] = value
    }
  }
  applyU1Theme(next)
}

async function onCopy() {
  try {
    await navigator.clipboard.writeText(code.value)
    copyLabel.value = '已复制'
  } catch {
    copyLabel.value = '复制失败'
  }
  if (copyResetTimer) clearTimeout(copyResetTimer)
  copyResetTimer = setTimeout(() => {
    copyLabel.value = '复制代码'
  }, 1600)
}

function onReset() {
  const defaults = defaultValues()
  for (const key of Object.keys(defaults)) {
    values[key] = defaults[key]!
  }
  resetU1Theme()
}

onBeforeUnmount(() => {
  if (copyResetTimer) clearTimeout(copyResetTimer)
})
</script>

<style scoped>
.u1-theme-editor {
  display: block;
  width: 100%;
  color: var(--u1-color-text);
  font-size: 14px;
}

.u1-theme-editor__columns {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  gap: 24px;
}

@media (max-width: 720px) {
  .u1-theme-editor__columns {
    grid-template-columns: minmax(0, 1fr);
  }
}

.u1-theme-editor__form,
.u1-theme-editor__code {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.u1-theme-editor__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.u1-theme-editor__label {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  font-size: 13px;
  color: var(--u1-color-text-regular);
}

.u1-theme-editor__name {
  font-weight: 500;
  color: var(--u1-color-text);
}

.u1-theme-editor__var {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  color: var(--u1-color-info);
}

.u1-theme-editor__control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.u1-theme-editor__color,
.u1-theme-editor__text {
  width: 100%;
  height: 32px;
  box-sizing: border-box;
  padding: 0 10px;
  border: 1px solid var(--u1-color-border);
  border-radius: var(--u1-radius-base);
  color: var(--u1-color-text);
  background: var(--u1-color-bg);
  font-size: 13px;
  outline: none;
  transition: border-color var(--u1-transition), box-shadow var(--u1-transition);
}

.u1-theme-editor__color {
  width: 44px;
  padding: 0;
  cursor: pointer;
}

.u1-theme-editor__text:focus,
.u1-theme-editor__color:focus {
  border-color: var(--u1-color-primary);
  box-shadow: var(--u1-shadow-focus);
}

.u1-theme-editor__swatch {
  display: inline-block;
  width: 22px;
  height: 22px;
  border: 1px solid var(--u1-color-border);
  border-radius: 4px;
}

.u1-theme-editor__actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}

.u1-theme-editor__btn {
  height: 32px;
  padding: 0 14px;
  border: 1px solid var(--u1-color-border);
  border-radius: var(--u1-radius-base);
  font-size: 13px;
  cursor: pointer;
  transition: color var(--u1-transition), background var(--u1-transition), border-color var(--u1-transition);
}

.u1-theme-editor__btn--copy {
  color: #ffffff;
  border-color: var(--u1-color-primary);
  background: var(--u1-color-primary);
}

.u1-theme-editor__btn--copy:hover {
  opacity: 0.92;
}

.u1-theme-editor__btn--reset {
  color: var(--u1-color-text);
  background: var(--u1-color-bg);
}

.u1-theme-editor__btn--reset:hover {
  color: var(--u1-color-primary);
  border-color: var(--u1-color-primary);
}

.u1-theme-editor__textarea {
  width: 100%;
  min-height: 360px;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1px solid var(--u1-color-border);
  border-radius: var(--u1-radius-base);
  color: var(--u1-color-text);
  background: var(--u1-color-bg);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  line-height: 1.55;
  resize: vertical;
  outline: none;
}

.u1-theme-editor__textarea:focus {
  border-color: var(--u1-color-primary);
  box-shadow: var(--u1-shadow-focus);
}

.u1-theme-editor__hint {
  margin: 0;
  font-size: 12px;
  color: var(--u1-color-info);
}
</style>
