import { copyFileSync, readFileSync, writeFileSync } from 'node:fs'

// Function to collect all dependencies from workspace packages
function collectWorkspaceDependencies() {
  const workspacePackages = ['../../packages/api/package.json']

  const allDeps = {}

  for (const pkgPath of workspacePackages) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
      const deps = pkg.dependencies || {}

      // Only include non-workspace dependencies
      for (const [name, version] of Object.entries(deps)) {
        if (!name.startsWith('@workspace/')) {
          allDeps[name] = version
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not read ${pkgPath}`)
    }
  }

  return allDeps
}

// Collect all workspace dependencies automatically
const workspaceDeps = collectWorkspaceDependencies()

// Create production package.json
const prodPackageJson = {
  name: 'fastify',
  private: true,
  version: '0.0.0',
  type: 'module',
  scripts: {
    start: 'node index.js',
  },
  dependencies: {
    // Fastify ecosystem (app-specific)
    '@fastify/cookie': 'catalog:',
    '@fastify/cors': 'catalog:',
    '@fastify/helmet': 'catalog:',
    '@fastify/rate-limit': 'catalog:',
    fastify: 'catalog:',

    // Auto-discovered workspace dependencies
    ...workspaceDeps,
  },
}

try {
  writeFileSync('dist/package.json', JSON.stringify(prodPackageJson, null, 2))
  console.log('✅ Production package.json created!')
  console.log('📋 Workspace dependencies found:', Object.keys(workspaceDeps).join(', '))

  // Copy workspace file for catalog resolution
  copyFileSync('../../pnpm-workspace.yaml', 'dist/pnpm-workspace.yaml')
  console.log('✅ Workspace file copied!')

  // Copy lock file
  copyFileSync('../../pnpm-lock.yaml', 'dist/pnpm-lock.yaml')
  console.log('✅ Lock file copied!')

  // Copy env file
  copyFileSync('.env', 'dist/.env')
  console.log('✅ Env file copied!')

  console.log('\n🚀 Production build complete!')
  console.log('📦 Deploy the entire dist/ folder to your server')
  console.log('🔧 On server: cd dist && pnpm install --prod && pnpm start')
} catch (error) {
  console.error('❌ Failed to create production files:', error)
  process.exit(1)
}
