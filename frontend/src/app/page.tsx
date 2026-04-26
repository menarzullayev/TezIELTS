import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Star,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: "TezIELTS - O'zbekistondagi eng zamonaviy IELTS Mock platformasi",
  description:
    "AI orqali baholanadigan, rasmiy IELTS standartlariga to'liq javob beruvchi Mock testlar. Speaking va Writing xatolaringizni aniq bilib oling.",
  openGraph: {
    title: 'TezIELTS - Premium Mock Tests',
    description:
      "AI orqali baholanadigan, rasmiy IELTS standartlariga to'liq javob beruvchi Mock testlar.",
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'TezIELTS',
  description: 'Premium IELTS Preparation and Mock Tests Platform',
  url: 'https://oneielts.uz',
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-24 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-100/40 via-white to-white -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600 font-semibold text-sm mb-8 animate-in slide-in-from-bottom-4 duration-500">
            <SparklesIcon className="w-4 h-4" />
            AI Baholash Tizimi Ishga Tushdi
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-8">
            IELTS da{' '}
            <span className="bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
              8.0+ Olish
            </span>{' '}
            Uchun <br className="hidden md:block" />
            Eng Zo'r Simulyator.
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-12 leading-relaxed">
            Haqiqiy imtihon muhiti, kiritilgan audio va testlar. AI yordamida
            Speaking va Writing bo'yicha batafsil xatolar tahlili.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/tests"
              prefetch={true}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:shadow-xl hover:shadow-orange-200 hover:-translate-y-1 transition-all"
            >
              Start Free Mock Test
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#pricing"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              Tariflarni ko'rish
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof / Features */}
      <section className="bg-slate-50 py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="w-8 h-8 text-blue-500" />}
              title="15,000+ O'quvchilar"
              desc="Butun O'zbekiston bo'ylab minglab o'quvchilar ishonchi."
            />
            <FeatureCard
              icon={<Trophy className="w-8 h-8 text-yellow-500" />}
              title="O'rtacha Ball 7.0"
              desc="Bizning platformamizda tayyorlanganlarning o'rtacha natijasi."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-orange-500" />}
              title="AI Tahlil"
              desc="Xatolaringizni sun'iy intellekt orqali shu zahoti bilib oling."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
            Sizga mos tarifni tanlang
          </h2>
          <p className="text-xl text-slate-500 mb-12">
            Yashirin to'lovlarsiz. Istalgan vaqtda bekor qilishingiz mumkin.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            {/* Free Plan */}
            <div className="bg-white border-2 border-slate-100 rounded-3xl p-8 hover:border-slate-200 transition-colors">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Basic</h3>
              <div className="text-4xl font-extrabold text-slate-900 mb-6">
                Bepul
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-600 font-medium">
                  <CheckCircle2 className="text-green-500 w-5 h-5" /> 3 ta Mock
                  Test
                </li>
                <li className="flex items-center gap-3 text-slate-600 font-medium">
                  <CheckCircle2 className="text-green-500 w-5 h-5" /> Reading va
                  Listening tahlili
                </li>
                <li className="flex items-center gap-3 text-slate-400 font-medium">
                  <span className="w-5 h-5 flex items-center justify-center">
                    -
                  </span>{' '}
                  Speaking va Writing AI yo'q
                </li>
              </ul>
              <Link
                href="/tests"
                className="block w-full text-center bg-slate-100 text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Boshlash
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="relative bg-slate-900 border-2 border-slate-900 rounded-3xl p-8 transform md:-translate-y-4 shadow-2xl">
              <div className="absolute top-0 right-8 transform -translate-y-1/2">
                <span className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Eng Ommabop
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
              <div className="text-4xl font-extrabold text-white mb-6">
                99,000{' '}
                <span className="text-lg text-slate-400 font-normal">
                  so'm/oy
                </span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-300 font-medium">
                  <CheckCircle2 className="text-orange-500 w-5 h-5" /> Barcha
                  Mock Testlar
                </li>
                <li className="flex items-center gap-3 text-slate-300 font-medium">
                  <CheckCircle2 className="text-orange-500 w-5 h-5" /> To'liq AI
                  Baholash (Spk/Wrt)
                </li>
                <li className="flex items-center gap-3 text-slate-300 font-medium">
                  <CheckCircle2 className="text-orange-500 w-5 h-5" /> Natijalar
                  tarixi va progress
                </li>
              </ul>
              <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all">
                Sotib olish
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m14.485-6.364l-2.121 2.121M7.636 17.364l-2.121 2.121m12.728 0l-2.121-2.121M7.636 6.636L5.515 4.515" />
    </svg>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}
