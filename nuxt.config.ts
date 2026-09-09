import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const wikiRoutes = readdirSync(fileURLToPath(new URL('./public/images/wiki/', import.meta.url)))
  .filter(name => name.endsWith('.png')).map(name => `/wiki/${name.slice(0, -4)}`)
const isProduction = process.env.NODE_ENV === 'production'
const baseURL = process.env.NUXT_APP_BASE_URL || (isProduction ? '/jihuang/' : '/')

export default defineNuxtConfig({
  srcDir: 'app/',
  runtimeConfig: { public: { siteOrigin: 'https://fshfish88-lab.github.io' } },
  dir: {
    public: '../public'
  },
  modules: ['@nuxt/content', '@pinia/nuxt'],
  content: {
    experimental: {
      sqliteConnector: 'native'
    }
  },
  css: [
    '~/assets/styles/tokens.css',
    '~/assets/styles/base.css',
    '~/assets/styles/components.css'
  ],
  devtools: { enabled: false },
  compatibilityDate: '2025-07-15',
  app: {
    baseURL,
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      titleTemplate: '%s｜火堆边百科',
      meta: [
        { name: 'theme-color', content: '#171714' },
        {
          name: 'description',
          content: '面向《饥荒联机版》新手的非官方生存攻略、角色指南、Boss 打法与世界主线手册。'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: `${baseURL}favicon.svg` }
      ]
    }
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', ...wikiRoutes],
      concurrency: 1,
      failOnError: true
    }
  },
  typescript: {
    strict: true,
    typeCheck: false
  },
  vite: {
    build: {
      cssMinify: 'lightningcss'
    }
  }
})
