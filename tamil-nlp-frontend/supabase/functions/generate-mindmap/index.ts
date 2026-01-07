import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, language = 'en' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!text || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log("Generating mindmap for text length:", text.length, "language:", language);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an educational mind map generator. Extract key concepts from text and organize them hierarchically.
            
Output ONLY valid JSON in this exact format:
{
  "title": "Main Topic Title",
  "keywords": [
    {
      "text": "Main Concept 1",
      "level": 1,
      "children": [
        { "text": "Sub-concept 1.1", "level": 2 },
        { "text": "Sub-concept 1.2", "level": 2 }
      ]
    },
    {
      "text": "Main Concept 2", 
      "level": 1,
      "children": []
    }
  ]
}

Rules:
- Title should be a concise summary (3-6 words)
- Extract 3-6 main concepts (level 1)
- Each main concept can have 0-4 sub-concepts (level 2)
- Keep keywords short and clear (1-4 words each)
- Respond in the same language as the input text
- Output ONLY the JSON, no explanations`
          },
          {
            role: "user",
            content: `Language: ${language}\n\nText to analyze:\n${text}`
          }
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      console.error("AI gateway error status:", status);
      
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in response");
    }

    // Parse JSON from response (handle markdown code blocks)
    let jsonStr = content.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/```json?\n?/g, "").replace(/```$/g, "").trim();
    }

    const parsed = JSON.parse(jsonStr);
    console.log("Successfully generated mindmap:", parsed.title);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Generate mindmap error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
