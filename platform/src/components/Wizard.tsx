"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Form } from "@/components/ui/form";

import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";
import Step6 from "./steps/Step6";

const wizardSchema = z.object({
  // Step 1
  interviewerName: z.string().min(1, "Interviewer name is required"),
  empNumber: z.string().min(1, "Employee number is required"),
  title: z.string().min(1, "Title is required"),
  departmentJob: z.string().min(1, "Department/Job is required"),
  // Step 2
  applicantName: z.string().optional(),
  nationality: z.string().optional(),
  dateOfBirth: z.string().optional(),
  maritalStatus: z.string().optional(),
  // Step 3
  qualification: z.string().optional(),
  mostRecentJob: z.string().optional(),
  yearsOfExperience: z.string().optional(),
  relativesInEtisalat: z.boolean().default(false),
  relativeDetails: z.string().optional(),
  // Step 4 (Ratings)
  appearanceConfidence: z.string().optional(),
  planningExecution: z.string().optional(),
  interpersonalSkills: z.string().optional(),
  customerCentricity: z.string().optional(),
  collaboration: z.string().optional(),
  agility: z.string().optional(),
  empowerment: z.string().optional(),
  relevantExperience: z.string().optional(),
  // Step 5 (Assessment)
  overallRating: z.string().optional(),
  professionalComments: z.string().optional(),
  personalityComments: z.string().optional(),
  eligibilityForEmp: z.boolean().default(false),
  jobRecommendedFor: z.string().optional(),
  grade: z.string().optional(),
  workLocation: z.string().optional(),
  availableToJoinFrom: z.string().optional(),
  otherComments: z.string().optional(),
  signatureData: z.string().optional(),
  // Step 6 (Output format)
  outputFormat: z.enum(["docx", "pdf"]).default("docx"),
});

export type WizardFormData = z.infer<typeof wizardSchema>;

export default function Wizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 6;

  const form = useForm<WizardFormData>({
    resolver: zodResolver(wizardSchema),
    defaultValues: {
      interviewerName: "Jane Doe",
      empNumber: "12345",
      title: "Senior HR Manager",
      departmentJob: "Software Engineering",
      applicantName: "",
      nationality: "",
      dateOfBirth: "",
      maritalStatus: "",
      qualification: "",
      mostRecentJob: "",
      yearsOfExperience: "",
      relativesInEtisalat: false,
      relativeDetails: "",
      appearanceConfidence: "",
      planningExecution: "",
      interpersonalSkills: "",
      customerCentricity: "",
      collaboration: "",
      agility: "",
      empowerment: "",
      relevantExperience: "",
      overallRating: "",
      professionalComments: "",
      personalityComments: "",
      eligibilityForEmp: false,
      jobRecommendedFor: "",
      grade: "",
      workLocation: "",
      availableToJoinFrom: "",
      otherComments: "",
      signatureData: "",
      outputFormat: "docx",
    },
    mode: "onChange",
  });

  const nextStep = async () => {
    // Basic step validation could go here
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data: WizardFormData) => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Failed to generate report");
        return;
      }

      // Trigger download for docx
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Interview_Report_${data.applicantName?.replace(/\s+/g, '_') || 'Candidate'}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
    } catch (error) {
      console.error(error);
      alert("An error occurred while generating the report.");
    }
  };

  const startNewInterview = () => {
    const currentValues = form.getValues();
    form.reset({
      interviewerName: currentValues.interviewerName,
      empNumber: currentValues.empNumber,
      title: currentValues.title,
      departmentJob: currentValues.departmentJob,
      applicantName: "",
      nationality: "",
      dateOfBirth: "",
      maritalStatus: "",
      qualification: "",
      mostRecentJob: "",
      yearsOfExperience: "",
      relativesInEtisalat: false,
      relativeDetails: "",
      appearanceConfidence: "",
      planningExecution: "",
      interpersonalSkills: "",
      customerCentricity: "",
      collaboration: "",
      agility: "",
      empowerment: "",
      relevantExperience: "",
      overallRating: "",
      professionalComments: "",
      personalityComments: "",
      eligibilityForEmp: false,
      jobRecommendedFor: "",
      grade: "",
      workLocation: "",
      availableToJoinFrom: "",
      otherComments: "",
      signatureData: "",
      outputFormat: "docx",
    });
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="max-w-4xl mx-auto py-4">
      <div className="mb-10">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider">Step {currentStep + 1} of {totalSteps}</h2>
            <p className="text-slate-500 text-sm mt-1">{Math.round(progress)}% Completed</p>
          </div>
        </div>
        <Progress value={progress} className="h-2.5 bg-slate-200" />
      </div>

      <Card className="shadow-xl border-slate-200/60 rounded-xl overflow-hidden bg-white">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="bg-slate-50/50 border-b px-8 py-6">
              <CardTitle className="text-2xl font-bold text-slate-800">
                {currentStep === 0 && "Context & Interviewer Details"}
                {currentStep === 1 && "Candidate Information"}
                {currentStep === 2 && "Experience & Qualifications"}
                {currentStep === 3 && "Competency Ratings"}
                {currentStep === 4 && "Assessment & Recommendation"}
                {currentStep === 5 && "Review & Generate"}
              </CardTitle>
              <CardDescription className="text-slate-500 mt-1">
                Please fill in the required information below to proceed.
              </CardDescription>
            </div>
            <CardContent className="min-h-[350px] p-8">
               {currentStep === 0 && <Step1 />}
               {currentStep === 1 && <Step2 />}
               {currentStep === 2 && <Step3 />}
               {currentStep === 3 && <Step4 />}
               {currentStep === 4 && <Step5 />}
               {currentStep === 5 && <Step6 />}
            </CardContent>
            <CardFooter className="flex justify-between border-t bg-slate-50/30 p-6 px-8">
              <Button 
                type="button" 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 0}
                className="w-32 border-slate-300"
              >
                Previous
              </Button>
              
              {currentStep < totalSteps - 1 ? (
                <Button type="button" onClick={nextStep} className="w-32 bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                  Next
                </Button>
              ) : (
                <div className="flex gap-4">
                  <Button type="button" onClick={startNewInterview} variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                    Start New Interview
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white shadow-md px-6">
                    Generate Report
                  </Button>
                </div>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
