import { defineStore } from 'pinia'
import { progressNodes } from '~/data/progression'

const STORAGE_KEY = 'campfire-wiki:progress:v1'

export function calculateCompletion(completedIds: string[], total = progressNodes.length): number {
  if (!total) return 0
  return Math.round((new Set(completedIds).size / total) * 100)
}

export function findNextIncomplete(completedIds: string[]) {
  return progressNodes.find(node => !completedIds.includes(node.id))
}

export const useProgressStore = defineStore('progress', () => {
  const completed = ref<string[]>([])
  const storageAvailable = ref(true)
  const hydrated = ref(false)

  const completion = computed(() => {
    return calculateCompletion(completed.value)
  })

  const nextNode = computed(() => findNextIncomplete(completed.value))

  function persist() {
    if (!import.meta.client) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed.value))
      storageAvailable.value = true
    } catch {
      storageAvailable.value = false
    }
  }

  function hydrate() {
    if (!import.meta.client || hydrated.value) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const parsed = raw ? JSON.parse(raw) : []
      if (Array.isArray(parsed)) {
        const valid = new Set(progressNodes.map(node => node.id))
        completed.value = parsed.filter(id => typeof id === 'string' && valid.has(id))
      }
    } catch {
      completed.value = []
      storageAvailable.value = false
    } finally {
      hydrated.value = true
    }
  }

  function toggle(id: string) {
    completed.value = completed.value.includes(id)
      ? completed.value.filter(item => item !== id)
      : [...completed.value, id]
    persist()
  }

  function reset() {
    completed.value = []
    persist()
  }

  return {
    completed,
    completion,
    nextNode,
    storageAvailable,
    hydrated,
    hydrate,
    toggle,
    reset
  }
})
