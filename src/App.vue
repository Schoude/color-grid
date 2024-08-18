<script setup lang="ts">
import SearchView from './components/SearchView.vue';
import { useImages } from './composables/images';
const images$ = useImages();

</script>

<template>
  <main>
    <SearchView />

    <div class="content" v-if="images$.images.value.length > 0">
      <div v-for="(img, i) of images$.images.value" class="overlay" :style="{ backgroundColor: img.hex }"
        :key="`overlay_${i}`"></div>
    </div>
  </main>
</template>

<style lang="sass" scoped>
#app
  font-family: "Avenir", Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale

main
  text-align: center
  color: #2c3e50
  margin-top: 60px


.content
  margin-top: 30px
  margin-bottom: 50px
  display: grid
  justify-content: center
  grid-template-columns: repeat(auto-fit, minmax(180px, 250px))
  grid-auto-flow: dense
  grid-gap: 10px

  @media only screen and (min-width: 300px) and (max-width: 768px)
    grid-template-columns: repeat(2, 1fr)

  .overlay
    width: 100%
    height: 190px
</style>
