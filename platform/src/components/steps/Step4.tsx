import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const competencies = [
  { name: "appearanceConfidence", label: "Appearance & Confidence", desc: "Appropriate appearance, Self Confidence" },
  { name: "planningExecution", label: "Planning & Execution", desc: "Ability to plan and accomplish tasks, in time and effectively." },
  { name: "interpersonalSkills", label: "Interpersonal & Comm. Skills", desc: "Good Listener expresses opinions clearly and concisely." },
  { name: "customerCentricity", label: "Customer Centricity", desc: "Willingness and ability to give priority to customers." },
  { name: "collaboration", label: "Collaboration", desc: "Working cooperatively. Recognizing different ways of working to achieve common goals." },
  { name: "agility", label: "Agility", desc: "Ability to respond quickly and correctly." },
  { name: "empowerment", label: "Empowerment", desc: "Enable people to take ownership and be accountable for delivery." },
  { name: "relevantExperience", label: "Relevant Work & Training", desc: "Previous experience and technical training meet with job requirement" },
];

const ratings = [
  { value: "L", label: "L", tooltip: "Low" },
  { value: "A", label: "A", tooltip: "Average" },
  { value: "G", label: "G", tooltip: "Good" },
  { value: "VG", label: "VG", tooltip: "Very Good" },
  { value: "O", label: "O", tooltip: "Outstanding" },
];

export default function Step4() {
  const { control } = useFormContext();

  return (
    <div className="space-y-8">
      <div className="bg-slate-50 p-4 rounded-md text-sm text-slate-600 mb-6">
        <p className="font-semibold text-slate-900 mb-1">Rating Scale Legend:</p>
        <div className="flex flex-wrap gap-4">
          <span><strong className="text-slate-900">L:</strong> Low</span>
          <span><strong className="text-slate-900">A:</strong> Average</span>
          <span><strong className="text-slate-900">G:</strong> Good</span>
          <span><strong className="text-slate-900">VG:</strong> Very Good</span>
          <span><strong className="text-slate-900">O:</strong> Outstanding</span>
        </div>
      </div>

      <div className="divide-y border rounded-md">
        {competencies.map((comp) => (
          <FormField
            key={comp.name}
            control={control}
            name={comp.name}
            render={({ field }) => (
              <FormItem className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <FormLabel className="text-base">{comp.label}</FormLabel>
                  <FormDescription>{comp.desc}</FormDescription>
                </div>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex justify-between sm:justify-end gap-2 sm:gap-4"
                  >
                    {ratings.map((rating) => (
                      <FormItem key={rating.value} className="flex flex-col items-center space-y-2">
                        <FormControl>
                          <RadioGroupItem value={rating.value} className="w-6 h-6" />
                        </FormControl>
                        <FormLabel className="font-medium text-xs cursor-pointer">
                          {rating.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage className="col-span-full" />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
}
