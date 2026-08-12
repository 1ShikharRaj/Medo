"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const patientSchema = z.object({
  name: z.string().min(2, "Name is required"),
  age: z.string().min(1, "Age is required"),
  sex: z.enum(["MALE", "FEMALE", "OTHER"]),
  phone: z.string().optional(),
  preferredLanguage: z.string().min(1, "Language is required"),
  village: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

const steps = [
  { id: 1, name: "Basic Info" },
  { id: 2, name: "Details" },
  { id: 3, name: "Review" }
];

export default function NewPatientForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  const { register, handleSubmit, setValue, getValues, trigger, formState: { errors } } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      preferredLanguage: "Hindi",
      phone: "",
      village: ""
    }
  });

  const nextStep = async () => {
    let fieldsToValidate: any = [];
    if (currentStep === 1) fieldsToValidate = ["name", "age", "sex"];
    if (currentStep === 2) fieldsToValidate = ["phone", "village", "preferredLanguage"];

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep(s => Math.min(s + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(s => Math.max(s - 1, 1));
  };

  async function onSubmit(data: PatientFormValues) {
    if (currentStep !== 3) return;
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create patient");
      }

      // Automatically create a draft case and redirect
      const caseRes = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: result.data._id }),
      });
      const caseResult = await caseRes.json();
      
      if (!caseRes.ok) throw new Error("Failed to create case");

      router.push(`/health-worker/cases/${caseResult.data._id}`);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  }

  const values = getValues();

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Progress Indicator */}
      <div className="mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full z-0"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full z-0 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>
        <div className="flex justify-between relative z-10">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${
                currentStep > step.id 
                  ? "bg-primary border-primary text-primary-foreground" 
                  : currentStep === step.id 
                    ? "bg-white border-primary text-primary" 
                    : "bg-white border-slate-200 text-slate-400"
              }`}>
                {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : step.id}
              </div>
              <span className={`text-xs font-semibold ${currentStep >= step.id ? 'text-slate-900' : 'text-slate-400'}`}>
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && <div className="p-4 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium border border-rose-100">{error}</div>}
            
            {/* Step 1: Basic Info */}
            <div className={currentStep === 1 ? "block space-y-6 animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Basic Information</h2>
                <p className="text-sm text-muted-foreground mb-6">Let&apos;s start with the patient&apos;s core details.</p>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="name" className="text-slate-700">Full Name</Label>
                <Input id="name" {...register("name")} placeholder="e.g., Ravi Kumar" className="h-12 bg-slate-50 focus-visible:bg-white" />
                {errors.name && <p className="text-rose-500 text-sm font-medium">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="age" className="text-slate-700">Age</Label>
                  <Input id="age" type="number" {...register("age")} placeholder="e.g., 42" className="h-12 bg-slate-50 focus-visible:bg-white" />
                  {errors.age && <p className="text-rose-500 text-sm font-medium">{errors.age.message}</p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="sex" className="text-slate-700">Biological Sex</Label>
                  <Select onValueChange={(val) => setValue("sex", val as any)} defaultValue={values.sex}>
                    <SelectTrigger className="h-12 bg-slate-50 focus-visible:bg-white">
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.sex && <p className="text-rose-500 text-sm font-medium">{errors.sex.message}</p>}
                </div>
              </div>
            </div>

            {/* Step 2: Contact & Location */}
            <div className={currentStep === 2 ? "block space-y-6 animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Contact & Details</h2>
                <p className="text-sm text-muted-foreground mb-6">How can we reach the patient and what do they speak?</p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="phone" className="text-slate-700">Phone Number (Optional)</Label>
                <Input id="phone" {...register("phone")} placeholder="e.g., 9876543210" className="h-12 bg-slate-50 focus-visible:bg-white" />
              </div>

              <div className="space-y-3">
                <Label htmlFor="village" className="text-slate-700">Village/Location (Optional)</Label>
                <Input id="village" {...register("village")} placeholder="e.g., Ramgarh" className="h-12 bg-slate-50 focus-visible:bg-white" />
              </div>

              <div className="space-y-3">
                <Label htmlFor="preferredLanguage" className="text-slate-700">Preferred Language</Label>
                <Select defaultValue={values.preferredLanguage || "Hindi"} onValueChange={(val) => setValue("preferredLanguage", val || "")}>
                  <SelectTrigger className="h-12 bg-slate-50 focus-visible:bg-white">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Bengali">Bengali</SelectItem>
                    <SelectItem value="Telugu">Telugu</SelectItem>
                  </SelectContent>
                </Select>
                {errors.preferredLanguage && <p className="text-rose-500 text-sm font-medium">{errors.preferredLanguage.message}</p>}
              </div>
            </div>

            {/* Step 3: Review */}
            <div className={currentStep === 3 ? "block space-y-6 animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Review Patient Profile</h2>
                <p className="text-sm text-muted-foreground mb-6">Please verify the details before creating the record.</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 space-y-4 border border-slate-100">
                <div className="grid grid-cols-3 gap-4 border-b border-slate-200 pb-4">
                  <div className="col-span-3 md:col-span-1">
                    <p className="text-sm text-slate-500 font-medium">Full Name</p>
                    <p className="font-semibold text-slate-900">{values.name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Age</p>
                    <p className="font-semibold text-slate-900">{values.age || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Sex</p>
                    <p className="font-semibold text-slate-900 capitalize">{values.sex?.toLowerCase() || "-"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3 md:col-span-1">
                    <p className="text-sm text-slate-500 font-medium">Phone</p>
                    <p className="font-semibold text-slate-900">{values.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Village</p>
                    <p className="font-semibold text-slate-900">{values.village || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Language</p>
                    <p className="font-semibold text-slate-900">{values.preferredLanguage}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={prevStep} 
                disabled={currentStep === 1 || isLoading}
                className={currentStep === 1 ? 'invisible' : ''}
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>

              {currentStep < steps.length ? (
                <Button type="button" onClick={nextStep} className="bg-slate-900 text-white hover:bg-slate-800 h-11 px-6">
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-8 font-bold shadow-md">
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Create Patient & Start Case
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
