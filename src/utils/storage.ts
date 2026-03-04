const CONFIG_KEY = 'vogueverse-config'
const LOOKS_KEY = 'vogueverse-looks'

export interface Config {
  colors: Record<string, string>
  toggles: Record<string, boolean>
  selectedCharacter?: string
}

export interface SavedLook {
  id: string
  name: string
  timestamp: number
  colors: Record<string, string>
  toggles: Record<string, boolean>
  selectedItems: string[]
  screenshot?: string
}

export function saveConfig(cfg: Config) {
  try { localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg)) } catch {}
}

export function loadConfig(): Config | null {
  try {
    const raw = localStorage.getItem(CONFIG_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function saveLook(look: SavedLook) {
  try {
    const looks = loadLooks()
    looks.push(look)
    localStorage.setItem(LOOKS_KEY, JSON.stringify(looks))
  } catch {}
}

export function loadLooks(): SavedLook[] {
  try {
    const raw = localStorage.getItem(LOOKS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function deleteLook(id: string) {
  try {
    const looks = loadLooks().filter(l => l.id !== id)
    localStorage.setItem(LOOKS_KEY, JSON.stringify(looks))
  } catch {}
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}
