<template>
  <div class="p-4 flex flex-col gap-4">
    <Com1Message ref="msgRef" />

    <Com1Card
      :config="{ left: '<h1 class=\'text-base font-bold\'>网站设置</h1>' }"
    />

    <div v-if="loading" class="flex justify-center py-12">
      <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>

    <template v-else>
      <Com1Card>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Com1Input
            :value="siteName"
            :config="{ text: '网站名称', width: 'w-24' }"
            placeholder="请输入网站名称"
            input-class-name="!max-w-[500px]"
            :max-length="50"
            :disabled="savingSiteName"
            @change="(val: string) => siteName = val"
          />
          <Com1Button
            text="保存-网站名称"
            class="sm:!w-[140px]"
            :loading="savingSiteName"
            @click="handleSave"
          />
        </div>
      </Com1Card>

      <Com1Card>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Com1Input
            :value="dbUrl"
            :config="{ text: '数据库', width: 'w-24' }"
            input-class-name="!max-w-[500px]"
            disabled
            @change="() => undefined"
          />
          <Com1Button
            text="下载-数据库备份"
            class="sm:!w-[140px]"
            :loading="downloadingBackup"
            @click="handleBackup"
          />
        </div>
      </Com1Card>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const siteName = ref('')
const dbUrl = ref('')
const loading = ref(true)
const savingSiteName = ref(false)
const downloadingBackup = ref(false)
const msgRef = ref<{ success: (m: string) => void; error: (m: string) => void; warning: (m: string) => void } | null>(null)

interface SaveFilePickerWindow extends Window {
  showSaveFilePicker?: (options: {
    suggestedName?: string
    types?: Array<{
      description: string
      accept: Record<string, string[]>
    }>
  }) => Promise<{
    createWritable: () => Promise<{
      write: (data: Blob) => Promise<void>
      close: () => Promise<void>
    }>
  }>
}

async function fetchSettings() {
  loading.value = true
  try {
    const resp = await $fetch<{ code: number; data: Record<string, string> }>('/api/admin/setting')
    if (resp.ok) {
      siteName.value = resp.data.site_name ?? ''
    }

    const dbResp = await $fetch<{ code: number; data: { url: string } }>('/api/admin/setting?resource=dbinfo')
    if (dbResp.ok) {
      dbUrl.value = dbResp.data.url
    }
  } catch {
    msgRef.value?.error('加载设置失败，请刷新重试')
  } finally {
    loading.value = false
  }
}

async function handleSave() {
  savingSiteName.value = true
  try {
    const resp = await $fetch<{ code: number; message?: string }>('/api/admin/setting', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: { key: 'site_name', value: siteName.value },
    })
    if (resp.ok) {
      msgRef.value?.success('成功:保存-网站名称')
    } else {
      msgRef.value?.error(resp.message ?? '失败:保存-网站名称')
    }
  } catch {
    msgRef.value?.error('失败:网络异常，保存-网站名称')
  } finally {
    savingSiteName.value = false
  }
}

function getBackupFilename(resp: Response) {
  const disposition = resp.headers.get('Content-Disposition')
  const filenameMatch = disposition?.match(/filename="?([^"]+)"?/)
  return filenameMatch ? filenameMatch[1] : 'backup.sql'
}

function fallbackDownloadBackup() {
  const link = document.createElement('a')
  link.href = '/api/admin/setting?resource=backup'
  link.download = ''
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

async function saveBackupWithPicker(blob: Blob, filename: string) {
  const pickerWindow = window as SaveFilePickerWindow
  if (!pickerWindow.showSaveFilePicker) return false

  const fileHandle = await pickerWindow.showSaveFilePicker({
    suggestedName: filename,
    types: [
      {
        description: 'SQL 备份文件',
        accept: { 'application/sql': ['.sql'] },
      },
    ],
  })
  const writable = await fileHandle.createWritable()
  await writable.write(blob)
  await writable.close()
  return true
}

async function handleBackup() {
  downloadingBackup.value = true
  try {
    const pickerWindow = window as SaveFilePickerWindow
    if (!pickerWindow.showSaveFilePicker) {
      fallbackDownloadBackup()
      msgRef.value?.warning('当前浏览器不支持选择保存位置，已使用默认下载')
      msgRef.value?.success('成功:下载-数据库备份')
      return
    }

    const resp = await fetch('/api/admin/setting?resource=backup')
    if (!resp.ok) {
      const data = await resp.json().catch(() => ({ message: '' }))
      msgRef.value?.error(data.message ?? '失败:下载-数据库备份')
      return
    }

    const blob = await resp.blob()
    const filename = getBackupFilename(resp)
    try {
      const savedWithPicker = await saveBackupWithPicker(blob, filename)
      if (savedWithPicker) {
        msgRef.value?.success('成功:下载-数据库备份')
        return
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        msgRef.value?.warning('已取消保存')
        return
      }
      throw err
    }
  } catch {
    msgRef.value?.error('失败:网络异常，下载-数据库备份')
  } finally {
    downloadingBackup.value = false
  }
}

onMounted(fetchSettings)
</script>
