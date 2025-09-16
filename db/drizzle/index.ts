import { faker } from "@faker-js/faker";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "@/db/drizzle/schema";

export const db = drizzle({
  connection: { url: process.env.DB_URL as string },
  logger: true,
  schema,
});

const queryPixabay = async (): Promise<
  Array<{ previewURL: string; largeImageURL: string }>
> => {
  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) {
    throw new Error(
      "PIXABAY_API_KEY is not set in environment variables. Please set it to a valid Pixabay API key.",
    );
  }

  const queryParams = new URLSearchParams({
    key: apiKey,
    q: "room",
    image_type: "photo",
    safesearch: "true",
    per_page: "200",
  });

  const url = `https://pixabay.com/api/?${queryParams.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Pixabay API responded with: ${await response.text()}`);
  }
  const data = await response.json();
  return data.hits;
};

const { communitiesTable, roomsTable, usersTable } = schema;

export async function seed() {
  // Use a specific seed for faker-js for reproducible data
  faker.seed(42);

  const existingUser = await db.select().from(usersTable).limit(1);

  if (existingUser.length > 0) return;

  console.log("Database is empty. Starting to seed...");

  const pixabayHits = await queryPixabay();

  // Insert users
  const fakeUsers = Array.from({ length: 15000 }, () => ({
    name: faker.person.fullName(),
  }));
  await db.insert(usersTable).values(fakeUsers);
  console.log("Users inserted.");

  // Get the newly inserted users to link their IDs
  const users = await db.select().from(usersTable);

  // Insert rooms
  const numberOfRooms = pixabayHits.length;

  if (numberOfRooms < 1)
    throw new Error("Not enough rooms were returned by Pixabay.");

  const fakeRooms = Array.from({ length: numberOfRooms }, (_, i) => {
    const { previewURL, largeImageURL } = pixabayHits[i];
    return {
      name: faker.lorem.words(3),
      imageUrl: largeImageURL,
      imagePreviewUrl: previewURL,
      ownerId: users[i % users.length].id,
    };
  });
  await db.insert(roomsTable).values(fakeRooms);
  console.log(`Rooms inserted: ${numberOfRooms}`);

  // Insert 20,000 community shares
  const rooms = await db.select().from(roomsTable);
  const numberOfCommunities = 20000;
  const communities = Array.from({ length: numberOfCommunities }, (_, i) => ({
    authorId: users[i % users.length].id,
    roomId: rooms[i % rooms.length].id,
    products: faker.number.int({ min: 1, max: 10 }),
  }));

  const batchSize = 1000;
  for (let i = 0; i < numberOfCommunities; i += batchSize) {
    const batch = communities.slice(i, i + batchSize);
    db.insert(communitiesTable).values(batch).run();
    console.log(`Communities inserted: ${i + batch.length}`);
  }

  console.log("Database seeded successfully!");
}

seed();
