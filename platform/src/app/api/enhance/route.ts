import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const hasKey = !!(
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY ||
    process.env.GEMINI_KEY ||
    process.env.GEMINI_API
  );

  return NextResponse.json({
    status: "online",
    geminiConfigured: hasKey,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, fieldType, applicantName, jobRecommendedFor, apiKey: clientApiKey } = body;

    const apiKey =
      clientApiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENAI_API_KEY ||
      process.env.GEMINI_KEY ||
      process.env.GEMINI_API;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "MISSING_API_KEY",
          message:
            "Gemini API key is not configured. Please provide an API key or configure GEMINI_API_KEY in the server environment.",
        },
        { status: 400 }
      );
    }

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        {
          error: "EMPTY_TEXT",
          message: "Please enter some notes or draft comments first to enhance with Gemini.",
        },
        { status: 400 }
      );
    }

    let fieldScope = "General Interview Feedback Comments";
    if (fieldType === "professionalComments") {
      fieldScope =
        "Professional Comments (evaluating academic qualifications, technical training, industry background, domain competence, project deliverables, and execution ability)";
    } else if (fieldType === "personalityComments") {
      fieldScope =
        "Personality Comments (evaluating interpersonal demeanor, attitude, communication skills, confidence, teamwork, adaptability, and professional presentation)";
    } else if (fieldType === "otherComments") {
      fieldScope =
        "Other Comments & Recommendations (evaluating overall fit, leadership potential, onboarding readiness, or final hiring observations)";
    }

    const candidateContext = applicantName ? `The applicant's name is ${applicantName}.` : "Refer to the applicant as 'the candidate' if needed.";
    const roleContext = jobRecommendedFor ? `Target position / role: ${jobRecommendedFor}.` : "";

    const prompt = `You are an expert executive HR interviewer and corporate talent assessment specialist.
Your task is to take the interviewer's brief draft notes and rewrite/expand them into articulate, comprehensive, and highly professional evaluation comments.

Context & Instructions:
- Section: ${fieldScope}
- ${candidateContext}
- ${roleContext}
- Enhance the draft notes with formal corporate expressions, sophisticated vocabulary, and polished sentence structures.
- Elaborate and expand upon the interviewer's observations to provide substantive, thorough evaluation comments (fill more words meaningfully without unnecessary fluff or rambling).
- Strictly maintain the interviewer's original intent, sentiment, and assessment.
- Do NOT include any introductory or concluding conversational text (e.g. "Here is the enhanced version:", quotes, or markdown backticks). Output ONLY the final enhanced comments text directly.

Interviewer's Draft Notes:
"${text.trim()}"`;

    const modelsToTry = [
      process.env.GEMINI_MODEL || "gemini-2.5-flash",
      "gemini-1.5-flash",
      "gemini-pro",
    ];

    let lastError = "";

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 1000,
            },
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const errBody = await response.text();
          lastError = `Gemini API returned status ${response.status}: ${errBody}`;
          // If model not found (404), try next model
          if (response.status === 404) {
            continue;
          }
          break;
        }

        const data = await response.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (candidateText && typeof candidateText === "string") {
          return NextResponse.json({
            enhancedText: candidateText.trim(),
          });
        } else {
          lastError = "No text content generated by Gemini.";
        }
      } catch (err: any) {
        lastError = err?.message || "Network error contacting Gemini API.";
      }
    }

    return NextResponse.json(
      {
        error: "GENERATION_FAILED",
        message: lastError || "Failed to generate enhanced text from Gemini.",
      },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("Error in /api/enhance:", error);
    return NextResponse.json(
      {
        error: "SERVER_ERROR",
        message: error?.message || "Internal server error.",
      },
      { status: 500 }
    );
  }
}
