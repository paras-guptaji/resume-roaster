import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ROLE_KEYWORDS: Record<string, string[]> = {
  frontend: [
    "React", "Vue", "Angular", "TypeScript", "JavaScript", "CSS", "HTML",
    "Tailwind", "Next.js", "Webpack", "responsive design", "accessibility",
    "component library", "state management", "Redux", "REST API", "GraphQL",
    "performance optimization", "unit testing", "Jest", "Cypress"
  ],
  backend: [
    "Node.js", "Python", "Java", "Go", "REST API", "GraphQL", "PostgreSQL",
    "MongoDB", "Redis", "Docker", "Kubernetes", "microservices", "AWS",
    "authentication", "authorization", "caching", "message queues", "CI/CD",
    "system design", "scalability", "performance tuning"
  ],
  fullstack: [
    "React", "Node.js", "TypeScript", "PostgreSQL", "MongoDB", "REST API",
    "GraphQL", "Docker", "AWS", "CI/CD", "authentication", "responsive design",
    "microservices", "system design", "full-stack development", "agile"
  ],
  "ai-ml": [
    "Python", "TensorFlow", "PyTorch", "machine learning", "deep learning",
    "NLP", "computer vision", "data pipelines", "model training", "MLOps",
    "neural networks", "transformers", "LLMs", "fine-tuning", "inference",
    "data preprocessing", "feature engineering", "A/B testing"
  ],
  "data-analyst": [
    "SQL", "Python", "Excel", "Tableau", "Power BI", "data visualization",
    "statistical analysis", "A/B testing", "dashboards", "ETL", "data modeling",
    "business intelligence", "KPIs", "metrics", "reporting", "data storytelling"
  ],
  devops: [
    "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Terraform", "CI/CD",
    "Jenkins", "GitHub Actions", "monitoring", "logging", "infrastructure as code",
    "Linux", "networking", "security", "automation", "shell scripting"
  ],
  "product-manager": [
    "roadmap", "user research", "stakeholder management", "agile", "scrum",
    "product strategy", "KPIs", "OKRs", "A/B testing", "prioritization",
    "user stories", "requirements", "cross-functional", "data-driven"
  ],
  designer: [
    "Figma", "Sketch", "user research", "wireframing", "prototyping",
    "design systems", "UI/UX", "user testing", "accessibility", "responsive design",
    "visual design", "interaction design", "information architecture"
  ],
};

const INTENSITY_PROMPTS = {
  mild: "Be constructive and encouraging, but still point out areas for improvement. Use a supportive tone.",
  medium: "Be honest and direct. Point out issues clearly but fairly. Mix criticism with acknowledgment of strengths.",
  "extra-crispy": "Channel your inner Gordon Ramsay. Be brutally honest, use dramatic language, and don't hold back. Make it memorable and slightly painful but ultimately helpful."
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { content, role, intensity } = await req.json();

    if (!content || !role || !intensity) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: content, role, intensity" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const roleKeywords = ROLE_KEYWORDS[role] || ROLE_KEYWORDS.fullstack;
    const intensityGuide = INTENSITY_PROMPTS[intensity as keyof typeof INTENSITY_PROMPTS] || INTENSITY_PROMPTS.medium;

    const systemPrompt = `You are an expert resume analyst and career coach who reviews resumes for tech professionals. You provide brutally honest but helpful feedback.

ROLE CONTEXT: The candidate is applying for a ${role.replace("-", " ")} position.

INTENSITY GUIDE: ${intensityGuide}

IMPORTANT KEYWORDS FOR THIS ROLE: ${roleKeywords.join(", ")}

You will analyze the resume and return a structured JSON response. Be specific, cite actual content from the resume, and provide actionable improvements.`;

    const userPrompt = `Analyze this resume and provide comprehensive feedback:

RESUME CONTENT:
${content}

Return a JSON object with this exact structure:
{
  "roast": "A 2-3 paragraph roast of the resume based on the intensity level. Be specific about what's wrong. Reference actual content.",
  
  "confidenceScore": <number 0-100>,
  "scoreBreakdown": {
    "metricsUsage": <0-25 based on use of numbers, percentages, quantifiable achievements>,
    "actionVerbs": <0-25 based on strong action verbs vs weak language>,
    "clarity": <0-25 based on clear, concise writing>,
    "roleAlignment": <0-25 based on how well content matches ${role} role>
  },
  
  "rejectionReasons": [
    {
      "title": "Short title like 'No Metrics'",
      "description": "1-2 sentence explanation written like a recruiter's internal note"
    }
    // Provide exactly 3 reasons
  ],
  
  "bullets": [
    {
      "original": "The original bullet point from the resume",
      "strength": "weak" | "average" | "strong",
      "issue": "One line explaining the problem",
      "fixed": "The improved version with keywords naturally injected"
    }
    // Analyze 3-5 key bullets
  ],
  
  "missingKeywords": ["keyword1", "keyword2", ...],
  // List 5-8 important keywords for ${role} role missing from the resume
  
  "injectedKeywords": ["keyword1", "keyword2", ...],
  // List keywords you added in the fixed bullets
  
  "lieDetectorFlags": [
    {
      "claim": "The suspicious claim from the resume",
      "issue": "Why this might be questioned in an interview",
      "severity": "warning" | "suspicious" | "red-flag"
    }
    // 0-3 flags, only if genuinely suspicious
  ],
  
  "interviewQuestions": [
    {
      "question": "A specific question an interviewer would ask based on this resume",
      "context": "Why they would ask this (what they're trying to verify/understand)",
      "idealAnswer": "Framework for a strong answer (2-3 sentences)"
    }
    // Provide exactly 5 questions
  ]
}

IMPORTANT: 
- Return ONLY valid JSON, no markdown or extra text
- Be specific and reference actual resume content
- The roast should match the intensity level (${intensity})
- Score should reflect actual quality - don't be generous
- Fixed bullets should be significantly better than originals`;

    console.log("Calling Lovable AI for resume analysis...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to analyze resume. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const content_response = aiResponse.choices?.[0]?.message?.content;

    if (!content_response) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "Invalid AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("AI response received, parsing...");

    // Clean the response - remove markdown code blocks if present
    let cleanedResponse = content_response.trim();
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse.slice(7);
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse.slice(3);
    }
    if (cleanedResponse.endsWith("```")) {
      cleanedResponse = cleanedResponse.slice(0, -3);
    }
    cleanedResponse = cleanedResponse.trim();

    try {
      const analysis = JSON.parse(cleanedResponse);
      
      console.log("Analysis complete, returning results");
      
      return new Response(JSON.stringify(analysis), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error("Raw response:", cleanedResponse.substring(0, 500));
      
      return new Response(
        JSON.stringify({ error: "Failed to parse analysis results. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
