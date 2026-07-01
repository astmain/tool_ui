<template>
  <div class="flex flex-col h-[calc(100vh-48px)]">
    <Com1Card class="mb-3">
      <div class="flex items-center gap-3 flex-wrap">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600">版本:</span>
          <Com1Button
            v-for="dir in dirs"
            :key="dir"
            :variant="currentDir === dir ? 'primary' : 'secondary'"
            size="small"
            @click="selectDir(dir)"
          >
            {{ dir }}
          </Com1Button>
        </div>

        <div class="flex items-center gap-2 flex-1 min-w-[200px]">
          <span class="text-sm text-gray-600">自定义URL:</span>
          <input
            v-model="customUrl"
            type="text"
            class="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            placeholder="输入完整URL"
            @keyup.enter="navigateToUrl"
          />
        </div>

        <div class="flex items-center gap-2">
          <Com1Button size="small" @click="openInNewWindow">
            新窗口打开
          </Com1Button>
          <Com1Button size="small" @click="refreshPreview">
            刷新
          </Com1Button>
        </div>
      </div>
    </Com1Card>

    <Com1Card v-if="currentFiles.length > 0" class="mb-3 flex-shrink-0">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="text-sm text-gray-600">文件:</span>
        <Com1Button
          v-for="file in currentFiles"
          :key="file.path"
          :variant="currentFile?.path === file.path ? 'primary' : 'secondary'"
          size="small"
          @click="selectFile(file)"
        >
          {{ file.name }}
        </Com1Button>
      </div>
    </Com1Card>

    <Com1Card class="flex-1 min-h-0">
      <div v-if="!currentFile" class="flex items-center justify-center h-full text-gray-400">
        请选择一个文件进行预览
      </div>
      <div v-else-if="currentFile.type === 'html'" class="h-full">
        <iframe
          ref="iframeRef"
          :src="`/ui-design/${currentFile.path}`"
          class="w-full h-full border-0"
          @load="onIframeLoad"
        />
      </div>
      <div v-else class="h-full overflow-auto p-4">
        <MarkdownPreview :content="fileContent" />
      </div>
    </Com1Card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
interface FileItem {
  dir: string;
  name: string;
  path: string;
  type: 'html' | 'markdown';
}

const currentDir = ref('');
const dirs = ref<string[]>([]);
const files = ref<FileItem[]>([]);
const currentFile = ref<FileItem | null>(null);
const fileContent = ref('');
const customUrl = ref('');
const iframeRef = ref<HTMLIFrameElement | null>(null);
const loading = ref(false);

const currentFiles = computed(() => {
  if (!currentDir.value) return [];
  return files.value.filter(f => f.dir === currentDir.value);
});

async function fetchFiles() {
  try {
    const resp = await $fetch<{ code: number; data: FileItem[] }>('/api/admin/ui-design');
    if (resp.ok) {
      files.value = resp.data;
      dirs.value = [...new Set(resp.data.map(f => f.dir))].sort();
      if (dirs.value.length > 0 && !currentDir.value) {
        selectDir(dirs.value[0]);
      }
    }
  } catch (error) {
    console.error('Failed to fetch files:', error);
  }
}

function selectDir(dir: string) {
  currentDir.value = dir;
  const dirFiles = files.value.filter(f => f.dir === dir);
  if (dirFiles.length > 0 && currentFile.value?.dir !== dir) {
    selectFile(dirFiles[0]);
  }
}

async function selectFile(file: FileItem) {
  currentFile.value = file;
  if (file.type === 'markdown') {
    await fetchFileContent(file.path);
  }
  updateCustomUrl();
}

async function fetchFileContent(filePath: string) {
  try {
    loading.value = true;
    const resp = await $fetch<{ code: number; data: { content: string } }>(
      `/api/admin/ui-design/content?path=${encodeURIComponent(filePath)}`
    );
    if (resp.ok) {
      fileContent.value = resp.data.content;
    } else {
      fileContent.value = `加载失败: ${resp.message || '未知错误'}`;
    }
  } catch (error) {
    fileContent.value = '加载失败: 网络错误';
  } finally {
    loading.value = false;
  }
}

function updateCustomUrl() {
  if (currentFile.value?.type === 'html') {
    customUrl.value = `/ui-design/${currentFile.value.path}`;
  }
}

function navigateToUrl() {
  const url = customUrl.value.trim();
  if (!url) return;

  if (currentFile.value?.type === 'html') {
    const filePath = url.replace(/^\//, '').replace(/^ui-design\//, '');
    const file = files.value.find(f => f.type === 'html' && `ui-design/${f.path}` === filePath);
    if (file) {
      selectFile(file);
      return;
    }
  }

  if (url.startsWith('http') || url.startsWith('/ui-design/')) {
    const iframe = iframeRef.value;
    if (iframe) {
      iframe.src = url;
    }
  }
}

function openInNewWindow() {
  if (customUrl.value) {
    window.open(customUrl.value, '_blank');
  } else if (currentFile.value?.type === 'html') {
    window.open(`/ui-design/${currentFile.value.path}`, '_blank');
  }
}

function refreshPreview() {
  if (currentFile.value?.type === 'html') {
    const iframe = iframeRef.value;
    if (iframe) {
      iframe.src = iframe.src;
    }
  } else if (currentFile.value?.type === 'markdown') {
    fetchFileContent(currentFile.value.path);
  }
}

function onIframeLoad() {
  try {
    const iframe = iframeRef.value;
    if (iframe && iframe.contentWindow) {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      customUrl.value = doc.location.href;
    }
  } catch (error) {
    // Cross-origin access denied, ignore
  }
}

onMounted(() => {
  fetchFiles();
});
</script>
