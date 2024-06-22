<script setup lang="ts">
import { getCurrentInstance, ref } from 'vue';
import Google from "./components/Google.vue";
import ColorThief from 'colorthief';
const v$ = getCurrentInstance();
const query = ref(null);
const startIndex = ref(0);
const images = ref<{thumbnailLink: string; link: string;}[]>([]);

const apiKey = import.meta.env.VITE_API_KEY;
const seId = import.meta.env.VITE_SE_ID;
const colorThief = new ColorThief();

const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map(x => {
  const hex = x.toString(16);
  return hex.length === 1 ? '0' + hex : hex
}).join('');

async function search() {
  await makeApiCall();
  const currentRefs = v$!.refs as Record<string, HTMLElement[]>;
  colorizeImageElements(currentRefs);
}

async function makeApiCall() {
  startIndex.value = 0;
  images.value = [];
  const apiCallCountMax = 4;

  for (let i = 0; i < apiCallCountMax; i++) {
    const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${seId}&q=${query.value}&searchType=image&start=${startIndex.value}`);

    const data = await response.json();
    startIndex.value = data.queries.nextPage[0].startIndex;

    data.items.forEach((imgItem: {
        image: {
          thumbnailLink: string;
        };
        link: string;
      }) => {
      images.value.push({link: imgItem.link, thumbnailLink: imgItem.image.thumbnailLink});
    });
  }
}

async function colorizeImageElements(refs: Record<string, HTMLElement[]>) {
  const imgKeys = Object.keys(refs);
  const paletteIndex = Math.floor(Math.random() * 3);

  for (const imgKey of imgKeys) {
    const theImage = document.querySelector(`.${imgKey}`) as HTMLImageElement;
    const overlay = theImage.nextElementSibling as HTMLElement;
    const imageUrl = theImage.src;
    const googleProxyURL = 'https://corsproxy.io/?';

    theImage.crossOrigin = 'Anonymous';
    theImage.src = googleProxyURL + encodeURIComponent(imageUrl);

    if (theImage.complete) {
      const rbg = colorThief.getPalette(theImage)[paletteIndex];
      const hex = rgbToHex(rbg[0], rbg[1], rbg[2]);
      overlay.style.backgroundColor = hex;
    } else {
      theImage.addEventListener('load', function() {
        const rbg = colorThief.getPalette(theImage)[paletteIndex];
        const hex = rgbToHex(rbg[0], rbg[1], rbg[2]);
        overlay.style.backgroundColor = hex;
      });
    }
  }
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
        <button class="feeling-lucky" type="submit" :disabled="query == null" title="Muted Colors">I'm Feeling Lucky</button>
      </div>
    </form>

    <div class="content">
      <div class="wrapper" v-for="(img, i) of images">
        <img :ref="`image-${i}`" :src="img.thumbnailLink" alt="" class="cors-image" :class="`image-${i}`">
        <div class="overlay" :key="`overlay_${i}`"></div>
      </div>
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

  .wrapper
    display: inline-block
    position: relative
    margin: auto
    max-width: 350px
    max-height: 190px

    img
      width: inherit
      max-width: inherit
      max-height: inherit
      opacity: 0
      transition: all 0.3s ease

    .overlay
      position: absolute
      top: 0
      bottom: 0
      left: 0
      right: 0
      transition: all .3s ease
      cursor: pointer
      &:hover,
      &:hover ~ img
        opacity: 0.2
      &:hover
        box-shadow: 0 0 12px 2px rgba(black, .5)
        transform: scale(1.05)
</style>
