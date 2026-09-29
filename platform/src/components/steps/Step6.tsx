import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Step6() {
  const { control, getValues } = useFormContext();
  const data = getValues();

  return (
    <div className="space-y-8">
      {/* Summary View */}
      <div className="bg-slate-50 p-6 rounded-md text-sm text-slate-700">
        <h3 className="font-semibold text-lg text-slate-900 mb-4 border-b pb-2">Review Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <span className="font-semibold">Candidate:</span> {data.applicantName || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Role:</span> {data.departmentJob || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Interviewer:</span> {data.interviewerName || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Overall Rating:</span> {data.overallRating || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Recommended for Hire:</span> {data.eligibilityForEmp ? "Yes" : "No"}
          </div>
        </div>
        
        {data.signatureData ? (
          <div className="mt-6">
            <span className="font-semibold block mb-2">Signature Attached:</span>
            <div className="h-16 w-48 border border-slate-200 bg-white flex items-center justify-center p-1 rounded">
              <img src={data.signatureData} alt="Signature" className="h-full object-contain" />
            </div>
          </div>
        ) : (
          <div className="mt-6 text-red-500 font-semibold">
            Warning: No signature attached.
          </div>
        )}
      </div>

      {/* Format Selection removed as per request */}
      <div className="border-t pt-6">
         <p className="text-sm text-slate-500 italic">Click "Generate Report" below to download the completed Word document.</p>
      </div>
    </div>
  );
}
