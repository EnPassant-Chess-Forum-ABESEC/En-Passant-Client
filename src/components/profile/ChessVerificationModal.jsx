"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/lib/api";
import { 
  X, 
  Copy, 
  ExternalLink, 
  Check, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Clock
} from "lucide-react";

export default function ChessVerificationModal({ isOpen, onClose, username, onVerified }) {
  const fetchApi = useApi();
  const [step, setStep] = useState(0); // 0: Intro, 1: Step 1, 2: Step 2, 3: Step 3, 4: Success, 5: Failed
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  // Start verification and generate token on mount
  useEffect(() => {
    if (isOpen && username) {
      startVerification();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, username]);

  const startVerification = async () => {
    setLoading(true);
    setError(null);
    setStep(0);
    try {
      const res = await fetchApi("/users/chess/verification/start", {
        method: "POST",
        body: { username },
      });
      if (res.success && res.data) {
        setToken(res.data.token);
      } else {
        setError(res.message || "Failed to start verification.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy token:", err);
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    setError(null);
    try {
      const res = await fetchApi("/users/chess/verification/verify", {
        method: "POST",
      });
      if (res.success) {
        setStep(4); // Success screen
        if (onVerified) {
          onVerified(username);
        }
      } else {
        setError(res.message || "Verification failed.");
        setStep(5); // Fail screen
      }
    } catch (err) {
      setError(err.message || "Could not verify profile.");
      setStep(5); // Fail screen
    } finally {
      setVerifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#0d0d0d] border border-white/10 rounded-2xl p-6 shadow-2xl text-white">
        
        {/* Top Header Controls (Back and Close) */}
        <div className="flex justify-between items-center mb-6">
          {step > 0 && step <= 3 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
              disabled={verifying}
            >
              <ArrowLeft size={14} /> Back
            </button>
          ) : (
            <div />
          )}

          {/* Centered Step Indicator */}
          {step > 0 && step <= 3 && (
            <span className="text-xs font-semibold text-[#c21818]">
              Step {step} <span className="text-white/30">/ 3</span>
            </span>
          )}

          <button
            onClick={onClose}
            className="text-white/40 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors"
            disabled={verifying}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#c21818] animate-spin" />
            <p className="text-xs text-white/40 uppercase tracking-widest">
              Initializing Verification...
            </p>
          </div>
        ) : (
          <>
            {/* Step 0: Intro */}
            {step === 0 && (
              <div className="space-y-6 text-center">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">
                    Verify your Chess.com profile
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed px-4">
                    This helps us confirm that the Chess.com profile belongs to you and allows us to show your verified profile on En Passant.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/5 px-3 py-1 rounded-full text-[11px] text-white/50">
                  <Clock size={12} className="text-[#c21818]" /> Takes less than 30 seconds
                </div>

                <div className="text-left bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-bold text-white/70 uppercase tracking-wider">
                    What you'll need:
                  </p>
                  <ul className="space-y-2.5 text-xs text-white/60">
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-green-500 shrink-0" />
                      Access to your Chess.com profile settings
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-green-500 shrink-0" />
                      Ability to temporarily edit your Last Name
                    </li>
                  </ul>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 text-red-400 text-xs rounded-lg border border-red-500/20 text-left">
                    {error}
                  </div>
                )}

                <button
                  onClick={() => setStep(1)}
                  className="w-full py-2.5 bg-[#c21818] hover:bg-[#ff3333] transition-all rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_4px_12px_rgba(194,24,24,0.15)]"
                >
                  Start Verification
                </button>
              </div>
            )}

            {/* Step 1: Open Profile Settings */}
            {step === 1 && (
              <div className="space-y-6 text-center">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">
                    Open your Chess.com profile
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Go to the following page while logged in to Chess.com:
                  </p>
                </div>

                <div className="space-y-3">
                  <a
                    href="https://www.chess.com/settings/profile"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 bg-[#c21818] hover:bg-[#ff3333] transition-all rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(194,24,24,0.15)]"
                  >
                    Open Chess.com Settings <ExternalLink size={14} />
                  </a>
                  
                  <a
                    href="https://www.chess.com/settings/profile"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-white/40 hover:text-white/60 transition-colors underline break-all inline-block"
                  >
                    https://www.chess.com/settings/profile
                  </a>
                </div>

                <p className="text-[11px] text-white/40 italic">
                  This is where you can edit your profile details.
                </p>

                <div className="relative rounded-xl overflow-hidden border border-white/10 max-w-xs mx-auto shadow-lg shadow-black/40 my-4">
                  <img 
                    src="/images/chess_settings_step1.png" 
                    alt="Chess.com Settings Profile Page"
                    className="w-full h-auto object-cover opacity-80"
                  />
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full py-2.5 border border-white/10 hover:bg-white/5 transition-all rounded-xl text-xs font-bold uppercase tracking-wider mt-4"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Paste Verification Code */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">
                    Paste the verification code in your Last Name
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Edit the <strong>Last Name</strong> section and paste the following code exactly as shown:
                  </p>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center font-mono text-sm font-bold text-white tracking-wider">
                    {token}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="px-4 border border-white/10 hover:bg-white/5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 text-white/70 hover:text-white"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-green-500" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copy
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-white/40 text-center leading-relaxed">
                  This code helps us confirm profile ownership. You can temporarily replace your last name with this code.
                </p>

                <div className="relative rounded-xl overflow-hidden border border-white/10 max-w-xs mx-auto shadow-lg shadow-black/40 my-4">
                  <img 
                    src="/images/chess_settings_step2.png" 
                    alt="Chess.com Settings Details Fields"
                    className="w-full h-auto object-cover opacity-80"
                  />
                </div>

                <button
                  onClick={() => setStep(3)}
                  className="w-full py-2.5 bg-[#c21818] hover:bg-[#ff3333] transition-all rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_4px_12px_rgba(194,24,24,0.15)]"
                >
                  I've pasted the code
                </button>
              </div>
            )}

            {/* Step 3: Save and Verify */}
            {step === 3 && (
              <div className="space-y-6 text-center">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">
                    Save your changes and verify
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed px-2">
                    Make sure you have saved your profile on Chess.com after updating your Last Name with the verification code.
                  </p>
                </div>

                <p className="text-xs text-white/40">
                  Once done, click verify below.
                </p>

                <button
                  onClick={handleVerify}
                  className="w-full py-3 bg-[#c21818] hover:bg-[#ff3333] disabled:opacity-50 transition-all rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(194,24,24,0.15)]"
                  disabled={verifying}
                >
                  {verifying ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Verifying...
                    </>
                  ) : (
                    "Verify Chess.com Profile"
                  )}
                </button>
              </div>
            )}

            {/* Step 4: Success Screen */}
            {step === 4 && (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                <div className="w-14 h-14 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                  <CheckCircle2 size={32} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-white">Chess.com Linked & Verified</h4>
                  <p className="text-xs text-white/50">
                    @{username} is now verified as your Chess.com account.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 bg-[#c21818] hover:bg-[#ff3333] transition-colors rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Done
                </button>
              </div>
            )}

            {/* Step 5: Failed Screen */}
            {step === 5 && (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-5">
                <div className="w-14 h-14 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                  <AlertTriangle size={32} />
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-white">Verification Failed</h4>
                  <p className="text-xs text-white/50">
                    Your Chess.com profile could not be verified.
                  </p>
                </div>

                {error && (
                  <div className="w-full p-4 bg-red-500/5 border border-red-500/10 text-red-400 text-xs rounded-xl text-left leading-relaxed">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => {
                      setError(null);
                      setStep(3); // Go back to verify step to retry
                    }}
                    className="flex-1 py-2.5 border border-white/10 hover:bg-white/5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Retry
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
