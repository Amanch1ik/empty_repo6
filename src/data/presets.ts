export interface Preset {
  name: string
  icon: string
  colors: { topColor: string; bottomColor: string; shoeColor: string }
  toggles: { showJacket: boolean; showHair: boolean; showGlasses: boolean }
}

export const PRESETS: Preset[] = [
  {
    name: 'Повседневный', icon: 'shirt',
    colors: { topColor: '#1a1a40', bottomColor: '#111111', shoeColor: '#e0e0e0' },
    toggles: { showJacket: false, showHair: true, showGlasses: false },
  },
  {
    name: 'Спорт', icon: 'dumbbell',
    colors: { topColor: '#8b1a1a', bottomColor: '#111111', shoeColor: '#7a1a1a' },
    toggles: { showJacket: false, showHair: true, showGlasses: false },
  },
  {
    name: 'Деловой', icon: 'briefcase',
    colors: { topColor: '#e8e8e8', bottomColor: '#0a0a0a', shoeColor: '#0a0a0a' },
    toggles: { showJacket: true, showHair: true, showGlasses: true },
  },
  {
    name: 'Уличный', icon: 'flame',
    colors: { topColor: '#1a3a1a', bottomColor: '#1a2a4a', shoeColor: '#e0e0e0' },
    toggles: { showJacket: true, showHair: true, showGlasses: true },
  },
]

export const COLOR_OPTIONS: Record<string, { name: string; value: string }[]> = {
  topColor: [
    { name: 'Тёмно-синий', value: '#1a1a40' },
    { name: 'Бордовый', value: '#8b1a1a' },
    { name: 'Лесной', value: '#1a3a1a' },
    { name: 'Белый', value: '#e8e8e8' },
    { name: 'Чёрный', value: '#111111' },
    { name: 'Бирюзовый', value: '#134e4a' },
  ],
  bottomColor: [
    { name: 'Фиолетовый', value: '#3d1a40' },
    { name: 'Чёрный', value: '#111111' },
    { name: 'Оливковый', value: '#3a3a1a' },
    { name: 'Джинс', value: '#1a2a4a' },
    { name: 'Серый', value: '#333333' },
    { name: 'Тёмно-красный', value: '#4a1a1a' },
  ],
  shoeColor: [
    { name: 'Стандарт', value: '#2a1a3a' },
    { name: 'Белый', value: '#e0e0e0' },
    { name: 'Красный', value: '#7a1a1a' },
    { name: 'Чёрный', value: '#0a0a0a' },
    { name: 'Коричневый', value: '#4a3520' },
    { name: 'Синий', value: '#1a2a5a' },
  ],
}
