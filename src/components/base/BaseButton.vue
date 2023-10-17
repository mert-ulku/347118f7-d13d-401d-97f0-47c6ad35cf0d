<template>
  <Button :type="type" :size="size" :htmlType="htmlType">
    <slot />
  </Button>
</template>

<script setup>
import { Button } from 'ant-design-vue'

defineProps({
  size: {
    type: String,
    default: 'middle',
    validator: (val) => ['small', 'middle', 'large'].includes(val)
  },
  type: {
    type: String,
    default: 'primary',
    validator: (val) => ['primary', 'ghost', 'dashed', 'link', 'text', 'default'].includes(val)
  },
  htmlType: {
    type: String,
    default: 'button'
  }
})
</script>
