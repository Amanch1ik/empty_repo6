const KEY = 'wardrobe-config'

interface Config {
  colors: Record<string, string>
  toggles: Record<string, boolean>
}

export function saveConfig(cfg: Config) {
  try { localStorage.setItem(KEY, JSON.stringify(cfg)) } catch {}
}

export function loadConfig(): Config | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}
