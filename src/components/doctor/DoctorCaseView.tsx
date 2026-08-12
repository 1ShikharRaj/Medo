"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Video, PhoneOff, Mic, Camera, Send, Activity, User as UserIcon, Sparkles, FileText, CheckCircle2, ShieldCheck, FileCheck } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { StatusBadge } from "@/components/ui/status-badge";

export default function DoctorCaseView({ caseData }: { caseData: any }) {
  const router = useRouter();
  const [inCall, setInCall] = useState(false);
  const [decision, setDecision] = useState({
    action: "",
    notes: "",
    prescriptions: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRed = caseData.riskLevel === 'RED';
  const isYellow = caseData.riskLevel === 'YELLOW';

  const handleSubmitDecision = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/doctor-decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: caseData._id,
          patientId: caseData.patientId._id,
          ...decision,
          prescriptions: decision.prescriptions.split(',').map((p: string) => p.trim()).filter(Boolean)
        }),
      });
      
      if (!res.ok) throw new Error("Failed to save decision");
      router.push("/doctor");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-8rem)] min-h-[600px]">
      
      {/* LEFT PANE: Patient Info & Raw Data */}
      <div className="w-full xl:w-[25%] flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
        <Card className="border-slate-200/60 shadow-sm shrink-0">
          <CardContent className="p-5 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4 border-4 border-white shadow-sm">
              <UserIcon className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-foreground">{caseData.patientId.name}</h2>
            <p className="text-sm font-medium text-muted-foreground mt-1">{caseData.patientId.age} yrs • <span className="capitalize">{caseData.patientId.sex?.toLowerCase()}</span></p>
            <p className="text-xs text-slate-400 font-mono mt-1">ID: {caseData.patientId.patientId}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm shrink-0">
          <CardHeader className="py-3 px-5 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-sm flex items-center gap-2 text-slate-700">
              <Activity className="w-4 h-4 text-primary" /> Current Vitals
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-2 divide-x divide-y divide-slate-100">
              <div className="p-4 text-center">
                <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Temp</div>
                <div className="text-xl font-bold text-slate-900">{caseData.vitals?.temperature || '--'}<span className="text-xs font-normal text-slate-500 ml-1">°F</span></div>
              </div>
              <div className="p-4 text-center">
                <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">BP</div>
                <div className="text-xl font-bold text-slate-900">{caseData.vitals?.bloodPressure || '--'}</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Pulse</div>
                <div className="text-xl font-bold text-slate-900">{caseData.vitals?.pulse || '--'}<span className="text-xs font-normal text-slate-500 ml-1">bpm</span></div>
              </div>
              <div className="p-4 text-center">
                <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">SpO2</div>
                <div className="text-xl font-bold text-slate-900">{caseData.vitals?.oxygenSaturation || '--'}<span className="text-xs font-normal text-slate-500 ml-1">%</span></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm shrink-0">
          <CardHeader className="py-3 px-5 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-sm flex items-center gap-2 text-slate-700">
              <FileText className="w-4 h-4 text-primary" /> Intake Data
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Chief Complaint</p>
              <p className="text-sm font-semibold text-slate-900">{caseData.chiefComplaint}</p>
            </div>
            {caseData.symptoms?.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Symptoms</p>
                <div className="flex flex-wrap gap-1.5">
                  {caseData.symptoms.map((sym: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-medium border border-slate-200">{sym}</span>
                  ))}
                </div>
              </div>
            )}
            {caseData.medicalHistory && (
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Medical History</p>
                <p className="text-xs font-medium text-slate-700 whitespace-pre-wrap">{caseData.medicalHistory}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* CENTER PANE: AI Case Brief & RAG */}
      <div className="w-full xl:w-[45%] flex flex-col h-full overflow-hidden">
        <Card className="h-full flex flex-col shadow-sm border-slate-200/60 overflow-hidden relative">
          
          {/* Label indicating AI Content */}
          <div className="absolute top-0 right-0 bg-primary/10 text-primary px-3 py-1 rounded-bl-xl text-xs font-bold flex items-center gap-1.5 border-b border-l border-primary/10 z-10">
            <Sparkles className="w-3.5 h-3.5" /> AI ASSISTANCE
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
            {isRed && (
              <div className="mb-8 p-5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h4 className="font-bold text-rose-900">URGENT REVIEW REQUIRED</h4>
                  <ul className="text-sm text-rose-700/80 mt-2 space-y-1 font-medium list-disc pl-4">
                    {caseData.riskReasons?.map((r: string, i: number) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">AI Case Brief</h2>
              <p className="text-sm text-muted-foreground mt-1">Organized synthesis of patient intake data.</p>
            </div>
            
            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h3:text-lg prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900 prose-li:text-slate-600 pb-8 border-b border-slate-100">
              <ReactMarkdown>{caseData.aiSummary || 'No AI summary available for this case.'}</ReactMarkdown>
            </div>

            {/* RAG Knowledge Section */}
            <div className="mt-8 pt-2">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground text-lg">Relevant Clinical Protocols</h3>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-slate-400 shrink-0" />
                  <div>
                    <p className="font-bold text-sm text-slate-900">Primary Care Triage Guidelines v2.1</p>
                    <p className="text-xs text-slate-500 mt-0.5">Used as context for AI summary generation</p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto text-xs bg-white h-8">View Protocol</Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* RIGHT PANE: Doctor Decision & Telemed */}
      <div className="w-full xl:w-[30%] flex flex-col gap-4 h-full">
        
        {/* Video Area */}
        <Card className={`border-slate-200/60 shadow-sm shrink-0 overflow-hidden relative transition-all duration-300 ${inCall ? 'h-64' : 'h-24'}`}>
          {!inCall ? (
            <div className="absolute inset-0 flex items-center justify-between p-6 bg-slate-900 text-white">
              <div>
                <h3 className="font-bold text-lg">Patient Waiting</h3>
                <p className="text-sm text-slate-400">Health worker is online.</p>
              </div>
              <Button onClick={() => setInCall(true)} className="bg-emerald-500 hover:bg-emerald-600 font-bold shadow-md h-12">
                <Video className="w-4 h-4 mr-2" /> Connect
              </Button>
            </div>
          ) : (
            <div className="absolute inset-0 bg-slate-900">
              {/* Mock WebRTC Video Container */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-slate-500 flex flex-col items-center">
                  <Video className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-sm font-medium text-slate-300">Connected to Clinic</p>
                </div>
              </div>
              {/* Self View Picture-in-Picture */}
              <div className="absolute top-3 right-3 w-24 h-16 bg-slate-800 rounded border border-slate-700 shadow-lg"></div>
              
              {/* Controls */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-900/80 p-2.5 rounded-full backdrop-blur-md border border-slate-700">
                <Button variant="ghost" size="icon" className="text-white hover:bg-slate-700 rounded-full h-8 w-8"><Mic className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-slate-700 rounded-full h-8 w-8"><Camera className="w-4 h-4" /></Button>
                <Button onClick={() => setInCall(false)} variant="destructive" size="icon" className="rounded-full h-10 w-10 bg-rose-600 hover:bg-rose-700"><PhoneOff className="w-4 h-4" /></Button>
              </div>
            </div>
          )}
        </Card>

        {/* Doctor Decision Form */}
        <Card className="border-slate-200/60 shadow-sm flex-1 flex flex-col overflow-hidden relative">
          <div className="absolute top-0 left-0 bg-blue-600 text-white px-4 py-1.5 rounded-br-xl text-xs font-bold flex items-center gap-1.5 z-10 shadow-sm">
            <FileCheck className="w-3.5 h-3.5" /> DOCTOR DECISION
          </div>
          
          <CardContent className="p-6 pt-12 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
            <div className="space-y-5 flex-1 flex flex-col">
              
              <div className="space-y-2 shrink-0">
                <label className="text-sm font-bold text-slate-900">Clinical Action Plan</label>
                <Select onValueChange={(val) => setDecision(prev => ({ ...prev, action: val as string }))}>
                  <SelectTrigger className="h-12 bg-slate-50 focus-visible:bg-white font-medium border-slate-200">
                    <SelectValue placeholder="Select final decision..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="APPROVE_CARE">Approve Basic Care Plan</SelectItem>
                    <SelectItem value="MODIFY_CARE">Modify Care Plan</SelectItem>
                    <SelectItem value="REFER_TO_HOSPITAL">Emergency Referral</SelectItem>
                    <SelectItem value="REQUEST_MORE_INFORMATION">Request More Info</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 flex-1 flex flex-col min-h-[150px]">
                <label className="text-sm font-bold text-slate-900">Clinical Notes & Instructions</label>
                <Textarea 
                  className="flex-1 resize-none bg-slate-50 focus-visible:bg-white border-slate-200 text-sm" 
                  placeholder="Final diagnosis and specific instructions for the health worker to execute..."
                  value={decision.notes}
                  onChange={(e: any) => setDecision(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              <div className="space-y-2 shrink-0 pb-2">
                <label className="text-sm font-bold text-slate-900">Prescriptions (Optional)</label>
                <Input 
                  placeholder="e.g. Paracetamol 500mg, Amoxicillin" 
                  value={decision.prescriptions}
                  onChange={(e: any) => setDecision(prev => ({ ...prev, prescriptions: e.target.value }))}
                  className="h-12 bg-slate-50 focus-visible:bg-white border-slate-200"
                />
              </div>
            </div>

            <Button 
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 shadow-md shrink-0 transition-transform hover:-translate-y-0.5" 
              onClick={handleSubmitDecision}
              disabled={isSubmitting || !decision.action || !decision.notes}
            >
              <Send className="w-5 h-5 mr-2" /> Finalize & Submit Decision
            </Button>
          </CardContent>
        </Card>
      </div>
      
    </div>
  );
}
