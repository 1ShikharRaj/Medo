import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, AlertTriangle, FileCheck, Users, Activity, ChevronRight, Stethoscope } from 'lucide-react';
import connectToDatabase from '@/lib/db/mongodb';
import Case from '@/models/Case';
import Patient from '@/models/Patient';
import User from '@/models/User';
import { auth } from '@clerk/nextjs/server';
import { StatusBadge } from '@/components/ui/status-badge';

export default async function HealthWorkerDashboard() {
  const { userId } = await auth();
  await connectToDatabase();

  const dbUser = await User.findOne({ clerkId: userId });
  const workerName = dbUser?.name || 'Health Worker';

  // Stats
  const urgentCasesCount = await Case.countDocuments({ createdBy: userId, riskLevel: 'RED', status: { $in: ['WAITING_DOCTOR', 'ASSESSMENT', 'AI_REVIEW'] } });
  const waitingCasesCount = await Case.countDocuments({ createdBy: userId, status: 'WAITING_DOCTOR' });
  const completedCasesCount = await Case.countDocuments({ status: { $in: ['CARE_PLAN_APPROVED', 'REFERRED'] } });
  const todayPatientsCount = await Patient.countDocuments({ 
    createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) }
  });

  // Fetch recent cases for Priority table
  const recentCases = await Case.find({ createdBy: userId })
    .sort({ updatedAt: -1 })
    .limit(5)
    .populate('patientId')
    .lean();

  return (
    <div className="space-y-10">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Good morning, {workerName}</h1>
          <p className="text-muted-foreground mt-2 font-medium">Here is the status of your clinic today.</p>
        </div>
        <Link href="/health-worker/patients/new">
          <Button size="lg" className="h-12 px-8 font-semibold shadow-md shrink-0 w-full md:w-auto">
            <Plus className="w-5 h-5 mr-2" />
            New Patient
          </Button>
        </Link>
      </div>

      {/* Prescription Ready Alert */}
      {completedCasesCount > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-100/50 mix-blend-overlay"></div>
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
              <FileCheck className="w-7 h-7 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-emerald-950">Prescriptions Ready</h2>
              <p className="text-emerald-800 font-medium text-sm mt-1">You have {completedCasesCount} patient(s) waiting to receive their care plans.</p>
            </div>
          </div>
          <Link href="/health-worker/completed" className="relative z-10 w-full md:w-auto">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm w-full md:w-auto">
              View Care Plans
            </Button>
          </Link>
        </div>
      )}

      {/* Today's Overview */}
      <div>
        <h2 className="text-lg font-bold mb-4 text-foreground">Today&apos;s Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-sm border-slate-200/60">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users className="w-6 h-6" /></div>
              <div>
                <p className="text-2xl font-bold text-foreground">{todayPatientsCount}</p>
                <p className="text-sm font-medium text-muted-foreground">Patients Today</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-slate-200/60">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-xl"><Activity className="w-6 h-6" /></div>
              <div>
                <p className="text-2xl font-bold text-foreground">{recentCases.length}</p>
                <p className="text-sm font-medium text-muted-foreground">Active Cases</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-amber-200 bg-amber-50/30">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-amber-100 text-amber-700 rounded-xl"><Clock className="w-6 h-6" /></div>
              <div>
                <p className="text-2xl font-bold text-amber-950">{waitingCasesCount}</p>
                <p className="text-sm font-medium text-amber-800">Waiting for Doctor</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-rose-200 bg-rose-50/30">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-rose-100 text-rose-700 rounded-xl"><AlertTriangle className="w-6 h-6" /></div>
              <div>
                <p className="text-2xl font-bold text-rose-950">{urgentCasesCount}</p>
                <p className="text-sm font-medium text-rose-800">Urgent Cases</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Priority Cases */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">Priority Cases</h2>
          <Link href="/health-worker/patients">
            <Button variant="ghost" className="text-primary font-medium hover:text-primary hover:bg-primary/5">
              View All Patients <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        
        <Card className="shadow-sm border-slate-200/60 overflow-hidden">
          <div className="min-w-full divide-y divide-slate-100">
            <div className="bg-slate-50/80 flex items-center p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="flex-1">Patient & Issue</div>
              <div className="w-32 hidden md:block text-center">Status</div>
              <div className="w-32 text-center">Urgency</div>
              <div className="w-24 text-right">Action</div>
            </div>
            
            {recentCases.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                  <Stethoscope className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No active cases</h3>
                <p className="text-slate-500 font-medium">Create a new patient record to start a consultation.</p>
              </div>
            ) : (
              recentCases.map((c: any) => (
                <div key={c._id.toString()} className="p-4 hover:bg-slate-50/50 transition-colors flex items-center justify-between group">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="font-bold text-foreground truncate">{c.patientId?.name || 'Unknown Patient'}</p>
                    <p className="text-sm text-muted-foreground truncate">{c.chiefComplaint}</p>
                  </div>
                  
                  <div className="w-32 hidden md:flex justify-center">
                    <Badge variant="outline" className="bg-white capitalize text-slate-600 font-medium border-slate-200">
                      {c.status.replace('_', ' ').toLowerCase()}
                    </Badge>
                  </div>
                  
                  <div className="w-32 flex justify-center">
                    {c.riskLevel === 'RED' ? <StatusBadge status="danger" /> : 
                     c.riskLevel === 'YELLOW' ? <StatusBadge status="warning" /> : 
                     <StatusBadge status="safe" />}
                  </div>
                  
                  <div className="w-24 flex justify-end">
                    <Link href={`/health-worker/cases/${c._id}`}>
                      <Button variant="ghost" size="sm" className="font-semibold text-slate-600 group-hover:text-primary transition-colors">
                        Review
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
