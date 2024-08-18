<script setup lang='ts'>
import { ref } from 'vue';
import Google from './Google.vue';
import type { ImageResult } from '@/composables/images';
import { useImages } from '../composables/images';

const images$ = useImages();

const query = ref(null);
const loading = ref(false);

async function search() {
  if (query.value == null || loading.value) {
    return;
  }

  loading.value = true;

  try {
    const results = await makeApiCall(query.value);
    console.log(results);

    images$.colorizeRectElements(results);
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
</script>

<template>
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
</template>

<style lang='sass' scoped>
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

</style>
