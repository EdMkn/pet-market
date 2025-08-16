# Vinyl Records Store

A modern e-commerce platform for vinyl record enthusiasts, built with Angular, NestJS, and Prisma.

## Features

- **Vinyl Album Catalog**: Browse a curated collection of classic and modern vinyl records
- **Genre Filtering**: Filter albums by genre (Rock, Pop, Hip Hop, R&B, etc.)
- **Search Functionality**: Search albums by title, artist, or genre
- **Shopping Cart**: Add albums to cart with quantity management
- **Secure Checkout**: Integrated Stripe payment processing
- **Responsive Design**: Beautiful, modern UI that works on all devices

## Tech Stack

- **Frontend**: Angular 19 with NgRx Signals
- **Backend**: NestJS with GraphQL
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS with DaisyUI
- **Payment**: Stripe integration
- **Build Tool**: Nx monorepo

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account (for payments)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Backend (.env in apps/vn-record-store-be/)
   DATABASE_URL="postgresql://..."
   STRIPE_SECRET_KEY="sk_..."
   ```

4. Run database migrations:
   ```bash
   cd apps/vn-record-store-be
   npx prisma migrate dev
   npx prisma db seed
   ```

5. Start the development servers:
   ```bash
   # Backend
   npx nx serve vn-record-store-be
   
   # Frontend
   npx nx serve vn-record-store-web
   ```

## Project Structure

```
apps/
├── vn-record-store-web/          # Angular frontend
├── vn-record-store-be/           # NestJS backend
└── pet-markt-assets/        # Static assets

packages/                    # Shared libraries
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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
