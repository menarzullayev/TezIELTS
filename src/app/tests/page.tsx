"use client";

import { useState } from "react";
import TestCard from "@/components/tests/TestCard";
import { Search, SlidersHorizontal } from "lucide-react";

// Mock Data
const MOCK_TESTS = [
  { id: "cam18-t1", title: "Cambridge 18 - Test 1", type: "Academic" as const, duration: "2h 45m", participants: 12400, difficulty: "Medium" as const, isPremium: false, progress: 0 },
  { id: "cam18-t2", title: "Cambridge 18 - Test 2", type: "Academic" as const, duration: "2h 45m", participants: 9800, difficulty: "Hard" as const, isPremium: true, progress: 45 },
  { id: "cam18-t3", title: "Cambridge 18 - Test 3", type: "General" as const, duration: "2h 45m", participants: 5200, difficulty: "Easy" as const, isPremium: false, progress: 100 },
  { id: "cam17-t1", title: "Cambridge 17 - Test 1", type: "Academic" as const, duration: "2h 45m", participants: 22100, difficulty: "Medium" as const, isPremium: false, progress: 0 },
];

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Academic" | "General">("All");

  const filteredTests = MOCK_TESTS.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "All" || test.type === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Testlar Katalogi</h1>
            <p className="text-slate-500">O'zingizga mos testni tanlang va tayyorgarlikni boshlang.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Test nomini qidiring..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 outline-none transition-colors shadow-sm"
              />
            </div>
            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-orange-600 transition-colors shadow-sm">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sectional Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {["All", "Academic", "General"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? "bg-slate-900 text-white" 
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
              }`}
            >
              {tab === "All" ? "Barchasi" : tab}
            </button>
          ))}
        </div>

        {/* Series Block */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
            Asosiy To'plamlar
          </h2>
          
          {filteredTests.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTests.map(test => (
                <TestCard key={test.id} {...test} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
              <p className="text-slate-500 font-medium">Hech narsa topilmadi. Boshqa so'z bilan qidirib ko'ring.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
