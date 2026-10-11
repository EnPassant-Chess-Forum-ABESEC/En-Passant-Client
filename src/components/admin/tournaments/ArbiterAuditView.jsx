"use client";

import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, RefreshCw } from "lucide-react";

export default function ArbiterAuditView({ audit, onRefresh, loading }) {
  if (!audit) {
    return (
      <div className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
        <ShieldCheck className="w-8 h-8 mx-auto text-slate-400 mb-2" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          No audit report generated yet
        </p>
        <button
          onClick={onRefresh}
          className="mt-3 px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-500/10 rounded-xl hover:bg-blue-100 transition-colors"
        >
          Generate FIDE Audit
        </button>
      </div>
    );
  }

  const { isValid, c1Passed, c2Passed, c3Passed, c4Passed, statistics = {}, violations = [] } = audit;

  const RULES = [
    {
      code: "C1",
      name: "No Rematches",
      passed: c1Passed,
      desc: "No two players shall be paired together more than once.",
    },
    {
      code: "C2",
      name: "No Repeat Byes",
      passed: c2Passed,
      desc: "No player shall receive more than 1 pairing-allocated bye.",
    },
    {
      code: "C3",
      name: "Max 2 Same Colors",
      passed: c3Passed,
      desc: "No player shall be assigned the same color 3 times consecutively.",
    },
    {
      code: "C4",
      name: "Color Imbalance <= 2",
      passed: c4Passed,
      desc: "The difference between White and Black games shall not exceed 2.",
    },
  ];

  return (
    <div className="space-y-6">
      <div
        className={`p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isValid
            ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60"
            : "bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60"
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-xl ${
              isValid
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300"
            }`}
          >
            {isValid ? (
              <ShieldCheck className="w-8 h-8" />
            ) : (
              <ShieldAlert className="w-8 h-8" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
              {isValid
                ? "100% FIDE Dutch C.04.3 Compliant"
                : "FIDE Swiss Rule Violations Detected"}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {isValid
                ? "All absolute criteria (C1 through C4) are fully verified and satisfied."
                : `${violations.length} pairing or color allocation rule violation(s) found.`}
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Re-Audit Engine
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {RULES.map((rule) => (
          <div
            key={rule.code}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black font-mono text-slate-400">
                Rule {rule.code}
              </span>
              {rule.passed ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  PASS
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                  <XCircle className="w-3.5 h-3.5" />
                  FAIL
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {rule.name}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              {rule.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Total Games Played
          </p>
          <p className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100 mt-1">
            {statistics.totalGames || 0}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Average Color Imbalance
          </p>
          <p className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400 mt-1">
            {statistics.colorBalanceAvg !== undefined ? statistics.colorBalanceAvg : "0.0"}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Maximum Color Imbalance
          </p>
          <p className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100 mt-1">
            ±{statistics.maxColorDiff !== undefined ? statistics.maxColorDiff : "0"}
          </p>
        </div>
      </div>

      {violations.length > 0 && (
        <div className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20">
          <h4 className="text-sm font-bold text-rose-800 dark:text-rose-300 flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            Violations Breakdown ({violations.length})
          </h4>
          <div className="space-y-2">
            {violations.map((v, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-rose-100 dark:border-rose-900/40 text-xs text-rose-700 dark:text-rose-300"
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  <span className="px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-900/40 text-[10px]">
                    Rule {v.rule}
                  </span>
                  <span>{v.title || "Rule Infraction"}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
