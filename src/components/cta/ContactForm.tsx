import React, { useState } from "react";
import { ArrowUpRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  company: string;
  message: string;
  budget: string;
  timeline: string;
}

const budgetOptions = ["$25K — $50K", "$50K — $100K", "$100K+"];
const timelineOptions = ["1 — 3 MONTHS", "3 — 6 MONTHS", "LONG-TERM"];

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    message: "",
    budget: "$50K — $100K",
    timeline: "1 — 3 MONTHS",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status === "error") setStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic frontend validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus("error");
      setErrorMessage("Please complete all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");

    try {
      // Configurable submission hook (simulated graceful client dispatch)
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Unable to submit at this time. Please email us directly.");
    }
  };

  if (status === "success") {
    return (
      <div className="p-8 md:p-12 rounded-2xl bg-[#06111F]/80 border border-[#168BFF]/40 text-center flex flex-col items-center justify-center max-w-xl mx-auto">
        <CheckCircle2 className="w-12 h-12 text-[#168BFF] mb-4" />
        <h3 className="text-2xl font-sans font-bold text-[#F5FAFF] mb-2">
          INQUIRY RECEIVED.
        </h3>
        <p className="text-sm text-[#8293AA] mb-6 max-w-md">
          Thank you, {formData.name}. Our architectural team will review your project and connect with you within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setFormData({
              name: "",
              email: "",
              company: "",
              message: "",
              budget: "$50K — $100K",
              timeline: "1 — 3 MONTHS",
            });
          }}
          className="text-xs font-mono text-[#168BFF] hover:underline uppercase tracking-wider"
        >
          SUBMIT ANOTHER INQUIRY
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 md:p-10 rounded-2xl bg-[#06111F]/60 border border-white/[0.08] max-w-2xl mx-auto text-left"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="text-[11px] font-mono text-[#8293AA] uppercase tracking-widest block mb-2">
            YOUR NAME <span className="text-[#168BFF]">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Ada Lovelace"
            className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.1] text-[#F5FAFF] placeholder-[#8293AA]/50 text-sm focus:outline-hidden focus:border-[#168BFF] focus:ring-1 focus:ring-[#168BFF] transition-colors"
          />
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="text-[11px] font-mono text-[#8293AA] uppercase tracking-widest block mb-2">
            WORK EMAIL <span className="text-[#168BFF]">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="ada@company.com"
            className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.1] text-[#F5FAFF] placeholder-[#8293AA]/50 text-sm focus:outline-hidden focus:border-[#168BFF] focus:ring-1 focus:ring-[#168BFF] transition-colors"
          />
        </div>
      </div>

      {/* Company */}
      <div className="mb-6">
        <label htmlFor="company" className="text-[11px] font-mono text-[#8293AA] uppercase tracking-widest block mb-2">
          COMPANY / BRAND
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Acme Innovations"
          className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.1] text-[#F5FAFF] placeholder-[#8293AA]/50 text-sm focus:outline-hidden focus:border-[#168BFF] focus:ring-1 focus:ring-[#168BFF] transition-colors"
        />
      </div>

      {/* Message */}
      <div className="mb-6">
        <label htmlFor="message" className="text-[11px] font-mono text-[#8293AA] uppercase tracking-widest block mb-2">
          WHAT ARE YOU BUILDING? <span className="text-[#168BFF]">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={3}
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us about the vision, timeline, and goals..."
          className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.1] text-[#F5FAFF] placeholder-[#8293AA]/50 text-sm focus:outline-hidden focus:border-[#168BFF] focus:ring-1 focus:ring-[#168BFF] transition-colors resize-none"
        />
      </div>

      {/* Budget & Timeline Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <span className="text-[11px] font-mono text-[#8293AA] uppercase tracking-widest block mb-2">
            EXPECTED BUDGET
          </span>
          <div className="flex flex-wrap gap-2">
            {budgetOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, budget: opt }))}
                className={`text-[11px] font-mono px-3 py-2 rounded-lg border transition-all ${
                  formData.budget === opt
                    ? "bg-[#168BFF] text-[#000000] border-transparent font-semibold"
                    : "bg-white/[0.02] text-[#8293AA] border-white/[0.08] hover:border-white/[0.2]"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[11px] font-mono text-[#8293AA] uppercase tracking-widest block mb-2">
            TARGET TIMELINE
          </span>
          <div className="flex flex-wrap gap-2">
            {timelineOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, timeline: opt }))}
                className={`text-[11px] font-mono px-3 py-2 rounded-lg border transition-all ${
                  formData.timeline === opt
                    ? "bg-[#4DE8FF] text-[#000000] border-transparent font-semibold"
                    : "bg-white/[0.02] text-[#8293AA] border-white/[0.08] hover:border-white/[0.2]"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error state alert */}
      {status === "error" && (
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === "submitting"}
        data-cursor="cta"
        className="w-full py-4 rounded-full bg-[#F5FAFF] hover:bg-[#168BFF] text-[#000000] font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 shadow-xl shadow-white/5 focus:outline-hidden focus:ring-2 focus:ring-[#168BFF] disabled:opacity-50"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>SUBMITTING INQUIRY...</span>
          </>
        ) : (
          <>
            <span>START YOUR PROJECT</span>
            <ArrowUpRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};
