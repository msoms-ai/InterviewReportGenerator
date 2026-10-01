import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Step1() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="interviewerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interviewer Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="empNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee Number</FormLabel>
              <FormControl>
                <Input placeholder="E.g., 12345" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Senior Manager" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="departmentJob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department / Job Interview For</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department/Job" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                  <SelectItem value="Product Management">Product Management</SelectItem>
                  <SelectItem value="Human Resources">Human Resources</SelectItem>
                  <SelectItem value="Sales & Marketing">Sales & Marketing</SelectItem>
                  <SelectItem value="Platforms Architecture">Platforms Architecture</SelectItem>
                  <SelectItem value="Platforms Development">Platforms Development</SelectItem>
                  <SelectItem value="Platforms Onboarding">Platforms Onboarding</SelectItem>
                  <SelectItem value="Platforms Operations">Platforms Operations</SelectItem>
                  <SelectItem value="Platforms Business">Platforms Business</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
