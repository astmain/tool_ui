<template>
  <div class="p-4 flex flex-col gap-2">
    <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h1 class="text-base font-bold">{{ "文章管理" }}</h1>
        <div class="flex gap-2">
          <button class="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm" @click="openCat">{{ "添加分类" }}</button>
          <button class="px-3 py-1 bg-blue-500 text-white rounded text-sm" @click="openArt">{{ "添加文章" }}</button>
        </div>
      </div>
      <div class="p-4">
        <div class="mb-4">
          <div class="text-sm font-medium text-gray-700 mb-2">{{ "文章分类" }}</div>
          <div class="flex flex-wrap gap-2 mb-3">
            <div v-if="cats.length === 0" class="text-sm text-gray-400">{{ "暂无分类" }}</div>
            <div v-for="cat in cats" :key="cat.id" class="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded text-sm">
              <span>{{ cat.name }}</span>
              <button class="text-blue-500 text-xs" @click="editCat(cat)">{{ "编" }}</button>
              <button class="text-red-500 text-xs" @click="delCat(cat.id)">{{ "删" }}</button>
            </div>
          </div>
          <div class="flex gap-2">
            <input v-model="catName" class="border px-2 py-1 rounded text-sm flex-1" placeholder="分类名称" />
            <button class="px-3 py-1 bg-blue-500 text-white rounded text-sm" @click="saveCat">{{ "保存" }}</button>
          </div>
        </div>
        <div class="border-t pt-4 mt-4">
          <div class="text-sm font-medium text-gray-700 mb-2">{{ "文章列表" }}</div>
          <div v-if="arts.length === 0" class="text-sm text-gray-400 py-4 text-center">{{ "暂无文章" }}</div>
          <div class="space-y-2">
            <div v-for="a in arts" :key="a.id" class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
              <div class="flex items-center gap-3 min-w-0">
                <span class="text-sm truncate">{{ a.title }}</span>
                <span class="text-xs bg-gray-200 px-2 py-0.5 rounded shrink-0">{{ a.category ? a.category.name : '' }}</span>
              </div>
              <div class="flex gap-2 shrink-0 ml-4">
                <button class="text-blue-500 text-xs" @click="editArt(a)">{{ "编" }}</button>
                <button class="text-red-500 text-xs" @click="delArt(a.id)">{{ "删" }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Com1Dialog :open="showDialog" :title="dialogTitle" confirm-text="确定" :on-confirm="handleSubmit" @close="showDialog = false">
      <div class="space-y-3">
        <div>
          <label class="text-sm text-gray-600">{{ "标题" }}</label>
          <input v-model="form.title" class="w-full border px-3 py-2 rounded mt-1" />
        </div>
        <div>
          <label class="text-sm text-gray-600">{{ "分类" }}</label>
          <select v-model="form.categoryId" class="w-full border px-3 py-2 rounded mt-1">
            <option value="0">{{ "请选择" }}</option>
            <option v-for="c in cats" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div>
          <label class="text-sm text-gray-600">{{ "内容" }}</label>
          <textarea v-model="form.content" rows="5" class="w-full border px-3 py-2 rounded mt-1"></textarea>
        </div>
      </div>
    </Com1Dialog>
  </div>
</template>

<script setup lang="ts">
const arts = ref<any[]>([])
const cats = ref<any[]>([])
const showDialog = ref(false)
const dialogTitle = ref('')
const catName = ref('')
const form = ref<any>({ id: null, title: '', content: '', categoryId: 0 })

async function fetchAll() {
  const [r1, r2] = await Promise.all([
    $fetch<any>('/api/admin/article'),
    $fetch<any>('/api/admin/article?resource=category')
  ])
  if (r1.code === 200) arts.value = r1.data
  if (r2.code === 200) cats.value = r2.data
}

function openCat() { form.value = { id: null, title: '', content: '', categoryId: 0 }; dialogTitle.value = '添加分类'; showDialog.value = true }
function openArt() { form.value = { id: null, title: '', content: '', categoryId: 0 }; dialogTitle.value = '添加文章'; showDialog.value = true }
function editCat(c: any) { form.value = { id: c.id, title: c.name, content: '', categoryId: 0 }; dialogTitle.value = '编辑分类'; showDialog.value = true }
function editArt(a: any) { form.value = { id: a.id, title: a.title, content: a.content, categoryId: a.categoryId }; dialogTitle.value = '编辑文章'; showDialog.value = true }

async function handleSubmit() {
  if (form.value.content === '') {
    const body: any = { resource: 'category', name: form.value.title }
    if (form.value.id) body.id = form.value.id
    const r = await $fetch<any>('/api/admin/article', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
    if (r.code !== 200) alert(r.message)
  } else {
    const body: any = { title: form.value.title, content: form.value.content, categoryId: form.value.categoryId }
    if (form.value.id) body.id = form.value.id
    const r = await $fetch<any>('/api/admin/article', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
    if (r.code !== 200) alert(r.message)
  }
  showDialog.value = false
  fetchAll()
}

async function saveCat() {
  if (!catName.value.trim()) return
  const r = await $fetch<any>('/api/admin/article', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: { resource: 'category', name: catName.value } })
  if (r.code === 200) { catName.value = ''; fetchAll() }
  else alert(r.message)
}

async function delCat(id: number) { if (confirm('确定删除？')) { await $fetch<any>('/api/admin/article?resource=category&id=' + id, { method: 'DELETE' }); fetchAll() } }
async function delArt(id: number) { if (confirm('确定删除？')) { await $fetch<any>('/api/admin/article?id=' + id, { method: 'DELETE' }); fetchAll() } }

onMounted(fetchAll)
</script>
