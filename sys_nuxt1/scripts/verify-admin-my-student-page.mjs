import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const currentDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(currentDir, '..');
const pagePath = resolve(projectRoot, 'app/pages/admin/my-student.vue');
const dialogPath = resolve(projectRoot, 'app/components/Com1Dialog.vue');
const inputPath = resolve(projectRoot, 'app/components/Com1Input.vue');
const page = readFileSync(pagePath, 'utf8');
const dialog = readFileSync(dialogPath, 'utf8');
const input = readFileSync(inputPath, 'utf8');

const checks = [
  ['student type includes canvas coordinates', /interface\s+Student[\s\S]*?x:\s*number[\s\S]*?y:\s*number/.test(page)],
  ['defines canvas constants', /const\s+CANVAS_WIDTH\s*=\s*1200/.test(page) && /const\s+GRID_SIZE\s*=\s*20/.test(page)],
  ['has selected ids state', /selectedIds\s*=\s*ref<Set<number>>/.test(page)],
  ['has findNextSlot helper', /function\s+findNextSlot\(existingStudents:\s*Student\[\]\)/.test(page)],
  ['add submit sends x and y', /body:\s*\{[\s\S]*?x:\s*slot\.x[\s\S]*?y:\s*slot\.y[\s\S]*?\}/.test(page)],
  ['has save positions action', /function\s+handleSavePositions/.test(page) && /body:\s*\{\s*items\s*\}/.test(page)],
  ['has drag handle mouse down', /function\s+handleCardHandleMouseDown/.test(page)],
  ['has canvas selection mouse down', /function\s+handleCanvasMouseDown/.test(page)],
  ['registers mousemove and mouseup listeners', /window\.addEventListener\('mousemove',\s*handleMouseMove\)/.test(page) && /window\.addEventListener\('mouseup',\s*handleMouseUp\)/.test(page)],
  ['renders free canvas instead of table', /ref="canvasRef"/.test(page) && /网格背景/.test(page) && !/<table/.test(page)],
  ['renders stable canvas helper targets', /data-testid="student-grid-bg"/.test(page) && /data-testid="student-selection-box"/.test(page) && /data-testid="student-guide-line-h"/.test(page) && /data-testid="student-guide-line-v"/.test(page) && /data-testid="student-grid-line-h"/.test(page) && /data-testid="student-grid-line-v"/.test(page) && /data-testid="student-align-line-h"/.test(page) && /data-testid="student-align-line-v"/.test(page) && /data-testid="student-coord-tip"/.test(page)],
  ['nearest grid snapping is implemented', /function\s+snapGrid\(value:\s*number\)\s*\{[\s\S]*?Math\.round\(value\s*\/\s*GRID_SIZE\)\s*\*\s*GRID_SIZE/.test(page)],
  ['alignment snapping is implemented', /function\s+snapAlign\(nx:\s*number,\s*ny:\s*number,\s*others:\s*Student\[\]\)/.test(page) && /horizontalPairs/.test(page) && /verticalPairs/.test(page) && /ALIGN_THRESHOLD/.test(page)],
  ['drag shows position guide lines and coordinate tip from snapped coordinates', /showEl\(guideLineHRef\.value,\s*true\)/.test(page) && /showEl\(guideLineVRef\.value,\s*true\)/.test(page) && /setLineH\(guideLineHRef\.value,\s*mainY\s*\+\s*CARD_HEIGHT\s*\/\s*2\)/.test(page) && /setLineV\(guideLineVRef\.value,\s*mainX\s*\+\s*CARD_WIDTH\s*\/\s*2\)/.test(page) && /coordTipRef\.value\.textContent\s*=\s*`x:\s*\$\{Math\.round\(mainX\)\},\s*y:\s*\$\{Math\.round\(mainY\)\}`/.test(page)],
  ['drag shows current grid lines while moving by grid', /showEl\(gridLineHRef\.value,\s*true\)/.test(page) && /showEl\(gridLineVRef\.value,\s*true\)/.test(page) && /setLineH\(gridLineHRef\.value,\s*mainY\)/.test(page) && /setLineV\(gridLineVRef\.value,\s*mainX\)/.test(page)],
  ['drag keeps align helper lines hidden for grid-only movement', /showEl\(alignLineHRef\.value,\s*false\)/.test(page) && /showEl\(alignLineVRef\.value,\s*false\)/.test(page)],
  ['selection box renders and selects intersecting cards', /showEl\(selBoxRef\.value,\s*true\)/.test(page) && /selBoxRef\.value\.style\.width\s*=\s*`\$\{right\s*-\s*left\}px`/.test(page) && /s\.x\s*\+\s*CARD_WIDTH\s*>\s*left\s*&&\s*s\.x\s*<\s*right\s*&&\s*s\.y\s*\+\s*CARD_HEIGHT\s*>\s*top\s*&&\s*s\.y\s*<\s*bottom/.test(page) && /selectedIds\.value\s*=\s*ids/.test(page)],
  ['helper lines are cleared on mouse up', /showEl\(guideLineHRef\.value,\s*false\)[\s\S]*?showEl\(gridLineHRef\.value,\s*false\)[\s\S]*?showEl\(alignLineHRef\.value,\s*false\)[\s\S]*?showEl\(coordTipRef\.value,\s*false\)/.test(page)],
  ['renders save position button', /保存位置/.test(page)],
  ['renders selected count', /已选中/.test(page) && /selectedIds\.size/.test(page)],
  ['keeps edit control on student cards', /title="编辑"/.test(page) && /@click\.stop="openEditDialog\(student\)"/.test(page)],
  ['does not render delete control on student cards', !/title="删除"/.test(page) && !/@click\.stop="handleDeleteStudent\(student\)"/.test(page)],
  ['dialog component supports custom footer slot', /\$slots\.footer/.test(dialog) && /<slot\s+name="footer"/.test(dialog)],
  ['renders edit dialog custom footer', /<template\s+#footer>/.test(page) && /v-if="isEdit && editingStudent"/.test(page) && /handleDeleteStudent\(editingStudent\)/.test(page)],
  ['places delete action in edit dialog footer', /<template\s+#footer>[\s\S]*?删除学生[\s\S]*?保存[\s\S]*?<\/template>/.test(page)],
  ['keeps add dialog footer actions with custom footer slot', /<div\s+v-else\s+class="flex justify-end gap-2"/.test(page) && /<span v-else>添加<\/span>/.test(page)],
  ['dialog confirm disabled until name exists', /:confirm-disabled="!form\.name\.trim\(\)"/.test(page)],
  ['input component emits enter key', /enter:\s*\[\]/.test(input) && /@keydown\.enter="\$emit\('enter'\)"/.test(input)],
  ['student dialog supports enter submit', /@enter="handleConfirm"/.test(page)],
];

const failed = checks.filter(([, ok]) => !ok);

if (failed.length > 0) {
  console.error('我的学生页面验证失败:');
  for (const [name] of failed) {
    console.error(`- ${name}`);
  }
  process.exit(1);
}

console.log('我的学生页面结构验证通过');
