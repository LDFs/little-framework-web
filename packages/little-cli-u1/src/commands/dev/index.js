import concurrently from 'concurrently'


export default async () => {
  try {
    // 执行并发命令并等待结果
    await concurrently([
      { command: `npx vite`, name: 'vite' },
    ]);
  } catch (error) {
    // 捕获并处理并发命令执行过程中的错误
    console.error('执行并发命令时出错:', error);
  }
}
