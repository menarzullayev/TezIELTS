import Link from "next/link";
import { ArrowLeft, Clock, AlertTriangle, PlayCircle, ShieldAlert } from "lucide-react";

export default function TestGuidelinesPage({ params }: { params: { id: string } }) {
  // Normally you fetch test data by ID here. We'll use mock data.
  const testId = params.id;
  
  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link href="/tests" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-orange-600 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Katalogga qaytish
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 sm:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 relative z-10">Test Qoidalari va Yo'riqnoma</h1>
            <p className="text-slate-300 text-lg relative z-10">
              Test ID: <span className="text-white font-mono bg-white/10 px-2 py-1 rounded">{testId}</span>
            </p>
          </div>

          <div className="p-8 sm:p-12">
            
            <div className="flex flex-col sm:flex-row gap-6 mb-10">
              <div className="flex-1 bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="flex items-center gap-3 text-orange-600 mb-2 font-bold text-lg">
                  <Clock className="w-6 h-6" />
                  Davomiylik
                </div>
                <p className="text-slate-700 font-medium">Test jami 2 soat 45 daqiqa davom etadi. Tanaffuslar mavjud emas.</p>
              </div>

              <div className="flex-1 bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center gap-3 text-blue-600 mb-2 font-bold text-lg">
                  <AlertTriangle className="w-6 h-6" />
                  Uskunalar
                </div>
                <p className="text-slate-700 font-medium">Listening qismi uchun quloqchinlaringiz (naushnik) ishlayotganini tekshiring.</p>
              </div>
            </div>

            <div className="space-y-6 mb-12">
              <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">Muhim Qoidalar</h3>
              <ul className="space-y-4">
                {[
                  "Test vaqtida sahifani yangilash (Refresh) mumkin emas, aks holda natijalar o'chib ketadi.",
                  "Barcha bo'limlar (Listening, Reading, Writing) ketma-ket avtomatik ochiladi.",
                  "Test yakunida Speaking qismi AI orqali onlayn qabul qilinadi.",
                  "Internet tezligi barqaror ekanligiga ishonch hosil qiling."
                ].map((rule, idx) => (
                  <li key={idx} className="flex gap-3 text-slate-600 leading-relaxed font-medium">
                    <ShieldAlert className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-10 text-center">
              <p className="text-sm text-slate-500 font-medium">
                Ro'yxatdan o'tish talab etilmaydi. "Testni Boshlash" tugmasini bosishingiz bilan vaqt ketishni boshlaydi.
              </p>
            </div>

            <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-xl font-extrabold py-5 rounded-2xl hover:shadow-xl hover:shadow-orange-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
              <PlayCircle className="w-7 h-7" />
              Testni Boshlash
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
