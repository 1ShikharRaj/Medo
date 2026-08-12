"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Mic, FileText, Image as ImageIcon, CheckCircle, ArrowRight, ArrowLeft, Sparkles, Activity, FileCheck, Stethoscope } from "lucide-react";

export default function IntakeFlow({ caseId, initialData }: { caseId: string, initialData: any }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("complaint");
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    chiefComplaint: initialData.chiefComplaint === "Pending" ? "" : initialData.chiefComplaint,
    symptoms: initialData.symptoms?.join(", ") || "",
    duration: initialData.symptomDuration || "",
    vitals: {
      temperature: initialData.vitals?.temperature || "",
      bloodPressure: initialData.vitals?.bloodPressure || "",
      pulse: initialData.vitals?.pulse || "",
      oxygenSaturation: initialData.vitals?.oxygenSaturation || "",
    },
    history: initialData.medicalHistory || "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name.includes("vitals.")) {
      const vitalName = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        vitals: { ...prev.vitals, [vitalName]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await fetch(`/api/cases/${caseId}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRunAI = async () => {
    if (!formData.chiefComplaint.trim()) {
      setError("Chief complaint is required before running AI analysis.");
      return;
    }
    
    setIsAnalyzing(true);
    setError("");
    try {
      await handleSaveDraft();
      
      const res = await fetch(`/api/cases/${caseId}/analyze`, {
        method: "POST",
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push(`/health-worker/cases/${caseId}/summary`);
    } catch (err: any) {
      setError(err.message || "Failed to analyze case");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    setError("");
    
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("caseId", caseId);
      data.append("patientId", initialData.patientId._id || initialData.patientId);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      setDocuments(prev => [...prev, result.data]);
    } catch (err: any) {
      setError(err.message || "Failed to upload document");
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const steps = [
    { id: "complaint", name: "Complaint", icon: <FileText className="w-4 h-4" /> },
    { id: "vitals", name: "Vitals", icon: <Activity className="w-4 h-4" /> },
    { id: "history", name: "History", icon: <FileCheck className="w-4 h-4" /> },
    { id: "documents", name: "Documents", icon: <ImageIcon className="w-4 h-4" /> }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === activeTab);

  return (
    <div className="max-w-3xl mx-auto w-full space-y-8">
      {/* Progress Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-6">Patient Intake</h1>
        
        <div className="flex justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full z-0"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full z-0 transition-all duration-300"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {steps.map((step, idx) => {
            const isCompleted = currentStepIndex > idx;
            const isCurrent = currentStepIndex === idx;
            return (
              <div key={step.id} className="flex flex-col items-center gap-2 relative z-10">
                <button 
                  onClick={() => setActiveTab(step.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                  isCompleted 
                    ? "bg-primary border-primary text-primary-foreground" 
                    : isCurrent 
                      ? "bg-white border-primary text-primary shadow-sm" 
                      : "bg-white border-slate-200 text-slate-400"
                }`}>
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : step.icon}
                </button>
                <span className={`text-xs font-semibold ${isCurrent || isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                  {step.name}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {error && <div className="p-4 bg-rose-50 text-rose-700 rounded-xl text-sm font-medium border border-rose-100 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> {error}</div>}
      
      <Card className="shadow-sm border-slate-200/60 overflow-hidden">
        <CardContent className="p-0">
          
          {/* COMPLAINT */}
          <div className={activeTab === "complaint" ? "block p-6 md:p-8 animate-in fade-in duration-300" : "hidden"}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">Chief Complaint</h3>
                <p className="text-sm text-muted-foreground mt-1">What brings the patient in today?</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2 text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 hover:text-primary transition-colors">
                <Mic className="w-4 h-4" /> Voice Intake
              </Button>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold">Main reason for visit <span className="text-rose-500">*</span></Label>
                <Input 
                  name="chiefComplaint" 
                  value={formData.chiefComplaint} 
                  onChange={handleChange} 
                  placeholder="e.g. Fever and weakness" 
                  className="h-12 bg-slate-50 focus-visible:bg-white text-base"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-slate-700">Symptoms (comma separated)</Label>
                  <Input 
                    name="symptoms" 
                    value={formData.symptoms} 
                    onChange={handleChange} 
                    placeholder="e.g. headache, chills, cough" 
                    className="h-12 bg-slate-50 focus-visible:bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700">Duration</Label>
                  <Input 
                    name="duration" 
                    value={formData.duration} 
                    onChange={handleChange} 
                    placeholder="e.g. 3 days" 
                    className="h-12 bg-slate-50 focus-visible:bg-white"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-8 mt-4 border-t border-slate-100">
              <Button onClick={() => setActiveTab("vitals")} className="h-11 px-6 shadow-sm">
                Next: Vitals <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* VITALS */}
          <div className={activeTab === "vitals" ? "block p-6 md:p-8 animate-in fade-in duration-300" : "hidden"}>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-foreground">Record Vitals</h3>
              <p className="text-sm text-muted-foreground mt-1">Please measure and enter accurately.</p>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Temperature (°F)</Label>
                <Input name="vitals.temperature" type="number" step="0.1" value={formData.vitals.temperature} onChange={handleChange} placeholder="98.6" className="h-12 bg-slate-50 focus-visible:bg-white text-lg font-medium" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Blood Pressure (mmHg)</Label>
                <Input name="vitals.bloodPressure" value={formData.vitals.bloodPressure} onChange={handleChange} placeholder="120/80" className="h-12 bg-slate-50 focus-visible:bg-white text-lg font-medium" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Pulse (BPM)</Label>
                <Input name="vitals.pulse" type="number" value={formData.vitals.pulse} onChange={handleChange} placeholder="72" className="h-12 bg-slate-50 focus-visible:bg-white text-lg font-medium" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">SpO2 (%)</Label>
                <Input name="vitals.oxygenSaturation" type="number" value={formData.vitals.oxygenSaturation} onChange={handleChange} placeholder="98" className="h-12 bg-slate-50 focus-visible:bg-white text-lg font-medium" />
              </div>
            </div>
            <div className="flex justify-between pt-8 mt-4 border-t border-slate-100">
              <Button variant="ghost" onClick={() => setActiveTab("complaint")} className="h-11 px-4 text-muted-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button onClick={() => setActiveTab("history")} className="h-11 px-6 shadow-sm">
                Next: History <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* HISTORY */}
          <div className={activeTab === "history" ? "block p-6 md:p-8 animate-in fade-in duration-300" : "hidden"}>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-foreground">Medical History</h3>
              <p className="text-sm text-muted-foreground mt-1">Any relevant conditions or allergies.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Textarea 
                  name="history" 
                  value={formData.history} 
                  onChange={handleChange} 
                  placeholder="e.g. Type 2 Diabetes, allergic to penicillin..." 
                  className="min-h-40 bg-slate-50 focus-visible:bg-white text-base resize-none"
                />
              </div>
            </div>
            <div className="flex justify-between pt-8 mt-4 border-t border-slate-100">
              <Button variant="ghost" onClick={() => setActiveTab("vitals")} className="h-11 px-4 text-muted-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button onClick={() => setActiveTab("documents")} className="h-11 px-6 shadow-sm">
                Next: Documents <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* DOCUMENTS */}
          <div className={activeTab === "documents" ? "block p-6 md:p-8 animate-in fade-in duration-300" : "hidden"}>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-foreground">Documents & Images</h3>
              <p className="text-sm text-muted-foreground mt-1">Upload any relevant lab reports or symptom photos.</p>
            </div>
            
            {documents.length > 0 && (
              <div className="mb-6 space-y-3">
                <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Uploaded Files</h4>
                <ul className="space-y-2">
                  {documents.map((doc) => (
                    <li key={doc._id} className="text-sm bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-foreground truncate max-w-[200px] md:max-w-xs">{doc.fileName}</span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Attached
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative border-2 border-dashed border-slate-300 bg-slate-50 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-100 hover:border-slate-400 cursor-pointer transition-colors overflow-hidden h-40">
                <input 
                  type="file" 
                  accept="application/pdf,image/jpeg,image/png" 
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                />
                {isUploading ? <Loader2 className="w-8 h-8 text-primary mb-3 animate-spin" /> : <FileText className="w-8 h-8 text-slate-400 mb-3" />}
                <span className="font-semibold text-foreground">{isUploading ? "Uploading..." : "Upload Lab Report"}</span>
                <span className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG</span>
              </div>
              <div className="relative border-2 border-dashed border-slate-300 bg-slate-50 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-100 hover:border-slate-400 cursor-pointer transition-colors overflow-hidden h-40">
                <input 
                  type="file" 
                  accept="image/jpeg,image/png" 
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                />
                {isUploading ? <Loader2 className="w-8 h-8 text-primary mb-3 animate-spin" /> : <ImageIcon className="w-8 h-8 text-slate-400 mb-3" />}
                <span className="font-semibold text-foreground">{isUploading ? "Uploading..." : "Add Patient Image"}</span>
                <span className="text-xs text-muted-foreground mt-1">Visible symptoms</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-100">
              <Button variant="ghost" onClick={() => setActiveTab("history")} disabled={isAnalyzing || isUploading} className="h-11 px-4 text-muted-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              
              <div className="bg-primary/5 border border-primary/20 rounded-full pr-1 pl-4 flex items-center h-12 shadow-sm">
                <span className="text-sm font-semibold text-primary mr-3 hidden md:inline">Ready for Doctor?</span>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 rounded-full px-6 font-bold shadow-md transition-transform hover:scale-105" 
                  onClick={handleRunAI} 
                  disabled={isAnalyzing || isUploading}
                >
                  {isAnalyzing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
                  ) : (
                    <><Sparkles className="w-4 h-4 mr-2" /> Run AI Analysis</>
                  )}
                </Button>
              </div>
            </div>
          </div>
          
        </CardContent>
      </Card>
    </div>
  );
}
