import { useRef, useState, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, RotateCcw, Key, AlertCircle, X } from "lucide-react";

export default function Step5() {
  const { control, setValue, getValues } = useFormContext();
  const sigCanvas = useRef<SignatureCanvas>(null);
  const signatureData = useWatch({ name: "signatureData", control });
  const [isUploadMode, setIsUploadMode] = useState(false);

  // Gemini enhancement states
  const [isEnhancing, setIsEnhancing] = useState<string | null>(null);
  const [previousComments, setPreviousComments] = useState<Record<string, string>>({});
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [userApiKey, setUserApiKey] = useState("");
  const [activeFieldForModal, setActiveFieldForModal] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("gemini_api_key") || "";
      setUserApiKey(savedKey);
    }
  }, []);

  const handleEnhance = async (
    fieldName: "professionalComments" | "personalityComments" | "otherComments",
    overrideKey?: string
  ) => {
    const currentText = (getValues(fieldName) || "") as string;
    if (!currentText.trim()) {
      setErrorMessage("Please type some initial notes or bullet points first before enhancing with Gemini.");
      return;
    }

    setErrorMessage(null);
    setIsEnhancing(fieldName);

    try {
      const keyToSend =
        overrideKey !== undefined
          ? overrideKey
          : typeof window !== "undefined"
          ? localStorage.getItem("gemini_api_key") || ""
          : "";

      const applicantName = getValues("applicantName") || "";
      const jobRecommendedFor = getValues("jobRecommendedFor") || "";

      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: currentText,
          fieldType: fieldName,
          applicantName,
          jobRecommendedFor,
          apiKey: keyToSend || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "MISSING_API_KEY") {
          setActiveFieldForModal(fieldName);
          setApiKeyModalOpen(true);
        } else {
          setErrorMessage(data.message || "Unable to enhance comments with Gemini.");
        }
        return;
      }

      if (data.enhancedText) {
        // Save previous notes so user can easily Undo
        setPreviousComments((prev) => ({ ...prev, [fieldName]: currentText }));
        setValue(fieldName, data.enhancedText, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Error communicating with Gemini service.");
    } finally {
      setIsEnhancing(null);
    }
  };

  const handleUndo = (fieldName: string) => {
    const prevText = previousComments[fieldName];
    if (prevText !== undefined) {
      setValue(fieldName, prevText, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setPreviousComments((prev) => {
        const updated = { ...prev };
        delete updated[fieldName];
        return updated;
      });
    }
  };

  const saveApiKeyAndRetry = () => {
    const trimmed = userApiKey.trim();
    if (typeof window !== "undefined") {
      if (trimmed) {
        localStorage.setItem("gemini_api_key", trimmed);
      } else {
        localStorage.removeItem("gemini_api_key");
      }
    }
    setApiKeyModalOpen(false);
    if (activeFieldForModal && trimmed) {
      handleEnhance(activeFieldForModal as any, trimmed);
      setActiveFieldForModal(null);
    }
  };

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
      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="flex items-center justify-between p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-700 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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

      {/* Comments Section with Gemini Assistant */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-800 tracking-wide uppercase">Evaluation Comments</h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              Gemini AI Powered
            </span>
          </div>
          <button
            type="button"
            onClick={() => setApiKeyModalOpen(true)}
            className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            title="Configure Gemini API Key"
          >
            <Key className="w-3 h-3" />
            <span>{userApiKey ? "API Key Configured" : "Set API Key"}</span>
          </button>
        </div>

        {/* 1. Professional Comments */}
        <FormField
          control={control}
          name="professionalComments"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between gap-2 pb-1">
                <FormLabel>Professional Comments</FormLabel>
                <div className="flex items-center gap-2">
                  {previousComments["professionalComments"] && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUndo("professionalComments")}
                      className="h-7 px-2 text-xs text-slate-500 hover:text-slate-800"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" />
                      Undo
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleEnhance("professionalComments")}
                    disabled={isEnhancing === "professionalComments" || !field.value?.trim()}
                    className="h-7 px-2.5 text-xs font-semibold gap-1.5 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 shadow-2xs transition-all disabled:opacity-40"
                    title={!field.value?.trim() ? "Type your draft notes first to enhance with Gemini" : "Enhance with Gemini AI"}
                  >
                    {isEnhancing === "professionalComments" ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                        <span>Enhancing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Enhance with Gemini</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <FormControl>
                <Textarea
                  rows={4}
                  className="min-h-[90px] resize-y"
                  placeholder="e.g. academic qualification, technical training, and experience..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 2. Personality Comments */}
        <FormField
          control={control}
          name="personalityComments"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between gap-2 pb-1">
                <FormLabel>Personality Comments</FormLabel>
                <div className="flex items-center gap-2">
                  {previousComments["personalityComments"] && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUndo("personalityComments")}
                      className="h-7 px-2 text-xs text-slate-500 hover:text-slate-800"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" />
                      Undo
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleEnhance("personalityComments")}
                    disabled={isEnhancing === "personalityComments" || !field.value?.trim()}
                    className="h-7 px-2.5 text-xs font-semibold gap-1.5 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 shadow-2xs transition-all disabled:opacity-40"
                    title={!field.value?.trim() ? "Type your draft notes first to enhance with Gemini" : "Enhance with Gemini AI"}
                  >
                    {isEnhancing === "personalityComments" ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                        <span>Enhancing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Enhance with Gemini</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <FormControl>
                <Textarea
                  rows={4}
                  className="min-h-[90px] resize-y"
                  placeholder="e.g. behaviour, attitude, and presentation..."
                  {...field}
                />
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

      {/* 3. Other Comments */}
      <FormField
        control={control}
        name="otherComments"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between gap-2 pb-1">
              <FormLabel>Other Comments</FormLabel>
              <div className="flex items-center gap-2">
                {previousComments["otherComments"] && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUndo("otherComments")}
                    className="h-7 px-2 text-xs text-slate-500 hover:text-slate-800"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" />
                    Undo
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleEnhance("otherComments")}
                  disabled={isEnhancing === "otherComments" || !field.value?.trim()}
                  className="h-7 px-2.5 text-xs font-semibold gap-1.5 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 shadow-2xs transition-all disabled:opacity-40"
                  title={!field.value?.trim() ? "Type your draft notes first to enhance with Gemini" : "Enhance with Gemini AI"}
                >
                  {isEnhancing === "otherComments" ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                      <span>Enhancing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Enhance with Gemini</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
            <FormControl>
              <Textarea
                rows={4}
                className="min-h-[90px] resize-y"
                placeholder="Any additional notes..."
                {...field}
              />
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

      {/* Gemini API Key Configuration Modal */}
      {apiKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 relative">
            <button
              type="button"
              onClick={() => setApiKeyModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 text-indigo-700">
              <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-lg">
                <Sparkles className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Google Gemini API Key</h3>
                <p className="text-xs text-slate-500">Configure AI-powered feedback enhancement</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your Gemini API key below to enable instant, professional comment enhancement. The key is securely saved in your browser session.
            </p>

            <div className="space-y-2">
              <Input
                type="password"
                placeholder="AIzaSy..."
                value={userApiKey}
                onChange={(e) => setUserApiKey(e.target.value)}
                className="font-mono text-xs"
              />
              <p className="text-[11px] text-slate-500">
                Need an API key? You can get a free one in seconds from{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 font-semibold underline hover:text-indigo-800"
                >
                  Google AI Studio
                </a>
                . (You can also configure <code>GEMINI_API_KEY</code> on your Plesk server <code>.env</code>).
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setApiKeyModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={saveApiKeyAndRetry}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                Save & Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
