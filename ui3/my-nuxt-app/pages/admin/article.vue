<template>
  <div class="p-4 flex flex-col gap-2">
    <Com1Card
      :config="{
        left: h('h1', { class: 'text-base font-bold' }, '文章管理'),
        right: h('div', { class: 'flex gap-2' }, [
          h(Com1Button, { text: '添加分类', variant: 'secondary', size: 'medium', onClick: () => { editCategoryId = null; showCategoryForm = true; categoryForm = { name: '', sort: 0, remark: '' } } }),
          h(Com1Button, { text: '添加文章', variant: 'primary', size: 'medium', onClick: () => { editArticleId = null; showArticleForm = true; articleForm = { title: '', content: '', categoryId: 0, sort: 0 } } }),
        ]),
      }"
    />

    <!-- 分类管理 -->
    <div class="border rounded-lg overflow-hidden">
      <div class="bg-gray-50 px-4 py-3 border-b font-medium text-sm text-gray-700">文章分类</div>
      <div class="divide-y">
        <div v-if="categories.length === 0" class="px-4 py-6 text-center text-gray-400 text-sm">暂无分类</div>
        <div v-for="cat in categories" :key="cat.id" class="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium text-gray-800">{{ cat.name }}</span>
            <span class="text-xs text-gray-400">排序: {{ cat.sort }}</span>
          </div>
          <div class="flex gap-2">
            <Com1Button text="编辑" variant="primary" size="mini" @click="openEditCategory(cat)" />
            <Com1Button text="删除" variant="danger" size="mini" @click="deleteCategory(cat.id)" />
          </div>
        </div>
      </div>
    </div>

    <Com1Dialog :open="showCategoryForm" :title="editCategoryId ? '编辑分类' : '添加分类'" :confirm-text="editCategoryId ? '保存' : '添加'" :on-confirm="handleCategorySubmit" :confirm-disabled="!categoryForm.name" @close="showCategoryForm = false">
      <div class="flex flex-col gap-3">
        <Com1Input :value="categoryForm.name" config-text="分类名称" placeholder="请输入分类名称" @change="(v) => (categoryForm.name = v)" />
        <Com1Input :value="String(categoryForm.sort)" config-text="排序值" type="number" @change="(v) => (categoryForm.sort = Number(v))" />
        <Com1Input :value="categoryForm.remark" config-text="描述" placeholder="可选" @change="(v) => (categoryForm.remark = v)" />
      </div>
    </Com1Dialog>

    <!-- 文章列表 -->
    <div class="border rounded-lg overflow-hidden">
      <div class="bg-gray-50 px-4 py-3 border-b font-medium text-sm text-gray-700">文章列表</div>
      <div class="divide-y">
        <div v-if="articles.length === 0" class="px-4 py-6 text-center text-gray-400 text-sm">暂无文章</div>
        <div v-for="article in articles" :key="article.id" class="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
          <div class="flex items-center gap-3 min-w-0">
            <span class="text-sm font-medium text-gray-800 truncate">{{ article.title }}</span>
            <span class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded shrink-0">{{ article.category?.name }}</span>
          </div>
          <div class="flex gap-2 shrink-0 ml-4">
            <Com1Button text="编辑" variant="primary" size="mini" @click="openEditArticle(article)" />
            <Com1Button text="删除" variant="danger" size="mini" @click="deleteArticle(article.id)" />
          </div>
        </div>
      </div>
    </div>

    <Com1Dialog :open="showArticleForm" :title="editArticleId ? '编辑文章' : '添加文章'" :confirm-text="editArticleId ? '保存' : '添加'" :on-confirm="handleArticleSubmit" :confirm-disabled="!articleForm.title || !articleForm.content || !articleForm.categoryId" @close="showArticleForm = false">
      <div class="flex flex-col gap-3">
        <Com1Input :value="articleForm.title" config-text="标题" placeholder="请输入文章标题" @change="(v) => (articleForm.title = v)" />
        <Com1Select :value="String(articleForm.categoryId)" :options="categories.map((c) => ({ value: String(c.id), label: c.name }))" config-text="分类" @change="(v) => (articleForm.categoryId = Number(v))" />
        <Com1Input :value="String(articleForm.sort)" config-text="排序值" type="number" @change="(v) => (articleForm.sort = Number(v))" />
        <div class="flex items-start gap-3">
          <label class="w-20 text-right pt-2 text-sm font-medium text-gray-700 shrink-0">内容</label>
          <textarea v-model="articleForm.content" rows="6" class="flex-1 border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入文章内容" />
        </div>
      </div>
    </Com1Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'

interface Article { id: number; title: string; content: string; sort: number; categoryId: number; category: { id: number; name: string } }
interface Category { id: number; name: string; sort: number; remark?: string }

const articles = ref<Article[]>([])
const categories = ref<Category[]>([])
const showCategoryForm = ref(false)
const showArticleForm = ref(false)
const editCategoryId = ref<number | null>(null)
const editArticleId = ref<number | null>(null)
const categoryForm = ref({ name: '', sort: 0, remark: '' })
const articleForm = ref({ title: '', content: '', categoryId: 0, sort: 0 })

async function fetchAll() {
  const [articlesRes, categoriesRes] = await Promise.all([
    $fetch<any>('/api/admin/article'),
    $fetch<any>('/api/admin/article?resource=category'),
  ])
  if (articlesRes.code === 200) articles.value = articlesRes.data
  if (categoriesRes.code === 200) categories.value = categoriesRes.data
}

function openEditCategory(cat: Category) {
  editCategoryId.value = cat.id
  categoryForm.value = { name: cat.name, sort: cat.sort, remark: cat.remark ?? '' }
  showCategoryForm.value = true
}

async function handleCategorySubmit() {
  const body: any = { resource: 'category', ...categoryForm.value }
  if (editCategoryId.value) body.id = editCategoryId.value
  const res = await $fetch<any>('/api/admin/article', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
  if (res.code === 200) { showCategoryForm.value = false; fetchAll() }
  else alert(res.message ?? '操作失败')
}

async function deleteCategory(id: number) {
  const res = await $fetch<any>(`/api/admin/article?resource=category&id=${id}`, { method: 'DELETE' })
  if (res.code === 200) fetchAll()
  else alert(res.message ?? '删除失败')
}

function openEditArticle(article: Article) {
  editArticleId.value = article.id
  articleForm.value = { title: article.title, content: article.content, categoryId: article.categoryId, sort: article.sort }
  showArticleForm.value = true
}

async function handleArticleSubmit() {
  const body: any = { ...articleForm.value }
  if (editArticleId.value) body.id = editArticleId.value
  const res = await $fetch<any>('/api/admin/article', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
  if (res.code === 200) { showArticleForm.value = false; fetchAll() }
  else alert(res.message ?? '操作失败')
}

async function deleteArticle(id: number) {
  const res = await $fetch<any>(`/api/admin/article?id=${id}`, { method: 'DELETE' })
  if (res.code === 200) fetchAll()
  else alert(res.message ?? '删除失败')
}

onMounted(fetchAll)
</script>
