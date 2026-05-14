/**
 * Setup global pour Vitest.
 *
 * - Mock localStorage entre chaque test (les stores Zustand persistent dedans).
 * - Mock import.meta.env pour les modules qui le lisent au top-level.
 */
import { afterEach, vi } from 'vitest'

// ── localStorage stub ──
class LocalStorageMock {
  constructor() { this.store = {} }
  clear()                         { this.store = {} }
  getItem(key)                    { return this.store[key] ?? null }
  setItem(key, value)             { this.store[key] = String(value) }
  removeItem(key)                 { delete this.store[key] }
  key(i)                          { return Object.keys(this.store)[i] ?? null }
  get length()                    { return Object.keys(this.store).length }
}
globalThis.localStorage = new LocalStorageMock()

// ── speechSynthesis stub minimal ──
globalThis.speechSynthesis = {
  speak:   vi.fn(),
  cancel:  vi.fn(),
  pause:   vi.fn(),
  resume:  vi.fn(),
  getVoices: () => [],
  addEventListener: vi.fn(),
}
globalThis.SpeechSynthesisUtterance = class {
  constructor(text) { this.text = text }
}

// Reset après chaque test
afterEach(() => {
  globalThis.localStorage.clear()
})
