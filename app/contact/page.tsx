import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ShieldCheck, Mail, ArrowRight } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Header />
      <main className="flex-grow max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex items-center justify-center">
        
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-teal-500"></div>
          
          <div className="mx-auto w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck className="w-8 h-8 text-cyan-400" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">Partner with SleepHAX</h1>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            To ensure the quality and clinical accuracy of our platform, we manually review feedback and partnership requests.
            <br/><br/>
            If you represent a clinical organization or have feedback regarding our AI accuracy, please contact our administrative team.
          </p>
          
          <a 
            href="mailto:bhargavkv05@gmail.com"
            className="inline-flex items-center justify-center gap-3 w-full bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/50 text-cyan-400 py-4 px-6 rounded-xl transition-all font-medium group"
          >
            <Mail className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            bhargavkv05@gmail.com
            <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          
        </div>

      </main>
      <Footer />
    </div>
  )
}
