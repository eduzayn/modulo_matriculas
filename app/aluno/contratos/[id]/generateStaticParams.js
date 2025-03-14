export async function generateStaticParams() {
  // For static export, we need to provide all possible IDs
  // Since we don't know all possible contract IDs in advance,
  // we'll provide a set of mock IDs for static generation
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' }
  ];
}
