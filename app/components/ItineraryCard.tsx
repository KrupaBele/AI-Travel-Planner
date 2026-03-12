"use client";

import { Itinerary } from "../utils/openai";

interface ItineraryCardProps {
  itinerary: Itinerary;
  onCopy: () => void;
  onDownload: () => void;
  copied: boolean;
}

const TimeBlock = ({
  icon,
  label,
  text,
  color,
}: {
  icon: string;
  label: string;
  text: string;
  color: string;
}) => (
  <div className={`rounded-xl p-4 ${color}`}>
    <div className="flex items-center gap-2 mb-1.5">
      <span className="text-lg">{icon}</span>
      <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
        {label}
      </span>
    </div>
    <p className="text-slate-700 text-sm leading-relaxed">{text}</p>
  </div>
);

export default function ItineraryCard({
  itinerary,
  onCopy,
  onDownload,
  copied,
}: ItineraryCardProps) {
  return (
    <div className="mt-10 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-6 py-2.5 rounded-full shadow-md text-sm font-semibold mb-2">
          <span>🗺️</span>
          <span>Your Itinerary is Ready!</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mt-3">
          {itinerary.destination}
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          {itinerary.days.length} day{itinerary.days.length !== 1 ? "s" : ""} ·{" "}
          {itinerary.days.length * 3} planned activities
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onCopy}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border-2 border-sky-400 text-sky-600 font-semibold rounded-xl hover:bg-sky-50 transition-all duration-200 text-sm shadow-sm"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy Itinerary
            </>
          )}
        </button>
        <button
          onClick={onDownload}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-indigo-700 transition-all duration-200 text-sm shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download as Text
        </button>
      </div>

      {/* Day Cards */}
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
              <TimeBlock
                icon="🌅"
                label="Morning"
                text={day.morning}
                color="bg-amber-50 border border-amber-100"
              />
              <TimeBlock
                icon="☀️"
                label="Afternoon"
                text={day.afternoon}
                color="bg-sky-50 border border-sky-100"
              />
              <TimeBlock
                icon="🌙"
                label="Evening"
                text={day.evening}
                color="bg-indigo-50 border border-indigo-100"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Food Suggestions */}
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
                  <span className="text-slate-700 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Travel Tips */}
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
                  <span className="text-slate-700 text-sm leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
