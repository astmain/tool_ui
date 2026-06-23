<template>
  <div class="p-4">
    <h1 class="text-base font-bold mb-4">角色管理</h1>
    <div v-if="loading">加载中...</div>
    <template v-else>
      <div v-for="r in roles" :key="r.id" class="mb-2 p-3 bg-gray-50 rounded">
        <span>{{ r.name }} ({{ r.key }})</span>
        <button class="text-red-500 text-xs ml-4" @click="del(r.id)">删除</button>
      </div>
    </template>
  </div>
</template>

<script setup>
const roles = ref([])
const loading = ref(true)

async function fetch角色管理() {
  const r = await $fetch('/api/admin/role')
  if (r.code === 200) roles.value = r.data
  loading.value = false
}

async function del(id) {
  if (!confirm('确定删除？')) return
  await $fetch('/api/admin/role', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: { id: id } })
  fetch角色管理()
}

onMounted(fetch角色管理)
</script>