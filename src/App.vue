<script setup lang="ts">
import ResulstsView from './components/ResulstsView.vue';
import SearchView from './components/SearchView.vue';
import { useImages } from './composables/images';
const images$ = useImages();

</script>

<template>
  <main>
    <Transition mode="out-in">
      <SearchView v-if="images$.images.value.length === 0" />
      <ResulstsView v-else />
    </Transition>
  </main>
</template>

<style lang="sass">
body
  margin: 0

#app
  font-family: "Avenir", Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50

button
  background-image: -webkit-linear-gradient(top,#f5f5f5,#f1f1f1)
  background-color: #f2f2f2
  border: 1px solid #f2f2f2
  border-radius: 4px
  color: #5F6368
  font-family: arial,sans-serif
  font-size: 14px
  margin: 11px 4px
  padding: 0 16px
  line-height: 27px
  height: 36px
  min-width: 54px
  text-align: center
  cursor: pointer
  user-select: none

  &:hover
    box-shadow: 0 1px 1px rgba(0,0,0,0.1)
    background-image: -webkit-linear-gradient(top,#f8f8f8,#f1f1f1)
    background-color: #f8f8f8
    border: 1px solid #c6c6c6
    color: #222

.v-enter-active,
.v-leave-active
  transition: opacity 0.5s ease

.v-enter-from,
.v-leave-to
  opacity: 0
</style>
