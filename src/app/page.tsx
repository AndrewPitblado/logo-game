import Link from "next/link";

const mockUrls = [
  "https://img.logo.dev/spotify.com?token=pk_G5936h44REiL0bO_Jbt2-w&size=140&format=png&retina=true",
  "https://img.logo.dev/netflix.com?token=pk_G5936h44REiL0bO_Jbt2-w&size=140&format=png&retina=true",
  "https://img.logo.dev/instagram.com?token=pk_G5936h44REiL0bO_Jbt2-w&size=140&format=png&retina=true",
  "https://img.logo.dev/facebook.com?token=pk_G5936h44REiL0bO_Jbt2-w&size=140&format=png&retina=true",
];

const mockLogos = mockUrls.map((url, index) => ({
  id: index + 1,
  url,
}));

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-wrap items-center justify-center">
      {mockLogos.map((logo) => (
        <div key={logo.id} className="m-4">
          <img src={logo.url} alt={`Logo ${logo.id}`} />
        </div>
      ))}
    </main>
  );
}
