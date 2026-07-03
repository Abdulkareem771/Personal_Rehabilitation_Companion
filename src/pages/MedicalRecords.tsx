import { FileText, Shield, User, Calendar } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function MedicalRecords() {
  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <PageHeader
        title="Medical Vault & Diagnostic Notes"
        description="Encrypted offline vault containing your MRI summary, surgeon instructions, and physical therapist progression boundaries."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border shadow-md">
          <CardHeader className="bg-secondary/30 pb-3">
            <Badge variant="outline" className="w-fit mb-1 font-bold">Diagnostic Summary</Badge>
            <CardTitle className="text-xl flex items-center gap-2">
              <Shield className="text-primary" size={20} /> Bankart Lesion Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4 text-sm leading-relaxed">
            <div>
              <span className="text-xs font-extrabold uppercase text-muted-foreground block">Diagnosis</span>
              <p className="font-bold text-foreground mt-0.5">Anterior-Inferior Labral Tear (Bankart Lesion) with capsule laxity.</p>
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase text-muted-foreground block">Mechanism</span>
              <p className="text-muted-foreground mt-0.5">Anterior subluxation events during external rotation and horizontal abduction.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/30 text-primary font-semibold text-xs">
              Primary Goal: Strengthen infraspinatus, teres minor, and serratus anterior to create active dynamic stabilization against anterior translation.
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-md">
          <CardHeader className="bg-secondary/30 pb-3">
            <Badge variant="outline" className="w-fit mb-1 font-bold">Clinical Contacts</Badge>
            <CardTitle className="text-xl flex items-center gap-2">
              <User className="text-rehab-blue" size={20} /> Care Team
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="p-4 rounded-xl border bg-secondary/20 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-foreground">Dr. Orthopedics (Surgeon)</h4>
                <span className="text-xs text-muted-foreground">Follow-up checkup scheduled</span>
              </div>
              <Badge variant="safe" className="flex items-center gap-1"><Calendar size={12} /> Month 3</Badge>
            </div>
            <div className="p-4 rounded-xl border bg-secondary/20 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-foreground">Lead Physiotherapist</h4>
                <span className="text-xs text-muted-foreground">Protocol cleared for Phase 1</span>
              </div>
              <Badge variant="safe">Cleared</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
