import { Header } from '@/components/header'
import { HomeClient } from './home-client'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow">
        <HomeClient />
      </main>
      <Footer />
    </div>
  )
}
