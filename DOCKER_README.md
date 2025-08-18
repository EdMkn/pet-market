# Docker Setup for Vinyl Records Store

This document explains how to run the Vinyl Records Store application using Docker and Docker Compose. This setup was developed with AI assistance to ensure robust architecture and production-ready configuration.

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Nginx Proxy   │    │  Angular Frontend │    │  NestJS Backend │
│   (Port 80/443) │◄───┤   (Port 4200)    │◄───┤   (Port 3000)   │
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

The application consists of the following services:

- **PostgreSQL Database** (`postgres`): Stores application data
- **NestJS Backend** (`backend`): GraphQL API server with Prisma ORM
- **Angular Frontend** (`frontend`): SSR-enabled web application with auto-generated types
- **Nginx Reverse Proxy** (`nginx`): Routes traffic and serves as load balancer
- **Database Seeder** (`seeder`): Automatically populates database with sample vinyl records

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vinyl-records-store
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env file with your configuration
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - **Frontend**: http://localhost (via Nginx proxy)
   - **Direct Frontend**: http://localhost:4200 (bypass nginx)
   - **Backend API**: http://localhost:3000/api (direct) or http://localhost/api (via nginx)
   - **GraphQL Playground**: http://localhost:3000/graphql (direct) or http://localhost/graphql (via nginx)
   - **Database**: localhost:5432
   
   The database is automatically seeded with 5 sample vinyl records on first startup.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/vinyl_records_store

# Stripe Configuration (Required for payment processing)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Application Configuration
NODE_ENV=production
PORT=3000

# Frontend Configuration
API_URL=http://backend:3000/api
GRAPHQL_URL=http://backend:3000/graphql
```

## Docker Compose Commands

### Start Services
```bash
# Start all services in background
docker-compose up -d

# Start with logs visible
docker-compose up

# Start specific service
docker-compose up -d postgres backend
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This will delete your database data)
docker-compose down -v
```

### View Logs
```bash
# View logs for all services
docker-compose logs

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs nginx

# Follow logs in real-time
docker-compose logs -f backend
```

### Rebuild Services
```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build backend

# Rebuild and start
docker-compose up -d --build
```

## Type Generation System

This application uses an **automated type generation system** that keeps frontend TypeScript types synchronized with the Prisma database schema.

### 🔄 How It Works in Docker

1. **During Build**: Frontend container automatically generates TypeScript types from Prisma schema
2. **No Manual Steps**: Types are always fresh and in sync with your database schema
3. **Faster Builds**: Frontend doesn't need Prisma client generation (saves ~10 seconds)

### 📝 Type Generation Commands

```bash
# Generate types manually (if needed)
docker-compose exec frontend npm run generate:types

# View generated types
docker-compose exec frontend cat apps/vn-record-store-web/src/app/types/album.types.ts

# Rebuild frontend with fresh types after schema changes
docker-compose build frontend
```

### 🔧 Workflow When Changing Database Schema

```bash
# 1. Edit Prisma schema locally
vim apps/vn-record-store-be/prisma/schema.prisma

# 2. Rebuild frontend (types auto-generate during build)
docker-compose build frontend

# 3. Restart services
docker-compose up -d

# 4. Run new migrations if needed
docker-compose exec backend npx prisma migrate deploy
```

### 🎯 Generated Types Include

- **Album Interface**: All album fields with correct TypeScript types
- **Order Interface**: Order management types
- **AlbumOrderItem Interface**: Shopping cart item types  
- **Enums**: OrderStatus and other database enums
- **CartItem Interface**: Custom frontend-specific types

### ✅ Benefits

- **⚡ Faster Docker builds** - No redundant Prisma generation
- **🔄 Always synchronized** - Types match database schema automatically
- **🛡️ Type safety** - Full TypeScript support throughout the application
- **🧹 Clean architecture** - Frontend has no direct database dependencies

## Development vs Production

### Development Mode

Use the provided development configuration for hot reloading and type watching:

```bash
# Start with development overrides (includes type watching)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Or create docker-compose.override.yml for persistent dev setup
```

**Development features:**
- **Hot reload** for source code changes
- **Automatic type generation** when Prisma schema changes
- **Type watcher service** runs independently
- **Volume mounts** for faster development cycles

**Example docker-compose.override.yml:**
```yaml
version: '3.8'
services:
  backend:
    volumes:
      - ./apps/vn-record-store-be/src:/app/src
    command: ["npm", "run", "start:dev"]
  
  frontend:
    volumes:
      - ./apps/vn-record-store-web/src:/app/src
      - ./apps/vn-record-store-web/src/app/types:/app/apps/vn-record-store-web/src/app/types
    command: ["sh", "-c", "npm run generate:types && npm run watch:types & npm run start"]
    
  # Optional: Dedicated type watcher
  type-generator:
    build:
      context: .
      dockerfile: apps/vn-record-store-web/Dockerfile
      target: base
    volumes:
      - .:/app
    command: ["npm", "run", "watch:types"]
```

### Production Mode
The current setup is optimized for production with:
- Multi-stage Docker builds for smaller images
- Non-root users for security
- Health checks for monitoring
- Nginx reverse proxy for performance

## Database Management

### Automatic Database Setup

The database is **automatically set up** when you start the application:

1. **Migrations**: Run automatically when backend starts
2. **Seeding**: Separate seeder container populates database with sample data
3. **No manual steps required** - everything happens on `docker-compose up`

### Manual Database Commands

```bash
# Run Prisma migrations manually (if needed)
docker-compose exec backend npx prisma migrate deploy

# View seeder logs
docker-compose logs seeder

# Restart seeder (if database was reset)
docker-compose up seeder

# Check seeded data
docker-compose exec postgres psql -U postgres -d vinyl_records_store -c "SELECT name, artist FROM \"Album\";"
```

### Access Database
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d vinyl_records_store

# Or use Prisma Studio
docker-compose exec backend npx prisma studio
```

### Backup Database
```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres vinyl_records_store > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U postgres vinyl_records_store < backup.sql
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using the port
   lsof -i :80
   lsof -i :3000
   lsof -i :5432
   
   # Stop conflicting services
   sudo systemctl stop apache2    # If Apache is running on port 80
   sudo systemctl stop postgresql # If PostgreSQL is running on port 5432
   ```

2. **Database connection issues**
   ```bash
   # Check if database is running
   docker-compose ps postgres
   
   # View database logs
   docker-compose logs postgres
   ```

3. **Frontend not loading**
   ```bash
   # Check if backend is running
   docker-compose ps backend
   
   # Check backend health
   curl http://localhost:3000/api
   ```

4. **GraphQL redirect issues (Apollo errors)**
   ```bash
   # Symptoms: "Http failure during parsing for http://localhost:4200/home"
   # Albums briefly appear then disappear
   
   # Solution: Ensure you access via nginx proxy
   # ✅ Correct: http://localhost/albums
   # ❌ Wrong: http://localhost:4200/albums
   
   # Check nginx logs
   docker-compose logs nginx
   
   # Restart nginx if needed
   docker-compose restart nginx
   ```

5. **Nginx proxy issues**
   ```bash
   # Check nginx container status
   docker-compose ps nginx
   
   # Check nginx configuration
   docker-compose exec nginx nginx -t
   
   # Restart nginx
   docker-compose restart nginx
   ```

### Health Checks

All services include health checks:

```bash
# Check service health
docker-compose ps

# View detailed health status
docker inspect <container_name> | grep Health -A 10
```

### Performance Monitoring

Monitor resource usage:

```bash
# View resource usage
docker-compose top

# Monitor in real-time
docker stats
```

### Complete Clean Start

If you encounter persistent issues:

```bash
# Stop everything and clean up
docker-compose down -v
docker system prune -a --volumes -f

# Start fresh
docker-compose up -d
```

## SSL/HTTPS Setup

To enable HTTPS:

1. **Generate SSL certificates**
   ```bash
   mkdir ssl
   # Add your SSL certificates to the ssl/ directory
   ```

2. **Update nginx.conf**
   ```nginx
   server {
       listen 443 ssl;
       ssl_certificate /etc/nginx/ssl/cert.pem;
       ssl_certificate_key /etc/nginx/ssl/key.pem;
       # ... rest of configuration
   }
   ```

## Scaling

To scale services:

```bash
# Scale backend to 3 instances
docker-compose up -d --scale backend=3

# Scale with load balancer
docker-compose up -d --scale backend=3 --scale frontend=2
```

## Maintenance

### Update Images
```bash
# Pull latest images
docker-compose pull

# Rebuild and restart
docker-compose up -d --build
```

### Clean Up
```bash
# Remove unused containers and images
docker system prune

# Remove unused volumes (WARNING: Data loss)
docker volume prune
```

## Development Notes

This Docker setup was developed with AI assistance to ensure:

- **Robust multi-service architecture** with proper service discovery
- **Production-ready nginx configuration** with security headers and performance optimizations
- **Automated database seeding** and migration handling
- **SSR-compatible Apollo GraphQL setup** with proper cookie handling
- **Comprehensive debugging and logging** for troubleshooting
- **Type-safe development workflow** with automated TypeScript generation

### Key Technical Solutions Implemented

1. **Angular SSR + Apollo GraphQL**: Resolved complex hydration issues with platform detection
2. **Cookie-based Authentication**: Configured Apollo client to handle authentication cookies properly
3. **Docker Networking**: Proper service discovery and internal routing
4. **Automated Type Generation**: Build-time TypeScript generation from Prisma schema
5. **Nginx Reverse Proxy**: Professional routing and performance optimization

## Support

For issues and questions:
1. Check the logs: `docker-compose logs [service]`
2. Verify environment variables
3. Ensure all required ports are available
4. Check Docker and Docker Compose versions
5. Refer to the troubleshooting section above

**Note**: This project demonstrates best practices for modern full-stack development with containerization, developed with AI assistance to ensure robust and maintainable code. 