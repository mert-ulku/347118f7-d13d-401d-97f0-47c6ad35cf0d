<template>
  <div class="wrapper">
    <ProductList />
  </div>
</template>

<script setup>
import ProductList from './views/ProductList.vue'
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

html,
body,
#app {
  height: 100vh;
}

.wrapper {
  height: 100%;
  padding: 0 30px;
  display: grid;
  place-items: center;
}

.ant-table-wrapper {
  width: 100%;
}
</style>
