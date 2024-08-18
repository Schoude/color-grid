<script setup lang='ts'>
import { useImages } from '@/composables/images';
import SearchBar from './SearchBar.vue';
import Google from './Google.vue';

const images$ = useImages();
</script>

<template>
  <header class="search">
    <div class="logo">
      <Google />
    </div>
    <SearchBar v-model="images$.query.value" />
    <button type="button" @click="images$.clear">Go Back</button>
  </header>
  <main class="results">
    <div v-for="(img, i) of images$.images.value" class="overlay"
      :style="{ backgroundColor: img.hex, flexBasis: img.flexBasis }" :key="`overlay_${i}`"></div>
  </main>
</template>

<style lang='sass' scoped>
.search
  display: flex
  align-items: center
  block-size: 99px
  margin-inline: 80px
  margin-block-end: 2rem

.logo
  svg
    inline-size: 140px

.search-bar
  margin-inline: 32px

.results
  margin-inline: 20px
  margin-bottom: 50px
  gap: 20px
  display: flex
  flex-wrap: wrap
  justify-content: center

  .overlay
    width: 100%
    height: 190px
    border-radius: 12px
    flex-grow: 1
</style>
