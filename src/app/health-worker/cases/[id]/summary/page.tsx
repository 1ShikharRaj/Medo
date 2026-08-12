import connectToDatabase from '@/lib/db/mongodb';
import Case from '@/models/Case';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2, Send, ArrowLeft, Sparkles, Activity, FileText, ClipboardList } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { redirect } from 'next/navigation';
import { StatusBadge } from '@/components/ui/status-badge';

export default async function CaseSummaryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();
  
  const caseRecord = await Case.findById(id).populate('patientId').lean();
  
  if (!caseRecord || caseRecord.status === 'DRAFT') {
    redirect(`/health-worker/cases/${id}`);
  }

  const isRed = caseRecord.riskLevel === 'RED';
  const isYellow = caseRecord.riskLevel === 'YELLOW';
  const isGreen = !isRed && !isYellow;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/health-worker/cases/${id}`}>
            <Button variant="ghost" size="icon" className="hover:bg-slate-100"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">AI-Assisted Case Review</h1>
            <p className="text-muted-foreground font-medium mt-1">Review the AI-generated brief before sending to a doctor.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
          <UserIcon className="w-5 h-5 text-slate-400" />
          <span className="font-semibold text-foreground">{caseRecord.patientId.name}</span>
          <span className="text-muted-foreground px-2">|</span>
          <span className="text-sm text-slate-500 font-mono">{caseRecord.caseId}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Col: AI Brief */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-slate-200 overflow-hidden relative">
            <div className="absolute top-0 right-0 bg-primary/10 text-primary px-3 py-1 rounded-bl-xl text-xs font-bold flex items-center gap-1.5 border-b border-l border-primary/10">
              <Sparkles className="w-3.5 h-3.5" /> AI-generated assistance
            </div>
            <CardContent className="p-6 md:p-8 pt-10">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><ClipboardList className="w-6 h-6" /></div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">AI Case Brief</h2>
                  <p className="text-sm text-muted-foreground">Structured summary of patient&apos;s intake.</p>
                </div>
              </div>

              <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-lg prose-h3:text-base prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900 prose-li:text-slate-600">
                <ReactMarkdown>{caseRecord.aiSummary || 'No summary available.'}</ReactMarkdown>
              </div>
              
              {/* Knowledge Used Section (Mocked for HW view) */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Relevant Knowledge Used</p>
                <div className="flex items-center gap-2 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-700 font-medium">
                  <FileText className="w-4 h-4 text-slate-400" />
                  Primary Care Protocols v2.1
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Safety & Action */}
        <div className="space-y-6">
          <Card className={`shadow-sm overflow-hidden border-2 ${isRed ? "border-rose-200" : isYellow ? "border-amber-200" : "border-emerald-200"}`}>
            <div className={`h-1.5 w-full ${isRed ? "bg-rose-500" : isYellow ? "bg-amber-500" : "bg-emerald-500"}`}></div>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-foreground">
                <Activity className="w-5 h-5 text-slate-400" />
                Safety Status
              </h3>
              
              <div className="flex justify-center mb-8">
                {isRed ? (
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center border border-rose-200 shadow-sm relative">
                      <div className="absolute inset-0 rounded-full border-2 border-rose-500 animate-ping opacity-20"></div>
                      <AlertTriangle className="w-8 h-8 text-rose-600 relative z-10" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-rose-900">Urgent Referral</h4>
                      <p className="text-sm text-rose-700/80 font-medium mt-1">Immediate doctor review required.</p>
                    </div>
                  </div>
                ) : isYellow ? (
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center border border-amber-200 shadow-sm">
                      <AlertTriangle className="w-8 h-8 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-amber-900">Doctor Review</h4>
                      <p className="text-sm text-amber-700/80 font-medium mt-1">Requires clinical attention.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200 shadow-sm">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-emerald-900">Routine Workflow</h4>
                      <p className="text-sm text-emerald-700/80 font-medium mt-1">Standard doctor queue.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-8">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Safety Engine Findings</p>
                <ul className="text-sm font-medium text-slate-700 space-y-2 list-inside">
                  {caseRecord.riskReasons?.map((reason: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                      <span>{reason}</span>
                    </li>
                  )) || <li className="text-slate-500">No specific flags raised.</li>}
                </ul>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold text-slate-900 mb-2">Next Step:</p>
                <Link href="/health-worker" className="block">
                  <Button className={`w-full h-12 font-bold shadow-md transition-transform hover:-translate-y-0.5 ${
                    isRed ? "bg-rose-600 hover:bg-rose-700 text-white" : 
                    "bg-primary hover:bg-primary/90 text-primary-foreground"
                  }`}>
                    <Send className="w-4 h-4 mr-2" /> 
                    {isRed ? "Send Urgent Alert to Doctor" : "Submit Case to Doctor"}
                  </Button>
                </Link>
                <Link href={`/health-worker/cases/${id}`} className="block">
                  <Button variant="outline" className="w-full h-12">Edit Case Information</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
