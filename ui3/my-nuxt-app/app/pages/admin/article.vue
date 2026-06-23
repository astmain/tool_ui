<template>
  <div class="p-4 flex flex-col gap-2">
    <Com1Card :config="{ left: h('h1', { class: 'text-base font-bold' }, '文章管理'), right: h('div', { class: 'flex gap-2' }, [h(Com1Button, { text: '添加分类', variant: 'secondary', onClick: () => { editCatId = null; catForm = { name: '', sort: 0, remark: '' }; showCat = true } }), h(Com1Button, { text: '添加文章', onClick: () => { editArtId = null; artForm = { title: '', content: '', categoryId: 0, sort: 0 }; showArt = true } })]) }" />
    <div class="border rounded-lg overflow-hidden">
      <div class="bg-gray-50 px-4 py-3 border-b font-medium text-sm text-gray-700">文章分类</div>
      <div class="divide-y">
        <div v-if="categories.length === 0" class="px-4 py-6 text-center text-gray-400 text-sm">暂无分类</div>
        <div v-for="cat in categories" :key="cat.id" class="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
          <div class="flex items-center gap-3"><span class="text-sm font-medium text-gray-800">{{ cat.name }}</span><span class="text-xs text-gray-400">排序: {{ cat.sort }}</span></div>
          <div class="flex gap-2"><Com1Button text="编辑" variant="primary" size="mini" @click="openEditCat(cat)" /><Com1Button text="删除" variant="danger" size="mini" @click="deleteCat(cat.id)" /></div>
        </div>
      </div>
    </div>
    <Com1Dialog :open="showCat" :title="editCatId ? '编辑分类' : '添加分类'" :confirm-text="editCatId ? '保存' : '添加'" :on-confirm="handleCatSubmit" :confirm-disabled="!catForm.name" @close="showCat = false">
      <div class="flex flex-col gap-3">
        <Com1Input :value="catForm.name" config-text="分类名称" placeholder="请输入分类名称" @change="(v: string) => catForm.name = v" />
        <Com1Input :value="String(catForm.sort)" config-text="排序值" type="number" @change="(v: string) => catForm.sort = Number(v)" />
        <Com1Input :value="catForm.remark" config-text="描述" placeholder="可选" @change="(v: string) => catForm.remark = v" />
      </div>
    </Com1Dialog>
    <div class="border rounded-lg overflow-hidden">
      <div class="bg-gray-50 px-4 py-3 border-b font-medium text-sm text-gray-700">文章列表</div>
      <div class="divide-y">
        <div v-if="articles.length === 0" class="px-4 py-6 text-center text-gray-400 text-sm">暂无文章</div>
        <div v-for="article in articles" :key="article.id" class="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
          <div class="flex items-center gap-3 min-w-0"><span class="text-sm font-medium text-gray-800 truncate">{{ article.title }}</span><span class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded shrink-0">{{ article.category?.name }}</span></div>
          <div class="flex gap-2 shrink-0 ml-4"><Com1Button text="编辑" variant="primary" size="mini" @click="openEditArt(article)" /><Com1Button text="删除" variant="danger" size="mini" @click="deleteArt(article.id)" /></div>
        </div>
      </div>
    </div>
    <Com1Dialog :open="showArt" :title="editArtId ? '编辑文章' : '添加文章'" :confirm-text="editArtId ? '保存' : '添加'" :on-confirm="handleArtSubmit" :confirm-disabled="!artForm.title || !artForm.content || !artForm.categoryId" @close="showArt = false">
      <div class="flex flex-col gap-3">
        <Com1Input :value="artForm.title" config-text="标题" placeholder="请输入文章标题" @change="(v: string) => artForm.title = v" />
        <Com1Select :value="String(artForm.categoryId)" :options="categories.map((c) => ({ value: String(c.id), label: c.name }))" config-text="分类" @change="(v: string) => artForm.categoryId = Number(v)" />
        <Com1Input :value="String(artForm.sort)" config-text="排序值" type="number" @change="(v: string) => artForm.sort = Number(v)" />
        <div class="flex items-start gap-3">
          <label class="w-20 text-right pt-2 text-sm font-medium text-gray-700 shrink-0">内容</label>
          <textarea v-model="artForm.content" rows="6" class="flex-1 border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入文章内容" />
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
const showCat = ref(false)
const showArt = ref(false)
const editCatId = ref<number | null>(null)
const editArtId = ref<number | null>(null)
const catForm = ref({ name: '', sort: 0, remark: '' })
const artForm = ref({ title: '', content: '', categoryId: 0, sort: 0 })

async function fetchAll() {
  const [ar, cr] = await Promise.all([$fetch<any>('/api/admin/article'), $fetch<any>('/api/admin/article?resource=category')])
  if (ar.code === 200) articles.value = ar.data
  if (cr.code === 200) categories.value = cr.data
}

function openEditCat(cat: Category) { editCatId.value = cat.id; catForm.value = { name: cat.name, sort: cat.sort, remark: cat.remark ?? '' }; showCat.value = true }
async function handleCatSubmit() {
  const body: any = { resource: 'category', ...catForm.value }
  if (editCatId.value) body.id = editCatId.value
  const res = await $fetch<any>('/api/admin/article', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
  if (res.code === 200) { showCat.value = false; fetchAll() } else alert(res.message ?? '操作失败')
}
async function deleteCat(id: number) {
  const res = await $fetch<any>(`/api/admin/article?resource=category&id=${id}`, { method: 'DELETE' })
  if (res.code === 200) { fetchAll() } else { alert(res.message ?? '删除失败') }
}
function openEditArt(art: Article) { editArtId.value = art.id; artForm.value = { title: art.title, content: art.content, categoryId: art.categoryId, sort: art.sort }; showArt.value = true }
async function handleArtSubmit() {
  const body: any = { ...artForm.value }
  if (editArtId.value) body.id = editArtId.value
  const res = await $fetch<any>('/api/admin/article', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
  if (res.code === 200) { showArt.value = false; fetchAll() } else alert(res.message ?? '操作失败')
}
async function deleteArt(id: number) {
  const res = await $fetch<any>(`/api/admin/article?id=${id}`, { method: 'DELETE' })
  if (res.code === 200) { fetchAll() } else { alert(res.message ?? '删除失败') }
}

onMounted(fetchAll)
</script>
