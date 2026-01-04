import { UploadSection } from "@/components/upload-section"
import { Shield, FileSearch, AlertTriangle, CheckCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <h1 className="text-xl font-semibold">InsureScan</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Shield className="h-4 w-4" />
            AI-Powered Insurance Intelligence
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
            Decode Your Insurance Policy in <span className="text-primary">Seconds</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Upload any insurance document and instantly understand what you're covered for, hidden risks, and coverage
            gaps—in plain language.
          </p>
        </div>

        {/* Upload Component */}
        <div className="max-w-3xl mx-auto mt-12">
          <UploadSection />
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">What InsureScan Detects</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Hidden Exclusions</h4>
              <p className="text-muted-foreground text-sm">
                Identifies waiting periods, pre-existing condition clauses, and claim rejection triggers buried in fine
                print.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <FileSearch className="h-6 w-6 text-accent" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Coverage Gaps</h4>
              <p className="text-muted-foreground text-sm">
                Detects missing coverage, low sub-limits, room rent caps, and insufficient sum assured for your needs.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Plain Summary</h4>
              <p className="text-muted-foreground text-sm">
                Translates complex policy jargon into simple, understandable language so you know exactly what you have.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-4 py-16 md:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Upload Your Policy",
                description: "Drop any insurance document—PDF, image, or scanned copy. No login required.",
              },
              {
                step: "02",
                title: "AI Analyzes Everything",
                description:
                  "Our OCR + NLP engine reads the entire document and extracts key terms, exclusions, and coverage details.",
              },
              {
                step: "03",
                title: "Get Instant Report",
                description:
                  "Receive a Smart Policy Report highlighting risks, gaps, and a plain-language summary in seconds.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 InsureScan. Making insurance transparent and understandable.</p>
        </div>
      </footer>
    </div>
  )
}
