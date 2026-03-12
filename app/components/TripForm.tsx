"use client";

import { useState } from "react";
import { TripFormData } from "../utils/openai";

interface TripFormProps {
  onSubmit: (data: TripFormData) => void;
  isLoading: boolean;
}

export default function TripForm({ onSubmit, isLoading }: TripFormProps) {
  const [formData, setFormData] = useState<TripFormData>({
    destination: "",
    days: 3,
    budget: "Medium",
    travelStyle: "Culture",
    travelers: 2,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TripFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TripFormData, string>> = {};
    if (!formData.destination.trim()) {
      newErrors.destination = "Please enter a destination.";
    }
    if (formData.days < 1 || formData.days > 30) {
      newErrors.days = "Days must be between 1 and 30.";
    }
    if (formData.travelers < 1 || formData.travelers > 50) {
      newErrors.travelers = "Travelers must be between 1 and 50.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200 text-slate-700 placeholder-slate-400";
  const labelClass = "block text-sm font-semibold text-slate-600 mb-1.5";
  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Destination */}
      <div>
        <label className={labelClass}>
          <span className="mr-1.5">📍</span>Destination
        </label>
        <input
          type="text"
          placeholder="e.g. Paris, Tokyo, Bali..."
          value={formData.destination}
          onChange={(e) =>
            setFormData({ ...formData, destination: e.target.value })
          }
          className={inputClass}
          disabled={isLoading}
        />
        {errors.destination && (
          <p className={errorClass}>{errors.destination}</p>
        )}
      </div>

      {/* Days + Travelers */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            <span className="mr-1.5">📅</span>Number of Days
          </label>
          <input
            type="number"
            min={1}
            max={30}
            value={formData.days}
            onChange={(e) =>
              setFormData({ ...formData, days: parseInt(e.target.value) || 1 })
            }
            className={inputClass}
            disabled={isLoading}
          />
          {errors.days && <p className={errorClass}>{errors.days}</p>}
        </div>
        <div>
          <label className={labelClass}>
            <span className="mr-1.5">👥</span>Travelers
          </label>
          <input
            type="number"
            min={1}
            max={50}
            value={formData.travelers}
            onChange={(e) =>
              setFormData({
                ...formData,
                travelers: parseInt(e.target.value) || 1,
              })
            }
            className={inputClass}
            disabled={isLoading}
          />
          {errors.travelers && (
            <p className={errorClass}>{errors.travelers}</p>
          )}
        </div>
      </div>

      {/* Budget */}
      <div>
        <label className={labelClass}>
          <span className="mr-1.5">💰</span>Budget
        </label>
        <select
          value={formData.budget}
          onChange={(e) =>
            setFormData({
              ...formData,
              budget: e.target.value as TripFormData["budget"],
            })
          }
          className={inputClass}
          disabled={isLoading}
        >
          <option value="Low">Low – Budget-friendly</option>
          <option value="Medium">Medium – Comfortable</option>
          <option value="Luxury">Luxury – Premium experience</option>
        </select>
      </div>

      {/* Travel Style */}
      <div>
        <label className={labelClass}>
          <span className="mr-1.5">🎯</span>Travel Style
        </label>
        <select
          value={formData.travelStyle}
          onChange={(e) =>
            setFormData({
              ...formData,
              travelStyle: e.target.value as TripFormData["travelStyle"],
            })
          }
          className={inputClass}
          disabled={isLoading}
        >
          <option value="Adventure">🏔️ Adventure</option>
          <option value="Relaxing">🌴 Relaxing</option>
          <option value="Culture">🏛️ Culture</option>
          <option value="Food">🍜 Food</option>
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 px-6 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-base"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Planning your trip...
          </>
        ) : (
          <>✨ Generate Itinerary</>
        )}
      </button>
    </form>
  );
}
