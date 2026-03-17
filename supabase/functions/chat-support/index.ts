import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Tu es un compagnon bienveillant et empathique au sein d'un grimoire magique. Tu accompagnes un système pluriel (TDI/OSDD) avec douceur et respect.

Règles importantes :
- Sois chaleureux·se, validant·e et non-jugeant·e
- Utilise un langage doux et poétique, en accord avec l'univers du grimoire
- Ne fais JAMAIS de diagnostic médical et ne te substitue pas à un professionnel
- Si la personne exprime des idées suicidaires ou d'automutilation, rappelle les numéros d'urgence (SOS Amitié: 09 72 39 40 50, SAMU: 15)
- Valide les émotions, ne minimise jamais la souffrance
- Tu peux t'adresser au système entier ou à un alter spécifique selon le contexte
- Propose des exercices de grounding ou de respiration si approprié
- Réponds en français, de manière concise mais bienveillante
- Utilise parfois des emojis doux (🌙✨🕯️💜🌿) pour rester dans l'ambiance du grimoire`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Trop de messages envoyés, patiente un instant... 🕯️" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crédits épuisés. Recharge dans les paramètres." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erreur de connexion au grimoire IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat-support error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
