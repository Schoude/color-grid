type RBG = [red: number, green: number, blue: number];
type Pallete = [RBG, RBG, RBG];

declare module 'colorthief' {
  class ColorThief {
    getColor(image: HTMLImageElement): RBG;
    getPalette(image: HTMLImageElement): Pallete;
  }

  export = ColorThief;
}
