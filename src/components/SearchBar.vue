<script setup lang='ts'>
const model = defineModel();
</script>

<template>
  <div class="search-bar">
    <img src="../assets/lupe.svg" alt="">
    <input type="text" v-model="model">
  </div>
</template>

<style lang='sass' scoped>
.search-bar
  background: #fff
  display: flex
  border: 1px solid #dfe1e5
  box-shadow: none
  border-radius: 24px
  z-index: 3
  height: 44px
  width: 534px
  max-width: 100%

  img
    width: 22px
    margin: 0 10px
    cursor: default
    user-select: none

  &:hover,
  &:focus-within
    box-shadow: 0 1px 6px 0 rgba(32,33,36,0.28)
    border-color: rgba(223,225,229,0)
    cursor: text

  input
    background-color: transparent
    border: none
    margin: 0
    padding: 0
    color: rgba(0,0,0,.87)
    word-wrap: break-word
    outline: none
    display: flex
    flex: 100%
    font-size: 16px
</style>
