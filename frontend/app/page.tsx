"use client";

import { useState } from "react";
import {
  Plus,
  X,
  Send,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function Home() {
  const [urls, setUrls] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [Links, setLinks] = useState([
    "https://cdn.thodex.live/235103012_Ali_Enes_Temizkan.docx",
    "https://cdn.thodex.live/20240703_3811c_yl---9-tez-savunmasi-juri-ortak-raporu_235116001_Saip%20Onurhan%20KADIO%C4%9ELU%20(1).docx",
    "https://cdn.thodex.live/20240930_165e5_tyl---11-proje-konusu-bildirim-formu-117.docx",
    "https://cdn.thodex.live/20240703_3811c_yl---9-tez-savunmasi-juri-ortak-raporu_235116001_Saip%20Onurhan%20KADIO%C4%9ELU.docx",
  ]);
  const [Results, setResults] = useState([]);

  const addUrlField = () => {
    setUrls([...urls, ""]);
  };

  const removeUrlField = (index: number) => {
    if (urls.length > 1) {
      setUrls(urls.filter((_, i) => i !== index));
    }
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty URLs
    const documentURLs = urls.filter((url) => url.trim() !== "");

    if (documentURLs.length === 0) {
      setSubmitStatus("error");
      setErrorMessage("Please enter at least one document URL");
      setTimeout(() => setSubmitStatus("idle"), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5000/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentURLs }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `report-${Date.now()}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setSubmitStatus("success");
      // Reset form after successful submission
      setTimeout(() => {
        setUrls([""]);
        setSubmitStatus("idle");
      }, 2000);
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to submit documents"
      );
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <FileText className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Kocaeli University
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Document Processing System
          </p>
        </div>

        {/* Main Form */}
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
            <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
              Submit Document URLs
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {urls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => updateUrl(index, e.target.value)}
                      placeholder="https://example.com/document.pdf"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                    />
                  </div>

                  {urls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeUrlField(index)}
                      className="flex h-12 w-12 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                      title="Remove URL"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}

              {/* Add URL Button */}
              <button
                type="button"
                onClick={addUrlField}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-400"
              >
                <Plus className="h-5 w-5" />d Another URL
              </button>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-4 text-lg font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Submit Documents
                    </>
                  )}
                </button>
              </div>

              {/* Status Messages */}
              {submitStatus === "success" && (
                <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">
                    Documents submitted successfully!
                  </span>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">
                    {errorMessage || "Failed to submit documents"}
                  </span>
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <div className="mt-8 rounded-xl bg-blue-50 p-6 dark:bg-blue-900/20">
            <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-300">
              Test Links:
            </h3>
            <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-400">
              {Links.map((link: String, index: number) => {
                return <li key={index}>{link}</li>;
              })}
            </ul>
          </div>

          {/* Results Section */}
          {Results.length > 0 && (
            <div className="mt-8 rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
              <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                Processing Results
              </h2>
              <div className="space-y-4">
                {Results.map((result: any, index: number) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Document {index + 1}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <pre className="overflow-x-auto rounded-md bg-gray-100 p-4 text-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setResults([])}
                className="mt-6 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Clear Results
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
