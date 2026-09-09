import type { RouterScrollBehavior } from 'vue-router'

const scrollBehavior: RouterScrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) return savedPosition
  if (to.hash) return { el: to.hash, top: 96, behavior: 'smooth' }
  if (to.path === from.path) return false
  return { left: 0, top: 0 }
}
export default { scrollBehavior }
