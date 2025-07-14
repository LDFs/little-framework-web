

export default async () => {
  const cwd = process.cwd()
  execSync(`npx vite build`, { cwd, stdio: 'inherit' })
}