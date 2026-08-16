"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Send, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useApi } from "@/lib/api";
import SpecularButton from "@/components/SpecularButton";
import { motion } from "framer-motion";

export default function ContactPage() {
  const { user, isLoaded } = useUser();
  const fetchApi = useApi();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.fullName || "",
        email: prev.email || user.primaryEmailAddress?.emailAddress || "",
      }));
    }
  }, [isLoaded, user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await fetchApi(
        "/contact",
        {
          method: "POST",
          body: formData,
        },
        false,
      );

      setSuccess(true);
      toast.success("Message sent successfully!");
    } catch (err) {
      toast.error(
        err.message || "Failed to send message. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden flex flex-col font-sans selection:bg-[#9b1a1a]/40">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/contact/contact_page_grid.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />

        <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-[#050505] via-[#050505] to-transparent" />

        <div className="absolute inset-x-0 top-0 h-[8%] bg-gradient-to-b from-[#050505] to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto min-h-screen pt-28 pb-12 px-4 sm:px-8 flex flex-col md:grid md:grid-cols-2 md:gap-12 md:items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-left w-full mb-12 md:mb-0"
        >
          <h1
            className="font-black uppercase tracking-wide leading-[0.9] text-white font-pezula drop-shadow-[0_0_15px_rgba(255,255,255,0.09)]"
            style={{ fontSize: "clamp(60px, 10vw, 120px)" }}
          >
            CONTACT <br className="hidden md:block" />
            <span className="text-[#9b1a1a] drop-shadow-[0_0_3px_rgba(155,26,26,0.05)]">
              US
            </span>
          </h1>
          <p className="text-white/60 font-medium text-sm md:text-base max-w-sm leading-relaxed mt-6 tracking-wide">
            Have a question about recruitment, payments, or just want to chat?
            We'd love to hear from you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          className="w-full max-w-xl mx-auto md:ml-auto md:mr-0"
        >
          <div className="bg-[#0a0a0a]/90 backdrop-blur-xl rounded-2xl p-8 border border-white/[0.07] relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-pezula tracking-widest uppercase text-white mb-3">
                  Message Sent!
                </h2>
                <p className="text-white/50 mb-8 max-w-sm mx-auto font-light leading-relaxed text-sm">
                  We've received your message and will get back to you at{" "}
                  <span className="text-white font-medium">
                    {formData.email}
                  </span>{" "}
                  as soon as possible.
                </p>

                <div className="max-w-[240px] mx-auto">
                  <SpecularButton
                    onClick={() => {
                      setSuccess(false);
                      setFormData((prev) => ({ ...prev, message: "" }));
                    }}
                    className="w-full h-12 group"
                    radius={10}
                    lineColor="#555555"
                    baseColor="#222222"
                    textColor="#ffffff"
                    tint="#ffffff"
                    tintOpacity={0.08}
                    autoAnimate={true}
                  >
                    <div className="flex justify-center items-center gap-3 font-normal uppercase tracking-[0.2em] text-[11px] relative z-10">
                      <span>Send Another</span>
                    </div>
                  </SpecularButton>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 border-l-2 border-white/20 pl-3">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your Name"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-colors text-sm placeholder:text-white/20 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 border-l-2 border-white/20 pl-3">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Your Email"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-colors text-sm placeholder:text-white/20 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 border-l-2 border-white/20 pl-3">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this regarding?"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-colors text-sm placeholder:text-white/20 font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 border-l-2 border-white/20 pl-3">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="How can we help you today?"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-colors resize-none text-sm placeholder:text-white/20 leading-relaxed font-medium"
                  />
                </div>

                <div className="pt-2">
                  <SpecularButton
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 group"
                    radius={10}
                    lineColor="#ff4444"
                    baseColor="#550000"
                    textColor="#ffffff"
                    tint="#9b1a1a"
                    tintOpacity={0.15}
                    autoAnimate={true}
                  >
                    <div className="flex justify-center items-center gap-3 font-normal uppercase tracking-[0.2em] text-[11px] relative z-10">
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </div>
                  </SpecularButton>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
