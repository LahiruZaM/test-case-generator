export async function POST(req) {
  try {
    const body = await req.json();
    const { prompt, count, includePositive, includeNegative } = body;

    if (!prompt || (!includePositive && !includeNegative)) {
      return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
    }

    const hfToken = process.env.HF_TOKEN;
    if (!hfToken) {
      return new Response(JSON.stringify({ error: "Missing Hugging Face API token." }), { status: 401 });
    }

    const positiveCount = includePositive ? Math.ceil(count / 2) : 0;
    const negativeCount = includeNegative ? Math.floor(count / 2) : 0;

    const dynamicPrompt = `
You are a test engineer. Generate exactly ${positiveCount} positive and ${negativeCount} negative test cases for: "${prompt}"

Format the result in valid JSON array like:
[
  {
    "id": "TC0001",
    "type": "Positive",
    "case": "valid test case for the input",
    "expected": "Login successful"
  },
  {
    "id": "TC0002",
    "type": "Negative",
    "case": "invalid test case for input",
    "expected": "Display 'invalid credentials' error"
  }
]

Output ONLY the JSON array — no explanation or markdown.
`;

    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hfToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: dynamicPrompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.5,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      return new Response(JSON.stringify({ error: `Hugging Face API error: ${errorDetails}` }), { status: response.status });
    }

    const data = await response.json();
    const generatedText = data?.[0]?.generated_text || "";

    let testCases = [];
    try {
      testCases = JSON.parse(generatedText);
    } catch (jsonErr) {
      console.error("❌ JSON parse failed", jsonErr);

      // Fallback to plain list handling
      const fallbackLines = generatedText
        .split("\n")
        .filter(line => line.trim() !== "");

      testCases = fallbackLines.map((line, i) => ({
        id: `TC${String(i + 1).padStart(4, '0')}`,
        type: line.toLowerCase().includes("negative") ? "Negative" : "Positive",
        email: "unknown",
        password: "unknown",
        expected: line.trim(),
      }));
    }

    return new Response(JSON.stringify({ result: testCases }), { status: 200 });

  } catch (err) {
    console.error("🔥 Internal error:", err);
    return new Response(JSON.stringify({ error: "Internal server error", message: err.message }), { status: 500 });
  }
}
