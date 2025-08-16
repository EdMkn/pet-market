import { PrismaClient } from "@prisma/client";
import { albumsList } from "./albumsList";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Check existing albums
  const existingAlbums = await prisma.album.findMany({
    select: { stripePriceId: true },
  });
  const existingAlbumPriceIds = new Set(
    existingAlbums.map((a) => a.stripePriceId)
  );

  console.log({ existingAlbums: existingAlbums.length });

  // Create only albums that don't exist
  for (const album of albumsList) {
    const { ...albumData } = album;
    if (!existingAlbumPriceIds.has(albumData.stripePriceId)) {
      await prisma.album.create({
        data: {
          name: albumData.name,
          artist: albumData.artist,
          description: albumData.description,
          price: albumData.price,
          image: albumData.image,
          genre: albumData.genre,
          releaseYear: albumData.releaseYear,
          trackCount: albumData.trackCount,
          duration: albumData.duration,
          stripePriceId: albumData.stripePriceId,
          isFeatured: albumData.isFeatured,
          createdAt: albumData.createdAt,
          updatedAt: albumData.updatedAt,
        },
      });
      console.log(`Created album: ${albumData.name}`);
    } else {
      console.log(`Skipping existing album: ${albumData.name}`);
    }
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
