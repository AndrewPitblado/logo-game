import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const images = await db.query.images.findMany();
  return (
    <main className="flex min-h-screen flex-wrap items-center justify-center">
      {images.map((image) => (
        <div key={image.id} className="m-4">
          <img src={image.url} alt={`Logo ${image.id}`} />
        </div>
      ))}
    </main>
  );
}
