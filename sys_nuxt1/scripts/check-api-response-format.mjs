import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

const rootDir = process.cwd()
const apiDir = join(rootDir, 'server/api')
const responseWrapper = 'defineApiEventHandler'
const rawEventHandlerPattern = /export\s+default\s+defineEventHandler\s*\(/g

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) return listFiles(fullPath)
      if (entry.isFile() && /\.(ts|js)$/.test(entry.name)) return [fullPath]
      return []
    }),
  )
  return files.flat()
}

const files = await listFiles(apiDir)
const violations = []

for (const file of files) {
  const source = await readFile(file, 'utf8')
  const path = relative(rootDir, file).replaceAll('\\', '/')
  const hasWrapper = source.includes(responseWrapper)
  const hasRawEventHandler = rawEventHandlerPattern.test(source)

  rawEventHandlerPattern.lastIndex = 0

  if (!hasWrapper) {
    violations.push(`${path}: missing ${responseWrapper}`)
  }

  if (hasRawEventHandler) {
    violations.push(`${path}: exports raw defineEventHandler`)
  }
}

if (violations.length > 0) {
  console.error(`API response format check failed (${violations.length} violations):`)
  for (const violation of violations) {
    console.error(`- ${violation}`)
  }
  process.exit(1)
}

console.log(`API response format check passed (${files.length} files).`)
