#!/usr/bin/env node
import { getPrompts, addDependencies, copyFileSync } from "../src/utils/exec.js";
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

async function init(){
  const prompt = await getPrompts()

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const templateCwd = resolve(__dirname, '../template')

  console.log('复制模板到当前文件夹...')
  await copyFileSync(templateCwd, prompt)

  console.log('安装依赖...')
  addDependencies()
}
init()
