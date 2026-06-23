<template>
  <div class="p-4 flex flex-col gap-2">
    <Com1Card
      :config="{
        left: h('h1', { class: 'text-base font-bold' }, '我的学生'),
        right: h(Com1Button, { text: '添加学生', variant: 'primary', size: 'medium', onClick: openAdd }),
      }"
    />

    <Com1Dialog
      :open="showForm"
      :title="editId ? '编辑学生' : '添加学生'"
      :confirm-text="editId ? '保存' : '添加'"
      :on-confirm="handleSubmit"
      :confirm-disabled="!form.name.trim() || form.age === null"
      @close="showForm = false"
    >
      <div class="flex flex-col gap-3">
        <Com1Input :value="form.name" config-text="姓名" placeholder="请输入姓名" @change="(v) => (form.name = v)" />
        <Com1Input :value="String(form.age ?? '')" config-text="年龄" type="number" placeholder="请输入年龄" @change="(v) => (form.age = Number(v))" />
        <Com1Input :value="String(form.x)" config-text="X坐标" type="number" @change="(v) => (form.x = Number(v))" />
        <Com1Input :value="String(form.y)" config-text="Y坐标" type="number" @change="(v) => (form.y = Number(v))" />
      </div>
    </Com1Dialog>

    <Com1Card>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b bg-gray-50">
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">序号</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">姓名</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">年龄</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">X</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">Y</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="px-4 py-6 text-center text-gray-400">加载中...</td>
            </tr>
            <tr v-else-if="students.length === 0">
              <td colspan="6" class="px-4 py-6 text-center text-gray-400">暂无数据</td>
            </tr>
            <tr v-else v-for="(s, i) in students" :key="s.id" class="border-b hover:bg-gray-50">
              <td class="px-4 py-3 text-sm">{{ i + 1 }}</td>
              <td class="px-4 py-3 text-sm">{{ s.name }}</td>
              <td class="px-4 py-3 text-sm">{{ s.age }}</td>
              <td class="px-4 py-3 text-sm">{{ s.x }}</td>
              <td class="px-4 py-3 text-sm">{{ s.y }}</td>
              <td class="px-4 py-3 text-sm">
                <Com1Button text="编辑" variant="primary" size="mini" @click="openEdit(s)" />
                <Com1Button text="删除" variant="danger" size="mini" class="ml-2" @click="handleDelete(s.id)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Com1Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'

interface Student { id: number; name: string; age: number; x: number; y: number }

const students = ref<Student[]>([])
const loading = ref(true)
const showForm = ref(false)
const editId = ref<number | null>(null)
const form = ref({ name: '', age: null as number | null, x: 0, y: 0 })

async function fetchStudents() {
  const res = await $fetch<any>('/api/admin/my-student')
  if (res.code === 200) students.value = res.data
  loading.value = false
}

function openAdd() {
  editId.value = null
  form.value = { name: '', age: null, x: 0, y: 0 }
  showForm.value = true
}

function openEdit(s: Student) {
  editId.value = s.id
  form.value = { name: s.name, age: s.age, x: s.x, y: s.y }
  showForm.value = true
}

async function handleSubmit() {
  const body: any = { ...form.value }
  if (editId.value) body.id = editId.value
  const res = await $fetch<any>('/api/admin/my-student', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
  if (res.code === 200) { showForm.value = false; fetchStudents() }
  else alert(res.message ?? '操作失败')
}

async function handleDelete(id: number) {
  const res = await $fetch<any>(`/api/admin/my-student?id=${id}`, { method: 'DELETE' })
  if (res.code === 200) fetchStudents()
  else alert(res.message ?? '删除失败')
}

onMounted(fetchStudents)
</script>
