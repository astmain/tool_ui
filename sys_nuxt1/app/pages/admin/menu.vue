<script setup lang="ts">
definePageMeta({ layout: 'admin' })

interface Menu {
  id: number
  name: string
  path: string | null
  icon: string | null
  orderNum: number
  type: string
  status: boolean
  group: string
}

interface FormState {
  name: string
  path: string
  icon: string
  group: string
  status: boolean
  orderNum: number
}

const menus = ref<Menu[]>([])
const loading = ref(false)
const submitting = ref(false)
const showForm = ref(false)
const editId = ref<number | null>(null)
const form = ref<FormState>({
  name: '',
  path: '',
  icon: '',
  group: 'admin',
  status: true,
  orderNum: 0,
})
const formError = ref('')
const confirmOpen = ref(false)
const confirmTarget = ref<Menu | null>(null)
const msgRef = ref<{ success: (m: string) => void; error: (m: string) => void } | null>(null)

const adminMenus = computed(() => menus.value.filter((m) => m.group === 'admin'))
const webMenus = computed(() => menus.value.filter((m) => m.group === 'web'))

async function fetchMenus() {
  loading.value = true
  try {
    const resp = await $fetch<{ code: number; data: Menu[] }>('/api/admin/menu')
    if (resp.ok) {
      menus.value = resp.data
    }
  } catch {
    msgRef.value?.error('加载菜单失败')
  } finally {
    loading.value = false
  }
}

function openAdd() {
  editId.value = null
  form.value = { name: '', path: '', icon: '', group: 'admin', status: true, orderNum: 0 }
  formError.value = ''
  showForm.value = true
}

function openEdit(menu: Menu) {
  editId.value = menu.id
  form.value = {
    name: menu.name,
    path: menu.path ?? '',
    icon: menu.icon ?? '',
    group: menu.group,
    status: menu.status,
    orderNum: menu.orderNum,
  }
  formError.value = ''
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editId.value = null
  formError.value = ''
}

async function handleSubmit() {
  if (!form.value.name.trim()) {
    formError.value = '菜单名称不能为空'
    return
  }

  submitting.value = true
  formError.value = ''

  try {
    const isEditing = editId.value !== null
    const payload = {
      name: form.value.name.trim(),
      path: form.value.path.trim() || null,
      icon: form.value.icon.trim() || null,
      group: form.value.group,
      status: form.value.status,
      orderNum: form.value.orderNum,
    }

    const url = isEditing ? `/api/admin/menu/${editId.value}` : '/api/admin/menu'
    const method = isEditing ? 'PUT' : 'POST'

    const resp = await $fetch<{ code: number; message?: string }>(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    })

    if (resp.ok) {
      closeForm()
      fetchMenus()
      msgRef.value?.success(isEditing ? '保存成功' : '添加成功')
    } else {
      formError.value = resp.message ?? '操作失败'
    }
  } catch (err: any) {
    formError.value = err?.data?.message ?? '操作失败'
  } finally {
    submitting.value = false
  }
}

function askDelete(menu: Menu) {
  confirmTarget.value = menu
  confirmOpen.value = true
}

async function handleDelete() {
  if (!confirmTarget.value) return
  const id = confirmTarget.value.id
  confirmOpen.value = false
  confirmTarget.value = null

  try {
    const resp = await $fetch<{ code: number; message?: string }>(`/api/admin/menu/${id}`, {
      method: 'DELETE',
    })
    if (resp.ok) {
      fetchMenus()
      msgRef.value?.success('删除成功')
    } else {
      msgRef.value?.error(resp.message ?? '删除失败')
    }
  } catch (err: any) {
    msgRef.value?.error(err?.data?.message ?? '删除失败')
  }
}

async function handleToggleStatus(menu: Menu) {
  try {
    const resp = await $fetch<{ code: number; message?: string }>(`/api/admin/menu/${menu.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: { status: !menu.status },
    })
    if (resp.ok) {
      fetchMenus()
      msgRef.value?.success(!menu.status ? '已启用' : '已禁用')
    } else {
      msgRef.value?.error(resp.message ?? '操作失败')
    }
  } catch (err: any) {
    msgRef.value?.error(err?.data?.message ?? '操作失败')
  }
}

onMounted(fetchMenus)
</script>

<template>
  <div class="p-4 space-y-4">
    <Com1Card>
      <template #header-left>
        <span class="text-base font-semibold">菜单管理</span>
      </template>
      <template #header-right>
        <Com1Button text="添加菜单" variant="primary" size="small" @click="openAdd" />
      </template>

      <div v-if="loading" class="py-12 text-center">
        <div class="flex items-center justify-center gap-2 text-gray-500">
          <div class="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          加载中...
        </div>
      </div>
      <template v-else>
        <div class="space-y-4">
          <div>
            <div class="text-xs font-medium text-gray-500 uppercase mb-2 px-1">后台中控</div>
            <ClientOnly>
              <div v-if="adminMenus.length === 0" class="py-8 text-center text-gray-400 text-sm border border-dashed border-gray-200 rounded-lg">暂无菜单</div>
              <div v-else v-for="menu in adminMenus" :key="menu.id" class="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0 last:rounded-b-lg first:rounded-t-lg">
                <div class="flex items-center gap-3 min-w-0">
                  <span :class="['text-sm truncate', menu.status ? 'text-gray-800' : 'text-gray-400 line-through']">{{ menu.name }}</span>
                  <span v-if="menu.path" class="text-xs text-gray-400 font-mono truncate">/{{ menu.path }}</span>
                  <span v-if="menu.icon" class="text-xs text-gray-400">[{{ menu.icon }}]</span>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0 ml-4">
                  <Com1Button :text="menu.status ? '禁用' : '启用'" :variant="menu.status ? 'secondary' : 'success'" size="mini" @click="handleToggleStatus(menu)" />
                  <Com1Button text="编辑" variant="primary" size="mini" @click="openEdit(menu)" />
                  <Com1Button text="删除" variant="danger" size="mini" @click="askDelete(menu)" />
                </div>
              </div>
            </ClientOnly>
          </div>

          <div>
            <div class="text-xs font-medium text-gray-500 uppercase mb-2 px-1">前台会员</div>
            <ClientOnly>
              <div v-if="webMenus.length === 0" class="py-8 text-center text-gray-400 text-sm border border-dashed border-gray-200 rounded-lg">暂无菜单</div>
              <div v-else v-for="menu in webMenus" :key="menu.id" class="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0 last:rounded-b-lg first:rounded-t-lg">
                <div class="flex items-center gap-3 min-w-0">
                  <span :class="['text-sm truncate', menu.status ? 'text-gray-800' : 'text-gray-400 line-through']">{{ menu.name }}</span>
                  <span v-if="menu.path" class="text-xs text-gray-400 font-mono truncate">/{{ menu.path }}</span>
                  <span v-if="menu.icon" class="text-xs text-gray-400">[{{ menu.icon }}]</span>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0 ml-4">
                  <Com1Button :text="menu.status ? '禁用' : '启用'" :variant="menu.status ? 'secondary' : 'success'" size="mini" @click="handleToggleStatus(menu)" />
                  <Com1Button text="编辑" variant="primary" size="mini" @click="openEdit(menu)" />
                  <Com1Button text="删除" variant="danger" size="mini" @click="askDelete(menu)" />
                </div>
              </div>
            </ClientOnly>
          </div>
        </div>
      </template>
    </Com1Card>

    <Com1Dialog
      :open="showForm"
      :title="editId ? '编辑菜单' : '添加菜单'"
      confirm-text="保存"
      width="max-w-xl"
      :confirm-loading="submitting"
      @confirm="handleSubmit"
      @cancel="closeForm"
      @close="closeForm"
    >
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <Com1Select
            :value="form.group"
            :options="[{ value: 'admin', label: '后台中控' }, { value: 'web', label: '前台会员' }]"
            @change="(val: string) => (form.group = val)"
          />
          <Com1Input
            :value="form.name"
            :config="{ text: '菜单名称', width: 'w-24' }"
            placeholder="例如：用户管理"
            @change="(val) => (form.name = val)"
          />
          <Com1Input
            :value="form.path"
            :config="{ text: '菜单路径', width: 'w-24' }"
            placeholder="例如：admin/user"
            @change="(val) => (form.path = val)"
          />
          <Com1Input
            :value="form.icon"
            :config="{ text: '菜单图标', width: 'w-24' }"
            placeholder="例如：User"
            @change="(val) => (form.icon = val)"
          />
          <Com1Input
            :value="String(form.orderNum)"
            :config="{ text: '排序值', width: 'w-24' }"
            type="number"
            placeholder="数字越小越靠前"
            @change="(val) => (form.orderNum = Number(val))"
          />
          <Com1Select
            :value="form.status"
            :options="[{ value: true, label: '启用' }, { value: false, label: '禁用' }]"
            @change="(val: string) => (form.status = val === 'true')"
          />
        </div>
        <p v-if="formError" class="text-red-500 text-sm">{{ formError }}</p>
      </div>
    </Com1Dialog>

    <Com1Confirm
      v-model:open="confirmOpen"
      message="确定删除该菜单？"
      title="删除确认"
      confirm-text="删除"
      @confirm="handleDelete"
      @cancel="confirmTarget = null"
    />

    <Com1Message ref="msgRef" />
  </div>
</template>
