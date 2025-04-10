"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Assignment {
  id: number;
  title: string;
  cloudinary_url: string;
  due_date: string;
  Cname: string;
  subm_id: number;
  is_submitted?: boolean;
}

interface Feedback {
  grade: number | null;
  comment: string | null;
}

export default function StudentAssignments() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [files, setFiles] = useState<{ [id: number]: File | null }>({});
  const [status, setStatus] = useState<{ [id: number]: string | null }>({});
  const [feedbacks, setFeedbacks] = useState<{ [subm_id: number]: Feedback }>({});
  const [feedbackVisible, setFeedbackVisible] = useState<{ [id: number]: boolean }>({});
  const [submittedMap, setSubmittedMap] = useState<{ [ass_id: number]: number }>({});

  // Get studentId and fetch assignments
  useEffect(() => {
    const id = sessionStorage.getItem("studentId");
    if (!id) return router.push("/");
    setStudentId(id);

    axios
      .get(`https://ai-teacher-api-xnd1.onrender.com/student/assignments/${id}`)
      .then(({ data }) => setAssignments(data))
      .catch(() => setStatus({ 0: "Error fetching assignments." }));
  }, [router]);

  // Get all submissions to map assignment_id to subm_id
  useEffect(() => {
    if (!studentId) return;

    axios
      .get(`https://ai-teacher-api-xnd1.onrender.com/student/submissions/${studentId}`)
      .then(({ data }) => {
        const submitted: { [ass_id: number]: number } = {};
        data.forEach((entry: any) => {
          submitted[entry.assignment_id] = entry.sub_id;
        });
        setSubmittedMap(submitted);
      })
      .catch(() => {
        console.error("Failed to fetch submissions");
      });
  }, [studentId]);

  const handleFileChange = (assignmentId: number, file: File | null) => {
    setFiles((prev) => ({ ...prev, [assignmentId]: file }));
  };

  const handleSubmit = async (assignmentId: number) => {
    if (!files[assignmentId] || !studentId) {
      return setStatus((prev) => ({
        ...prev,
        [assignmentId]: "Please select a file.",
      }));
    }

    const formData = new FormData();
    formData.append("assignment_id", assignmentId.toString());
    formData.append("student_id", studentId);
    formData.append("file", files[assignmentId] as File);

    setStatus((prev) => ({ ...prev, [assignmentId]: "Submitting..." }));

    try {
      await axios.post(
        "https://ai-teacher-api-xnd1.onrender.com/student/submit_assignment/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setStatus((prev) => ({
        ...prev,
        [assignmentId]: "Submitted successfully!",
      }));

      setAssignments((prev) =>
        prev.map((a) =>
          a.id === assignmentId ? { ...a, is_submitted: true } : a
        )
      );
    } catch {
      setStatus((prev) => ({
        ...prev,
        [assignmentId]: "Submission failed.",
      }));
    }
  };

  const toggleFeedback = async (assignmentId: number) => {
    if (!studentId) return;

    const submId = submittedMap[assignmentId];
    if (!submId) return;

    const isVisible = feedbackVisible[assignmentId];

    if (!isVisible) {
      try {
        const { data } = await axios.get(
          `https://ai-teacher-api-xnd1.onrender.com/student/FeedBack/${studentId}/${assignmentId}/${submId}`
        );

        setFeedbacks((prev) => ({
          ...prev,
          [submId]: {
            grade: data.grade,
            comment: data.feedback,
          },
        }));
      } catch {
        console.error("Error fetching feedback");
      }
    }

    setFeedbackVisible((prev) => ({
      ...prev,
      [assignmentId]: !prev[assignmentId],
    }));
  };

  if (!assignments.length)
    return <p className="text-center text-gray-500">Loading assignments...</p>;

    return (
      <div className="flex justify-center items-center px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-screen-xl">
          {assignments.map((assignment) => {
            const isSubmitted = assignment.is_submitted || submittedMap[assignment.id];
            const submId = submittedMap[assignment.id];
            const feedback = feedbacks[submId];
    
            return (
              <Card
                key={assignment.id}
                className="w-full shadow-lg border border-gray-200"
              >
                <CardHeader>
                  <CardTitle className="text-xl">{assignment.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <strong>Assignment ID:</strong> {assignment.id}
                  </p>
                  <p>
                    <strong>Class:</strong> {assignment.Cname}
                  </p>
                  <p>
                    <strong>Due Date:</strong>{" "}
                    {assignment.due_date.split("T")[0]}
                  </p>
                  <p>
                    <strong>File:</strong>{" "}
                    <a
                      href={assignment.cloudinary_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      View
                    </a>
                  </p>
    
                  {!isSubmitted ? (
                    <>
                      <Input
                        type="file"
                        onChange={(e) =>
                          handleFileChange(
                            assignment.id,
                            e.target.files?.[0] || null
                          )
                        }
                      />
                      <Button
                        onClick={() => handleSubmit(assignment.id)}
                        disabled={status[assignment.id] === "Submitting..."}
                      >
                        {status[assignment.id] === "Submitting..."
                          ? "Submitting..."
                          : "Submit"}
                      </Button>
                    </>
                  ) : (
                    <p className="text-green-600">
                      Assignment already submitted.
                    </p>
                  )}
    
                  {status[assignment.id] && (
                    <p className="text-blue-500">{status[assignment.id]}</p>
                  )}
    
                  <>
                  <div className="flex gap-4">

                  
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => {
                        toggleFeedback(assignment.id);
                        router.push("/dashboard/student/submissions");
                      }}
                    >
                      {"View Feedback"}
                    </Button>
                    </div>
                    {feedbackVisible[assignment.id] && feedback && (
                      <div className="bg-gray-50 p-2 border rounded mt-2">
                        <p>
                          <strong>Grade:</strong>{" "}
                          {feedback.grade !== null ? feedback.grade : "Not graded"}
                        </p>
                        <p>
                          <strong>Feedback:</strong>{" "}
                          {feedback.comment || "No feedback available."}
                        </p>
                      </div>
                    )}
                  </>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
    
}
