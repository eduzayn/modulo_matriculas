export async function generateStaticParams() {
  // For static export, we need to provide all possible IDs
  // Since we don't know all possible contract IDs in advance,
  // we'll return an empty array and handle 404s for unknown IDs
  return [];
}
