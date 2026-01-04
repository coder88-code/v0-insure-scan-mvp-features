"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  CheckCircle,
  Info,
  AlertCircle,
  ArrowLeft,
  Shield,
  Calendar,
  DollarSign,
  FileText,
} from "lucide-react"

interface PolicyReportProps {
  onReset: () => void
  fileName: string
  analysis: {
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
}

export function PolicyReport({ onReset, fileName, analysis }: PolicyReportProps) {
  const getRiskIcon = (type: string) => {
    switch (type) {
      case "high":
        return <AlertTriangle className="h-5 w-5 text-destructive" />
      case "medium":
        return <AlertCircle className="h-5 w-5 text-orange-500" />
      case "low":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const getRiskBadgeVariant = (type: string) => {
    switch (type) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onReset}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Upload New Policy
        </Button>
      </div>

      <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Smart Policy Report</h2>
            <p className="text-muted-foreground">{fileName}</p>
          </div>
        </div>
      </Card>

      {/* Policy Overview - Using real analysis data */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Policy Overview</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Policy Type</p>
              <p className="font-medium">{analysis.policyType}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Insurer</p>
              <p className="font-medium">{analysis.insurer}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Sum Insured</p>
              <p className="font-medium">{analysis.sumInsured}</p>
            </div>
          </div>
          {analysis.coverageStart && analysis.coverageEnd && (
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Coverage Period</p>
                <p className="font-medium">
                  {analysis.coverageStart} - {analysis.coverageEnd}
                </p>
              </div>
            </div>
          )}
          {analysis.premium && (
            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Premium</p>
                <p className="font-medium">{analysis.premium}</p>
              </div>
            </div>
          )}
          {analysis.policyNumber && (
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Policy Number</p>
                <p className="font-medium">{analysis.policyNumber}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Risk Flags - Displaying real AI-detected risk flags */}
      {analysis.riskFlags.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Risk Flags Detected
          </h3>
          <div className="space-y-4">
            {analysis.riskFlags.map((flag, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {getRiskIcon(flag.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{flag.title}</h4>
                      <Badge variant={getRiskBadgeVariant(flag.type) as any} className="text-xs">
                        {flag.type === "high" ? "High Risk" : flag.type === "medium" ? "Medium" : "Low"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{flag.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Coverage Gaps - Showing real detected gaps */}
      {analysis.coverageGaps.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-accent" />
            Coverage Gaps
          </h3>
          <ul className="space-y-2">
            {analysis.coverageGaps.map((gap, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground mt-1">•</span>
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Plain Language Summary - Using AI-generated summary */}
      <Card className="p-6 bg-accent/5 border-accent/20">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-accent" />
          Plain Language Summary
        </h3>
        <p className="text-muted-foreground leading-relaxed">{analysis.summary}</p>
      </Card>

      {/* Future Features Placeholder */}
      <Card className="p-6 border-dashed">
        <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Premium features will include multilingual reports, policy comparisons, expert consultations, and personalized
          recommendations.
        </p>
        <Button variant="outline" disabled>
          Upgrade to Premium
        </Button>
      </Card>
    </div>
  )
}
