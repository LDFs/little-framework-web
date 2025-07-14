import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import * as prettier from 'prettier'
import toLower from 'lodash-es/toLower.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const createTag = (opt) => {
  const { tag, innerText = '', ...props } = opt
  if (!props) props = {}
  const attrString = Object.keys(props)
    .map((key) => `${key}="${props[key]}"`)
    .join(' ')
  let res = `<${tag} ${attrString}>`
  let needCloseTag = true
  if (['link', 'meta'].includes(tag)) needCloseTag = false
  if (!needCloseTag) return res.replace('>', ' />')
  if (innerText) res += `\r\n${innerText}\r\n`
  res += `</${tag}>`
  return res
}

const createTags = (tagArrs) => {
  let res = ''
  for (const item of tagArrs) {
    const tagItem = createTag(item)
    if (tagItem) res += `${tagItem}\r\n`
  }
  return res
}

const geneHtml = async (options = {}) => {
  const {
    microApps = [],
    title = "",
    appId = "app",
    sourceBaseUrl = "/web/admin",
    libs = [],
  } = options || {};

  const payloadStylesheets = options.stylesheets || []
  const payloadImportmap = options.importmap || {}

  const libImportmapImports = {};
  const libPreScripts = [];
  const libStylesheets = [];
  libs.map((lib) => {
    const paths = lib.paths || [];
    paths.map((path) => {
      const type = path.type;
      const src = `${sourceBaseUrl}${path.src}`;
      if (type === "script") {
        libPreScripts.push({ tag: "script", src });
      }
      if (type === "importmap.imports") {
        libImportmapImports[path.key] = src;
      }
      if (type === "style") {
        libStylesheets.push({ tag: "link", rel: "stylesheet", href: src });
      }
    });
  });

  const preScripts = [
    ...libPreScripts,
    {tag: 'script', src: `${sourceBaseUrl}/config.js`},
    {
      tag: 'script',
      innerText: `
        window.process = {env: {NODE_ENV: 'production'}};
        window.dynamicStyleLink = (href, attrs) => {
          const link = document.createElement('link')
          const { id=href, rel='stylesheet' } = attrs || { }
          if(document.getElementById(id)) return
          link.rel = rel
          link.href = href 
          link.id = id
          Object.keys(attrs || {}).forEach(key => {
            link.setAttribute(key, attrs[key])
          })
          document.head.appendChild(link)
        }
      `
    }
  ]

  const importmap = { ...payloadImportmap, imports: { ...libImportmapImports, ...(payloadImportmap?.imports || {}) } }
  const stylesheets = [
    ...payloadStylesheets,
    ...libStylesheets,
    { tag: 'link', rel: 'stylesheet', href: `${sourceBaseUrl}/style.css` },
  ]

  let mainScriptCode = `
  import createWebApp from '${sourceBaseUrl}/index.js';
  `
  const microAppPath = []
  microApps.map((item, index) => {
    const microAppName = toLower(item.id)
    const microAppEnrtyPath = `/web/${microAppName}/index.js`
    const microAppStylePath = `/web/${microAppName}/style.css`
    mainScriptCode += `import ${microAppName} from '${microAppEnrtyPath}';\n `
    mainScriptCode += `window.dynamicStyleLink('${microAppStylePath}')\r\n`
    microAppPath.push(microAppName)
  })
  
  mainScriptCode += `
    const microApps = [${microAppPath}].map((item) => item())
    createWebApp({ microApps })
  \r\n`

  const headContent = createTags([
    { tag: 'meta', charset: 'UTF-8' },
    { tag: 'meta', name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { tag: 'title', innerText: title },
    ...preScripts,
    { tag: 'script', type: 'importmap', innerText: JSON.stringify(importmap) },
    ...stylesheets,
  ])

  const bodyContent = createTags([
    { tag: 'div', id: appId },
    { tag: 'script', type: 'module', innerText: mainScriptCode },
  ])

  let indexHtmlContent = (await fs.readFile(resolve(__dirname, './index.temp.html'))).toString()
  indexHtmlContent = indexHtmlContent.replace('{{head}}', headContent)
  indexHtmlContent = indexHtmlContent.replace('{{body}}', bodyContent)

  return prettier.format(indexHtmlContent, {
    parser: 'html',
    singleQuote: true,
    tabWidth: 2,
    printWidth: 120,
    semi: false,
    trailingComma: 'all',
    bracketSpacing: true,
  })
};
export default geneHtml;