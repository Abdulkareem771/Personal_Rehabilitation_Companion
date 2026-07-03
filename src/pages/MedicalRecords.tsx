import { useState } from "react";
import { FileText, Shield, User, Calendar, Image as ImageIcon, Pill, HelpCircle, Plus, CheckCircle2, Circle, Clock, Stethoscope, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function MedicalRecords() {
  // Local state for interactive Doctor Questions checklist
  const [questions, setQuestions] = useState([
    { id: 1, text: "When is it safe to begin overhead pressing with dumbbells (> 10 kg)?", asked: false, doctorResponse: "After completing Week 6 with zero subluxation or anterior clicking." },
    { id: 2, text: "Should I continue taking 15g Hydrolyzed Collagen pre-workout?", asked: true, doctorResponse: "Yes, continue 45 minutes before rehab sessions with Vitamin C." },
    { id: 3, text: "Is mild fatigue sensation in teres minor normal after external rotations?", asked: true, doctorResponse: "Yes, muscular fatigue is expected. Sharp anterior joint capsule pain is NOT." },
  ]);

  const [newQuestionText, setNewQuestionText] = useState("");
  const [qModalOpen, setQModalOpen] = useState(false);

  const toggleQuestion = (id: number) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, asked: !q.asked } : q));
  };

  const handleAddQuestion = () => {
    if (!newQuestionText.trim()) return;
    setQuestions([...questions, { id: Date.now(), text: newQuestionText.trim(), asked: false, doctorResponse: "" }]);
    setNewQuestionText("");
    setQModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <PageHeader
        title="Hierarchical Medical & Imaging Vault"
        description="Encrypted offline diagnostic repository organizing MRI labral reports, clinical progression boundaries, and doctor visit agendas."
      />

      {/* Hero Diagnostic Summary */}
      <Card className="border-border shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-primary/90 via-primary to-rehab-blue p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-white border-0 font-extrabold">Active Diagnosis</Badge>
              <span className="text-xs font-semibold text-white/80">ICD-10: S43.014</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">Anterior-Inferior Glenohumeral Labral Tear (Bankart Lesion)</h2>
            <p className="text-white/85 text-sm leading-relaxed font-medium">
              MRI confirms detachment of the anterior-inferior labral complex with secondary stretching of the inferior glenohumeral ligament (IGHL). Non-operative stabilization protocol active.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0 min-w-[180px]">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-white/80 block">Primary Care Lead</span>
            <span className="font-black text-lg block mt-1">Dr. Orthopedics</span>
            <span className="text-xs text-rehab-green font-bold bg-white px-2 py-0.5 rounded-full inline-block mt-2 shadow-sm">
              Cleared for Phase 1
            </span>
          </div>
        </div>
      </Card>

      {/* 4-Tab Hierarchical Vault */}
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid grid-cols-4 w-full sm:max-w-xl mx-auto mb-6">
          <TabsTrigger value="timeline" className="gap-1.5"><Calendar size={16} /> Timeline</TabsTrigger>
          <TabsTrigger value="imaging" className="gap-1.5"><ImageIcon size={16} /> Imaging Vault</TabsTrigger>
          <TabsTrigger value="medications" className="gap-1.5"><Pill size={16} /> Medications</TabsTrigger>
          <TabsTrigger value="questions" className="gap-1.5"><HelpCircle size={16} /> Doctor Q&A</TabsTrigger>
        </TabsList>

        {/* Tab 1: Clinical Timeline */}
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock size={18} className="text-primary" /> Longitudinal Clinical Progression
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  date: "May 14, 2026",
                  type: "Diagnostic Imaging",
                  title: "High-Resolution 3T MRI Right Shoulder",
                  desc: "Confirmed Bankart lesion from 3 o'clock to 6 o'clock position along glenoid rim. No full-thickness rotator cuff tear.",
                  status: "Verified",
                  color: "border-primary",
                },
                {
                  date: "May 20, 2026",
                  type: "Orthopedic Consultation",
                  title: "Conservative Rehabilitation Clearance",
                  desc: "Surgeon recommended 8 weeks of focused dynamic scapulohumeral stabilization before considering surgical capsulorrhaphy.",
                  status: "Cleared",
                  color: "border-rehab-blue",
                },
                {
                  date: "June 01, 2026",
                  type: "PT Evaluation",
                  title: "Baseline Kinematic Assessment",
                  desc: "Noted 15° scapular winging during forward flexion. External rotation strength measured at 40% of uninjured left shoulder.",
                  status: "Baseline Set",
                  color: "border-rehab-amber",
                },
              ].map((ev, i) => (
                <div key={i} className={`p-5 rounded-2xl border-l-4 ${ev.color} bg-card border border-border shadow-sm space-y-2`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-extrabold text-primary uppercase">{ev.type}</span>
                    <Badge variant="outline" className="text-xs">{ev.date}</Badge>
                  </div>
                  <h4 className="font-extrabold text-base text-foreground">{ev.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">{ev.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Imaging Vault */}
        <TabsContent value="imaging" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                type: "MRI Scan (Magnetic Resonance)",
                count: "2 Studies",
                badge: "Primary Diagnostic",
                desc: "3 Tesla sagittal and axial coronal sequences visualizing soft labral detachment.",
                scans: [
                  { name: "Axial T2 Fat-Sat Sequence", date: "May 2026", finding: "Anterior labral avulsion noted at glenoid neck." },
                  { name: "Coronal Oblique T1", date: "May 2026", finding: "Supraspinatus tendon intact, mild subacromial bursitis." },
                ],
              },
              {
                type: "CT Scan (Computed Tomography)",
                count: "1 Study",
                badge: "Bone Loss Assessment",
                desc: "Evaluates glenoid rim bone loss to rule out bony Bankart or Hill-Sachs engagement.",
                scans: [
                  { name: "3D Glenoid Reconstruction", date: "May 2026", finding: "< 5% anterior glenoid bone loss. Subcritical." },
                ],
              },
              {
                type: "X-Ray Radiographs",
                count: "3 Views",
                badge: "Baseline Alignment",
                desc: "True AP, Scapular Y, and Axillary views confirming humeral head centering.",
                scans: [
                  { name: "Axillary Lateral View", date: "April 2026", finding: "Humeral head centered in glenoid fossa at rest." },
                ],
              },
            ].map((section, i) => (
              <Card key={i} className="border-border shadow-sm flex flex-col justify-between">
                <CardHeader className="bg-secondary/20 pb-4 border-b">
                  <div className="flex justify-between items-center mb-1">
                    <Badge className="text-[10px] uppercase font-black">{section.badge}</Badge>
                    <span className="text-xs font-bold text-muted-foreground">{section.count}</span>
                  </div>
                  <CardTitle className="text-base font-extrabold">{section.type}</CardTitle>
                  <p className="text-xs text-muted-foreground font-medium mt-1">{section.desc}</p>
                </CardHeader>
                <CardContent className="pt-4 space-y-3 flex-1">
                  {section.scans.map((sc, j) => (
                    <div key={j} className="p-3 rounded-xl border bg-secondary/30 space-y-1">
                      <div className="flex justify-between text-xs font-bold text-foreground">
                        <span>{sc.name}</span>
                        <span className="text-muted-foreground">{sc.date}</span>
                      </div>
                      <p className="text-[11px] text-primary font-medium">{sc.finding}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 3: Medications */}
        <TabsContent value="medications">
          <Card>
            <CardHeader>
              <CardTitle>Prescribed Medications & Connective Tissue Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Hydrolyzed Collagen Peptides (Type I/III)", dose: "15 grams daily", timing: "45 minutes prior to rehabilitation workout", note: "Provides glycine and proline amino acids directly during tendon hyperemia." },
                { name: "Ascorbic Acid (Vitamin C)", dose: "500 mg daily", timing: "Taken alongside collagen peptides", note: "Essential catalytic co-factor for cross-linking collagen fibrils." },
                { name: "Omega-3 Triglycerides (EPA/DHA)", dose: "2,000 mg combined EPA/DHA", timing: "With breakfast meal", note: "Modulates local cytokine production to prevent chronic synovitis." },
              ].map((med, i) => (
                <div key={i} className="p-4 rounded-2xl border bg-card space-y-2 shadow-sm">
                  <div className="flex justify-between items-center">
                    <h4 className="font-extrabold text-sm text-foreground">{med.name}</h4>
                    <Badge variant="safe">{med.dose}</Badge>
                  </div>
                  <p className="text-xs font-bold text-primary">{med.timing}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{med.note}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Doctor Questions & Clinical Agenda */}
        <TabsContent value="questions" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Stethoscope size={20} className="text-primary" /> Surgeon & PT Visit Agenda
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Prepare questions before clinical consultations and log doctor responses directly into your offline vault.
                </p>
              </div>
              <Button onClick={() => setQModalOpen(true)} size="sm" className="font-extrabold gap-1.5 shadow-sm">
                <Plus size={16} /> Add Question
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {questions.map((q) => (
                <div
                  key={q.id}
                  onClick={() => toggleQuestion(q.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    q.asked ? "bg-rehab-green/5 border-rehab-green/30" : "bg-card border-border hover:border-primary/40 shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {q.asked ? (
                      <CheckCircle2 size={20} className="text-rehab-green shrink-0 mt-0.5" />
                    ) : (
                      <Circle size={20} className="text-muted-foreground shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1 flex-1">
                      <p className={`text-sm font-bold ${q.asked ? "text-foreground" : "text-foreground"}`}>
                        {q.text}
                      </p>
                      {q.doctorResponse && (
                        <div className="p-3 rounded-xl bg-secondary/40 border text-xs text-muted-foreground font-medium mt-2">
                          <span className="font-extrabold text-primary block mb-0.5">Doctor Response:</span>
                          {q.doctorResponse}
                        </div>
                      )}
                    </div>
                    <Badge variant={q.asked ? "safe" : "outline"} className="text-[10px] uppercase font-bold shrink-0">
                      {q.asked ? "Discussed" : "Pending Visit"}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Question Modal */}
      <Dialog open={qModalOpen} onOpenChange={setQModalOpen}>
        <DialogContent className="max-w-md space-y-4">
          <DialogHeader>
            <DialogTitle className="text-xl">Add Doctor Consultation Question</DialogTitle>
            <DialogDescription>
              Log any unusual sensations, clicking triggers, or exercise progression queries for your next checkup.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <textarea
              placeholder="e.g. Can I use a massage gun directly over the anterior shoulder deltoid insertion?"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl border border-border bg-background text-sm font-medium focus:ring-2 focus:ring-primary outline-none resize-none"
            />
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setQModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAddQuestion} className="font-extrabold px-6">Add to Agenda</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
