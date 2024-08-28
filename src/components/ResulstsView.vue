<script setup lang='ts'>
import { useImages } from '@/composables/images';
import SearchBar from './SearchBar.vue';
import Google from './Google.vue';

const images$ = useImages();
</script>

<template>
  <div class="results-view">
    <header class="search">
      <div class="logo" @click="images$.clear()">
        <Google />
      </div>
      <SearchBar v-model="images$.query.value" />
    </header>
    <main class="results">
      <div v-for="(img, i) of images$.images.value" class="overlay"
        :style="{ backgroundColor: img.hex, width: img.width, height: img.height }" :key="`overlay_${i}`"></div>
    </main>
  </div>
</template>

<style lang='sass' scoped>
.results-view
  container-type: inline-size
  @container (inline-size >= 600px)
    .search
      flex-direction: row
      margin-block-start: 0

    .logo
      margin-block-end: 0

.search
  display: flex
  align-items: center
  block-size: 99px
  margin-inline: 1rem
  margin-block-end: 2rem

  flex-direction: column
  margin-block-start: 1rem

.logo
  cursor: pointer
  margin-block-end: .5rem

  svg
    inline-size: 200px

.search-bar
  margin-inline: 1.5rem
  width: min(600px, 100%)

.results
  margin-inline: 1rem
  margin-bottom: 50px
  gap: 1rem
  display: flex
  flex-wrap: wrap
  justify-content: center

  .overlay
    align-self: center
    flex-grow: 1
</style>
