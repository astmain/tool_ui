<script setup lang="ts">
import { U1Message, U1Confirm } from 'tool_ui1'

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

// 分类表格列
const catColumns = [
  { type: 'index', label: '序号', width: 70, align: 'center' },
  { prop: 'name', label: '分类名称', minWidth: 140 },
  { prop: 'sort', label: '排序', width: 90, align: 'center' },
  { prop: 'remark', label: '备注', minWidth: 160 },
  { prop: 'articleCount', label: '文章数', width: 90, align: 'center' },
  { type: 'action', label: '操作', width: 170, align: 'center' },
]

// 文章表格列
const artColumns = [
  { type: 'index', label: '序号', width: 70, align: 'center' },
  { prop: 'title', label: '标题', minWidth: 180 },
  { prop: 'category', label: '分类', width: 120 },
  { prop: 'sort', label: '排序', width: 90, align: 'center' },
  { prop: 'publishTime', label: '发布时间', width: 130 },
  { type: 'action', label: '操作', width: 170, align: 'center' },
]

// 文章分类下拉选项
const categoryOptions = computed(() => [
  { value: '', label: '请选择分类' },
  ...categories.value.map((c) => ({ value: String(c.id), label: c.name })),
])

function formatDate(art: Article) {
  const raw = art.updatedAt || art.createdAt
  return raw ? new Date(raw).toLocaleDateString('zh-CN') : '—'
}

// ─── Fetch ───────────────────────────────────────────────────────────────────
async function fetchCategories() {
  loadingCategories.value = true
  try {
    const resp = await $fetch<{ code: number; data: Category[] }>('/api/admin/article?resource=category')
    if (resp.ok) {
      categories.value = resp.data
    }
  } catch {
    U1Message.error('加载分类失败')
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
    U1Message.error('加载文章列表失败')
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

    const method = editCatId.value ? 'PUT' : 'POST'
    if (editCatId.value) {
      body.id = editCatId.value
    }

    const resp = await $fetch<{ code: number; message?: string }>('/api/admin/article', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body,
    })

    if (resp.ok) {
      U1Message.success(editCatId.value ? '修改成功' : '添加成功')
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

    const method = editArtId.value ? 'PUT' : 'POST'
    if (editArtId.value) {
      body.id = editArtId.value
    }

    const resp = await $fetch<{ code: number; message?: string }>('/api/admin/article', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body,
    })

    if (resp.ok) {
      U1Message.success(editArtId.value ? '修改成功' : '发布成功')
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
async function askDelete(id: number, type: 'category' | 'article') {
  const ok = await U1Confirm({
    title: '确认删除',
    message: `确定删除该${type === 'category' ? '分类' : '文章'}吗?`,
    type: 'danger',
    confirmText: '删除',
  })
  if (!ok) return

  try {
    const suffix = type === 'category' ? '&resource=category' : ''
    const resp = await $fetch<{ code: number; message?: string }>(`/api/admin/article?id=${id}${suffix}`, {
      method: 'DELETE',
    })
    if (resp.ok) {
      U1Message.success('删除成功')
      if (type === 'category') fetchCategories()
      else fetchArticles()
    } else {
      U1Message.error(resp.message ?? '删除失败')
    }
  } catch (err: any) {
    U1Message.error(err?.data?.message ?? '删除失败')
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
    <U1Card>
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-base font-semibold">分类管理</span>
          <U1Button type="primary" size="small" @click="openCatAdd">添加分类</U1Button>
        </div>
      </template>

      <U1Table :columns="catColumns" :data="categories" row-key="id" :loading="loadingCategories" empty-text="暂无数据">
        <template #cell-remark="{ row }">{{ row.remark ?? '—' }}</template>
        <template #cell-articleCount="{ row }">{{ row.articleCount ?? 0 }}</template>
        <template #action="{ row }">
          <U1Button type="primary" size="mini" @click="openCatEdit(row)">编辑</U1Button>
          <U1Button type="danger" size="mini" class="ml-2" @click="askDelete(row.id, 'category')">删除</U1Button>
        </template>
      </U1Table>
    </U1Card>

    <!-- 文章管理 Card -->
    <U1Card>
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-base font-semibold">文章管理</span>
          <U1Button type="primary" size="small" @click="openArtAdd">发布文章</U1Button>
        </div>
      </template>

      <U1Table :columns="artColumns" :data="articles" row-key="id" :loading="loadingArticles" empty-text="暂无数据">
        <template #cell-category="{ row }">
          <U1Tag type="primary" effect="light">{{ row.category?.name ?? '—' }}</U1Tag>
        </template>
        <template #cell-publishTime="{ row }">{{ formatDate(row) }}</template>
        <template #action="{ row }">
          <U1Button type="primary" size="mini" @click="openArtEdit(row)">编辑</U1Button>
          <U1Button type="danger" size="mini" class="ml-2" @click="askDelete(row.id, 'article')">删除</U1Button>
        </template>
      </U1Table>
    </U1Card>

    <!-- 分类表单 Dialog -->
    <U1Dialog v-model="showCatDialog" :title="editCatId ? '编辑分类' : '添加分类'" width="460px" @close="closeCatDialog">
      <div class="flex flex-col gap-4">
        <U1InputLabel v-model="catForm.name" label="分类名称" label-width="80px" input-width="300px" placeholder="请输入分类名称" />
        <U1InputLabel v-model="catForm.sort" type="number" label="排序值" label-width="80px" input-width="300px" />
        <U1InputLabel v-model="catForm.remark" label="备注" label-width="80px" input-width="300px" placeholder="可选" />
        <p v-if="catFormError" class="text-red-500 text-sm">{{ catFormError }}</p>

        <div class="flex justify-end gap-2 pt-2 border-t border-gray-100">
          <U1Button size="small" @click="closeCatDialog">取消</U1Button>
          <U1Button type="primary" size="small" :loading="submitting" @click="handleCategorySubmit">保存</U1Button>
        </div>
      </div>
    </U1Dialog>

    <!-- 文章表单 Dialog -->
    <U1Dialog v-model="showArtDialog" :title="editArtId ? '编辑文章' : '发布文章'" width="680px" @close="closeArtDialog">
      <div class="flex flex-col gap-4">
        <U1InputLabel v-model="artForm.title" label="标题" label-width="80px" input-width="480px" placeholder="请输入文章标题" />
        <label class="flex items-center gap-2">
          <span class="w-20 text-right text-sm text-gray-600 shrink-0">分类</span>
          <U1Select v-model="artForm.categoryId" :options="categoryOptions" placeholder="请选择分类" />
        </label>
        <U1InputLabel v-model="artForm.sort" type="number" label="排序值" label-width="80px" input-width="480px" />
        <label class="flex items-start gap-2">
          <span class="w-20 text-right text-sm text-gray-600 shrink-0 pt-2">内容</span>
          <U1Textarea
            v-model="artForm.content"
            class="flex-1"
            :rows="5"
            placeholder="请输入文章内容"
          />
        </label>
        <p v-if="artFormError" class="text-red-500 text-sm">{{ artFormError }}</p>

        <div class="flex justify-end gap-2 pt-2 border-t border-gray-100">
          <U1Button size="small" @click="closeArtDialog">取消</U1Button>
          <U1Button type="primary" size="small" :loading="submitting" @click="handleArticleSubmit">保存</U1Button>
        </div>
      </div>
    </U1Dialog>
  </div>
</template>
