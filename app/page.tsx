import { Header } from '@/components/header'
import { HomeClient } from './home-client'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HomeClient />
    </div>
  )
}
