# 🎧 Podcast Player

A modern, full-stack podcast player application with PWA support for offline listening.

## ✨ Features

- **🔍 Podcast Search** - Search podcasts using the Podcast Index API
- **📋 Episode Browsing** - Browse episodes with virtualized scrolling for performance
- **▶️ Audio Playback** - Full-featured player with play/pause, skip, seek, and progress tracking
- **📝 Queue Management** - Add episodes to queue, reorder, and manage your listening list
- **💾 Persistent State** - Player state and queue saved to localStorage across sessions
- **📱 PWA Support** - Install as app, offline caching
- **🌙 Dark Mode** - Light/dark/system theme support
- **📱 Responsive** - Mobile-first design with desktop layout

## 🏗️ Architecture

This is a **TypeScript monorepo** built with **Turborepo**:

```
├── apps/
│   ├── fastify/          # Backend API (Fastify + tRPC)
│   └── web/              # Frontend PWA (React 19 + Vite)
├── packages/
│   ├── api/              # tRPC API definitions & routers
│   └── ui/               # Shadcn/ui component library
└── tooling/              # Shared ESLint, Prettier, TypeScript configs
```

## 🚀 Tech Stack

### Frontend (`apps/web/`)
- **React 19** with TypeScript
- **Vite** + **vite-plugin-pwa** for PWA support
- **Tailwind CSS v4** for styling
- **TanStack Router** for file-based routing
- **TanStack Query** for server state
- **TanStack Store** for global state management
- **TanStack Virtual** for virtualized lists
- **Shadcn/ui** components

### Backend (`apps/fastify/`)
- **Fastify** web framework
- **tRPC** for type-safe APIs
- **Podcast Index API** integration
- Security: Helmet, CORS, Rate Limiting

## 🔧 Getting Started

### Prerequisites
- Node.js 20+
- pnpm 9+
- [Podcast Index API credentials](https://podcastindex.org/)

### Installation

1. **Clone and install:**
   ```bash
   git clone <repo-url>
   cd PodcastPlayer
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   # apps/fastify/.env
   cp apps/fastify/.env.example apps/fastify/.env
   # Add your Podcast Index API key and secret
   
   # apps/web/.env
   cp apps/web/.env.example apps/web/.env
   ```

3. **Build packages and start development:**
   ```bash
   pnpm build
   pnpm dev
   ```

4. **Open the app:**
   - Frontend: http://localhost:3035
   - Backend: http://localhost:3030

## 📜 Scripts

```bash
# Development
pnpm dev              # Start all apps in dev mode
pnpm build            # Build all packages and apps
pnpm lint             # Lint all packages
pnpm typecheck        # Type check all packages

# Individual apps
pnpm --filter=web dev
pnpm --filter=fastify dev
```

## 📱 PWA Features

The app is a Progressive Web App with:
- **Installable** - Add to home screen on mobile/desktop
- **Offline Support** - Static assets cached for offline use
- **Auto-update** - Service worker updates automatically

### Caching Strategy
- **Static assets** - Precached on install
- **Podcast API** - NetworkFirst, 24h cache
- **Images** - CacheFirst, 100 images, 30 days

## 🎯 Key Features Explained

### Player State Persistence
- Currently playing episode and position saved to localStorage
- Queue persisted across sessions
- Restores playback position on page refresh (paused state)

### Virtualized Scrolling
- Episode lists use `@tanstack/react-virtual`
- Smooth scrolling with thousands of episodes
- Efficient memory usage

### Responsive Design
- Mobile: Tabbed interface (Search / Listen)
- Desktop: Side-by-side layout with player and queue

## 📚 Documentation Links

- [Podcast Index API](https://podcastindex-org.github.io/docs-api/)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Shadcn/ui](https://ui.shadcn.com/)

## 📄 License

MIT

---

_Built with ❤️ using React, Fastify, and the Podcast Index API_
