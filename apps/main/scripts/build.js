import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import buildMain from './build-main/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const cwd = path.resolve(__dirname, '../')
execSync(`ddd-cli build`, { cwd, stdio: 'inherit' })

buildMain({})

const parseArgs = (args) => {
  return args.reduce((acc, arg) => {
    const [key, value] = arg.split('=')
    acc[key.replace(/^--/, '')] = value || true
    return acc
  }, {})
}
const argv = parseArgs(process.argv.slice(2))
const cwd = path.resolve(__dirname, `../packages/admin`)
execSync('pnpm run build', { cwd, stdio: 'inherit' })

