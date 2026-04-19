import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VigorNova | Desata Tu Potencial',
  description: 'El gimnasio premium para quienes buscan transformar su cuerpo y mente.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
