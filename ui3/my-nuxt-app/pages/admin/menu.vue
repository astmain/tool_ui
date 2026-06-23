<template>
  <div class="p-4 flex flex-col gap-2">
    <Com1Card
      :config="{
        left: h('h1', { class: 'text-base font-bold' }, '菜单管理'),
        right: h(Com1Button, { text: '添加菜单', variant: 'primary', size: 'medium', onClick: openAdd }),
      }"
    />

    <!-- 添加/编辑弹框 -->
    <Com1Dialog
      :open="showForm"
      :title="editId ? '编辑菜单' : '添加菜单'"
      confirm-text="保存"
      :on-confirm="handleSubmit"
      :confirm-disabled="!form.name.trim()"
      width="max-w-lg"
      @close="closeForm"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">菜单组 <span class="text-red-500">*</span></label>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="admin" v-model="form.group" class="w-4 h-4 text-blue-500" />
              <span class="text-sm text-gray-700">后台中控</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="web" v-model="form.group" class="w-4 h-4 text-blue-500" />
              <span class="text-sm text-gray-700">前台会员</span>
            </label>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">菜单名称 <span class="text-red-500">*</span></label>
          <input v-model="form.name" type="text" class="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="例如：用户管理" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">菜单路径</label>
            <input v-model="form.path" type="text" class="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="例如：/admin/user" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">菜单图标</label>
            <input v-model="form.icon" type="text" class="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="例如：User" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">排序号</label>
            <input v-model.number="form.orderNum" type="number" class="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">状态</label>
            <div class="flex items-center h-[42px] gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" :value="true" v-model="form.status" class="w-4 h-4 text-blue-500" />
                <span class="text-sm text-gray-700">启用</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" :value="false" v-model="form.status" class="w-4 h-4 text-blue-500" />
                <span class="text-sm text-gray-700">禁用</span>
              </label>
            </div>
          </div>
        </div>
        <p v-if="errMsg" class="text-red-500 text-sm">{{ errMsg }}</p>
      </div>
    </Com1Dialog>

    <div v-if="loading" class="text-gray-500 text-sm">加载中...</div>
    <template v-else>
      <div v-for="(label, key) in { admin: '后台中控的菜单', web: '前台会员的菜单' }" :key="key" class="border rounded-lg overflow-hidden mb-4 pt-1">
        <div class="bg-gray-50 px-4 py-3 border-b font-medium text-sm text-gray-700 flex justify-between items-center">
          <span>{{ label }} &quot;/{{ key }}&quot;</span>
          <span class="text-gray-400 text-xs font-normal">{{ menus.filter((m) => m.group === key).length }} 个菜单</span>
        </div>
        <div class="divide-y">
          <template v-if="menus.filter((m) => m.group === key).length === 0">
            <p class="px-4 py-6 text-center text-gray-400 text-sm">暂无菜单</p>
          </template>
          <template v-else>
            <div
              v-for="m in menus.filter((m) => m.group === key)"
              :key="m.id"
              class="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
            >
              <div class="flex items-center gap-3 min-w-0">
                <span :class="['text-sm truncate', m.status ? 'text-gray-800' : 'text-gray-400 line-through']">{{ m.name }}</span>
                <span v-if="m.path" class="text-xs text-gray-400 font-mono truncate">{{ m.path }}</span>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0 ml-4">
                <Com1Button text="编辑" variant="primary" size="mini" @click="openEdit(m)" />
                <Com1Button text="删除" variant="danger" size="mini" @click="handleDelete(m.id)" />
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'

interface Menu { id: number; name: string; path: string | null; icon: string | null; orderNum: number; status: boolean; group: string }

const menus = ref<Menu[]>([])
const loading = ref(true)
const showForm = ref(false)
const editId = ref<number | null>(null)
const errMsg = ref('')
const form = ref({ name: '', path: '', icon: '', group: 'admin', status: true, orderNum: 0 })

async function fetchMenus() {
  const res = await $fetch<any>('/api/admin/menu')
  if (res.code === 200) menus.value = res.data
}

function openAdd() {
  editId.value = null
  form.value = { name: '', path: '', icon: '', group: 'admin', status: true, orderNum: 0 }
  errMsg.value = ''
  showForm.value = true
}

function openEdit(menu: Menu) {
  editId.value = menu.id
  form.value = { name: menu.name, path: menu.path ?? '', icon: menu.icon ?? '', group: menu.group, status: menu.status, orderNum: menu.orderNum }
  errMsg.value = ''
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editId.value = null
  errMsg.value = ''
}

async function handleSubmit() {
  errMsg.value = ''
  if (!form.value.name.trim()) { errMsg.value = '菜单名称不能为空'; return }

  const payload = { name: form.value.name.trim(), path: form.value.path.trim() || null, icon: form.value.icon.trim() || null, group: form.value.group, status: form.value.status, orderNum: form.value.orderNum }
  const url = editId.value ? `/api/admin/menu` : '/api/admin/menu'
  const method = editId.value ? 'PUT' : 'POST'
  if (editId.value) (payload as any).id = editId.value

  const res = await $fetch<any>(url, { method, headers: { 'Content-Type': 'application/json' }, body: payload })
  if (res.code === 200) { closeForm(); fetchMenus() }
  else { errMsg.value = res.message ?? '操作失败' }
}

async function handleDelete(id: number) {
  const res = await $fetch<any>(`/api/admin/menu?id=${id}`, { method: 'DELETE' })
  if (res.code === 200) fetchMenus()
  else alert(res.message ?? '删除失败')
}

onMounted(async () => { await fetchMenus(); loading.value = false })
</script>
