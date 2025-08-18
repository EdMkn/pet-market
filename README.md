# Vinyl Records Store

A modern e-commerce platform for vinyl record enthusiasts, built with Angular, NestJS, and Prisma. Developed with AI assistance to ensure robust architecture and best practices.

## Features

- **Vinyl Album Catalog**: Browse a curated collection of classic and modern vinyl records
- **Genre Filtering**: Filter albums by genre (Rock, Pop, Hip Hop, R&B, etc.)
- **Search Functionality**: Search albums by title, artist, or genre
- **Shopping Cart**: Add albums to cart with quantity management
- **Secure Checkout**: Integrated Stripe payment processing
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Server-Side Rendering**: Optimized Angular SSR with proper hydration
- **Docker Deployment**: Complete containerized setup with nginx reverse proxy

## Tech Stack

- **Frontend**: Angular 19 with NgRx Signals, SSR-enabled
- **Backend**: NestJS with GraphQL API
- **Database**: PostgreSQL with Prisma ORM
- **Reverse Proxy**: Nginx for routing and performance
- **Styling**: Tailwind CSS with DaisyUI
- **Payment**: Stripe integration
- **Build Tool**: Nx monorepo
- **Containerization**: Docker & Docker Compose
- **Type Generation**: Automated TypeScript types from Prisma schema

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Nginx Proxy   │    │  Angular Frontend │    │  NestJS Backend │
│   (Port 80)     │◄───┤   (Port 4200)    │◄───┤   (Port 3000)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌────────▼────────┐             │
         │              │  Type Generator │             │
         │              │   (Build Time)  │             │
         │              └─────────────────┘             │
         │                                              │
         └──────────────────────┬───────────────────────┘
                                │
                    ┌───────────▼────────────┐    ┌─────────────┐
                    │   PostgreSQL Database  │    │   Seeder    │
                    │      (Port 5432)       │◄───┤ (Run Once)  │
                    └────────────────────────┘    └─────────────┘
```

## Getting Started

### Prerequisites

**For Local Development:**
- Node.js 18+
- PostgreSQL database
- Stripe account (for payments)

**For Docker (Recommended):**
- Docker Engine 20.10+
- Docker Compose 2.0+

### 🐳 Docker Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vinyl-records-store
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your Stripe keys
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - **Frontend**: http://localhost (via Nginx proxy)
   - **GraphQL API**: http://localhost/graphql
   - **Backend API**: http://localhost/api
   - **Database**: Automatically seeded with sample albums

### 💻 Local Development Setup

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd vinyl-records-store
   npm install
   ```

2. **Generate TypeScript types**
   ```bash
   # Generate frontend types from Prisma schema
   npm run generate:types
   
   # Or watch for schema changes during development
   npm run watch:types
   ```

3. **Set up environment variables**
   ```bash
   # Backend (.env in apps/vn-record-store-be/)
   DATABASE_URL="postgresql://..."
   STRIPE_SECRET_KEY="sk_..."
   ```

4. **Run database setup**
   ```bash
   cd apps/vn-record-store-be
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start development servers**
   ```bash
   # Backend
   npx nx serve vn-record-store-be
   
   # Frontend (in new terminal)
   npx nx serve vn-record-store-web
   ```

## Why Nginx Reverse Proxy?

The Docker setup includes **Nginx as a reverse proxy** for several important benefits:

### 🌐 **Single Entry Point**
- All requests go through nginx (port 80)
- Clean URLs without port numbers
- Professional deployment setup

### ⚡ **Performance Benefits**
- **Gzip compression** for faster loading
- **Static file caching** for images and assets
- **Load balancing** capabilities for scaling

### 🛡️ **Security & Headers**
- **Security headers** (XSS protection, CSRF prevention)
- **SSL termination** support (HTTPS)
- **Request filtering** and rate limiting

### 🔧 **Request Routing**
```
http://localhost/          → Angular Frontend
http://localhost/api/      → NestJS Backend  
http://localhost/graphql   → GraphQL API
```

Without nginx, you'd need to access services on different ports (`:3000`, `:4200`), which is less professional and harder to manage in production.

## Type Generation System

This project uses an **automated type generation system** that keeps frontend TypeScript types in sync with the Prisma database schema.

### 🔄 How It Works

1. **Prisma Schema** (`apps/vn-record-store-be/prisma/schema.prisma`) - Single source of truth
2. **Type Generator** (`scripts/generate-frontend-types.js`) - Parses schema and generates types
3. **Frontend Types** (`apps/vn-record-store-web/src/app/types/album.types.ts`) - Auto-generated TypeScript interfaces

### 📝 Available Commands

```bash
# Generate types once
npm run generate:types

# Watch schema for changes (development)
npm run watch:types

# Build frontend (auto-generates types first)  
npm run build:frontend
```

### 🔧 When You Modify the Database Schema

```bash
# 1. Edit Prisma schema
vim apps/vn-record-store-be/prisma/schema.prisma

# 2. Types auto-generate during Docker build, or run manually:
npm run generate:types

# 3. Frontend types are now in sync!
```

### ✅ Benefits

- **⚡ Faster builds** - No Prisma client generation in frontend (saves ~10 seconds)
- **🔄 Always in sync** - Types automatically match your database schema
- **🛡️ Type safety** - Full TypeScript support without manual maintenance
- **🧹 Clean architecture** - Frontend has no database dependencies

## Project Structure

```
apps/
├── vn-record-store-web/          # Angular frontend
│   └── src/app/types/            # Auto-generated TypeScript types
├── vn-record-store-be/           # NestJS backend
│   └── prisma/                   # Database schema & migrations
└── vn-record-store-assets/       # Static assets

scripts/
├── generate-frontend-types.js    # Type generation script
└── watch-types.js               # Development type watcher

docker-compose.yml               # Production container setup
docker-compose.dev.yml           # Development overrides
nginx.conf                       # Reverse proxy configuration
```

## Album Collection

The store features a carefully curated selection of vinyl records including:

- **Classic Rock**: The Beatles, Led Zeppelin, Pink Floyd
- **Pop**: Michael Jackson, Madonna, Prince
- **Hip Hop**: Dr. Dre, Nas, Lauryn Hill
- **Alternative**: Nirvana, Radiohead, Neutral Milk Hotel

Each album includes detailed information:
- Artist name
- Release year
- Genre classification
- Track count and duration
- High-quality album artwork

## Quick Commands Reference

```bash
# 🐳 Docker (Production)
docker-compose up -d                    # Start all services
docker-compose logs seeder              # Check database seeding
docker-compose build frontend           # Rebuild with fresh types

# 💻 Local Development  
npm run generate:types                  # Generate types once
npm run watch:types                     # Watch schema for changes
npm run build:frontend                  # Build with type generation

# 🔧 Schema Changes Workflow
vim apps/vn-record-store-be/prisma/schema.prisma  # Edit schema
npm run generate:types                             # Sync types
docker-compose build frontend                      # Rebuild container
```

## Docker Services

### Core Services
- **PostgreSQL Database** (`postgres`): Stores application data
- **NestJS Backend** (`backend`): GraphQL API server with Prisma ORM
- **Angular Frontend** (`frontend`): SSR-enabled web application
- **Nginx Reverse Proxy** (`nginx`): Routes traffic and provides performance optimizations
- **Database Seeder** (`seeder`): Automatically populates database with sample data

### Service Health
```bash
# Check all services
docker-compose ps

# View service logs
docker-compose logs [service-name]

# Access services directly
curl http://localhost/api        # Backend health check
curl http://localhost/graphql    # GraphQL endpoint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. **Run type generation** if you modified the Prisma schema
5. Add tests if applicable
6. Submit a pull request

## Documentation

- **[Docker Setup Guide](DOCKER_README.md)** - Complete Docker documentation
- **[Type Generation System](#type-generation-system)** - How automated types work
- **Environment Setup** - See `.env.example` for configuration

## Development Notes

This project was developed with AI assistance to ensure:
- **Robust architecture** with proper separation of concerns
- **Best practices** for Angular SSR and GraphQL integration
- **Comprehensive Docker setup** with nginx reverse proxy
- **Automated type generation** for maintainable code
- **Production-ready configuration** with security considerations

## License

MIT License - see LICENSE file for details.
