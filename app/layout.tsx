import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL('https://tutmey.com'),
  title: 'Tutmey Real Estate | Exceptional Dubai Homes',
  description: 'Discover a more personal way to find your Dubai home. Tutmey Real Estate helps buyers find luxury villas, waterfront residences and city apartments.',
  alternates: { canonical: '/' },
  openGraph: { title: 'Tutmey Real Estate | Exceptional Dubai Homes', description: 'Exceptional homes. A life well chosen. Personal property guidance in Dubai.', type: 'website', locale: 'en_AE', siteName: 'Tutmey Real Estate' },
  twitter: { card: 'summary', title: 'Tutmey Real Estate', description: 'A more personal way to find your Dubai home.' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="dark antialiased">{children}</body></html>;
}
