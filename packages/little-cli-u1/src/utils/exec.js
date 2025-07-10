import inquirer from "inquirer";
import fs from "fs-extra";
import glob from 'fast-glob'
import { resolve } from "path";
import { execSync } from "child_process";

async function getPrompts() {
  const prompts = [
    {
      type: "input",
      name: "name",
      message: "应用名称",
      default: "app-name",
    },
    {
      type: "select",
      name: "cover",
      message: "该操作可能会覆盖当前文件夹下的内容，是否继续？(y/n)",
      default: "Y",
    },
  ];
  try {
    const commandRes = await inquirer.prompt(prompts);
    if (commandRes["cover"].toUpperCase() !== "Y") {
      console.log("退出...");
      process.exit()
    }

    return commandRes;
  } catch (e) {}
}

const copyFileSync = async (source, params) => {  
  const cwd = process.cwd()
  const templateGlob = await glob(['**/**'], { cwd: source, dot: true })
  for (const item of templateGlob) {
    const targetPath = resolve(cwd, item)
    await fs.copy(resolve(source, item), targetPath, { overwrite: true })
    if (item.indexOf('config.js') > -1) {
      const fileContent = (await fs.readFile(targetPath)).toString()
      await fs.writeFile(targetPath, fileContent.replaceAll(`%microAppName%`, params['name']))
    }

    if (item.indexOf('package.json') > -1) {
      const fileContent = (await fs.readFile(targetPath)).toString()
      await fs.writeFile(targetPath, fileContent.replaceAll(`%packageName%`, params['name']))
    }
  }
}

function addDependencies() {
  const dependencies = [
    "vue",
    "vue-router",
  ];
  const devDependencies = [
    "@vitejs/plugin-vue-jsx",
    "@vitejs/plugin-vue",
    "rollup-plugin-visualizer",
    "vite",
    "vue-tsc",
    "unplugin-auto-import",
    "unplugin-vue-components",
    "vite-plugin-compression",
    "vite-plugin-style-import",
    "consola",
  ];
  const cwd = process.cwd();
  execSync(`pnpm add ${dependencies.join(" ")}`, { cwd, stdio: "inherit" });
  execSync(`pnpm add -D ${devDependencies.join(" ")}`, {
    cwd,
    stdio: "inherit",
  });

  console.log("项目初始化完成！");
}

export { getPrompts, addDependencies, copyFileSync };
