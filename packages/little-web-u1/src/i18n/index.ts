import {ref, reactive, computed} from 'vue'

const globalLangData: any = reactive({})
const currentLang = ref('zh-CN')

async function initi18n(opt: any){
  // 设置html lang属性
  const htmlElement = document.documentElement
  htmlElement && htmlElement.setAttribute('lang', currentLang.value)

  let globData = Object.assign(opt?.i18n?.glob || {})
  opt?.microApps?.map((item: any) => {
    globData = Object.assign(globData, item.i18n?.glob || {})
  })

  Object.values(globData)
    .filter((item) => !!item)
    .flat()
    .map((item) => setI18nRules(item))
}

function setI18nRules(datas: any){
  for(let key in datas){
    globalLangData[key] = datas[key]
  }
}

function getI18nRule(key: string, ...args: any[]){
  return computed(() => {
    if(!key) return ''
    const keyData = globalLangData[key]
    if(!keyData || keyData === key) return key

    let text = keyData[currentLang.value]
    
    args.map((item: any, index: number) => {
      text = text.replace(`$${index}`, item) 
    })
    return text
  })
}

function setLang(lang: string){
  if(lang === 'zh-cn') lang = 'zh-CN'
  currentLang.value = lang
}

const getLang = () => currentLang.value

const t = (key: string, ...args: any[]) => getI18nRule(key, ...args).value

export {
  initi18n, setI18nRules, t, setLang, getLang
}