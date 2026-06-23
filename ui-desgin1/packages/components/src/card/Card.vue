<template>
  <section class="u1-card" :class="`u1-card--shadow-${shadow}`">
    <header v-if="$slots.header" class="u1-card__header">
      <slot name="header" />
    </header>
    <div class="u1-card__body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="u1-card__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<script setup lang="ts">
defineOptions({
  name: 'U1Card'
})

withDefaults(
  defineProps<{
    shadow?: 'always' | 'hover' | 'never'
  }>(),
  {
    shadow: 'always'
  }
)
</script>
