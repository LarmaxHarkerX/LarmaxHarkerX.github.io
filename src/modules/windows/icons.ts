export type Win3xIconColor =
  | 'black'
  | 'white'
  | 'gray'
  | 'lightGray'
  | 'darkGray'
  | 'navy'
  | 'red'
  | 'green'
  | 'blue'
  | 'yellow'

export interface Win3xIconRect {
  x: number
  y: number
  width: number
  height: number
  color: Win3xIconColor
}

export interface Win3xIconDefinition {
  viewBox: string
  rects: readonly Win3xIconRect[]
}

const r = (
  x: number,
  y: number,
  width: number,
  height: number,
  color: Win3xIconColor,
): Win3xIconRect => ({ x, y, width, height, color })

export const win3xIcons = {
  windowsLogo: {
    viewBox: '0 0 16 16',
    rects: [
      r(0, 4, 3, 1, 'darkGray'),
      r(0, 7, 3, 1, 'darkGray'),
      r(1, 10, 2, 1, 'darkGray'),
      r(3, 2, 5, 5, 'red'),
      r(9, 1, 4, 5, 'green'),
      r(3, 9, 5, 5, 'blue'),
      r(9, 8, 4, 5, 'yellow'),
      r(8, 2, 1, 11, 'black'),
      r(3, 7, 10, 1, 'black'),
      r(2, 1, 1, 13, 'black'),
      r(13, 1, 1, 12, 'black'),
      r(3, 1, 10, 1, 'black'),
      r(3, 13, 10, 1, 'black'),
    ],
  },
  programManager: {
    viewBox: '0 0 16 16',
    rects: [
      r(1, 1, 14, 14, 'black'),
      r(2, 2, 12, 12, 'gray'),
      r(2, 2, 12, 2, 'navy'),
      r(3, 5, 4, 4, 'white'),
      r(8, 5, 4, 4, 'yellow'),
      r(3, 10, 4, 3, 'green'),
      r(8, 10, 4, 3, 'blue'),
      r(4, 6, 2, 2, 'navy'),
      r(9, 6, 2, 2, 'red'),
      r(4, 11, 2, 1, 'red'),
      r(9, 11, 2, 1, 'white'),
      r(3, 5, 1, 8, 'lightGray'),
      r(3, 5, 9, 1, 'lightGray'),
    ],
  },
  fileManager: {
    viewBox: '0 0 16 16',
    rects: [
      r(1, 4, 5, 2, 'yellow'),
      r(1, 6, 14, 8, 'black'),
      r(2, 7, 12, 6, 'yellow'),
      r(2, 6, 12, 1, 'lightGray'),
      r(3, 8, 4, 4, 'white'),
      r(8, 8, 4, 4, 'white'),
      r(4, 9, 2, 2, 'navy'),
      r(9, 9, 2, 2, 'red'),
      r(1, 5, 1, 8, 'black'),
      r(14, 6, 1, 7, 'darkGray'),
      r(6, 4, 5, 2, 'black'),
      r(7, 5, 3, 1, 'gray'),
    ],
  },
  notepad: {
    viewBox: '0 0 16 16',
    rects: [
      r(2, 1, 10, 1, 'black'),
      r(1, 2, 1, 12, 'black'),
      r(12, 2, 1, 12, 'black'),
      r(2, 14, 10, 1, 'black'),
      r(2, 2, 10, 2, 'navy'),
      r(2, 4, 10, 10, 'white'),
      r(3, 5, 1, 8, 'red'),
      r(5, 6, 6, 1, 'blue'),
      r(5, 8, 6, 1, 'blue'),
      r(5, 10, 6, 1, 'blue'),
      r(5, 12, 4, 1, 'blue'),
      r(3, 2, 1, 2, 'lightGray'),
      r(5, 2, 1, 2, 'lightGray'),
      r(7, 2, 1, 2, 'lightGray'),
      r(9, 2, 1, 2, 'lightGray'),
    ],
  },
  cardfile: {
    viewBox: '0 0 16 16',
    rects: [
      r(1, 5, 14, 9, 'black'),
      r(2, 6, 12, 7, 'gray'),
      r(3, 2, 3, 4, 'white'),
      r(7, 3, 3, 3, 'white'),
      r(11, 4, 2, 2, 'white'),
      r(3, 3, 2, 2, 'red'),
      r(7, 4, 2, 1, 'green'),
      r(3, 8, 10, 1, 'white'),
      r(3, 10, 8, 1, 'white'),
      r(2, 6, 12, 1, 'lightGray'),
      r(2, 6, 1, 7, 'lightGray'),
      r(13, 6, 1, 7, 'darkGray'),
    ],
  },
  computer: {
    viewBox: '0 0 16 16',
    rects: [
      r(1, 2, 12, 9, 'black'),
      r(2, 3, 10, 7, 'gray'),
      r(3, 4, 8, 5, 'navy'),
      r(4, 5, 6, 3, 'blue'),
      r(5, 11, 4, 2, 'black'),
      r(4, 13, 6, 1, 'darkGray'),
      r(11, 12, 3, 2, 'gray'),
      r(12, 11, 2, 1, 'lightGray'),
      r(2, 3, 1, 7, 'lightGray'),
      r(2, 3, 10, 1, 'lightGray'),
    ],
  },
  folder: {
    viewBox: '0 0 16 16',
    rects: [
      r(1, 4, 5, 2, 'yellow'),
      r(1, 6, 14, 8, 'black'),
      r(2, 7, 12, 6, 'yellow'),
      r(2, 6, 12, 1, 'lightGray'),
      r(3, 8, 10, 4, 'yellow'),
      r(1, 5, 1, 8, 'black'),
      r(14, 6, 1, 7, 'darkGray'),
      r(6, 4, 4, 2, 'black'),
      r(7, 5, 2, 1, 'gray'),
    ],
  },
  document: {
    viewBox: '0 0 16 16',
    rects: [
      r(3, 1, 8, 1, 'black'),
      r(2, 2, 1, 12, 'black'),
      r(11, 2, 1, 12, 'black'),
      r(3, 14, 8, 1, 'black'),
      r(3, 2, 8, 12, 'white'),
      r(9, 2, 2, 2, 'lightGray'),
      r(4, 5, 5, 1, 'darkGray'),
      r(4, 7, 5, 1, 'darkGray'),
      r(4, 9, 5, 1, 'darkGray'),
      r(4, 11, 3, 1, 'darkGray'),
    ],
  },
  shutdown: {
    viewBox: '0 0 16 16',
    rects: [
      r(2, 2, 10, 8, 'black'),
      r(3, 3, 8, 6, 'gray'),
      r(4, 4, 6, 4, 'navy'),
      r(6, 10, 2, 2, 'black'),
      r(5, 12, 4, 1, 'darkGray'),
      r(11, 5, 3, 6, 'red'),
      r(12, 6, 1, 4, 'yellow'),
      r(3, 3, 1, 6, 'lightGray'),
      r(3, 3, 8, 1, 'lightGray'),
    ],
  },
  back: {
    viewBox: '0 0 16 16',
    rects: [
      r(2, 7, 10, 2, 'navy'),
      r(2, 7, 2, 2, 'black'),
      r(4, 5, 2, 2, 'navy'),
      r(4, 9, 2, 2, 'navy'),
      r(6, 3, 2, 2, 'navy'),
      r(6, 11, 2, 2, 'navy'),
    ],
  },
  forward: {
    viewBox: '0 0 16 16',
    rects: [
      r(4, 7, 10, 2, 'navy'),
      r(12, 7, 2, 2, 'black'),
      r(10, 5, 2, 2, 'navy'),
      r(10, 9, 2, 2, 'navy'),
      r(8, 3, 2, 2, 'navy'),
      r(8, 11, 2, 2, 'navy'),
    ],
  },
  copy: {
    viewBox: '0 0 16 16',
    rects: [
      r(4, 1, 6, 2, 'black'),
      r(5, 2, 4, 1, 'lightGray'),
      r(3, 3, 8, 11, 'black'),
      r(4, 4, 6, 9, 'white'),
      r(5, 6, 4, 1, 'darkGray'),
      r(5, 8, 4, 1, 'darkGray'),
      r(1, 5, 6, 8, 'darkGray'),
      r(2, 6, 4, 6, 'gray'),
    ],
  },
  archive: {
    viewBox: '0 0 16 16',
    rects: [
      r(2, 2, 12, 12, 'black'),
      r(3, 3, 10, 10, 'gray'),
      r(3, 5, 10, 1, 'lightGray'),
      r(4, 7, 8, 1, 'darkGray'),
      r(4, 9, 8, 1, 'darkGray'),
      r(4, 11, 4, 1, 'darkGray'),
      r(6, 3, 4, 2, 'yellow'),
      r(7, 4, 2, 1, 'red'),
    ],
  },
  save: {
    viewBox: '0 0 16 16',
    rects: [
      r(2, 2, 12, 12, 'black'),
      r(3, 3, 10, 10, 'gray'),
      r(4, 4, 6, 3, 'navy'),
      r(10, 4, 2, 4, 'white'),
      r(5, 9, 6, 3, 'white'),
      r(6, 10, 4, 1, 'darkGray'),
      r(3, 3, 1, 10, 'lightGray'),
      r(3, 3, 9, 1, 'lightGray'),
    ],
  },
  cut: {
    viewBox: '0 0 16 16',
    rects: [
      r(3, 3, 2, 2, 'red'),
      r(11, 3, 2, 2, 'red'),
      r(5, 5, 2, 2, 'black'),
      r(9, 5, 2, 2, 'black'),
      r(7, 7, 2, 2, 'black'),
      r(5, 9, 2, 2, 'black'),
      r(9, 9, 2, 2, 'black'),
      r(3, 11, 2, 2, 'red'),
      r(11, 11, 2, 2, 'red'),
    ],
  },
  pin: {
    viewBox: '0 0 16 16',
    rects: [
      r(5, 2, 6, 2, 'navy'),
      r(6, 4, 4, 3, 'gray'),
      r(7, 7, 2, 4, 'black'),
      r(6, 11, 1, 3, 'black'),
      r(9, 11, 1, 3, 'black'),
    ],
  },
  search: {
    viewBox: '0 0 16 16',
    rects: [
      r(3, 3, 6, 1, 'black'),
      r(2, 4, 1, 4, 'black'),
      r(9, 4, 1, 4, 'black'),
      r(3, 8, 6, 1, 'black'),
      r(4, 4, 4, 4, 'white'),
      r(9, 9, 2, 2, 'black'),
      r(11, 11, 2, 2, 'black'),
    ],
  },
  link: {
    viewBox: '0 0 16 16',
    rects: [
      r(3, 5, 4, 2, 'navy'),
      r(5, 3, 2, 2, 'navy'),
      r(7, 7, 2, 2, 'black'),
      r(6, 6, 4, 4, 'lightGray'),
      r(9, 9, 4, 2, 'navy'),
      r(9, 11, 2, 2, 'navy'),
    ],
  },
  up: {
    viewBox: '0 0 16 16',
    rects: [
      r(7, 3, 2, 10, 'navy'),
      r(5, 5, 2, 2, 'navy'),
      r(9, 5, 2, 2, 'navy'),
      r(3, 7, 2, 2, 'navy'),
      r(11, 7, 2, 2, 'navy'),
    ],
  },
  down: {
    viewBox: '0 0 16 16',
    rects: [
      r(7, 3, 2, 10, 'navy'),
      r(3, 7, 2, 2, 'navy'),
      r(11, 7, 2, 2, 'navy'),
      r(5, 9, 2, 2, 'navy'),
      r(9, 9, 2, 2, 'navy'),
    ],
  },
  minimize: {
    viewBox: '0 0 16 16',
    rects: [r(3, 10, 10, 2, 'black')],
  },
  maximize: {
    viewBox: '0 0 16 16',
    rects: [
      r(3, 3, 10, 2, 'black'),
      r(3, 5, 2, 8, 'black'),
      r(11, 5, 2, 8, 'black'),
      r(5, 11, 6, 2, 'black'),
      r(5, 5, 6, 6, 'white'),
    ],
  },
  close: {
    viewBox: '0 0 16 16',
    rects: [
      r(3, 4, 2, 2, 'black'),
      r(5, 6, 2, 2, 'black'),
      r(7, 8, 2, 2, 'black'),
      r(9, 10, 2, 2, 'black'),
      r(9, 4, 2, 2, 'black'),
      r(7, 6, 2, 2, 'black'),
      r(5, 8, 2, 2, 'black'),
      r(3, 10, 2, 2, 'black'),
    ],
  },
} satisfies Record<string, Win3xIconDefinition>

export type Win3xIconKey = keyof typeof win3xIcons
