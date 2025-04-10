"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Submission {
  sub_id: number;
  assignment_id: number;
  cloudinary_url: string;
  submitted_at: string;
  grade: number | null;
  feedback: string | null;
}

interface Assignment {
  id: number;
  title: string;
  cloudinary_url: string;
  due_date: string;
  Cname: string;
}

interface Language {
  code: string;
  name: string;
}

export default function Submissions() {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackState, setFeedbackState] = useState<{ [sub_id: number]: string }>({});
  const [originalFeedback, setOriginalFeedback] = useState<{ [sub_id: number]: string }>({});
  const [visible, setVisible] = useState<{ [sub_id: number]: boolean }>({});
  const [typing, setTyping] = useState<number | null>(null);
  const [translating, setTranslating] = useState<{ [sub_id: number]: boolean }>({});
  const [selectedLanguage, setSelectedLanguage] = useState<{ [sub_id: number]: string }>({});

  const languages: Language[] = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "pa", name: "Punjabi" },
    { code: "bn", name: "Bengali" },
    { code: "gu", name: "Gujarati" },
    { code: "mr", name: "Marathi" },
    { code: "ta", name: "Tamil" },
    { code: "te", name: "Telugu" },
    { code: "kn", name: "Kannada" },
    { code: "ml", name: "Malayalam" },
  ];

  useEffect(() => {
    const id = sessionStorage.getItem("studentId");
    if (!id) return;
    setStudentId(id);

    const fetchData = async () => {
      try {
        const [subsRes, assignRes] = await Promise.all([
          axios.get(`https://ai-teacher-api-xnd1.onrender.com/student/submissions/${id}`),
          axios.get(`https://ai-teacher-api-xnd1.onrender.com/student/assignments/${id}`),
        ]);
        setSubmissions(subsRes.data);
        setAssignments(assignRes.data);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const typeFeedback = (sub_id: number, text: string) => {
    let i = 0;
    const speed = 20;
    const interval = setInterval(() => {
      setFeedbackState((prev) => ({
        ...prev,
        [sub_id]: text.slice(0, i + 1),
      }));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setTyping(null);
      }
    }, speed);
  };

  const getOrGenerateFeedback = async (submission: Submission) => {
    const { assignment_id, sub_id, feedback } = submission;
    if (!studentId) return;

    if (feedbackState[sub_id]) {
      setVisible((prev) => ({
        ...prev,
        [sub_id]: !prev[sub_id],
      }));
      return;
    }

    try {
      setTyping(sub_id);

      let finalFeedback = feedback;

      if (!feedback) {
        const { data } = await axios.get(
          `https://ai-teacher-api-xnd1.onrender.com/student/FeedBack/${studentId}/${assignment_id}/${sub_id}`
        );
        finalFeedback = data.FeedBack || "No feedback available.";
      }

      // Store the original English feedback
      setOriginalFeedback((prev) => ({
        ...prev,
        [sub_id]: finalFeedback as string,
      }));

      setFeedbackState((prev) => ({
        ...prev,
        [sub_id]: "",
      }));

      setVisible((prev) => ({
        ...prev,
        [sub_id]: true,
      }));

      // Set Hindi as default language for this submission
      setSelectedLanguage((prev) => ({
        ...prev,
        [sub_id]: "hi",
      }));

      // Translate to Hindi by default
      translateFeedback(sub_id, finalFeedback as string, "hi");
    } catch (err) {
      console.error("Error fetching/generating feedback", err);
      setTyping(null);
    }
  };

  const translateFeedback = async (sub_id: number, text: string, targetLang: string) => {
    if (!text) return;
    
    setTranslating((prev) => ({
      ...prev,
      [sub_id]: true,
    }));

    try {
      // If user selects English, just use the original feedback
      if (targetLang === "en") {
        setFeedbackState((prev) => ({
          ...prev,
          [sub_id]: "",
        }));
        typeFeedback(sub_id, originalFeedback[sub_id]);
        setSelectedLanguage((prev) => ({
          ...prev,
          [sub_id]: "en",
        }));
        return;
      }

      // In a real application, you would call a translation API here
      // For now, let's simulate translation with a simple mock
      const mockTranslatedText = await mockTranslate(text, targetLang);
      
      setFeedbackState((prev) => ({
        ...prev,
        [sub_id]: "",
      }));

      typeFeedback(sub_id, mockTranslatedText);
      setSelectedLanguage((prev) => ({
        ...prev,
        [sub_id]: targetLang,
      }));
    } catch (err) {
      console.error("Translation error", err);
      // Fallback to original text if translation fails
      typeFeedback(sub_id, originalFeedback[sub_id]);
    } finally {
      setTranslating((prev) => ({
        ...prev,
        [sub_id]: false,
      }));
    }
  };

  // Mock translation function (in production, replace with actual API call)
  const mockTranslate = async (text: string, targetLang: string): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, you would use something like Google Translate API or DeepL
    // For example:
    // const response = await axios.post('https://translation-api.com/translate', {
    //   text,
    //   target: targetLang
    // });
    // return response.data.translatedText;

    // Simple mock translations for demonstration
    const mockTranslations: {[key: string]: {[key: string]: string}} = {
      "hi": {
        "No feedback available.": "कोई प्रतिक्रिया उपलब्ध नहीं है।",
        "Great job!": "बहुत अच्छा काम!",
      },
      "pa": {
        "No feedback available.": "ਕੋਈ ਫੀਡਬੈਕ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।",
        "Great job!": "ਬਹੁਤ ਵਧੀਆ ਕੰਮ!",
      },
      "bn": {
        "No feedback available.": "কোন প্রতিক্রিয়া উপলব্ধ নেই।",
        "Great job!": "চমৎকার কাজ!",
      }
    };

    // For demonstration, we just return a prefix based on the language
    // In a real app, you would return the actual translated text
    return `[${languages.find(l => l.code === targetLang)?.name}] ${text}`;
  };

  const getAssignmentTitle = (assignmentId: number) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    return assignment ? assignment.title : `Assignment ${assignmentId}`;
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading submissions...</p>;
  }

  if (!submissions.length) {
    return <p className="text-center text-gray-500">No submissions found.</p>;
  }

  return (
    <div className="flex flex-wrap justify-center mt-8">
      <div className="w-full max-w-4xl space-y-4">
        {submissions.map((submission) => (
          <Card key={submission.sub_id} className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>Assignment: {getAssignmentTitle(submission.assignment_id)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <strong>Submitted At:</strong>{" "}
                {new Date(submission.submitted_at).toLocaleString()}
              </p>
              <p>
                <strong>File:</strong>{" "}
                <a
                  href={submission.cloudinary_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View PDF
                </a>
              </p>

              <Button
                onClick={() => getOrGenerateFeedback(submission)}
                disabled={typing === submission.sub_id}
              >
                {typing === submission.sub_id
                  ? "Typing..."
                  : visible[submission.sub_id]
                  ? "Hide Feedback"
                  : "View Feedback"}
              </Button>

              {visible[submission.sub_id] && (
                <div className="mt-2 p-3 border rounded">
                  <div className="flex justify-between items-center mb-4">
                    <p>
                      <strong className="text-2xl">Grade:</strong>{" "}
                      {submission.grade ?? "N/A"}
                    </p>
                    
                    {/* Language selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Language:</span>
                      <Select
                        value={selectedLanguage[submission.sub_id] || "en"}
                        onValueChange={(value) => {
                          if (originalFeedback[submission.sub_id]) {
                            translateFeedback(
                              submission.sub_id,
                              originalFeedback[submission.sub_id],
                              value
                            );
                          }
                        }}
                        disabled={translating[submission.sub_id]}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p>
                      <strong className="text-2xl">Feedback:</strong>{" "}
                      {translating[submission.sub_id] ? (
                        <span className="italic text-gray-500">
                          Translating...
                        </span>
                      ) : (
                        <span className="whitespace-pre-line">
                          {feedbackState[submission.sub_id] ? (
                            <>
                              {feedbackState[submission.sub_id]}
                              {feedbackState[submission.sub_id]?.length <
                                (originalFeedback[submission.sub_id]?.length || 0) && (
                                <span className="animate-pulse">|</span>
                              )}
                            </>
                          ) : (
                            <span className="italic text-gray-500 animate-pulse">
                              typing...
                            </span>
                          )}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}