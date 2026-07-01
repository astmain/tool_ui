<script setup lang="ts">
definePageMeta({ layout: 'admin' })

// ─── Types ───────────────────────────────────────────────────────────────────
interface Category {
  id: number
  name: string
  sort: number
  remark: string | null
  articleCount?: number
}

interface Article {
  id: number
  title: string
  content: string
  sort: number
  categoryId: number
  category: { id: number; name: string }
  createdAt: string
  updatedAt: string
}

// ─── State ───────────────────────────────────────────────────────────────────
const articles = ref<Article[]>([])
const categories = ref<Category[]>([])
const loadingArticles = ref(false)
const loadingCategories = ref(false)
const submitting = ref(false)

// Category dialog
const showCatDialog = ref(false)
const editCatId = ref<number | null>(null)
const catForm = ref({ name: '', sort: 0, remark: '' })
const catFormError = ref('')

// Article dialog
const showArtDialog = ref(false)
const editArtId = ref<number | null>(null)
const artForm = ref({ title: '', content: '', categoryId: '', sort: 0 })
const artFormError = ref('')

// Delete confirm
const showDeleteConfirm = ref(false)
const deleteTarget = ref<{ id: number; type: 'category' | 'article' } | null>(null)

const msgRef = ref<{ success: (m: string) => void; error: (m: string) => void } | null>(null)

// ─── Fetch ───────────────────────────────────────────────────────────────────
async function fetchCategories() {
  loadingCategories.value = true
  try {
    const resp = await $fetch<{ code: number; data: Category[] }>('/api/admin/article?resource=category')
    if (resp.ok) {
      categories.value = resp.data
    }
  } catch {
    msgRef.value?.error('加载分类失败')
  } finally {
    loadingCategories.value = false
  }
}

async function fetchArticles() {
  loadingArticles.value = true
  try {
    const resp = await $fetch<{ code: number; data: Article[] }>('/api/admin/article')
    if (resp.ok) {
      articles.value = resp.data
    }
  } catch {
    msgRef.value?.error('加载文章列表失败')
  } finally {
    loadingArticles.value = false
  }
}

// ─── Category Actions ─────────────────────────────────────────────────────────
function openCatAdd() {
  editCatId.value = null
  catForm.value = { name: '', sort: 0, remark: '' }
  catFormError.value = ''
  showCatDialog.value = true
}

function openCatEdit(c: Category) {
  editCatId.value = c.id
  catForm.value = { name: c.name, sort: c.sort, remark: c.remark ?? '' }
  catFormError.value = ''
  showCatDialog.value = true
}

function closeCatDialog() {
  showCatDialog.value = false
  editCatId.value = null
  catFormError.value = ''
}

async function handleCategorySubmit() {
  if (!catForm.value.name.trim()) {
    catFormError.value = '请输入分类名称'
    return
  }

  submitting.value = true
  catFormError.value = ''

  try {
    const body: Record<string, unknown> = {
      resource: 'category',
      name: catForm.value.name.trim(),
      sort: catForm.value.sort,
    }
    if (catForm.value.remark.trim()) {
      body.remark = catForm.value.remark.trim()
    }

    const url = editCatId.value
      ? '/api/admin/article'
      : '/api/admin/article'
    const method = editCatId.value ? 'PUT' : 'POST'
    if (editCatId.value) {
      body.id = editCatId.value
    }

    const resp = await $fetch<{ code: number; message?: string }>(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body,
    })

    if (resp.ok) {
      msgRef.value?.success(editCatId.value ? '修改成功' : '添加成功')
      closeCatDialog()
      fetchCategories()
    } else {
      catFormError.value = resp.message ?? '操作失败'
    }
  } catch (err: any) {
    catFormError.value = err?.data?.message ?? '操作失败'
  } finally {
    submitting.value = false
  }
}

// ─── Article Actions ─────────────────────────────────────────────────────────
function openArtAdd() {
  editArtId.value = null
  artForm.value = { title: '', content: '', categoryId: '', sort: 0 }
  artFormError.value = ''
  showArtDialog.value = true
}

function openArtEdit(a: Article) {
  editArtId.value = a.id
  artForm.value = {
    title: a.title,
    content: a.content,
    categoryId: String(a.categoryId),
    sort: a.sort,
  }
  artFormError.value = ''
  showArtDialog.value = true
}

function closeArtDialog() {
  showArtDialog.value = false
  editArtId.value = null
  artFormError.value = ''
}

async function handleArticleSubmit() {
  if (!artForm.value.title.trim()) {
    artFormError.value = '请输入文章标题'
    return
  }
  if (!artForm.value.categoryId) {
    artFormError.value = '请选择文章分类'
    return
  }

  submitting.value = true
  artFormError.value = ''

  try {
    const body: Record<string, unknown> = {
      title: artForm.value.title.trim(),
      content: artForm.value.content.trim(),
      categoryId: Number(artForm.value.categoryId),
      sort: artForm.value.sort,
    }

    const url = '/api/admin/article'
    const method = editArtId.value ? 'PUT' : 'POST'
    if (editArtId.value) {
      body.id = editArtId.value
    }

    const resp = await $fetch<{ code: number; message?: string }>(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body,
    })

    if (resp.ok) {
      msgRef.value?.success(editArtId.value ? '修改成功' : '发布成功')
      closeArtDialog()
      fetchArticles()
    } else {
      artFormError.value = resp.message ?? '操作失败'
    }
  } catch (err: any) {
    artFormError.value = err?.data?.message ?? '操作失败'
  } finally {
    submitting.value = false
  }
}

// ─── Delete ─────────────────────────────────────────────────────────────────
function askDelete(id: number, type: 'category' | 'article') {
  deleteTarget.value = { id, type }
  showDeleteConfirm.value = true
}

async function handleDelete() {
  if (!deleteTarget.value) return
  const { id, type } = deleteTarget.value
  showDeleteConfirm.value = false
  deleteTarget.value = null

  try {
    const suffix = type === 'category' ? '&resource=category' : ''
    const resp = await $fetch<{ code: number; message?: string }>(`/api/admin/article?id=${id}${suffix}`, {
      method: 'DELETE',
    })
    if (resp.ok) {
      msgRef.value?.success('删除成功')
      if (type === 'category') fetchCategories()
      else fetchArticles()
    } else {
      msgRef.value?.error(resp.message ?? '删除失败')
    }
  } catch (err: any) {
    msgRef.value?.error(err?.data?.message ?? '删除失败')
  }
}

onMounted(() => {
  fetchCategories()
  fetchArticles()
})
</script>

<template>
  <div class="p-4 max-w-6xl mx-auto space-y-4">
    <!-- 分类管理 Card -->
    <Com1Card>
      <template #header-left>
        <span class="text-base font-semibold">分类管理</span>
      </template>
      <template #header-right>
        <Com1Button text="添加分类" variant="primary" size="small" @click="openCatAdd" />
      </template>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b bg-gray-50">
              <th class="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">序号</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">分类名称</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">排序</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">备注</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">文章数</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody>
            <!-- Loading -->
            <tr v-if="loadingCategories">
              <td colspan="6" class="px-4 py-12 text-center text-gray-400">
                <div class="flex items-center justify-center gap-2">
                  <div class="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  加载中...
                </div>
              </td>
            </tr>

            <!-- Empty -->
            <tr v-else-if="categories.length === 0">
              <td colspan="6" class="px-4 py-12 text-center">
                <div class="flex flex-col items-center gap-2 text-gray-400">
                  <svg class="w-10 h-10 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <p class="text-sm">暂无数据</p>
                  <Com1Button text="添加分类" variant="secondary" size="mini" @click="openCatAdd" />
                </div>
              </td>
            </tr>

            <!-- Data rows -->
            <tr
              v-for="(cat, i) in categories"
              v-else
              :key="cat.id"
              class="border-b hover:bg-gray-50 transition"
            >
              <td class="px-4 py-3 text-gray-500 whitespace-nowrap">{{ i + 1 }}</td>
              <td class="px-4 py-3 text-gray-800 whitespace-nowrap font-medium">{{ cat.name }}</td>
              <td class="px-4 py-3 text-gray-500 whitespace-nowrap">{{ cat.sort }}</td>
              <td class="px-4 py-3 text-gray-500 whitespace-nowrap">{{ cat.remark ?? '—' }}</td>
              <td class="px-4 py-3 text-gray-500 whitespace-nowrap">{{ cat.articleCount ?? 0 }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <Com1Button text="编辑" variant="primary" size="mini" @click="openCatEdit(cat)" />
                <Com1Button text="删除" variant="danger" size="mini" class="ml-2" @click="askDelete(cat.id, 'category')" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Com1Card>

    <!-- 文章管理 Card -->
    <Com1Card>
      <template #header-left>
        <span class="text-base font-semibold">文章管理</span>
      </template>
      <template #header-right>
        <Com1Button text="发布文章" variant="primary" size="small" @click="openArtAdd" />
      </template>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b bg-gray-50">
              <th class="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">序号</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">标题</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">分类</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">排序</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">发布时间</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody>
            <!-- Loading -->
            <tr v-if="loadingArticles">
              <td colspan="6" class="px-4 py-12 text-center text-gray-400">
                <div class="flex items-center justify-center gap-2">
                  <div class="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  加载中...
                </div>
              </td>
            </tr>

            <!-- Empty -->
            <tr v-else-if="articles.length === 0">
              <td colspan="6" class="px-4 py-12 text-center">
                <div class="flex flex-col items-center gap-2 text-gray-400">
                  <svg class="w-10 h-10 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p class="text-sm">暂无数据</p>
                  <Com1Button text="发布文章" variant="secondary" size="mini" @click="openArtAdd" />
                </div>
              </td>
            </tr>

            <!-- Data rows -->
            <tr
              v-for="(art, i) in articles"
              v-else
              :key="art.id"
              class="border-b hover:bg-gray-50 transition"
            >
              <td class="px-4 py-3 text-gray-500 whitespace-nowrap">{{ i + 1 }}</td>
              <td class="px-4 py-3 text-gray-800 whitespace-nowrap">{{ art.title }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded">{{ art.category?.name ?? '—' }}</span>
              </td>
              <td class="px-4 py-3 text-gray-500 whitespace-nowrap">{{ art.sort }}</td>
              <td class="px-4 py-3 text-gray-500 whitespace-nowrap">{{ art.updatedAt ? new Date(art.updatedAt).toLocaleDateString('zh-CN') : (art.createdAt ? new Date(art.createdAt).toLocaleDateString('zh-CN') : '—') }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <Com1Button text="编辑" variant="primary" size="mini" @click="openArtEdit(art)" />
                <Com1Button text="删除" variant="danger" size="mini" class="ml-2" @click="askDelete(art.id, 'article')" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Com1Card>

    <!-- 分类表单 Dialog -->
    <Com1Dialog
      :open="showCatDialog"
      :title="editCatId ? '编辑分类' : '添加分类'"
      confirm-text="保存"
      width="max-w-md"
      @confirm="handleCategorySubmit"
      @cancel="closeCatDialog"
      @close="closeCatDialog"
    >
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <Com1Input
            :value="catForm.name"
            :config="{ text: '分类名称', width: 'w-20' }"
            placeholder="请输入分类名称"
            @change="(val) => (catForm.name = val)"
          />
          <Com1Input
            :value="String(catForm.sort)"
            :config="{ text: '排序值', width: 'w-20' }"
            type="number"
            @change="(val) => (catForm.sort = Number(val))"
          />
        </div>
        <Com1Input
          :value="catForm.remark"
          :config="{ text: '备注', width: 'w-20' }"
          placeholder="可选"
          @change="(val) => (catForm.remark = val)"
        />
        <p v-if="catFormError" class="text-red-500 text-sm">{{ catFormError }}</p>
      </div>
    </Com1Dialog>

    <!-- 文章表单 Dialog -->
    <Com1Dialog
      :open="showArtDialog"
      :title="editArtId ? '编辑文章' : '发布文章'"
      confirm-text="保存"
      width="max-w-2xl"
      @confirm="handleArticleSubmit"
      @cancel="closeArtDialog"
      @close="closeArtDialog"
    >
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <Com1Input
            :value="artForm.title"
            :config="{ text: '标题', width: 'w-20' }"
            placeholder="请输入文章标题"
            @change="(val) => (artForm.title = val)"
          />
          <Com1Select
            :value="artForm.categoryId"
            :options="[{ value: '', label: '请选择分类' }, ...categories.map(c => ({ value: String(c.id), label: c.name }))]"
            :config="{ text: '分类', width: 'w-20' }"
            @change="(val: string) => (artForm.categoryId = val)"
          />
          <Com1Input
            :value="String(artForm.sort)"
            :config="{ text: '排序值', width: 'w-20' }"
            type="number"
            @change="(val) => (artForm.sort = Number(val))"
          />
        </div>
        <Com1Input
          :value="artForm.content"
          :config="{ text: '内容', width: 'w-20' }"
          type="textarea"
          placeholder="请输入文章内容"
          :input-class="'min-h-[120px]'"
          @change="(val) => (artForm.content = val)"
        />
        <p v-if="artFormError" class="text-red-500 text-sm">{{ artFormError }}</p>
      </div>
    </Com1Dialog>

    <!-- 删除确认 -->
    <Com1Confirm
      v-model:open="showDeleteConfirm"
      :message="`确定删除该${deleteTarget?.type === 'category' ? '分类' : '文章'}吗？`"
      title="确认删除"
      confirm-text="删除"
      @confirm="handleDelete"
      @cancel="deleteTarget = null"
    />

    <!-- 消息提示 -->
    <Com1Message ref="msgRef" />
  </div>
</template>
