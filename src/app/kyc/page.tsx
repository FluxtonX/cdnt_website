"use client";

import React, { useState, useRef, useEffect } from "react";
import { Check, Upload, CheckCircle2, Clock, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function KYCPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
  async function checkExistingKyc() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('kyc_submissions')
      .select('status')
      .eq('user_id', user.id)
      .single();
    if (data?.status === 'pending') {
      alert("You have already submitted your KYC. Please wait for approval.");
      router.push('/dashboard');
    } else if (data?.status === 'approved') {
      router.push('/dashboard');
    }
    setKycChecked(true);
  }
  checkExistingKyc();
}, []);
  const idFrontRef = useRef<HTMLInputElement>(null);
  const idBackRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    sin: "",
    occupation: "",
    streetAddress: "",
    city: "",
    province: "",
    postalCode: "",
    country: ""
  });

  const [files, setFiles] = useState({
    idFront: null as File | null,
    idBack: null as File | null,
    selfie: null as File | null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
const [filePreviews, setFilePreviews] = useState<Record<string, string>>({});
const [kycChecked, setKycChecked] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof files) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    if (file.size > 10 * 1024 * 1024) {
      setErrors({ ...errors, [field]: "File too large. Maximum size is 10MB" });
      return;
    }
    setFiles({ ...files, [field]: file });
    const preview = URL.createObjectURL(file);
    setFilePreviews({ ...filePreviews, [field]: preview });
    setErrors({ ...errors, [field]: "" });
  }
};
  const submitKyc = async () => {
    if (!files.idFront || !files.idBack || !files.selfie) {
      alert("Please upload all required documents");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const uploadFile = async (file: File, filename: string) => {
        const filePath = `${user.id}/${filename}`;
        const { error: uploadError } = await supabase.storage
          .from('kyc-documents')
          .upload(filePath, file, { upsert: true });
        
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from('kyc-documents').getPublicUrl(filePath);
        return data.publicUrl;
      };

      const idFrontUrl = await uploadFile(files.idFront, 'id-front.jpg');
      const idBackUrl = await uploadFile(files.idBack, 'id-back.jpg');
      const selfieUrl = await uploadFile(files.selfie, 'selfie.jpg');

      const { error: insertError } = await supabase
        .from('kyc_submissions')
        .insert({
          user_id: user.id,
          full_name: formData.fullName,
          date_of_birth: formData.dob,
          sin: formData.sin,
          occupation: formData.occupation,
          street_address: formData.streetAddress,
          city: formData.city,
          province: formData.province,
          postal_code: formData.postalCode,
          country: formData.country,
          id_front_url: idFrontUrl,
          id_back_url: idBackUrl,
          selfie_url: selfieUrl,
          status: 'pending'
        });

      if (insertError) throw insertError;

      try {
        await fetch("/api/log-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "KYC Documents Submitted",
            category: "Kyc",
            severity: "Info",
            userName: formData.fullName,
            userId: user.id,
            details: "User submitted front ID, back ID, and selfie for KYC verification."
          })
        });
      } catch (logErr) {
        console.error("Failed to call log-event for KYC submission:", logErr);
      }

      setCurrentStep(5);
    } catch (error: any) {
      console.error("KYC submission error:", error);
      alert(error.message || "An error occurred while submitting KYC. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSteps = 5;

const nextStep = () => {
  const newErrors: Record<string, string> = {};
  
  if (currentStep === 1) {
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.dob.trim()) newErrors.dob = "Date of birth is required";
    if (!formData.sin.trim()) newErrors.sin = "SIN is required";
    if (!formData.occupation.trim()) newErrors.occupation = "Occupation is required";
  }
  
  if (currentStep === 2) {
    if (!formData.streetAddress.trim()) newErrors.streetAddress = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.province.trim()) newErrors.province = "Province is required";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
  }

  if (currentStep === 3) {
    if (!files.idFront) newErrors.idFront = "Please upload front of ID";
    if (!files.idBack) newErrors.idBack = "Please upload back of ID";
  }

  if (currentStep === 4) {
    if (!files.selfie) newErrors.selfie = "Please upload your selfie";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({});
  if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
};
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const StepIndicator = () => {
    return (
      <div className="flex items-center justify-center w-full max-w-[400px] mb-6">
        {[1, 2, 3, 4].map((step, index) => {
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;

          return (
            <React.Fragment key={step}>
              {/* Step Circle */}
              <div 
                className={cn(
                  "flex items-center justify-center w-[30px] h-[30px] rounded-full text-[13px] font-bold z-10 transition-colors shadow-sm",
                  isCompleted || isActive ? "bg-[#F5A623] text-[#0A0F2C]" : "bg-[#335CBC] text-blue-200"
                )}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : step}
              </div>

              {/* Connecting Line */}
              {index < 3 && (
                <div 
                  className={cn(
                    "flex-1 h-[2px] mx-2 transition-colors rounded-full",
                    step < currentStep ? "bg-[#F5A623]" : "bg-[#335CBC]"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
      {currentStep <= 4 && (
        <>
          <h1 className="text-[28px] font-bold text-white mb-1 text-center">
            Identity Verification
          </h1>
          <p className="text-[14px] text-blue-100 mb-5 text-center font-medium">
            Complete KYC to unlock your account
          </p>
          <StepIndicator />
        </>
      )}

      <div className="bg-white rounded-2xl w-full p-6 shadow-xl shadow-blue-900/20">
        
        {/* Step 1: Personal Information */}
      {currentStep === 1 && (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="text-center mb-6">
      <h2 className="text-[17px] font-bold text-[#0A0F2C]">Personal Information</h2>
      <p className="text-[13px] text-[#718096] mt-1">Provide your legal information</p>
    </div>
    
    <div className="space-y-4">
      <div>
        <label className="block text-[12px] font-bold text-[#0A0F2C] mb-1">Legal Full Name</label>
        <input 
          type="text" 
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="John Michael Smith" 
          className={`w-full px-3 py-2.5 rounded-xl border text-[14px] text-[#0A0F2C] focus:outline-none focus:ring-2 focus:ring-[#113285]/20 focus:border-[#113285] transition-all ${errors.fullName ? 'border-red-400' : 'border-gray-200'}`}
        />
        {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[12px] font-bold text-[#0A0F2C] mb-1">Date of Birth</label>
          <input 
            type="text" 
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            placeholder="dd/mm/yyyy" 
            className={`w-full px-3 py-2.5 rounded-xl border text-[14px] text-[#0A0F2C] focus:outline-none focus:ring-2 focus:ring-[#113285]/20 focus:border-[#113285] transition-all ${errors.dob ? 'border-red-400' : 'border-gray-200'}`}
          />
          {errors.dob && <p className="text-[11px] text-red-500 mt-1">{errors.dob}</p>}
        </div>
        <div>
          <label className="block text-[12px] font-bold text-[#0A0F2C] mb-1">Social Insurance Number (SIN)</label>
          <input 
            type="text" 
            name="sin"
            value={formData.sin}
            onChange={handleInputChange}
            placeholder="000-000-000" 
            className={`w-full px-3 py-2.5 rounded-xl border text-[14px] text-[#0A0F2C] focus:outline-none focus:ring-2 focus:ring-[#113285]/20 focus:border-[#113285] transition-all ${errors.sin ? 'border-red-400' : 'border-gray-200'}`}
          />
          {errors.sin && <p className="text-[11px] text-red-500 mt-1">{errors.sin}</p>}
        </div>
      </div>

      <div>
        <label className="block text-[12px] font-bold text-[#0A0F2C] mb-1">Occupation</label>
        <input 
          type="text" 
          name="occupation"
          value={formData.occupation}
          onChange={handleInputChange}
          placeholder="Software Engineer" 
          className={`w-full px-3 py-2.5 rounded-xl border text-[14px] text-[#0A0F2C] focus:outline-none focus:ring-2 focus:ring-[#113285]/20 focus:border-[#113285] transition-all ${errors.occupation ? 'border-red-400' : 'border-gray-200'}`}
        />
        {errors.occupation && <p className="text-[11px] text-red-500 mt-1">{errors.occupation}</p>}
      </div>
    </div>

    <button 
      onClick={nextStep}
      className="w-full bg-[#113285] hover:bg-[#0D2665] text-white font-bold text-[14px] py-3 rounded-xl mt-6 transition-colors"
    >
      Continue
    </button>
  </div>
)}
        {/* Step 2: Address Details */}
      {currentStep === 2 && (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="text-center mb-6">
      <h2 className="text-[17px] font-bold text-[#0A0F2C]">Address Details</h2>
      <p className="text-[13px] text-[#718096] mt-1">Your current residential address</p>
    </div>
    
    <div className="space-y-4">
      <div>
        <label className="block text-[12px] font-bold text-[#0A0F2C] mb-1">Street Address</label>
        <input 
          type="text" 
          name="streetAddress"
          value={formData.streetAddress}
          onChange={handleInputChange}
          placeholder="123 Main Street" 
          className={`w-full px-3 py-2.5 rounded-xl border text-[14px] text-[#0A0F2C] focus:outline-none focus:ring-2 focus:ring-[#113285]/20 focus:border-[#113285] transition-all ${errors.streetAddress ? 'border-red-400' : 'border-gray-200'}`}
        />
        {errors.streetAddress && <p className="text-[11px] text-red-500 mt-1">{errors.streetAddress}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[12px] font-bold text-[#0A0F2C] mb-1">City</label>
          <input 
            type="text" 
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="Toronto" 
            className={`w-full px-3 py-2.5 rounded-xl border text-[14px] text-[#0A0F2C] focus:outline-none focus:ring-2 focus:ring-[#113285]/20 focus:border-[#113285] transition-all ${errors.city ? 'border-red-400' : 'border-gray-200'}`}
          />
          {errors.city && <p className="text-[11px] text-red-500 mt-1">{errors.city}</p>}
        </div>
        <div>
          <label className="block text-[12px] font-bold text-[#0A0F2C] mb-1">Province</label>
          <input 
            type="text" 
            name="province"
            value={formData.province}
            onChange={handleInputChange}
            placeholder="Ontario" 
            className={`w-full px-3 py-2.5 rounded-xl border text-[14px] text-[#0A0F2C] focus:outline-none focus:ring-2 focus:ring-[#113285]/20 focus:border-[#113285] transition-all ${errors.province ? 'border-red-400' : 'border-gray-200'}`}
          />
          {errors.province && <p className="text-[11px] text-red-500 mt-1">{errors.province}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[12px] font-bold text-[#0A0F2C] mb-1">Postal Code</label>
          <input 
            type="text" 
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            placeholder="M5A 1A1" 
            className={`w-full px-3 py-2.5 rounded-xl border text-[14px] text-[#0A0F2C] focus:outline-none focus:ring-2 focus:ring-[#113285]/20 focus:border-[#113285] transition-all ${errors.postalCode ? 'border-red-400' : 'border-gray-200'}`}
          />
          {errors.postalCode && <p className="text-[11px] text-red-500 mt-1">{errors.postalCode}</p>}
        </div>
        <div>
          <label className="block text-[12px] font-bold text-[#0A0F2C] mb-1">Country</label>
          <input 
            type="text" 
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            placeholder="Canada" 
            className={`w-full px-3 py-2.5 rounded-xl border text-[14px] text-[#0A0F2C] focus:outline-none focus:ring-2 focus:ring-[#113285]/20 focus:border-[#113285] transition-all ${errors.country ? 'border-red-400' : 'border-gray-200'}`}
          />
          {errors.country && <p className="text-[11px] text-red-500 mt-1">{errors.country}</p>}
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 mt-6">
      <button onClick={prevStep} className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-[#0A0F2C] font-bold text-[14px] py-3 rounded-xl transition-colors">Back</button>
      <button onClick={nextStep} className="w-full bg-[#113285] hover:bg-[#0D2665] text-white font-bold text-[14px] py-3 rounded-xl transition-colors">Continue</button>
    </div>
  </div>
)}

        {/* Step 3: Government ID Upload */}
    {currentStep === 3 && (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="text-center mb-6">
      <h2 className="text-[17px] font-bold text-[#0A0F2C]">Government ID Upload</h2>
      <p className="text-[13px] text-[#718096] mt-1">Upload a clear photo of your ID</p>
    </div>
    
    <div className="space-y-3">
      {/* Upload Front */}
      <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="hidden" ref={idFrontRef} onChange={(e) => handleFileChange(e, 'idFront')} />
      <button onClick={() => idFrontRef.current?.click()} className="w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#113285]/50 hover:bg-[#113285]/5 transition-all group">
        {filePreviews.idFront ? (
          <img src={filePreviews.idFront} className="w-full h-32 object-cover rounded-xl mb-2" />
        ) : (
          <div className="w-10 h-10 mb-2 text-[#4A5568] group-hover:text-[#113285]">
            <Upload className="w-full h-full" strokeWidth={1.5} />
          </div>
        )}
        <div className="text-[14px] font-bold text-[#0A0F2C] mb-1">{files.idFront ? files.idFront.name : "Upload Front of ID"}</div>
        <div className="text-[12px] text-[#718096]">JPG, PNG, WEBP, PDF • Max 10MB</div>
        {files.idFront && <div className="text-[11px] text-[#A0AEC0] mt-1">{(files.idFront.size / 1024 / 1024).toFixed(2)} MB</div>}
      </button>
      {errors.idFront && <p className="text-[11px] text-red-500 mt-1">{errors.idFront}</p>}

      {/* Upload Back */}
      <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="hidden" ref={idBackRef} onChange={(e) => handleFileChange(e, 'idBack')} />
      <button onClick={() => idBackRef.current?.click()} className="w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#113285]/50 hover:bg-[#113285]/5 transition-all group">
        {filePreviews.idBack ? (
          <img src={filePreviews.idBack} className="w-full h-32 object-cover rounded-xl mb-2" />
        ) : (
          <div className="w-10 h-10 mb-2 text-[#4A5568] group-hover:text-[#113285]">
            <Upload className="w-full h-full" strokeWidth={1.5} />
          </div>
        )}
        <div className="text-[14px] font-bold text-[#0A0F2C] mb-1">{files.idBack ? files.idBack.name : "Upload Back of ID"}</div>
        <div className="text-[12px] text-[#718096]">JPG, PNG, WEBP, PDF • Max 10MB</div>
        {files.idBack && <div className="text-[11px] text-[#A0AEC0] mt-1">{(files.idBack.size / 1024 / 1024).toFixed(2)} MB</div>}
      </button>
      {errors.idBack && <p className="text-[11px] text-red-500 mt-1">{errors.idBack}</p>}
    </div>

    <div className="grid grid-cols-2 gap-3 mt-6">
      <button onClick={prevStep} className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-[#0A0F2C] font-bold text-[14px] py-3 rounded-xl transition-colors">Back</button>
      <button onClick={nextStep} className="w-full bg-[#113285] hover:bg-[#0D2665] text-white font-bold text-[14px] py-3 rounded-xl transition-colors">Continue</button>
    </div>
  </div>
)}

        {/* Step 4: Selfie Upload */}
     {currentStep === 4 && (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="text-center mb-6">
      <h2 className="text-[17px] font-bold text-[#0A0F2C]">Selfie Upload</h2>
      <p className="text-[13px] text-[#718096] mt-1">Upload a clear photo of your face</p>
    </div>
    
    <div className="space-y-4">
      <div className="bg-[#F8F9FA] rounded-xl p-4 border border-gray-100">
        <h3 className="text-[13px] font-bold text-[#0A0F2C] mb-2">Selfie Guidelines:</h3>
        <ul className="space-y-1.5">
          {["Face clearly visible", "Good lighting", "No sunglasses or hats", "Neutral expression"].map(g => (
            <li key={g} className="flex items-center text-[12px] text-[#4A5568]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] mr-2 flex-shrink-0" />
              {g}
            </li>
          ))}
        </ul>
      </div>

      <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" ref={selfieRef} onChange={(e) => handleFileChange(e, 'selfie')} />
      <button onClick={() => selfieRef.current?.click()} className="w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#113285]/50 hover:bg-[#113285]/5 transition-all group">
        {filePreviews.selfie ? (
          <img src={filePreviews.selfie} className="w-32 h-32 object-cover rounded-full mb-2" />
        ) : (
          <div className="w-10 h-10 mb-2 text-[#4A5568] group-hover:text-[#113285]">
            <Upload className="w-full h-full" strokeWidth={1.5} />
          </div>
        )}
        <div className="text-[14px] font-bold text-[#0A0F2C] mb-1">{files.selfie ? files.selfie.name : "Upload Selfie"}</div>
        <div className="text-[12px] text-[#718096]">JPG, PNG, WEBP • Max 10MB</div>
        {files.selfie && <div className="text-[11px] text-[#A0AEC0] mt-1">{(files.selfie.size / 1024 / 1024).toFixed(2)} MB</div>}
      </button>
      {errors.selfie && <p className="text-[11px] text-red-500 mt-1">{errors.selfie}</p>}
    </div>

    <div className="grid grid-cols-2 gap-3 mt-6">
      <button onClick={prevStep} className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-[#0A0F2C] font-bold text-[14px] py-3 rounded-xl transition-colors">Back</button>
      <button
        onClick={submitKyc}
        disabled={isSubmitting}
        className="w-full flex items-center justify-center bg-[#113285] hover:bg-[#0D2665] disabled:bg-[#113285]/70 text-white font-bold text-[14px] py-3 rounded-xl transition-colors"
      >
        {isSubmitting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</>) : "Submit for Review"}
      </button>
    </div>
  </div>
)}

        {/* Step 5: Verification in Progress */}
        {currentStep === 5 && (
          <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#FFF8EB] flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-[#F5A623]" strokeWidth={2.5} />
            </div>
            
            <h2 className="text-[20px] font-bold text-[#0A0F2C] mb-2">Verification in Progress</h2>
            
            <p className="text-[13px] text-[#718096] mb-6 max-w-[360px] leading-relaxed mx-auto">
              Thank you for submitting your documents.<br />
              Our team is reviewing your information.<br />
              This typically takes 1-2 business days.
            </p>
            
            <div className="bg-[#F8F9FA] rounded-xl p-5 w-full mb-6">
              <h3 className="text-[13px] font-bold text-[#0A0F2C] mb-3">What happens next?</h3>
              <ul className="space-y-2 text-[12px] text-[#718096] text-left max-w-[260px] mx-auto list-disc pl-4 marker:text-gray-400">
                <li className="pl-1">We'll verify your identity documents</li>
                <li className="pl-1">You'll receive an email when approved</li>
                <li className="pl-1">You can then access your full account</li>
              </ul>
            </div>

            <Link 
              href="/dashboard"
              className="w-full bg-[#113285] hover:bg-[#0D2665] text-white font-bold text-[14px] py-3 rounded-xl transition-colors block"
            >
              Go to Dashboard
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
