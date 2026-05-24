import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-12 shadow-xl">
          <h1 className="text-4xl font-extrabold text-white mb-4">Terms of Service</h1>
          <p className="text-slate-400 mb-12">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-10 text-slate-300 leading-relaxed">
            <p>
              Welcome to SleepHAX. By accessing or using our platform, you agree to be bound by these Terms of Service.
            </p>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptable Use</h2>
              <p>
                You agree to use SleepHAX only for its intended purpose of searching and analyzing clinical sleep information and maintaining your personal sleep journal. You must provide accurate profile information and use the AI search responsibly.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Medical Disclaimer</h2>
              <p>
                SleepHAX provides AI-generated analysis of public information regarding sleep hacks. <strong>This information is NOT medical advice.</strong> The insights provided by the AI are for informational and educational purposes only. Always consult with a qualified healthcare professional before trying any new health supplements or making significant changes to your sleep routines.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Account Termination</h2>
              <p>
                We reserve the right to suspend or terminate accounts that violate these terms, including accounts exhibiting malicious behavior, scraping data, or attempting to compromise the security of the application.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
