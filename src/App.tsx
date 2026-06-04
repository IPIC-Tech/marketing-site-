import { useState } from 'react';
import { Ticket, CreditCard, Star, Calendar, Shield, ChevronRight, Check, ArrowRight } from 'lucide-react';

// InstaPass brand colors (from actual logo)
const IP_RED   = '#CC0000';   // InstaPass crimson — used in INSTA wordmark
const IP_BLACK = '#111111';   // PASS wordmark + body text

const WAITLIST_URL = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/waitlist-signup`
  : null;

function WaitlistForm() {
  const [email,     setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [platform,  setPlatform]  = useState('instapass');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) { setError('Please enter a valid email.'); return; }
    setLoading(true); setError('');

    try {
      if (WAITLIST_URL) {
        const res = await fetch(WAITLIST_URL, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ email, platform, source: 'marketing-site' }),
        });
        if (!res.ok) throw new Error('Server error');
      } else {
        // Dev: just simulate success
        await new Promise(r => setTimeout(r, 600));
      }
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-6">
        <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
          <Check className="w-6 h-6 text-green-400" />
        </div>
        <p className="text-lg font-semibold text-white">You're on the list!</p>
        <p className="text-sm text-gray-400 text-center">We'll notify you at <span className="text-white">{email}</span> when we launch.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-md">
      <div className="flex gap-2">
        {(['instapass','instacash','instapoints'] as const).map(p => (
          <button type="button" key={p} onClick={() => setPlatform(p)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              platform === p ? 'bg-violet-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}>
            {p === 'instapass' ? 'Tickets' : p === 'instacash' ? 'Wallet' : 'Points'}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          required
        />
        <button type="submit" disabled={loading}
          className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5 whitespace-nowrap">
          {loading ? '…' : <><span>Join</span><ArrowRight className="w-4 h-4" /></>}
        </button>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <p className="text-xs text-gray-500 text-center">No spam. Early access + 1,000 InstaPoints on launch.</p>
    </form>
  );
}

const PLATFORMS = [
  { icon: Ticket,     name: 'InstaPass',   color: 'from-violet-500 to-purple-600',  desc: 'Buy and resell tickets with real inventory from millions of events. Interactive venue maps. No junk fees.' },
  { icon: CreditCard, name: 'InstaCash',   color: 'from-cyan-500 to-blue-600',      desc: 'Embedded wallet for tickets, P2P, and everyday spending. Earn points on every dollar. ACH, instant transfer, QR pay.' },
  { icon: Star,       name: 'InstaPoints', color: 'from-yellow-500 to-orange-500',  desc: '5 loyalty tiers. Earn on every platform. Redeem for tickets, gift cards, or cash back. Never expire if you stay active.' },
  { icon: Calendar,   name: 'I-Vent',      color: 'from-green-500 to-emerald-600',  desc: 'Create and sell tickets to any event. White-label for venues, sports teams, and organizers. Built-in loyalty tools.' },
  { icon: Shield,     name: 'I-ID',        color: 'from-pink-500 to-rose-600',      desc: 'One identity across all platforms. KYC once, use everywhere. Your data, your control. GDPR/CCPA compliant.' },
];

const STATS = [
  { label: '$25B',  sub: 'Ticket market TAM' },
  { label: '$40B',  sub: 'Fintech wallet TAM' },
  { label: '10K+',  sub: 'Venues pre-mapped' },
  { label: '5×',    sub: 'Platform flywheel' },
];

const FAQS = [
  { q: 'How is InstaPass different from Ticketmaster?',
    a: 'No venue exclusives, no junk fees (we charge a flat %, not a mystery fee stack), real inventory from day one via our ticket exchange partnerships, and you earn loyalty points on every purchase.' },
  { q: 'What is InstaCash?',
    a: 'An embedded neobank wallet built for events. Top up via ACH or debit card, pay for tickets in one tap, send money to friends, earn InstaPoints on every dollar spent.' },
  { q: 'Can I earn points at non-IPIC merchants?',
    a: 'Yes — InstaPoints is an independent B2B loyalty platform. Any merchant can integrate via our Partner API. Points earned at partner merchants work the same as points earned on InstaPass.' },
  { q: 'When do you launch?',
    a: 'We\'re in final pre-launch testing. Join the waitlist and you\'ll get early access + 1,000 founding-member InstaPoints before the public launch.' },
];

export default function App() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 glass">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">IPIC-Tech</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <a href="#platforms" className="hover:text-white transition-colors">Platforms</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <a href="#waitlist" className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-sm font-medium transition-colors">
            Join Waitlist
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Now accepting early access signups
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Five Platforms.<br />
            <span className="gradient-text">One Flywheel.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Buy tickets, earn loyalty points, and pay instantly — all connected through a single identity. The fan commerce platform built for how you actually live.
          </p>
          <div id="waitlist" className="flex justify-center">
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(s => (
            <div key={s.label}>
              <p className="text-3xl font-black gradient-text">{s.label}</p>
              <p className="text-sm text-gray-500 mt-1">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Platforms */}
      <section id="platforms" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-4">Five Independent Platforms</h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">Each platform works standalone. Together they compound. Disable any integration — everything still works.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLATFORMS.map(p => (
              <div key={p.name} className="glass rounded-2xl p-6 hover:border-white/15 transition-colors">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-4`}>
                  <p.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{p.name}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
            {/* CTA card */}
            <div className="glass rounded-2xl p-6 bg-gradient-to-br from-violet-900/30 to-purple-900/30 border-violet-500/20 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2">The Flywheel</h3>
                <p className="text-sm text-gray-400 leading-relaxed">Buy on InstaPass → earn InstaPoints → pay with InstaCash → earn 1.5× → level up your tier. Every interaction compounds.</p>
              </div>
              <a href="#waitlist" className="mt-4 flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium">
                Get early access <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12">One Signup. Instant Value.</h2>
          <div className="space-y-4">
            {[
              { n: '01', title: 'Sign up once with I-ID', desc: 'One identity across all five platforms. KYC once. Done.' },
              { n: '02', title: 'Browse millions of tickets', desc: 'InstaPass pulls real inventory from Ticket Evolution + Victory Live. Interactive 3D venue maps. No junk fees.' },
              { n: '03', title: 'Pay with InstaCash, earn instantly', desc: 'Top up your wallet via ACH or debit. Pay for tickets, earn 10 pts per dollar. 1.5× with InstaCash payment.' },
              { n: '04', title: 'Points compound across every platform', desc: 'Every ticket, every payment, every referral, every event moment — all earn InstaPoints. Tier up for higher multipliers.' },
              { n: '05', title: 'Redeem anywhere', desc: 'Use points for more tickets, gift cards, wallet credit, or donate to charity. Points never expire if you stay active.' },
            ].map(step => (
              <div key={step.n} className="flex gap-5 glass rounded-2xl p-5">
                <span className="text-2xl font-black gradient-text shrink-0">{step.n}</span>
                <div>
                  <p className="font-bold text-white">{step.title}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-10">FAQ</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="glass rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-medium text-sm">{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6 text-center border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-black mb-4">Ready to earn on every ticket?</h2>
          <p className="text-gray-400 mb-8">Join the waitlist for early access and 1,000 founding-member InstaPoints.</p>
          <div className="flex justify-center">
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-violet-600 flex items-center justify-center"><Zap className="w-3 h-3 text-white" /></div>
            <span>IPIC-Tech Holdings © 2026</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
