<template>
  <div class="p-4">
    <h1 class="text-base font-bold mb-4">菜单管理</h1>
    <div v-if="loading">加载中...</div>
    <template v-else>
      <div v-for="m in menus" :key="m.id" class="mb-2 p-3 bg-gray-50 rounded">
        <span>{{ m.name }}</span>
        <button class="text-red-500 text-xs ml-4" @click="del(m.id)">删除</button>
      </div>
    </template>
  </div>
</template>

<script setup>
const menus = ref([])
const loading = ref(true)

async function fetch菜单管理() {
  const r = await $fetch('/api/admin/menu')
  if (r.code === 200) menus.value = r.data
  loading.value = false
}

async function del(id) {
  if (!confirm('确定删除？')) return
  await $fetch('/api/admin/menu/' + id, { method: 'DELETE' })
  fetch菜单管理()
}

onMounted(fetch菜单管理)
</script>