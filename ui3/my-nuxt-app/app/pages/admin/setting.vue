<template>
  <div class="p-4 flex flex-col gap-4">
    <Com1Card :config="{ left: h('h1', { class: 'text-base font-bold' }, '网站设置') }" />
    <Com1Card>
      <div class="space-y-4">
        <div v-for="item in settings" :key="item.key" class="flex items-center gap-4">
          <label class="w-32 text-right text-sm font-medium text-gray-700 shrink-0">{{ item.key }}</label>
          <input v-model="item.value" type="text" class="flex-1 border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <Com1Button text="保存" variant="primary" size="small" @click="saveSetting(item)" />
        </div>
        <div class="flex items-center gap-4">
          <label class="w-32 text-right text-sm font-medium text-gray-700 shrink-0">新增设置</label>
          <input v-model="newKey" type="text" class="flex-1 border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="key" />
          <input v-model="newValue" type="text" class="flex-1 border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="value" />
          <Com1Button text="添加" variant="primary" size="small" @click="addSetting" />
        </div>
        <div class="border-t pt-4 mt-4">
          <h3 class="text-sm font-medium text-gray-700 mb-3">数据库备份</h3>
          <Com1Button text="导出 SQL 备份文件" variant="secondary" :loading="backingUp" @click="handleBackup" />
          <p v-if="msg" class="text-sm text-green-600 mt-2">{{ msg }}</p>
        </div>
      </div>
    </Com1Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
const settings = ref<Array<{ key: string; value: string }>>([])
const newKey = ref('')
const newValue = ref('')
const backingUp = ref(false)
const msg = ref('')

async function fetchSettings() {
  const res = await $fetch<any>('/api/admin/setting')
  if (res.code === 200) settings.value = Object.entries(res.data).map(([key, value]) => ({ key, value: value as string }))
}

async function saveSetting(item: { key: string; value: string }) {
  const res = await $fetch<any>('/api/admin/setting', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: { key: item.key, value: item.value } })
  if (res.code !== 200) alert(res.message ?? '保存失败')
}

async function addSetting() {
  if (!newKey.value.trim() || !newValue.value.trim()) return
  await saveSetting({ key: newKey.value.trim(), value: newValue.value.trim() })
  newKey.value = ''; newValue.value = ''
  fetchSettings()
}

async function handleBackup() {
  backingUp.value = true; msg.value = ''
  try {
    const res = await fetch('/api/admin/setting?resource=backup')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `backup-${new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')}.sql`
    a.click(); URL.revokeObjectURL(url)
    msg.value = '备份文件已下载'
  } catch { alert('备份失败') } finally { backingUp.value = false }
}

onMounted(fetchSettings)
</script>
