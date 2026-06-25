<script setup lang="ts">
import { U1ThemeEditor, U1ThemeEditorDialog } from 'tool_ui1'
import { ref } from 'vue'

const visible = ref(false)

function open() {
  visible.value = true
}
</script>

<template>
  <Teleport to="body">
    <div class="u1-theme-fab">
      <button
        v-if="!visible"
        class="u1-theme-fab__btn"
        type="button"
        title="打开主题编辑器"
        aria-label="打开主题编辑器"
        @click="open"
      >
        <span class="u1-theme-fab__icon" />
      </button>

      <U1ThemeEditorDialog
        v-model="visible"
        title="主题编辑器"
        width="960px"
        top="8vh"
        draggable
      />
    </div>
  </Teleport>
</template>

<style scoped>
.u1-theme-fab {
  position: fixed;
  right: 24px;
  bottom: 32px;
  z-index: 9999;
}

.u1-theme-fab__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: #409eff;
  box-shadow: 0 4px 16px rgb(64 158 255 / 45%);
  cursor: pointer;
  transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.u1-theme-fab__btn:hover {
  background: #66b1ff;
  box-shadow: 0 6px 20px rgb(64 158 255 / 55%);
  transform: scale(1.06);
}

.u1-theme-fab__btn:active {
  transform: scale(0.96);
}

.u1-theme-fab__icon {
  position: relative;
  display: inline-block;
  width: 22px;
  height: 22px;
}

.u1-theme-fab__icon::before,
.u1-theme-fab__icon::after {
  position: absolute;
  content: '';
}

.u1-theme-fab__icon::before {
  top: 0;
  left: 50%;
  width: 14px;
  height: 14px;
  margin-left: -7px;
  border: 2px solid #fff;
  border-radius: 50%;
}

.u1-theme-fab__icon::after {
  bottom: 0;
  left: 50%;
  width: 2px;
  height: 8px;
  margin-left: -1px;
  background: #fff;
  border-radius: 999px;
}
</style>
