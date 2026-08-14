import './globals.css'
import type { Metadata } from 'next'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'

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
      <body>
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
