import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-12 shadow-xl">
          <h1 className="text-4xl font-extrabold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-400 mb-12">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-10 text-slate-300 leading-relaxed">
            <p>
              At SleepHAX, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform to analyze sleep hacks and log your journal entries.
            </p>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, log your sleep, or communicate with us. This includes:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2 text-slate-400">
                <li>Your name and email address for authentication purposes.</li>
                <li>Your sleep journal entries (hours slept, quality scores, and personal notes).</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
              <p>
                We use the information we collect to operate our platform, securely log your data in your private profile, and securely transmit your sleep logs to Google Gemini's AI models to generate personalized sleep insights for you.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Data Security</h2>
              <p>
                We implement strict technical and organizational security protocols, utilizing Supabase's secure infrastructure to protect your data against unauthorized access, modification, or destruction. We do not sell your personal data or your sleep journal entries to third parties.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
