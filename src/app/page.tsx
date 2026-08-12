import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, Shield, Stethoscope, Video, Activity, 
  BrainCircuit, FileText, CheckCircle2, User, 
  AlertTriangle, ArrowUpRight, Search, FileSymlink,
  HeartPulse, Sparkles, Building2, UserCheck
} from 'lucide-react';
import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { StatusBadge } from '@/components/ui/status-badge';

export default async function LandingPage() {
  const { userId } = await auth();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      {/* NAVBAR */}
      <header className="px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 transition-all">
        <div className="flex items-center gap-1 md:gap-2">
          <Stethoscope className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          <span className="text-lg md:text-xl font-bold tracking-tight text-foreground">
            SehatBridge<span className="text-primary font-semibold text-base md:text-lg ml-0.5">AI</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-muted-foreground">
          <Link href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#rag" className="hover:text-foreground transition-colors">Clinical AI</Link>
          <Link href="#safety" className="hover:text-foreground transition-colors">Safety</Link>
        </nav>
        <div className="flex items-center gap-2 md:gap-4">
          {!userId ? (
            <SignInButton mode="modal">
              <Button variant="ghost" className="font-semibold px-2 md:px-4 text-sm md:text-base">Sign In</Button>
            </SignInButton>
          ) : (
            <UserButton />
          )}
          <Link href={userId ? "/dashboard" : "/login"}>
            <Button className="font-semibold shadow-sm text-sm md:text-base px-3 md:px-4">
              <span className="hidden sm:inline">{userId ? "Go to Clinic" : "Open Clinic"}</span>
              <span className="sm:inline hidden">{userId ? "" : ""}</span>
              <span className="sm:hidden">{userId ? "Clinic" : "Open"}</span>
              <ArrowRight className="ml-1 md:ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center w-full overflow-x-hidden">
        {/* HERO */}
        <section className="w-full py-16 md:py-32 flex flex-col items-center text-center px-4 md:px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background -z-10" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20 shadow-sm">
            <Sparkles className="w-4 h-4" />
            AI-Assisted Virtual Clinic for Rural Healthcare
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight max-w-5xl mb-6 text-foreground leading-[1.1]">
            Healthcare support, <br className="hidden sm:block" />
            <span className="text-primary">closer to every village.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-10 leading-relaxed font-medium">
            SehatBridge AI helps trained health workers collect patient information, organize clinical cases, access relevant protocols, and connect patients with qualified remote doctors.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-16 md:mb-20 w-full sm:w-auto">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="h-14 px-8 text-lg w-full shadow-md transition-transform hover:-translate-y-0.5">
                Open Virtual Clinic <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#how-it-works" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full bg-white shadow-sm hover:bg-slate-50 transition-transform hover:-translate-y-0.5">
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Hero Visual - Dashboard Preview */}
          <div className="w-full max-w-6xl relative rounded-2xl border border-slate-200/60 bg-white/50 backdrop-blur-sm shadow-2xl p-2 md:p-4 md:rotate-[1deg] hover:rotate-0 transition-transform duration-700 ease-out">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent bottom-0 h-40 z-10 rounded-b-2xl" />
            <div className="rounded-xl overflow-hidden border border-slate-100 bg-white shadow-inner flex flex-col md:flex-row h-[400px] md:h-[500px]">
              {/* Fake Sidebar */}
              <div className="hidden md:flex w-64 bg-slate-50 border-r border-slate-100 p-4 flex-col gap-4">
                <div className="h-8 bg-slate-200 rounded-md w-3/4 mb-4" />
                <div className="h-10 bg-white border border-slate-200 rounded-md w-full" />
                <div className="h-10 bg-slate-200/50 rounded-md w-full" />
                <div className="h-10 bg-slate-200/50 rounded-md w-full" />
              </div>
              {/* Fake Main Content */}
              <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 bg-slate-50/50">
                <div className="flex justify-between items-center">
                  <div className="h-8 bg-slate-200 rounded-md w-48" />
                  <div className="h-8 bg-primary/20 rounded-full w-24" />
                </div>
                {/* Fake AI Brief Panel */}
                <div className="bg-white border border-primary/20 rounded-xl p-6 shadow-sm flex-1 flex flex-col gap-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-primary">AI Case Brief</span>
                  </div>
                  <div className="h-4 bg-slate-100 rounded w-full" />
                  <div className="h-4 bg-slate-100 rounded w-5/6" />
                  <div className="h-4 bg-slate-100 rounded w-4/6" />
                  
                  <div className="mt-auto flex gap-4">
                     <div className="h-10 bg-emerald-100 rounded-md w-32" />
                     <div className="h-10 bg-primary text-primary-foreground rounded-md w-48 flex items-center justify-center font-medium text-sm">Consult Doctor</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="w-full py-12 border-y bg-slate-50 flex justify-center">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 px-6 text-muted-foreground font-medium text-sm md:text-base">
            <div className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> AI-Assisted</div>
            <div className="flex items-center gap-2"><Stethoscope className="w-5 h-5 text-primary" /> Doctor Reviewed</div>
            <div className="flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> Protocol Grounded</div>
            <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-primary" /> Secure Records</div>
          </div>
        </section>

        {/* PROBLEM & SOLUTION */}
        <section className="w-full py-16 md:py-24 px-4 md:px-6 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Bridging the Healthcare Gap</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Rural health centres often have dedicated trained health workers but limited access to qualified doctors when it matters most.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">The Solution is Connected</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mt-1 shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-foreground text-lg">Collect</h4>
                    <p className="text-muted-foreground">Health worker records symptoms and vitals.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mt-1 shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-foreground text-lg">Understand</h4>
                    <p className="text-muted-foreground">AI organizes the case into a clear clinical brief.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mt-1 shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-foreground text-lg">Check</h4>
                    <p className="text-muted-foreground">Deterministic safety rules identify urgent risks.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mt-1 shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold text-foreground text-lg">Connect</h4>
                    <p className="text-muted-foreground">Remote doctor reviews and makes the final decision.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mt-1 shrink-0">5</div>
                  <div>
                    <h4 className="font-semibold text-foreground text-lg">Follow Up</h4>
                    <p className="text-muted-foreground">Health worker manages the ongoing care plan.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm relative">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent rounded-2xl" />
               <div className="flex flex-col gap-6 relative z-10">
                  <div className="flex items-center gap-3 md:gap-4 bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-100">
                     <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full bg-blue-100 flex items-center justify-center"><User className="text-blue-600 w-5 h-5 md:w-6 md:h-6" /></div>
                     <div><p className="font-semibold text-sm md:text-base">Village Patient</p><p className="text-xs md:text-sm text-muted-foreground">Arrives at rural clinic</p></div>
                  </div>
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-slate-300 mx-auto rotate-90" />
                  <div className="flex items-center gap-3 md:gap-4 bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-100">
                     <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center"><UserCheck className="text-primary w-5 h-5 md:w-6 md:h-6" /></div>
                     <div><p className="font-semibold text-sm md:text-base">Health Worker + AI</p><p className="text-xs md:text-sm text-muted-foreground">Intake & case preparation</p></div>
                  </div>
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-slate-300 mx-auto rotate-90" />
                  <div className="flex items-center gap-3 md:gap-4 bg-white p-3 md:p-4 rounded-xl shadow-sm border border-primary/30 ring-1 ring-primary/10">
                     <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full bg-emerald-100 flex items-center justify-center"><Stethoscope className="text-emerald-700 w-5 h-5 md:w-6 md:h-6" /></div>
                     <div><p className="font-semibold text-emerald-900 text-sm md:text-base">Remote Doctor</p><p className="text-xs md:text-sm text-emerald-700/80">Reviews & Decides</p></div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* AI + HUMAN PHILOSOPHY */}
        <section className="w-full py-16 md:py-24 bg-slate-900 text-white px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-10 leading-tight">AI assists. <br/><span className="text-primary">Doctors decide.</span></h2>
            <p className="text-xl text-slate-300 mb-12 text-left leading-relaxed">
              AI does not replace doctors. It organizes unstructured information, retrieves relevant clinical knowledge, and highlights safety risks. Qualified remote doctors review the prepared case and make all final clinical decisions.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">AI Assistance</h3>
                </div>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400/70" /> Extracts symptoms from notes</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400/70" /> Summarizes medical history</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400/70" /> Searches clinical protocols (RAG)</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400/70" /> Flags abnormal vitals</li>
                </ul>
              </div>
              <div className="bg-primary/20 border border-primary/30 p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <Stethoscope className="w-6 h-6 text-primary-foreground" />
                    <h3 className="text-xl font-bold text-white">Doctor Decision</h3>
                  </div>
                  <ul className="space-y-3 text-slate-200">
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Reviews AI case brief</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Conducts video consultation</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Diagnoses the patient</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Prescribes care plan</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS / ROLES */}
        <section id="how-it-works" className="w-full py-16 md:py-24 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Empowering Both Sides of Care</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Dedicated tools built specifically for the needs of rural health workers and remote medical experts.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            {/* Health Worker */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl text-blue-700"><Building2 className="w-6 h-6" /></div>
                <h3 className="text-2xl font-bold">For Health Workers</h3>
              </div>
              <p className="text-muted-foreground mb-8">
                Operate the virtual clinic with confidence. Collect data easily, let AI organize the paperwork, and connect your patients to experts.
              </p>
              <div className="space-y-6">
                <RoleFeature icon={<User />} title="Patient Intake" desc="Record symptoms, vitals, and upload documents easily." />
                <RoleFeature icon={<Activity />} title="Follow-up Management" desc="Track patient progress and manage ongoing care instructions." />
                <RoleFeature icon={<FileSymlink />} title="Digital Records" desc="Keep organized, secure digital patient histories." />
              </div>
            </div>

            {/* Doctor */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-100 rounded-xl text-emerald-700"><Stethoscope className="w-6 h-6" /></div>
                <h3 className="text-2xl font-bold">For Doctors</h3>
              </div>
              <p className="text-muted-foreground mb-8">
                Receive highly structured, prioritized clinical cases. Focus your time on medical decision-making rather than data collection.
              </p>
              <div className="space-y-6">
                <RoleFeature icon={<FileText />} title="AI Patient Summary" desc="Review a concise, structured brief before the consultation." />
                <RoleFeature icon={<AlertTriangle />} title="Safety & Triage" desc="Urgent cases are automatically flagged for immediate review." />
                <RoleFeature icon={<Video />} title="Remote Consultation" desc="Integrated video calls backed by full patient context." />
              </div>
            </div>
          </div>
        </section>

        {/* RAG & SAFETY */}
        <section id="rag" className="w-full py-16 md:py-24 bg-slate-50 px-4 md:px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <StatusBadge status="safe" label="Clinical Intelligence" className="mb-6 bg-primary/10 text-primary border-primary/20" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Grounded in Medical Protocol</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Instead of asking AI to rely on general internet knowledge, SehatBridge retrieves specific, relevant clinic protocols and provides them as context.
              </p>
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4 text-sm font-medium text-slate-500 mb-4">
                  <span>Clinical Knowledge</span>
                  <ArrowRight className="w-4 h-4" />
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                  <span className="text-primary font-bold">Relevant Protocol</span>
                </div>
                <p className="text-sm text-foreground bg-slate-50 p-4 rounded-lg border border-slate-100">
                  "Knowledge Used: Primary Care Triage Protocol v2.1"
                </p>
              </div>
            </div>
            
            <div id="safety">
              <StatusBadge status="warning" label="Deterministic Safety" className="mb-6 bg-amber-100 text-amber-800 border-amber-200" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Built-in Safety Guardrails</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Strict safety checks monitor patient vitals and symptoms against configured risk thresholds.
              </p>
              <div className="space-y-4">
                <Card className="border-emerald-200 shadow-sm">
                  <CardContent className="p-4 flex items-center gap-4">
                    <StatusBadge status="safe" />
                    <div><p className="font-semibold text-sm">Routine Workflow</p><p className="text-xs text-muted-foreground">Standard queue processing</p></div>
                  </CardContent>
                </Card>
                <Card className="border-amber-200 shadow-sm">
                  <CardContent className="p-4 flex items-center gap-4">
                    <StatusBadge status="warning" />
                    <div><p className="font-semibold text-sm">Doctor Review Recommended</p><p className="text-xs text-muted-foreground">Requires clinical attention</p></div>
                  </CardContent>
                </Card>
                <Card className="border-rose-200 shadow-sm">
                  <CardContent className="p-4 flex items-center gap-4">
                    <StatusBadge status="danger" />
                    <div><p className="font-semibold text-sm">Urgent Referral</p><p className="text-xs text-muted-foreground">Bypass standard queue</p></div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="w-full py-20 md:py-32 bg-primary text-primary-foreground text-center px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">Bring a virtual clinic closer to every community.</h2>
            <Link href="/register">
              <Button size="lg" className="h-14 px-10 text-lg bg-white text-primary hover:bg-slate-100 shadow-xl transition-transform hover:-translate-y-1">
                Explore SehatBridge
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full py-12 px-6 border-t bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-slate-400" />
            <span className="font-bold text-slate-900">SehatBridge<span className="text-slate-500 font-medium">AI</span></span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-slate-500 font-medium">
            <Link href="#" className="hover:text-slate-900 transition-colors">Product</Link>
            <Link href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Terms</Link>
          </nav>
          <p className="text-sm text-slate-400">
            © 2026 SehatBridge AI. Built for the Healthcare Hackathon.
          </p>
        </div>
      </footer>
    </div>
  );
}

function RoleFeature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-foreground mb-1">{title}</h4>
        <p className="text-muted-foreground text-sm">{desc}</p>
      </div>
    </div>
  );
}
