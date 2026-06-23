<template>
  <div class="p-4">
    <h1 class="text-base font-bold mb-4">网站设置</h1>
    <div v-for="item in settings" :key="item.key" class="mb-3 flex items-center gap-3">
      <label class="w-32 text-sm text-gray-600">{{ item.key }}</label>
      <input v-model="item.value" class="flex-1 border px-3 py-2 rounded" />
      <button class="px-3 py-1 bg-blue-500 text-white rounded text-sm" @click="save(item)">Save</button>
    </div>
    <p v-if="msg" class="text-sm mt-2" :class="msg.type === 'error' ? 'text-red-500' : 'text-green-500'">{{ msg.text }}</p>
  </div>
</template>

<script setup>
const settings = ref([])
const msg = ref(null)

async function fetch网站设置() {
  const r = await $fetch('/api/admin/setting')
  if (r.code === 200) settings.value = Object.entries(r.data).map(function(entry) { return { key: entry[0], value: entry[1] } })
}

async function save(item) {
  const r = await $fetch('/api/admin/setting', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: { key: item.key, value: item.value } })
  msg.value = r.code === 200 ? { text: '保存成功', type: 'success' } : { text: r.message || '保存失败', type: 'error' }
  setTimeout(function() { msg.value = null }, 3000)
}

onMounted(fetch网站设置)
</script>