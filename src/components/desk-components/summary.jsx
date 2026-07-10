"use client";

import { Sparkles, RefreshCw, BrainCircuit } from "lucide-react";
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
      setError("Start a session to generate a summary.");
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
        throw new Error(data?.error || "Unable to generate summary right now.");
      }

      if (data?.message) {
        setResult({ empty: true, message: data.message });
        return;
      }

      setResult({
        shortSummary: data.shortSummary || "",
        keyTakeaways: data.keyTakeaways || [],
        actionItems: data.actionItems || [],
        topicsToRevise: data.topicsToRevise || [],
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

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
                  AI Note Summary
                </h2>
              </div>
              <button
                type="button"
                onClick={handleGenerateSummary}
                className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                <Sparkles size={16} />
                AI Summary
              </button>
            </div>

            <p className="max-w-2xl text-sm text-stone-600">
              Turn the notes from {sessionName} into a concise review with key ideas,
              action items, and topics to revisit.
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
                  AI-generated insight
                </p>
                <h3 className="text-xl font-semibold text-stone-800">
                  Session summary
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
                  <p className="font-semibold">We could not generate a summary.</p>
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
                  <p className="font-semibold">No notes were found for this session yet.</p>
                  <p className="mt-1">{result.message}</p>
                </div>
              ) : result ? (
                <div className="space-y-4">
                  <div className="rounded-xl bg-sky-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-sky-700">
                      <BrainCircuit size={16} /> Short summary
                    </div>
                    <p className="mt-2 text-sm text-stone-700">{result.shortSummary}</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-stone-200 p-4">
                      <h4 className="text-sm font-semibold text-stone-800">Key takeaways</h4>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-stone-600">
                        {(result.keyTakeaways || []).map((item, index) => (
                          <li key={`takeaway-${index}`}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-stone-200 p-4">
                      <h4 className="text-sm font-semibold text-stone-800">Action items</h4>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-stone-600">
                        {(result.actionItems || []).map((item, index) => (
                          <li key={`action-${index}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-xl border border-stone-200 p-4">
                    <h4 className="text-sm font-semibold text-stone-800">Topics to revise</h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-stone-600">
                      {(result.topicsToRevise || []).map((item, index) => (
                        <li key={`revise-${index}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
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
