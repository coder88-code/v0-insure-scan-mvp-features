"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Upload, FileText, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PolicyReport } from "@/components/policy-report"

type PolicyAnalysis = {
  policyType: string
  insurer: string
  policyNumber?: string
  sumInsured: string
  premium?: string
  tenure?: string
  coverageStart?: string
  coverageEnd?: string
  riskFlags: Array<{
    type: "high" | "medium" | "low"
    title: string
    description: string
  }>
  coverageGaps: string[]
  summary: string
}

export function UploadSection() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<PolicyAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }, [])

  const handleAnalyze = async () => {
    if (!file) return

    setIsAnalyzing(true)
    setError(null)

    try {
      console.log("[v0] Uploading PDF for AI analysis...")

      const formData = new FormData()
      formData.append("file", file)

      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 90000) // 90 second timeout for AI analysis

      const analyzeResponse = await fetch("/api/analyze-policy", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      })

      clearTimeout(timeout)

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json()
        throw new Error(errorData.error || "Failed to analyze policy")
      }

      const { analysis: policyAnalysis } = await analyzeResponse.json()
      console.log("[v0] Analysis complete successfully")

      setAnalysis(policyAnalysis)
    } catch (err: any) {
      console.error("[v0] Analysis error:", err)

      if (err.name === "AbortError") {
        setError("Request timed out. The PDF may be too large or complex. Please try with a smaller document.")
      } else {
        setError(err.message || "An error occurred during analysis")
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setAnalysis(null)
    setError(null)
    setIsAnalyzing(false)
  }

  if (analysis) {
    return <PolicyReport onReset={handleReset} fileName={file?.name || "Policy Document"} analysis={analysis} />
  }

  return (
    <Card className="p-8">
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Upload Insurance Policy</h3>
              <p className="text-muted-foreground mb-4">Drop your PDF here, or click to browse</p>
            </div>
            <label htmlFor="file-upload">
              <Button type="button" asChild>
                <span>Choose File</span>
              </Button>
            </label>
            <input id="file-upload" type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" />
            <p className="text-xs text-muted-foreground">Supports PDF only • Max 10MB • No login required</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted">
            <FileText className="h-8 w-8 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{file.name}</h4>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
              </p>
            </div>
            {!isAnalyzing && (
              <Button variant="ghost" size="sm" onClick={handleReset}>
                Remove
              </Button>
            )}
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {isAnalyzing ? (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">Analyzing Your Policy...</h4>
              <p className="text-muted-foreground text-sm">
                Our AI is reading the document and identifying key terms, exclusions, and risks.
              </p>
            </div>
          ) : (
            <Button onClick={handleAnalyze} size="lg" className="w-full">
              Analyze Policy
            </Button>
          )}
        </div>
      )}
    </Card>
  )
}
