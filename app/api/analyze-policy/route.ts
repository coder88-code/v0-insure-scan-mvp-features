import { generateText } from "ai"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("[v0] Analyzing PDF directly with AI SDK...")
    console.log("[v0] File:", file.name, "Size:", file.size, "bytes")

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log("[v0] Buffer created, calling AI model...")

    const { text: analysisText } = await generateText({
      model: "anthropic/claude-sonnet-4.5",
      system: "You are an expert insurance policy analyzer for the Indian market.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this insurance policy document and extract key information.

Your response MUST be ONLY valid JSON with this exact structure (no markdown, no code blocks, no extra text):
{
  "policyType": "Type of insurance (Health/Life/Motor/etc)",
  "insurer": "Insurance company name",
  "policyNumber": "Policy number if found, otherwise 'Not specified'",
  "sumInsured": "Sum insured amount with currency",
  "premium": "Premium amount if found, otherwise 'Not specified'",
  "tenure": "Policy term if found, otherwise 'Not specified'",
  "coverageStart": "Start date if found, otherwise 'Not specified'",
  "coverageEnd": "End date if found, otherwise 'Not specified'",
  "riskFlags": [
    {
      "type": "high",
      "title": "Brief risk title",
      "description": "Detailed explanation"
    }
  ],
  "coverageGaps": ["Missing coverage 1", "Missing coverage 2"],
  "summary": "Plain language summary in 2-3 sentences"
}

Focus on identifying:
- Hidden exclusions and waiting periods (HIGH RISK)
- Room rent caps and sub-limits (MEDIUM/HIGH RISK)
- Pre-existing disease clauses (HIGH RISK)
- Co-payment requirements (MEDIUM RISK)
- Coverage gaps (no OPD, maternity, dental)
- Insufficient sum assured
- Any unfavorable terms

Return ONLY the JSON object.`,
            },
            {
              type: "file",
              data: buffer,
              mimeType: "application/pdf",
            },
          ],
        },
      ],
      maxTokens: 2000,
      temperature: 0.1,
    })

    console.log("[v0] AI response received, length:", analysisText.length)

    let cleanJson = analysisText.trim()

    // Remove markdown code blocks if present
    if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/```json\n?/g, "").replace(/```\n?/g, "")
    }

    // Find the first { and last } to extract just the JSON
    const firstBrace = cleanJson.indexOf("{")
    const lastBrace = cleanJson.lastIndexOf("}")

    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanJson = cleanJson.substring(firstBrace, lastBrace + 1)
    }

    console.log("[v0] Parsing JSON...")

    const analysis = JSON.parse(cleanJson)

    console.log("[v0] Analysis complete:", analysis.policyType)

    return Response.json({ analysis })
  } catch (error: any) {
    console.error("[v0] Analysis error:", error)
    console.error("[v0] Error message:", error.message)

    // Return a graceful fallback response
    return Response.json({
      analysis: {
        policyType: "Unable to determine",
        insurer: "Unable to determine",
        policyNumber: "Not specified",
        sumInsured: "Not specified",
        premium: "Not specified",
        tenure: "Not specified",
        coverageStart: "Not specified",
        coverageEnd: "Not specified",
        riskFlags: [
          {
            type: "medium",
            title: "Analysis Error",
            description:
              "Unable to fully analyze the policy document. This may be due to document format or quality issues. Please review your policy manually or contact support.",
          },
        ],
        coverageGaps: ["Unable to determine coverage gaps - manual review needed"],
        summary:
          "The policy analysis encountered an error. This may be due to unclear document formatting or scanning quality. Please review your policy document manually.",
      },
    })
  }
}
