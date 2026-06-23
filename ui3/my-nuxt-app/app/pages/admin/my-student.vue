<template>
  <div class="p-4">
    <h1 class="text-base font-bold mb-4">我的学生</h1>
    <div v-if="loading">加载中...</div>
    <template v-else>
      <div v-for="s in students" :key="s.id" class="mb-2 p-3 bg-gray-50 rounded">
        <span>{{ s.name }} ({{ s.age }})</span>
        <button class="text-red-500 text-xs ml-4" @click="del(s.id)">删除</button>
      </div>
    </template>
  </div>
</template>

<script setup>
const students = ref([])
const loading = ref(true)

async function fetchData() {
  const r = await $fetch('/api/admin/my-student')
  if (r.code === 200) students.value = r.data
  loading.value = false
}

async function del(id) {
  if (!confirm('确定删除？')) return
  await $fetch('/api/admin/my-student?id=' + id, { method: 'DELETE' })
  fetchData()
}

onMounted(fetchData)
</script>