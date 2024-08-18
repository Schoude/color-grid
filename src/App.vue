<script setup lang="ts">
import { computed, ref, watch, type ComponentPublicInstance } from 'vue';
import ColorThief from 'colorthief';
import { useIdle } from '@vueuse/core';
import Google from './components/Google.vue';

interface ImageResult {
  thumbnail: string;
  thumbnail_token: string;
}

const images = ref<{ hex: string }[]>([]);
const wall = ref<null | ComponentPublicInstance>(null);
const search$ = ref<null | HTMLInputElement>(null);
const query = ref(null);
const loading = ref(false);

const showForm = ref(true);

const colorThief = new ColorThief();

const { idle } = useIdle(1000, {
  initialState: false,
});

const showClearButton = computed(() => query.value != null && query.value !== '');

watch(idle, (idleValue) => {
  if (idleValue) {
    showForm.value = false;
  } else {
    showForm.value = true;
    search$.value?.focus();
  }
}, {
  immediate: true,
});

const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map(x => {
  const hex = x.toString(16);
  return hex.length === 1 ? '0' + hex : hex
}).join('');

async function search() {
  if (query.value == null || loading.value) {
    return;
  }

  loading.value = true;

  const svgEL = wall.value?.$el as SVGElement;
  // const rects = svgEL.querySelectorAll<SVGRectElement>('rect.canvas');
  // const rectsArr = Array.from(rects);

  // rectsArr.reverse();

  try {
    const results = await makeApiCall(query.value);
    console.log(results);

    colorizeRectElements(results);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

async function makeApiCall(q: string) {
  const res = await fetch(`https://close-starfish-42.deno.dev/?q=${encodeURIComponent(q)}`);

  return await res.json() as ImageResult[];
}

async function colorizeRectElements(imageData: ImageResult[]) {
  imageData.forEach((image, index) => {
    const tempImg = document.createElement('img');
    const paletteIndex = Math.floor(Math.random() * 3);

    const proxyUrl = 'https://corsproxy.io/?';

    tempImg.crossOrigin = 'Anonymous';
    tempImg.src = proxyUrl + encodeURIComponent(image.thumbnail);

    tempImg.onload = () => {
      const rbg = colorThief.getPalette(tempImg)[paletteIndex];
      const hex = rgbToHex(rbg[0], rbg[1], rbg[2]);

      images.value.push({ hex });

      tempImg.remove()
    }
  });
}
</script>

<template>
  <main>
    <div class="logo">
      <Google />
    </div>

    <form @submit.prevent="search">
      <div class="input-wrapper">
        <img src="./assets/lupe.svg" alt="">
        <input type="text" name="" id="" v-model="query">
      </div>
      <div class="buttons-container">
        <button class="search" type="submit" :disabled="query == null" title="Vibrant Colors">Google Search</button>
        <button class="feeling-lucky" type="submit" :disabled="query == null" title="Muted Colors">I'm Feeling
          Lucky</button>
      </div>
    </form>

    <div class="content">
      <div v-for="(img, i) of images" class="overlay" :style="{ backgroundColor: img.hex }" :key="`overlay_${i}`"></div>
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

.logo
  margin: 0 auto
  padding: 50px 20px 20px
  max-width: 440px
  cursor: pointer

  @media only screen and (min-width: 300px) and (max-width: 768px)
    padding-top: 0

.input-wrapper
  background: #fff
  display: flex
  border: 1px solid #dfe1e5
  box-shadow: none
  border-radius: 24px
  z-index: 3
  height: 44px
  margin: 0 auto
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

.buttons-container
  padding-top: 15px
  button,
  a
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

  a
    padding: 11px 16px
    text-decoration: none

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
