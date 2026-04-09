import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Search, 
  Gavel, 
  Layout, 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Download,
  Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";

import { analyzeInnovation, InnovationAnalysis } from "./services/analyzer";
import { searchPriorArt, PriorArtItem } from "./services/priorArt";
import { generateClaims, PatentClaims } from "./services/claims";
import { generatePatentDocument, PatentDocument } from "./services/patentGenerator";

export default function App() {
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<"idle" | "analyzing" | "prior-art" | "claims" | "document" | "complete">("idle");
  
  const [analysis, setAnalysis] = useState<InnovationAnalysis | null>(null);
  const [priorArt, setPriorArt] = useState<PriorArtItem[] | null>(null);
  const [claims, setClaims] = useState<PatentClaims | null>(null);
  const [document, setDocument] = useState<PatentDocument | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setStep("analyzing");
    
    try {
      // Step 1: Analysis
      const analysisData = await analyzeInnovation(description);
      setAnalysis(analysisData);
      
      // Step 2: Prior Art
      setStep("prior-art");
      const priorArtData = await searchPriorArt(description);
      setPriorArt(priorArtData);
      
      // Step 3: Claims
      setStep("claims");
      const claimsData = await generateClaims(description, analysisData);
      setClaims(claimsData);
      
      // Step 4: Document
      setStep("document");
      const docData = await generatePatentDocument(description, analysisData, claimsData);
      setDocument(docData);
      
      setStep("complete");
    } catch (err) {
      console.error(err);
      setError("An error occurred during generation. Please check your API key and try again.");
      setStep("idle");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="border-bottom border-[#E5E5E5] bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1A1A1A] rounded flex items-center justify-center">
              <FileText className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">PatentAI</h1>
            <Badge variant="outline" className="ml-2 font-mono text-[10px] uppercase tracking-wider opacity-60">v1.0.0</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-xs font-medium uppercase tracking-wider opacity-60 hover:opacity-100">
              Documentation
            </Button>
            <Button variant="ghost" size="sm" className="text-xs font-medium uppercase tracking-wider opacity-60 hover:opacity-100">
              Settings
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Input & Status */}
          <div className="lg:col-span-4 space-y-8">
            <section className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-medium tracking-tight">Innovation Input</h2>
                <p className="text-sm text-[#666666]">Describe your technical innovation in detail. Include the problem it solves and how it works.</p>
              </div>
              
              <div className="relative">
                <Textarea 
                  placeholder="e.g., A novel solar panel coating that uses biomimetic nanostructures to increase light absorption by 40% in low-light conditions..."
                  className="min-h-[300px] resize-none border-[#E5E5E5] focus:border-[#1A1A1A] focus:ring-0 transition-colors p-4 text-base leading-relaxed"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isGenerating}
                />
                <div className="absolute bottom-4 right-4 text-[10px] font-mono text-[#999999] uppercase tracking-widest">
                  {description.length} characters
                </div>
              </div>

              <Button 
                className="w-full h-12 bg-[#1A1A1A] hover:bg-[#333333] text-white transition-all group"
                onClick={handleGenerate}
                disabled={isGenerating || !description.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Patent...
                  </>
                ) : (
                  <>
                    Generate Patent
                    <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-600 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}
            </section>

            {/* Progress Tracker */}
            {(isGenerating || step !== "idle") && (
              <section className="p-6 bg-white border border-[#E5E5E5] rounded-xl space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#999999]">Drafting Progress</h3>
                <div className="space-y-4">
                  <ProgressStep 
                    label="Innovation Analysis" 
                    status={step === "analyzing" ? "loading" : (analysis ? "complete" : "pending")} 
                  />
                  <ProgressStep 
                    label="Prior Art Search" 
                    status={step === "prior-art" ? "loading" : (priorArt ? "complete" : "pending")} 
                  />
                  <ProgressStep 
                    label="Claims Generation" 
                    status={step === "claims" ? "loading" : (claims ? "complete" : "pending")} 
                  />
                  <ProgressStep 
                    label="Document Compilation" 
                    status={step === "document" ? "loading" : (document ? "complete" : "pending")} 
                  />
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {step === "idle" && !isGenerating ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20 border-2 border-dashed border-[#E5E5E5] rounded-2xl"
                >
                  <div className="w-16 h-16 bg-white border border-[#E5E5E5] rounded-full flex items-center justify-center shadow-sm">
                    <Layout className="text-[#999999] w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">Ready to Draft</h3>
                    <p className="text-[#666666] max-w-md">Enter your innovation details on the left to begin the AI-powered patent drafting process.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <Tabs defaultValue="analysis" className="w-full">
                    <TabsList className="w-full bg-white border border-[#E5E5E5] p-1 h-12 rounded-xl mb-8">
                      <TabsTrigger value="analysis" className="flex-1 rounded-lg data-[state=active]:bg-[#F8F9FA] data-[state=active]:shadow-none">
                        <Search className="w-4 h-4 mr-2" />
                        Analysis
                      </TabsTrigger>
                      <TabsTrigger value="prior-art" className="flex-1 rounded-lg data-[state=active]:bg-[#F8F9FA]" disabled={!priorArt}>
                        <Layout className="w-4 h-4 mr-2" />
                        Prior Art
                      </TabsTrigger>
                      <TabsTrigger value="claims" className="flex-1 rounded-lg data-[state=active]:bg-[#F8F9FA]" disabled={!claims}>
                        <Gavel className="w-4 h-4 mr-2" />
                        Claims
                      </TabsTrigger>
                      <TabsTrigger value="document" className="flex-1 rounded-lg data-[state=active]:bg-[#F8F9FA]" disabled={!document}>
                        <FileText className="w-4 h-4 mr-2" />
                        Document
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="analysis">
                      <AnalysisTab analysis={analysis} />
                    </TabsContent>

                    <TabsContent value="prior-art">
                      <PriorArtTab priorArt={priorArt} />
                    </TabsContent>

                    <TabsContent value="claims">
                      <ClaimsTab claims={claims} />
                    </TabsContent>

                    <TabsContent value="document">
                      <DocumentTab document={document} />
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

function ProgressStep({ label, status }: { label: string, status: "pending" | "loading" | "complete" }) {
  return (
    <div className="flex items-center justify-between group">
      <span className={`text-sm transition-colors ${status === "pending" ? "text-[#999999]" : "text-[#1A1A1A]"}`}>
        {label}
      </span>
      {status === "loading" && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
      {status === "complete" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
      {status === "pending" && <div className="w-4 h-4 rounded-full border-2 border-[#E5E5E5]" />}
    </div>
  );
}

function AnalysisTab({ analysis }: { analysis: InnovationAnalysis | null }) {
  if (!analysis) return <LoadingSkeleton />;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-[#E5E5E5] shadow-none">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-[#999999]">Technical Field</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{analysis.technicalField}</p>
          </CardContent>
        </Card>
        <Card className="border-[#E5E5E5] shadow-none">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-[#999999]">Novelty Points</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {analysis.noveltyPoints.map((point, i) => (
              <Badge key={i} variant="secondary" className="bg-[#F0F0F0] text-[#1A1A1A] hover:bg-[#E5E5E5] border-none">
                {point}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#E5E5E5] shadow-none">
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-[#999999]">Problem Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed text-[#444444]">{analysis.problem}</p>
        </CardContent>
      </Card>

      <Card className="border-[#E5E5E5] shadow-none">
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-[#999999]">Proposed Solution</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed text-[#444444]">{analysis.solution}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function PriorArtTab({ priorArt }: { priorArt: PriorArtItem[] | null }) {
  if (!priorArt) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Similar Patents & Inventions</h3>
        <p className="text-sm text-[#666666]">Simulated search results based on technical components.</p>
      </div>
      
      <div className="grid gap-6">
        {priorArt.map((item, i) => (
          <Card key={i} className="border-[#E5E5E5] shadow-none hover:border-[#1A1A1A] transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">{item.title}</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Similarity</span>
                <Badge variant={item.similarityScore > 70 ? "destructive" : "outline"} className="font-mono">
                  {item.similarityScore}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-[#444444] leading-relaxed">{item.description}</p>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">Novelty Differentiation</p>
                <p className="text-sm text-blue-900">{item.uniquenessFactor}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ClaimsTab({ claims }: { claims: PatentClaims | null }) {
  if (!claims) return <LoadingSkeleton />;

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Independent Claims</h3>
          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest">Primary Scope</Badge>
        </div>
        <div className="space-y-4">
          {claims.independentClaims.map((claim, i) => (
            <div key={i} className="p-6 bg-white border border-[#E5E5E5] rounded-xl relative group">
              <span className="absolute -top-3 -left-3 w-8 h-8 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                {i + 1}
              </span>
              <p className="text-base leading-relaxed font-serif italic text-[#1A1A1A]">
                {claim}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator className="bg-[#E5E5E5]" />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Dependent Claims</h3>
          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest">Secondary Scope</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {claims.dependentClaims.map((claim, i) => (
            <div key={i} className="p-4 bg-[#F8F9FA] border border-[#E5E5E5] rounded-lg text-sm leading-relaxed text-[#444444]">
              <span className="font-bold mr-2">{claims.independentClaims.length + i + 1}.</span>
              {claim}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function DocumentTab({ document }: { document: PatentDocument | null }) {
  if (!document) return <LoadingSkeleton />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Full Patent Application</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Download className="w-3 h-3 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Printer className="w-3 h-3 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[800px] border border-[#E5E5E5] rounded-2xl bg-white p-12 shadow-inner">
        <div className="max-w-2xl mx-auto space-y-12 font-serif text-[#1A1A1A]">
          {/* Title */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold uppercase tracking-tight leading-tight">
              {document.title}
            </h1>
            <div className="w-24 h-1 bg-[#1A1A1A] mx-auto" />
          </div>

          {/* Abstract */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[#999999] text-center">Abstract</h2>
            <p className="text-base leading-relaxed text-justify">
              {document.abstract}
            </p>
          </section>

          <Separator className="bg-[#F0F0F0]" />

          {/* Background */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold">Background of the Invention</h2>
            <p className="text-base leading-relaxed whitespace-pre-wrap">
              {document.background}
            </p>
          </section>

          {/* Summary */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold">Summary of the Invention</h2>
            <p className="text-base leading-relaxed">
              {document.summary}
            </p>
          </section>

          {/* Advantages */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold">Advantages</h2>
            <ul className="list-disc pl-6 space-y-2">
              {document.advantages.map((adv, i) => (
                <li key={i} className="text-base">{adv}</li>
              ))}
            </ul>
          </section>

          {/* Detailed Description */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold">Detailed Description</h2>
            <p className="text-base leading-relaxed whitespace-pre-wrap">
              {document.detailedDescription}
            </p>
          </section>

          {/* Diagram Instructions */}
          <section className="space-y-4 p-6 bg-[#F8F9FA] rounded-xl border border-[#E5E5E5] font-sans not-italic">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#999999] mb-4">Technical Diagram Specifications</h2>
            <Accordion type="single" collapsible className="w-full">
              {document.diagramInstructions.map((instr, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-b-[#E5E5E5]">
                  <AccordionTrigger className="text-sm font-medium hover:no-underline">
                    Figure {i + 1} Description
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-[#666666] leading-relaxed">
                    {instr}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-40 w-full rounded-xl" />
      <div className="grid grid-cols-2 gap-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
      <Skeleton className="h-60 w-full rounded-xl" />
    </div>
  );
}
