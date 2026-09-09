import { chromium } from '@playwright/test'
import { writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const dir = dirname(fileURLToPath(import.meta.url))
const browser = await chromium.launch({channel:'chrome',headless:true})
const page = await browser.newPage({viewport:{width:375,height:812}})
const base='http://127.0.0.1:4174/jihuang'
const r={}
await page.goto(base+'/wiki',{waitUntil:'networkidle'})
await page.getByRole('button',{name:'料理',exact:true}).click()
await page.locator('.content-card').first().waitFor({state:'visible'})
await page.screenshot({path:join(dir,'screenshots/filter-dishes-before.png')})
await page.locator('.content-card').first().click()
await page.waitForURL('**/wiki/**')
await page.locator('h1').waitFor({state:'visible'})
await page.goBack()
await page.waitForURL('**/wiki')
await page.locator('.content-card').first().waitFor({state:'visible'})
r.filterBack={count:await page.locator('.content-card').count(),active:await page.locator('.filter-button[aria-pressed="true"]').textContent()}
await page.screenshot({path:join(dir,'screenshots/filter-dishes-back.png')})
await page.goto(base+'/search',{waitUntil:'networkidle'})
await page.getByRole('searchbox').fill('怎么复活')
await page.getByRole('heading',{name:'手记里暂时没有这个词'}).waitFor({state:'visible'})
await page.screenshot({path:join(dir,'screenshots/search-revive-empty.png')})
await page.getByRole('searchbox').fill('复活')
await page.locator('.search-result').first().waitFor({state:'visible'})
r.reviveShort={count:await page.locator('.search-result').count(),titles:await page.locator('.search-result h2').allTextContents()}
await page.goto(base+'/wiki/pierogi',{waitUntil:'networkidle'})
r.recipeTop=await page.locator('.dish-panel').evaluate(e=>Math.round(e.getBoundingClientRect().top+scrollY))
await page.goto(base+'/tools/progression-checklist',{waitUntil:'networkidle'})
r.checklist={routes:await page.locator('.route-checklist__head h2').allTextContents(),nodes:await page.locator('.route-checklist li').count()}
await page.setViewportSize({width:320,height:812})
await page.getByRole('button',{name:'重置全部进度',exact:true}).click()
r.reset320=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}))
await page.screenshot({path:join(dir,'screenshots/reset-320.png'),fullPage:true})
await page.goto(base+'/characters',{waitUntil:'networkidle'})
r.characters=await page.locator('.content-card h3').allTextContents()
await page.goto(base+'/bosses',{waitUntil:'networkidle'})
r.bosses=await page.locator('.content-card h3').allTextContents()
await page.goto(base+'/progression/shadow-sanctum',{waitUntil:'networkidle'})
r.articleSources=await page.locator('.prose a[href^="http"]').evaluateAll(es=>es.map(e=>e.href))
await page.locator('.prose h2').last().scrollIntoViewIfNeeded()
await page.screenshot({path:join(dir,'screenshots/article-sources.png')})
await writeFile(join(dir,'followup-results.json'),JSON.stringify(r,null,2))
console.log(JSON.stringify(r,null,2))
await browser.close()
