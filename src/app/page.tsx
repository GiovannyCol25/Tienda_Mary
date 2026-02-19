import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Tienda Mary</h1>
      <p>Proyecto Next.js listo para iniciar.</p>
      <p>
        <Link href="/productos">Ir a Gestion de Productos</Link>
      </p>
    </main>
  );
}