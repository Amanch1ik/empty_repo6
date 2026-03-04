export interface ClothingItem {
  id: string
  name: string
  category: 'top' | 'bottom' | 'shoes' | 'accessory'
  colorKey: string
  color: string
  price: number
  currency: string
  marketplaceUrl: string
  marketplace: string
  emoji: string
}

export const CLOTHING_CATALOG: ClothingItem[] = [
  // === TOPS ===
  { id: 't1', name: 'Базовая футболка', category: 'top', colorKey: 'topColor', color: '#1a1a40', price: 1290, currency: '₽', marketplaceUrl: 'https://www.wildberries.ru/catalog/0/search.aspx?search=футболка+базовая', marketplace: 'Wildberries', emoji: '👕' },
  { id: 't2', name: 'Худи оверсайз', category: 'top', colorKey: 'topColor', color: '#3d1a40', price: 2990, currency: '₽', marketplaceUrl: 'https://www.wildberries.ru/catalog/0/search.aspx?search=худи+оверсайз', marketplace: 'Wildberries', emoji: '🧥' },
  { id: 't3', name: 'Свитер вязаный', category: 'top', colorKey: 'topColor', color: '#8b1a1a', price: 2490, currency: '₽', marketplaceUrl: 'https://www.ozon.ru/search/?text=свитер+вязаный', marketplace: 'Ozon', emoji: '🧶' },
  { id: 't4', name: 'Рубашка классика', category: 'top', colorKey: 'topColor', color: '#e8e8e8', price: 1990, currency: '₽', marketplaceUrl: 'https://www.wildberries.ru/catalog/0/search.aspx?search=рубашка+классическая', marketplace: 'Wildberries', emoji: '👔' },
  { id: 't5', name: 'Куртка кожаная', category: 'top', colorKey: 'topColor', color: '#111111', price: 7990, currency: '₽', marketplaceUrl: 'https://www.ozon.ru/search/?text=куртка+кожаная', marketplace: 'Ozon', emoji: '🧥' },
  { id: 't6', name: 'Бомбер', category: 'top', colorKey: 'topColor', color: '#1a3a1a', price: 4590, currency: '₽', marketplaceUrl: 'https://www.wildberries.ru/catalog/0/search.aspx?search=бомбер', marketplace: 'Wildberries', emoji: '🧥' },
  { id: 't7', name: 'Кроп-топ', category: 'top', colorKey: 'topColor', color: '#ff69b4', price: 890, currency: '₽', marketplaceUrl: 'https://www.wildberries.ru/catalog/0/search.aspx?search=кроп+топ', marketplace: 'Wildberries', emoji: '👚' },

  // === BOTTOMS ===
  { id: 'b1', name: 'Джинсы прямые', category: 'bottom', colorKey: 'bottomColor', color: '#1a2a4a', price: 2990, currency: '₽', marketplaceUrl: 'https://www.wildberries.ru/catalog/0/search.aspx?search=джинсы+прямые', marketplace: 'Wildberries', emoji: '👖' },
  { id: 'b2', name: 'Карго штаны', category: 'bottom', colorKey: 'bottomColor', color: '#3a3a1a', price: 3490, currency: '₽', marketplaceUrl: 'https://www.ozon.ru/search/?text=карго+штаны', marketplace: 'Ozon', emoji: '👖' },
  { id: 'b3', name: 'Чиносы', category: 'bottom', colorKey: 'bottomColor', color: '#333333', price: 2290, currency: '₽', marketplaceUrl: 'https://www.wildberries.ru/catalog/0/search.aspx?search=чиносы', marketplace: 'Wildberries', emoji: '👖' },
  { id: 'b4', name: 'Спортивные штаны', category: 'bottom', colorKey: 'bottomColor', color: '#111111', price: 1790, currency: '₽', marketplaceUrl: 'https://www.wildberries.ru/catalog/0/search.aspx?search=спортивные+штаны', marketplace: 'Wildberries', emoji: '🩳' },
  { id: 'b5', name: 'Юбка мини', category: 'bottom', colorKey: 'bottomColor', color: '#3d1a40', price: 1590, currency: '₽', marketplaceUrl: 'https://www.ozon.ru/search/?text=юбка+мини', marketplace: 'Ozon', emoji: '👗' },
  { id: 'b6', name: 'Леггинсы', category: 'bottom', colorKey: 'bottomColor', color: '#0a0a0a', price: 1290, currency: '₽', marketplaceUrl: 'https://www.wildberries.ru/catalog/0/search.aspx?search=леггинсы', marketplace: 'Wildberries', emoji: '🩲' },
  { id: 'b7', name: 'Широкие брюки', category: 'bottom', colorKey: 'bottomColor', color: '#4a3520', price: 2790, currency: '₽', marketplaceUrl: 'https://www.wildberries.ru/catalog/0/search.aspx?search=широкие+брюки', marketplace: 'Wildberries', emoji: '👖' },

  // === SHOES ===
  { id: 's1', name: 'Кроссовки', category: 'shoes', colorKey: 'shoeColor', color: '#e0e0e0', price: 4990, currency: '₽', marketplaceUrl: 'https://www.wildberries.ru/catalog/0/search.aspx?search=кроссовки', marketplace: 'Wildberries', emoji: '👟' },
  { id: 's2', name: 'Ботинки Chelsea', category: 'shoes', colorKey: 'shoeColor', color: '#0a0a0a', price: 5990, currency: '₽', marketplaceUrl: 'https://www.ozon.ru/search/?text=ботинки+челси', marketplace: 'Ozon', emoji: '🥾' },
  { id: 's3', name: 'Кеды высокие', category: 'shoes', colorKey: 'shoeColor', color: '#7a1a1a', price: 3490, currency: '₽', marketplaceUrl: 'https://www.wildberries.ru/catalog/0/search.aspx?search=кеды+высокие', marketplace: 'Wildberries', emoji: '👟' },
  { id: 's4', name: 'Лоферы', category: 'shoes', colorKey: 'shoeColor', color: '#4a3520', price: 4290, currency: '₽', marketplaceUrl: 'https://www.ozon.ru/search/?text=лоферы', marketplace: 'Ozon', emoji: '👞' },
  { id: 's5', name: 'Сандалии', category: 'shoes', colorKey: 'shoeColor', color: '#2a1a3a', price: 1990, currency: '₽', marketplaceUrl: 'https://www.wildberries.ru/catalog/0/search.aspx?search=сандалии', marketplace: 'Wildberries', emoji: '🩴' },
  { id: 's6', name: 'Платформы', category: 'shoes', colorKey: 'shoeColor', color: '#1a2a5a', price: 3990, currency: '₽', marketplaceUrl: 'https://www.wildberries.ru/catalog/0/search.aspx?search=обувь+на+платформе', marketplace: 'Wildberries', emoji: '👠' },

  // === ACCESSORIES ===
  { id: 'a1', name: 'Солнечные очки', category: 'accessory', colorKey: 'showGlasses', color: '', price: 990, currency: '₽', marketplaceUrl: 'https://www.wildberries.ru/catalog/0/search.aspx?search=солнечные+очки', marketplace: 'Wildberries', emoji: '🕶️' },
  { id: 'a2', name: 'Бейсболка', category: 'accessory', colorKey: 'showHair', color: '', price: 790, currency: '₽', marketplaceUrl: 'https://www.ozon.ru/search/?text=бейсболка', marketplace: 'Ozon', emoji: '🧢' },
  { id: 'a3', name: 'Куртка-оверлей', category: 'accessory', colorKey: 'showJacket', color: '', price: 5990, currency: '₽', marketplaceUrl: 'https://www.wildberries.ru/catalog/0/search.aspx?search=куртка', marketplace: 'Wildberries', emoji: '🧥' },
]

export const CATEGORIES = [
  { key: 'top', label: 'Верх', emoji: '👕' },
  { key: 'bottom', label: 'Низ', emoji: '👖' },
  { key: 'shoes', label: 'Обувь', emoji: '👟' },
  { key: 'accessory', label: 'Аксессуары', emoji: '✨' },
] as const

export function getItemsByCategory(category: string): ClothingItem[] {
  return CLOTHING_CATALOG.filter(item => item.category === category)
}

export function getItemById(id: string): ClothingItem | undefined {
  return CLOTHING_CATALOG.find(item => item.id === id)
}
