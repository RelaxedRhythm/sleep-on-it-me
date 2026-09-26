"use client";

import { Sparkles, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

const NotebookSummary = ({ sessionId, sessionName = "current session" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const canSummarize = useMemo(() => Boolean(sessionId), [sessionId]);

  const handleGenerateSummary = async () => {
    if (!canSummarize) {
      setError("Start a session to generate suggestions.");
      setResult(null);
      setIsOpen(true);
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);
    setIsOpen(true);

    try {
      const response = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to generate suggestions right now.");
      }

      if (data?.message) {
        setResult({
          empty: true,
          message: data.message,
          basedOn: data.basedOn || "none",
        });
        return;
      }

      setResult({
        suggestions: Array.isArray(data.suggestions) ? data.suggestions : [],
        basedOn: data.basedOn || "current",
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const basedOnText =
    result?.basedOn === "previous"
      ? "Based on your previous study session"
      : result?.basedOn === "current"
        ? "Based on your current session"
        : "";

  return (
    <>
      <div className="flex flex-col gap-4 text-lg text-stone-700 lg:flex-row">
        <div className="min-h-60 w-full rounded-xl bg-stone-100 p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
                  Study workspace
                </p>
                <h2 className="text-xl font-semibold text-stone-800">
                  AI Suggestions
                </h2>
              </div>
              <button
                type="button"
                onClick={handleGenerateSummary}
                className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                <Sparkles size={16} />
                AI Suggestions
              </button>
            </div>

            <p className="max-w-2xl text-sm text-stone-600">
              Get practical next steps based on the notes from {sessionName}.
            </p>
          </div>
        </div>

        <div className="relative h-60 min-w-0 overflow-hidden rounded-xl lg:min-w-90">
          <Image
            quality={100}
            src="/pomodoro-illustration.jpg"
            fill
            alt="Pomodoro illustration"
            className="object-cover"
          />
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 px-4 py-6">
          <div className="w-full max-w-2xl rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
                  Personalized guidance
                </p>
                <h3 className="text-xl font-semibold text-stone-800">
                  AI Suggestions
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-stone-200 px-3 py-1 text-sm text-stone-500 transition hover:bg-stone-100"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {isLoading ? (
                <div className="space-y-3">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-stone-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-stone-200" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-stone-200" />
                  <div className="h-24 animate-pulse rounded-xl bg-stone-100" />
                </div>
              ) : error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  <p className="font-semibold">We could not generate suggestions.</p>
                  <p className="mt-1">{error}</p>
                  <button
                    type="button"
                    onClick={handleGenerateSummary}
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                  >
                    <RefreshCw size={14} /> Retry
                  </button>
                </div>
              ) : result?.empty ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                  <p className="font-semibold">No study notes available yet.</p>
                  <p className="mt-1">{result.message}</p>
                </div>
              ) : result ? (
                <div className="space-y-4">
                  {basedOnText ? (
                    <div className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-medium text-sky-700">
                      {basedOnText}
                    </div>
                  ) : null}

                  {(result.suggestions || []).length > 0 ? (
                    <div className="space-y-3">
                      {(result.suggestions || []).map((suggestion, index) => (
                        <div
                          key={`suggestion-${index}`}
                          className="rounded-xl border border-stone-200 bg-stone-50 p-4"
                        >
                          <h4 className="text-sm font-semibold text-stone-800">
                            {suggestion.title || `Suggestion ${index + 1}`}
                          </h4>
                          <p className="mt-2 text-sm text-stone-600">
                            {suggestion.description || "No description provided."}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                      No study notes available yet. Add some notes to get personalized suggestions.
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotebookSummary;
