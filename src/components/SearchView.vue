<script setup lang='ts'>
import { ref } from 'vue';
import Google from './Google.vue';
import type { ImageResult } from '@/composables/images';
import { useImages } from '../composables/images';
import SearchBar from './SearchBar.vue';

const images$ = useImages();
const loading = ref(false);

async function search() {
  if (images$.query.value == null || loading.value) {
    return;
  }

  loading.value = true;

  try {
    const results = await makeApiCall(images$.query.value);
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
  <main class="search-view">
    <div class="logo">
      <Google />
    </div>
    <form @submit.prevent="search">
      <SearchBar v-model="images$.query.value" />
      <div class="buttons-container">
        <button class="search" type="submit" :disabled="images$.query.value == null" title="Vibrant Colors">Google
          Search</button>
        <button class="feeling-lucky" type="submit" :disabled="images$.query.value == null" title="Muted Colors">I'm
          Feeling
          Lucky</button>
      </div>
    </form>
  </main>
</template>

<style lang='sass' scoped>
main
  margin-top: 60px

.logo
  margin: 0 auto
  padding: 50px 20px 20px
  max-width: 440px
  cursor: pointer

  @media only screen and (min-width: 300px) and (max-width: 768px)
    padding-top: 0

.search-bar
  margin: 0 auto

.buttons-container
  padding-top: 15px
</style>
