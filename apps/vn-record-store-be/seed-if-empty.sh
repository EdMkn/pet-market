#!/bin/sh

# Check if albums table has any data
ALBUM_COUNT=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM \"Album\";" | tail -1 | tr -d ' ')

echo "Current album count: $ALBUM_COUNT"

if [ "$ALBUM_COUNT" = "0" ]; then
    echo "Database is empty. Running seeder..."
    docker run --rm --network vinyl-records-store_vn-record-store-network \
        -e DATABASE_URL="$DATABASE_URL" \
        vinyl-seeder npx ts-node prisma/seed.ts
    echo "Seeding completed."
else
    echo "Database already has data. Skipping seeding."
fi 