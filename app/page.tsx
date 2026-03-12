"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import TripForm from "./components/TripForm";
import ItineraryCard from "./components/ItineraryCard";
import { generateItinerary, Itinerary, TripFormData } from "./utils/openai";

// Leaflet requires browser APIs — must disable SSR
const MapView = dynamic(() => import("./components/MapView"), { ssr: false });

type AppState = "landing" | "form" | "loading" | "result";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleFormSubmit = async (formData: TripFormData) => {
    setAppState("loading");
    setError(null);
    try {
      const result = await generateItinerary(formData);
      setItinerary(result);
      setAppState("result");
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setAppState("form");
    }
  };

  const formatItineraryAsText = (data: Itinerary): string => {
    let text = `🌍 TRAVEL ITINERARY: ${data.destination.toUpperCase()}\n`;
    text += "═".repeat(50) + "\n\n";

    data.days.forEach((day) => {
      text += `📅 DAY ${day.day}\n`;
      text += "─".repeat(30) + "\n";
      text += `🌅 Morning:\n${day.morning}\n\n`;
      text += `☀️  Afternoon:\n${day.afternoon}\n\n`;
      text += `🌙 Evening:\n${day.evening}\n\n`;
    });

    if (data.foodSuggestions?.length) {
      text += "🍽️  FOOD SUGGESTIONS\n";
      text += "─".repeat(30) + "\n";
      data.foodSuggestions.forEach((item, i) => {
        text += `${i + 1}. ${item}\n`;
      });
      text += "\n";
    }

    if (data.travelTips?.length) {
      text += "💡 TRAVEL TIPS\n";
      text += "─".repeat(30) + "\n";
      data.travelTips.forEach((tip, i) => {
        text += `${i + 1}. ${tip}\n`;
      });
    }

    return text;
  };

  const handleCopy = async () => {
    if (!itinerary) return;
    const text = formatItineraryAsText(itinerary);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setError("Failed to copy to clipboard.");
    }
  };

  const handleDownload = () => {
    if (!itinerary) return;
    const text = formatItineraryAsText(itinerary);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${itinerary.destination
      .replace(/\s+/g, "-")
      .toLowerCase()}-itinerary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-200/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        {/* ── Landing Page ── */}
        {appState === "landing" && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center animate-fade-in">
            <div className="mb-6">
              <span className="text-7xl">✈️</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-800 mb-4 leading-tight">
              AI Travel{" "}
              <span className="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
                Planner
              </span>
            </h1>
            <p className="text-xl text-slate-500 max-w-md mb-10 leading-relaxed">
              Generate a personalized travel itinerary using AI — tailored to
              your style, budget, and dream destination.
            </p>
            <button
              onClick={() => setAppState("form")}
              className="px-10 py-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
            >
              🗺️ Plan My Trip
            </button>
          </div>
        )}

        {/* ── Form Page ── */}
        {(appState === "form" || appState === "loading") && (
          <div>
            <button
              onClick={() => {
                setAppState("landing");
                setError(null);
              }}
              className="mb-6 flex items-center gap-1.5 text-slate-500 hover:text-slate-700 transition-colors text-sm font-medium"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>

            <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/60 p-8">
              <div className="text-center mb-8">
                <span className="text-4xl mb-3 block">🌏</span>
                <h2 className="text-2xl font-bold text-slate-800">
                  Plan Your Trip
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Tell us about your dream vacation
                </p>
              </div>

              {error && (
                <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
                  <svg
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <TripForm
                onSubmit={handleFormSubmit}
                isLoading={appState === "loading"}
              />
            </div>

            {/* Loading overlay */}
            {appState === "loading" && (
              <div className="mt-8 text-center">
                <div className="inline-flex flex-col items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-lg border border-white/60">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-sky-200 border-t-sky-500 animate-spin" />
                    <span className="absolute inset-0 flex items-center justify-center text-2xl">
                      ✈️
                    </span>
                  </div>
                  <div>
                    <p className="text-slate-700 font-semibold text-lg">
                      Planning your trip...
                    </p>
                    <p className="text-slate-400 text-sm mt-0.5">
                      Our AI is crafting your perfect itinerary
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Result Page ── */}
        {appState === "result" && itinerary && (
          <div ref={resultRef} className="space-y-6">
            {/* Back button */}
            <button
              onClick={() => {
                setAppState("form");
                setItinerary(null);
              }}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 transition-colors text-sm font-medium"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Plan Another Trip
            </button>

            {/* Result header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-6 py-2.5 rounded-full shadow-md text-sm font-semibold">
                <span>🗺️</span>
                <span>Your Itinerary is Ready!</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mt-3">
                {itinerary.destination}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {itinerary.days.length} day
                {itinerary.days.length !== 1 ? "s" : ""} ·{" "}
                {itinerary.days.length * 3} planned activities
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border-2 border-sky-400 text-sky-600 font-semibold rounded-xl hover:bg-sky-50 transition-all duration-200 text-sm shadow-sm"
              >
                {copied ? (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                    Copy Itinerary
                  </>
                )}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-indigo-700 transition-all duration-200 text-sm shadow-md"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download as Text
              </button>
            </div>

            {/* ── Interactive Map ── */}
            <MapView
              destination={itinerary.destination}
              keyPlaces={itinerary.keyPlaces ?? []}
            />

            {/* ── Day Cards ── */}
            <div className="space-y-4">
              {itinerary.days.map((day) => (
                <div
                  key={day.day}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-slate-100 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-sky-500 to-indigo-600 px-6 py-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                      <span className="bg-white/25 rounded-full w-8 h-8 flex items-center justify-center text-sm font-extrabold">
                        {day.day}
                      </span>
                      Day {day.day}
                    </h3>
                  </div>
                  <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="rounded-xl p-4 bg-amber-50 border border-amber-100">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-lg">🌅</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                          Morning
                        </span>
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed">
                        {day.morning}
                      </p>
                    </div>
                    <div className="rounded-xl p-4 bg-sky-50 border border-sky-100">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-lg">☀️</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                          Afternoon
                        </span>
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed">
                        {day.afternoon}
                      </p>
                    </div>
                    <div className="rounded-xl p-4 bg-indigo-50 border border-indigo-100">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-lg">🌙</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                          Evening
                        </span>
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed">
                        {day.evening}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Food Suggestions ── */}
            {itinerary.foodSuggestions?.length > 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-400 to-rose-500 px-6 py-4">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <span>🍽️</span> Food Suggestions
                  </h3>
                </div>
                <div className="p-5">
                  <ul className="space-y-2.5">
                    {itinerary.foodSuggestions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-0.5 flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-slate-700 text-sm leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* ── Travel Tips ── */}
            {itinerary.travelTips?.length > 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <span>💡</span> Travel Tips
                  </h3>
                </div>
                <div className="p-5">
                  <ul className="space-y-2.5">
                    {itinerary.travelTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-0.5 flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-slate-700 text-sm leading-relaxed">
                          {tip}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
