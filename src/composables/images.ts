import { ref } from 'vue';
import ColorThief from 'colorthief';
const colorThief = new ColorThief();

export interface ImageResult {
  thumbnail: string;
  thumbnail_token: string;
}

const query = ref<string | null>(null);
const images = ref<{ hex: string, width: string; height: string }[]>([]);

export function useImages() {
  const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex
  }).join('');

  function getRandomWidth() {
    const isPhone = window.innerWidth < 768;

    let maxValue = 310;
    let minValue = 145;

    if (isPhone) {
      maxValue = 125;
      minValue = 75;
    }

    const randomFraction = Math.random();
    const randomValue = minValue + randomFraction * (maxValue - minValue);

    return `${Math.floor(randomValue)}px`;
  }

  async function colorizeRectElements(imageData: ImageResult[]) {
    imageData.forEach(image => {
      const tempImg = document.createElement('img');
      const paletteIndex = Math.floor(Math.random() * 3);

      const proxyUrl = 'https://corsproxy.io/?';

      tempImg.crossOrigin = 'Anonymous';
      tempImg.src = proxyUrl + encodeURIComponent(image.thumbnail);

      tempImg.onload = () => {
        const rbg = colorThief.getPalette(tempImg)[paletteIndex];
        const hex = rgbToHex(rbg[0], rbg[1], rbg[2]);

        images.value.push({ hex, width: getRandomWidth(), height: getRandomWidth() });

        tempImg.remove()
      }
    });
  }

  function clear() {
    images.value = [];
    query.value = '';
  }

  return {
    query,
    images,
    colorizeRectElements,
    clear,
  }
}
