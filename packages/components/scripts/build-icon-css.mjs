#!/usr/bin/env node
/**
 * 从 src/icon/icons/*.vue 自动生成 src/styles/icons.css
 *
 * 用法: node scripts/build-icon-css.mjs
 *
 * 设计要点:
 * - 抓取 <svg>...</svg> 整段 (含 innerHTML), 丢掉 svg 自身的属性
 * - 重新包装为 <svg xmlns='...' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
 * - 用 encodeURIComponent 一次安全转义 (避免 # 等字符破坏 data URI)
 * - mask-image + background-color: currentColor 让 <div class="icon-menu" /> 自动渲染
 *
 * 重新生成: 修改任何 icons/*.vue 后重跑此脚本即可
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(here, '..')
const iconsDir = path.resolve(projectRoot, 'src/icon/icons')
const outFile = path.resolve(projectRoot, 'src/styles/icons.css')

// 抓 <svg ...>...</svg> 整段, group 1 是 outer html (含 svg 标签), group 2 是 inner html
// 使用 ?s (dotAll) 让 . 匹配换行
const svgRe = /<svg\b([^>]*)>([\s\S]*?)<\/svg>/i
// 抓 svg 上的 viewBox (用于验证, 如果图标不是 24x24 这里要单独处理)
const viewBoxRe = /viewBox\s*=\s*"([^"]+)"/i

const files = (await readdir(iconsDir)).filter((f) => f.endsWith('.vue')).sort()

const blocks = []
let count = 0
const issues = []

for (const f of files) {
  const name = f.replace(/\.vue$/, '')
  const src = await readFile(path.join(iconsDir, f), 'utf8')
  const m = src.match(svgRe)
  if (!m) {
    issues.push(`${name}.vue: no <svg> found`)
    continue
  }
  const svgAttrs = m[1] ?? ''
  const inner = m[2] ?? ''
  const vbMatch = svgAttrs.match(viewBoxRe)
  const viewBox = vbMatch ? vbMatch[1] : '0 0 24 24'

  // 清理 inner: 多余空白行统一, 但保留 svg 元素的属性写法
  const cleanedInner = inner.trim()

  // 包装新 svg: 把所有 stroke/color 转 black (mask-mode 下只看亮度),
  // 把 fill 设 none 保证 stroke-only, 强制 stroke 圆角
  const newSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${viewBox}' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>${cleanedInner}</svg>`

  // encodeURIComponent 一次性转义所有 URL 保留字符 (# < > " ' 等)
  // 把 encodeURIComponent 默认不转的单引号 (在 encodeURIComponent 里 ' 是合法字符) 也保留
  const encoded = encodeURIComponent(newSvg)
  // encodeURIComponent 会把空格编码为 %20, 我们 SVG 里保留了空格, 不用替换
  const dataUri = `url("data:image/svg+xml;utf8,${encoded}")`

  blocks.push(`.icon-${name} {`)
  blocks.push(`  -webkit-mask-image: ${dataUri};`)
  blocks.push(`          mask-image: ${dataUri};`)
  blocks.push(`}`)
  count++
}

const header = `/* 自动生成 - 公共基类是手工维护, 调用方不要再写 width/height. 由 scripts/build-icon-css.mjs 从 src/icon/icons/*.vue 生成. */
/* 重新生成: node scripts/build-icon-css.mjs */
/* 共 ${count} 个图标 class, 通过 mask-image + currentColor 让空 <div class="icon-xxx" /> 自动渲染对应图标. */
/* 基类已自带尺寸: width:1em; height:1em; vertical-align:-.125em. 消费端通过父元素 font-size 覆盖, 无需再写 width/height. */

[class^="icon-"], [class*=" icon-"] {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: -0.125em;
  background-color: currentColor;
  -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
  -webkit-mask-position: center;
          mask-position: center;
  -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
}

`

await writeFile(outFile, header + blocks.join('\n\n') + '\n', 'utf8')

if (issues.length) {
  console.error('issues:')
  for (const i of issues) console.error('  ' + i)
}

console.log(`generated: ${path.relative(projectRoot, outFile)} (${count} icons)`)
