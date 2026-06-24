<template>
  <div v-if="content" class="markdown-preview" v-html="parsedContent" />
  <div v-else class="text-gray-400">暂无内容</div>
</template>

<script setup lang="ts">
const props = defineProps<{
  content: string;
}>();

const parsedContent = computed(() => {
  return parseMarkdown(props.content);
});

function parseMarkdown(text: string): string {
  let html = text
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4"><code class="text-sm">${escapeHtml(code.trim())}</code></pre>`;
    })
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-pink-600 px-1 rounded text-sm">$1</code>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-3 text-gray-800">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-6 mb-3 text-gray-800">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-4 text-gray-900">$1</h1>')
    .replace(/^\| (.+) \|$/gm, (match) => {
      const cells = match.split('|').filter(c => c.trim());
      if (cells.every(c => /^-+$/.test(c.trim()))) {
        return '';
      }
      const isHeader = cells.every(c => /^[a-zA-Z0-9\u4e00-\u9fa5]/.test(c.trim()));
      const tag = isHeader ? 'th' : 'td';
      const cellHtml = cells.map(c => `<${tag} class="border border-gray-300 px-4 py-2">${c.trim()}</${tag}>`).join('');
      return isHeader ? `<thead><tr>${cellHtml}</tr></thead><tbody>` : `<tr>${cellHtml}</tr>`;
    })
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-gray-700 mb-1">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-gray-700 mb-1">$1</li>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
    .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
    .replace(/\n/g, '<br>');

  const lines = html.split('\n');
  const result: string[] = [];
  let inTable = false;

  for (const line of lines) {
    if (line.startsWith('<thead') || line.startsWith('<tr')) {
      if (!inTable) {
        result.push('<div class="overflow-x-auto mb-4">');
        result.push('<table class="min-w-full border-collapse border border-gray-300">');
        inTable = true;
      }
      result.push(line);
    } else if (inTable && !line.startsWith('<') && !line.startsWith('</')) {
      result.push('</tbody></table></div>');
      inTable = false;
      result.push(`<p class="mb-4 text-gray-700 leading-relaxed">${line}</p>`);
    } else if (inTable && line.includes('</tr>')) {
      result.push(line);
    } else {
      if (inTable) {
        result.push('</tbody></table></div>');
        inTable = false;
      }
      if (line.trim() && !line.startsWith('<li') && !line.startsWith('<h') && !line.startsWith('<pre') && !line.startsWith('<div')) {
        result.push(`<p class="mb-4 text-gray-700 leading-relaxed">${line}</p>`);
      } else {
        result.push(line);
      }
    }
  }

  if (inTable) {
    result.push('</tbody></table></div>');
  }

  return result.join('\n');
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
</script>

<style scoped>
.markdown-preview :deep(h1) {
  @apply text-2xl font-bold mt-6 mb-4 text-gray-900;
}

.markdown-preview :deep(h2) {
  @apply text-xl font-semibold mt-6 mb-3 text-gray-800;
}

.markdown-preview :deep(h3) {
  @apply text-lg font-semibold mt-6 mb-3 text-gray-800;
}

.markdown-preview :deep(p) {
  @apply mb-4 text-gray-700 leading-relaxed;
}

.markdown-preview :deep(ul),
.markdown-preview :deep(ol) {
  @apply mb-4 pl-6;
}

.markdown-preview :deep(pre) {
  @apply bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4;
}

.markdown-preview :deep(code) {
  @apply text-sm font-mono;
}

.markdown-preview :deep(table) {
  @apply min-w-full border-collapse border border-gray-300;
}

.markdown-preview :deep(th),
.markdown-preview :deep(td) {
  @apply border border-gray-300 px-4 py-2;
}

.markdown-preview :deep(th) {
  @apply bg-gray-100 font-semibold;
}

.markdown-preview :deep(a) {
  @apply text-blue-600 hover:underline;
}

.markdown-preview :deep(strong) {
  @apply font-semibold text-gray-900;
}
</style>
