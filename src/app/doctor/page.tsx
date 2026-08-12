import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, Activity, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import connectToDatabase from '@/lib/db/mongodb';
import Case from '@/models/Case';
import Patient from '@/models/Patient';
import { auth } from '@clerk/nextjs/server';
import { StatusBadge } from '@/components/ui/status-badge';

export default async function DoctorQueueDashboard() {
  await connectToDatabase();

  // Fetch cases waiting for doctor review, sorted by Risk Level (RED first, then YELLOW, then GREEN) 
  // and then by oldest first
  const cases = await Case.find({ status: 'WAITING_DOCTOR' })
    .populate('patientId')
    .lean();

  // Sort: RED (3) -> YELLOW (2) -> GREEN (1)
  const sortedCases = cases.sort((a: any, b: any) => {
    const riskScore = { 'RED': 3, 'YELLOW': 2, 'GREEN': 1, 'PENDING': 0 };
    const scoreA = riskScore[a.riskLevel as keyof typeof riskScore] || 0;
    const scoreB = riskScore[b.riskLevel as keyof typeof riskScore] || 0;
    
    if (scoreA !== scoreB) {
      return scoreB - scoreA; // Descending
    }
    // If same risk, oldest first
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const urgentCount = sortedCases.filter((c: any) => c.riskLevel === 'RED').length;
  const totalCount = sortedCases.length;

  return (
    <div className="space-y-8 pb-20">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Priority Queue</h1>
          <p className="text-muted-foreground mt-2 font-medium">Remote clinic cases requiring your review.</p>
        </div>
        <div className="flex gap-4">
          <div className="text-center px-6 py-3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-slate-900 leading-none">{totalCount}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Waiting</div>
          </div>
          <div className="text-center px-6 py-3 bg-rose-50 rounded-xl border border-rose-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-rose-500/10 mix-blend-overlay"></div>
            <div className="text-2xl font-bold text-rose-700 leading-none relative z-10">{urgentCount}</div>
            <div className="text-xs font-semibold text-rose-700 uppercase tracking-wider mt-1 relative z-10">Urgent</div>
          </div>
        </div>
      </div>

      <Card className="shadow-sm overflow-hidden border-slate-200/60">
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider grid grid-cols-12 gap-4">
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-3">Patient</div>
          <div className="col-span-3">Chief Complaint</div>
          <div className="col-span-3">AI Flags</div>
          <div className="col-span-2 text-right">Action</div>
        </div>
        <div className="divide-y divide-slate-100">
          {sortedCases.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center bg-white">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                <CheckCircle2 className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Queue is empty</h3>
              <p className="text-slate-500 font-medium">All cases have been reviewed. Take a break.</p>
            </div>
          ) : (
            sortedCases.map((c: any) => (
              <div key={c._id.toString()} className={`px-6 py-5 hover:bg-slate-50/50 transition-colors grid grid-cols-12 gap-4 items-center ${c.riskLevel === 'RED' ? 'bg-rose-50/20' : ''}`}>
                <div className="col-span-1 flex justify-center">
                  {c.riskLevel === 'RED' ? (
                     <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center border border-rose-200">
                        <AlertTriangle className="w-5 h-5 text-rose-600" />
                     </div>
                  ) : c.riskLevel === 'YELLOW' ? (
                     <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center border border-amber-200">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                     </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                  )}
                </div>
                
                <div className="col-span-3 flex flex-col pl-2">
                  <span className="font-bold text-foreground text-base">{c.patientId?.name || 'Unknown Patient'}</span>
                  <span className="text-sm font-medium text-muted-foreground">{c.patientId?.age} yrs • <span className="capitalize">{c.patientId?.sex?.toLowerCase()}</span></span>
                </div>
                
                <div className="col-span-3 pr-4">
                  <span className="text-sm font-semibold text-slate-800 line-clamp-1">{c.chiefComplaint}</span>
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mt-1.5 bg-slate-100 w-max px-2 py-0.5 rounded-md">
                    <Clock className="w-3 h-3" /> Waiting {Math.round((new Date().getTime() - new Date(c.updatedAt).getTime()) / 60000)}m
                  </span>
                </div>
                
                <div className="col-span-3 flex flex-wrap gap-1.5">
                  {c.riskReasons?.slice(0, 2).map((reason: string, i: number) => (
                    <Badge key={i} variant="outline" className={`text-xs font-medium line-clamp-1 h-6 max-w-full ${c.riskLevel === 'RED' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-slate-200'}`}>{reason}</Badge>
                  ))}
                  {c.riskReasons?.length > 2 && <Badge variant="outline" className="text-xs h-6 bg-slate-100">+{c.riskReasons.length - 2}</Badge>}
                  {(!c.riskReasons || c.riskReasons.length === 0) && <span className="text-sm text-slate-400 italic">No flags</span>}
                </div>
                
                <div className="col-span-2 flex justify-end">
                  <Link href={`/doctor/cases/${c._id}`}>
                    <Button className={`shadow-sm h-10 px-5 font-semibold transition-transform hover:-translate-y-0.5 ${c.riskLevel === 'RED' ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}>
                      Review Case <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
