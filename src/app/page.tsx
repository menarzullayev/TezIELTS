import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="TezIELTS Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
                TezIELTS
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a href="#" className="hover:text-orange-600 transition-colors">Features</a>
              <a href="#" className="hover:text-orange-600 transition-colors">Pricing</a>
              <a href="#" className="hover:text-orange-600 transition-colors">About</a>
              <button className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-orange-200 transition-all">
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 animate-float">
              <Image
                src="/logo.png"
                alt="TezIELTS Hero Logo"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6">
            IELTSga <span className="bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">Tez</span> va Oson tayyorlaning
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed">
            AI texnologiyalari yordamida real imtihon muhitida mashq qiling, 
            xatolaringizni darhol aniqlang va natijangizni oshiring.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-10 py-4 rounded-2xl text-lg font-bold hover:scale-105 transition-transform shadow-xl shadow-orange-100">
              Free Mock Test
            </button>
            <button className="bg-white border-2 border-slate-200 text-slate-700 px-10 py-4 rounded-2xl text-lg font-bold hover:bg-slate-50 transition-colors">
              Platformani ko'rish
            </button>
          </div>

          {/* Stats/Trust Bar */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-100 pt-16">
            <div>
              <p className="text-3xl font-bold text-slate-900">50K+</p>
              <p className="text-slate-500 text-sm">Foydalanuvchilar</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">100+</p>
              <p className="text-slate-500 text-sm">Mock Testlar</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">AI</p>
              <p className="text-slate-500 text-sm">Feedback</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">8.5+</p>
              <p className="text-slate-500 text-sm">O'rtacha natija</p>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
