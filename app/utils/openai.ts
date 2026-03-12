import Groq from "groq-sdk";

export interface DayItinerary {
  day: number;
  morning: string;
  afternoon: string;
  evening: string;
}

export interface Itinerary {
  destination: string;
  days: DayItinerary[];
  foodSuggestions: string[];
  travelTips: string[];
  keyPlaces: string[];
}

export interface TripFormData {
  destination: string;
  days: number;
  budget: "Low" | "Medium" | "Luxury";
  travelStyle: "Adventure" | "Relaxing" | "Culture" | "Food";
  travelers: number;
}

export async function generateItinerary(
  formData: TripFormData
): Promise<Itinerary> {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Groq API key is missing. Please add NEXT_PUBLIC_GROQ_API_KEY to your .env.local file."
    );
  }

  const client = new Groq({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  const prompt = `Generate a detailed travel itinerary in valid JSON format only.

Destination: ${formData.destination}
Number of Days: ${formData.days}
Budget: ${formData.budget}
Travel Style: ${formData.travelStyle}
Number of Travelers: ${formData.travelers}

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, no extra text):
{
  "destination": "${formData.destination}",
  "days": [
    {
      "day": 1,
      "morning": "Detailed morning activity description",
      "afternoon": "Detailed afternoon activity description",
      "evening": "Detailed evening activity description"
    }
  ],
  "foodSuggestions": ["suggestion 1", "suggestion 2", "suggestion 3", "suggestion 4", "suggestion 5"],
  "travelTips": ["tip 1", "tip 2", "tip 3", "tip 4", "tip 5"],
  "keyPlaces": ["Real specific landmark or attraction name 1", "Real specific landmark or attraction name 2", "Real specific landmark or attraction name 3", "Real specific landmark or attraction name 4", "Real specific landmark or attraction name 5", "Real specific landmark or attraction name 6"]
}

Rules:
- Generate exactly ${formData.days} day entries.
- For keyPlaces, list 6 real, well-known, searchable landmarks, attractions, museums, parks, or neighborhoods in ${formData.destination} that are actually mapped on OpenStreetMap. Use their official names (e.g. "Eiffel Tower, Paris" not just "famous tower").
- Tailor everything to ${formData.travelStyle} travel style and ${formData.budget} budget.
- Include local experiences, hidden gems, and practical details.`;

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are an expert travel planner. Always respond with valid JSON only. No markdown, no code blocks, no extra text — just a raw JSON object.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.8,
    max_tokens: 4096,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response received from Groq.");
  }

  try {
    const cleaned = content.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned) as Itinerary;
    return parsed;
  } catch {
    throw new Error("Failed to parse the AI response. Please try again.");
  }
}
