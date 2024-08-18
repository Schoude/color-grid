import { ref } from 'vue';
import ColorThief from 'colorthief';
const colorThief = new ColorThief();

export interface ImageResult {
  thumbnail: string;
  thumbnail_token: string;
}

const images = ref<{ hex: string }[]>([]);

export function useImages() {

  const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex
  }).join('');

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


  return {
    images,
    colorizeRectElements,
  }
}
