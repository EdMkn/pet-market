const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const albumsList = [
  {
    name: 'Abbey Road',
    artist: 'The Beatles',
    description: 'The iconic final album recorded by The Beatles, featuring classics like "Come Together" and "Here Comes the Sun".',
    price: 24.99,
    image: 'products/abbey-road.jpg',
    genre: 'Rock',
    releaseYear: 1969,
    trackCount: 17,
    duration: '47:23',
    stripePriceId: 'price_xxxxx_abbeyroad',
    createdAt: new Date(),
    updatedAt: new Date(),
    isFeatured: true,
  },
  {
    name: 'Thriller',
    artist: 'Michael Jackson',
    description: 'The best-selling album of all time, featuring hits like "Billie Jean" and "Beat It".',
    price: 19.99,
    image: 'products/thriller.jpg',
    genre: 'Pop',
    releaseYear: 1982,
    trackCount: 9,
    duration: '42:19',
    stripePriceId: 'price_xxxxx_thriller',
    createdAt: new Date(),
    updatedAt: new Date(),
    isFeatured: true,
  },
  {
    name: 'The Dark Side of the Moon',
    artist: 'Pink Floyd',
    description: 'A groundbreaking concept album exploring themes of conflict, greed, and mental illness.',
    price: 22.99,
    image: 'products/dark-side-moon.jpg',
    genre: 'Progressive Rock',
    releaseYear: 1973,
    trackCount: 10,
    duration: '42:59',
    stripePriceId: 'price_xxxxx_darksideofmoon',
    createdAt: new Date(),
    updatedAt: new Date(),
    isFeatured: true,
  },
  {
    name: 'Back in Black',
    artist: 'AC/DC',
    description: 'One of the best-selling albums of all time, featuring hard rock anthems like "Back in Black" and "You Shook Me All Night Long".',
    price: 21.99,
    image: 'products/back-in-black.jpg',
    genre: 'Hard Rock',
    releaseYear: 1980,
    trackCount: 10,
    duration: '42:11',
    stripePriceId: 'price_xxxxx_backinblack',
    createdAt: new Date(),
    updatedAt: new Date(),
    isFeatured: false,
  },
  {
    name: 'Hotel California',
    artist: 'Eagles',
    description: 'The Eagles\' masterpiece featuring the iconic title track and "Life in the Fast Lane".',
    price: 23.99,
    image: 'products/hotel-california.jpg',
    genre: 'Rock',
    releaseYear: 1976,
    trackCount: 9,
    duration: '43:28',
    stripePriceId: 'price_xxxxx_hotelcalifornia',
    createdAt: new Date(),
    updatedAt: new Date(),
    isFeatured: false,
  }
];

async function main() {
  console.log("Start seeding...");

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
        data: albumData,
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