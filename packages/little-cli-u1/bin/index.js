#!/usr/bin/env node
import { dirname, resolve, relative } from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const runCli = async (e) => {
  let arg = process.argv.splice(2);
  const a = arg[0] || "help";

  // const cwd = process.cwd()   //  D:\coding\PROJECTS\little-framework-web\apps\app1  控制台里 输入命令时所在的路径
  // 获取当前模块的文件路径
  const __filename = fileURLToPath(import.meta.url);
  // 获取当前模块所在的目录
  const __dirname = dirname(__filename);   // D:\coding\PROJECTS\little-framework-web\packages\little-cli-u1\bin  当前文件所在的位置

  // 根据不同的参数，来执行src/commands/下的指令，比如 src/commands/dev/index.js
  const commandPath = resolve(__dirname, `../src/commands/${a}/index.js`);
  // 将文件路径转换为 file:// 格式的 URL
  const commandUrl = new URL(`file://${commandPath}`);
  const commandExists = fs.existsSync(commandPath);
  if (commandExists) {
    try {
      const module = await import(commandUrl.href);
      if (typeof module.default === "function") {
        module.default();
      }else {
        console.log('模块默认导出不是一个函数');
      }
    } catch (error) {
      console.error(`执行命令 ${a} 时出错:`, error);
    }
  } else {
    console.log(`命令 ${a} 不存在`);
  }

  // if(a === 'dev'){
  //   concurrently([
  //     { command: 'pnpm cup-cli dev-helper', name: 'ddd-cli' },
  //     { command: `npx vite`, name: 'vite' },
  //   ])
  // }else if(a === 'dev-helper'){
  //   console.log("---helper")
  // }else if(a === 'build') {
  //   // 打包，
  //   execSync(`npx vite build`, { cwd, stdio: 'inherit' })
  // }else if(a === 'init') {
  //   init()
  // }
};
runCli();
