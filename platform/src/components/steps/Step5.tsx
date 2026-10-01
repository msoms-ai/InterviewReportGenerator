import { useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Step5() {
  const { control, setValue } = useFormContext();
  const sigCanvas = useRef<SignatureCanvas>(null);
  const signatureData = useWatch({ name: "signatureData", control });
  const [isUploadMode, setIsUploadMode] = useState(false);

  const clearSignature = () => {
    sigCanvas.current?.clear();
    setValue("signatureData", ""); // Clear form state as well
  };

  const saveSignature = () => {
    if (sigCanvas.current?.isEmpty()) return;
    const dataURL = sigCanvas.current?.getTrimmedCanvas().toDataURL("image/png");
    setValue("signatureData", dataURL);
  };

  return (
    <div className="space-y-8">
      {/* Ratings & Comments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="overallRating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Overall Rating</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Rating" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="L">L - Low</SelectItem>
                  <SelectItem value="A">A - Average</SelectItem>
                  <SelectItem value="G">G - Good (Min for Selection)</SelectItem>
                  <SelectItem value="VG">VG - Very Good</SelectItem>
                  <SelectItem value="O">O - Outstanding</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Minimum rating of "Good" required for selection.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="eligibilityForEmp"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between border rounded-md p-4 bg-slate-50">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Eligibility for Employment</FormLabel>
                <FormDescription>
                  Is the candidate recommended for hire?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <FormField
          control={control}
          name="professionalComments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional Comments</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g. academic qualification, technical training, and experience..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personalityComments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personality Comments</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g. behaviour, attitude, and presentation..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="jobRecommendedFor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Recommended For</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Senior Dev" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grade</FormLabel>
              <FormControl>
                <Input placeholder="E.g., G4" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="workLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work Location</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Dubai HQ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="availableToJoinFrom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available to join from</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="otherComments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Other Comments</FormLabel>
            <FormControl>
              <Textarea placeholder="Any additional notes..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Signature Section */}
      <div className="space-y-4 pt-6 border-t">
        <div>
          <h4 className="text-base font-bold text-slate-800">Interviewer Signature</h4>
          <p className="text-sm text-muted-foreground">Please provide your signature to authorize this feedback report.</p>
        </div>
        
        <div className="border border-slate-200 rounded-md p-4 bg-slate-50 space-y-4">
          {signatureData && signatureData.length > 0 ? (
            <div className="space-y-2">
              <div className="border border-slate-300 bg-white rounded-md p-2 inline-block">
                <img src={signatureData} alt="Signature" className="max-w-[400px] max-h-[150px] object-contain" />
              </div>
              <div>
                <Button type="button" variant="outline" size="sm" onClick={clearSignature} className="text-red-600 border-red-200 hover:bg-red-50">
                  Clear Signature
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 border-b pb-4">
                <Button 
                  type="button" 
                  variant={!isUploadMode ? "default" : "outline"} 
                  onClick={() => setIsUploadMode(false)}
                  size="sm"
                >
                  Draw Signature
                </Button>
                <span className="text-slate-400 text-sm font-medium">OR</span>
                <Button 
                  type="button" 
                  variant={isUploadMode ? "default" : "outline"} 
                  onClick={() => setIsUploadMode(true)}
                  size="sm"
                >
                  Upload Image
                </Button>
              </div>

              {!isUploadMode ? (
                <div className="space-y-2">
                  <div className="border-2 border-dashed border-slate-300 rounded-md bg-white overflow-hidden max-w-[400px]">
                    <SignatureCanvas
                      ref={sigCanvas}
                      canvasProps={{
                        width: 400,
                        height: 150,
                        className: "signature-canvas w-full h-full cursor-crosshair"
                      }}
                      onEnd={saveSignature}
                    />
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={clearSignature}>
                    Clear Drawing
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setValue("signatureData", reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <Button type="button" variant="outline" size="sm">
                      Choose Image File...
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

    </div>
  );
}
