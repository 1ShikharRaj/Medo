import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import connectToDatabase from '@/lib/db/mongodb';
import User from '@/models/User';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { LayoutDashboard, Users, Clock, Stethoscope, Search, Bell } from 'lucide-react';

export default async function DoctorLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect('/');

  await connectToDatabase();
  const dbUser = await User.findOne({ clerkId: userId });
  if (!dbUser || dbUser.role !== 'DOCTOR') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground font-sans">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col fixed h-full z-20 shadow-sm">
        <div className="h-16 flex items-center px-6 gap-2 font-bold text-xl border-b border-border">
          <Stethoscope className="w-6 h-6 text-primary" />
          <span className="tracking-tight">SehatBridge<span className="text-primary font-semibold ml-0.5">AI</span></span>
        </div>
        
        <div className="px-6 py-5 border-b border-border bg-slate-50/50">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Role</div>
          <div className="text-sm font-semibold text-foreground flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></div> Remote Doctor
          </div>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1">
          <Link href="/doctor" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-slate-100 hover:text-foreground font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5" /> Case Queue
          </Link>
          <Link href="/doctor/patients" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-slate-100 hover:text-foreground font-medium transition-colors">
            <Users className="w-5 h-5" /> Patients
          </Link>
          <Link href="/doctor/follow-ups" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-slate-100 hover:text-foreground font-medium transition-colors">
            <Clock className="w-5 h-5" /> Follow-ups
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
          {/* Mobile Logo */}
          <div className="flex md:hidden items-center gap-2 font-bold text-lg">
            <Stethoscope className="w-5 h-5 text-primary" />
            SehatBridge
          </div>
          
          {/* Desktop Search */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg w-96 border border-slate-200/60 focus-within:ring-2 ring-primary/20 transition-all">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search patients, cases..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground"
            />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4 ml-auto">
            <button className="p-2 text-muted-foreground hover:bg-slate-100 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
            </button>
            <div className="h-8 w-px bg-border mx-1 hidden md:block"></div>
            <UserButton />
          </div>
        </header>
        
        <div className="flex-1 p-6 md:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
