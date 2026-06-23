<template>
  <div class="p-4">
    <h1 class="text-base font-bold mb-4">用户管理</h1>
    <div v-if="loading">加载中...</div>
    <template v-else>
      <div v-for="user in users" :key="user.id" class="mb-2 p-3 bg-gray-50 rounded">
        <span>{{ user.nickname }} ({{ user.email }})</span>
        <button class="text-red-500 text-xs ml-4" @click="del(user.id)">删除</button>
      </div>
    </template>
  </div>
</template>

<script setup>
const users = ref([])
const loading = ref(true)

async function fetch用户管理() {
  const r = await $fetch('/api/admin/user')
  if (r.code === 200) users.value = r.data
  loading.value = false
}

async function del(id) {
  if (!confirm('确定删除？')) return
  await $fetch('/api/admin/user?id=' + id, { method: 'DELETE' })
  fetch用户管理()
}

onMounted(fetch用户管理)
</script>