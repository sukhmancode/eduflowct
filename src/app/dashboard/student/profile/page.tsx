"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface Student {
  id: number;
  Sname: string;
  Semail: string;
  Scontact: string;
  college_id: number;
  Spass?: string;
}

export default function Profile() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentId = sessionStorage.getItem("studentId");

    if (!studentId) {
      toast.error("No student ID found in session.");
      setLoading(false);
      return;
    }

    const fetchStudent = async () => {
      try {
        const res = await axios.get<Student>(
          `https://ai-teacher-api-xnd1.onrender.com/student/${studentId}/details`
        );
        setStudent(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch student profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  if (loading) {
    return <div className="p-4">Loading student profile...</div>;
  }

  if (!student) {
    return <div className="p-4">Student not found.</div>;
  }

  return (
    <div className="max-w-[500px] mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-black text-center">
            {student.Sname}
          </CardTitle>
          <CardDescription className="text-2xl text-center">
            Student ID: {student.id}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <strong className="text-xl">Email:</strong>{" "}
            <span className="text-xl">{student.Semail}</span>
          </div>
          <div>
            <strong className="text-xl">Contact:</strong>{" "}
            <span className="text-xl">{student.Scontact}</span>
          </div>
          <div>
            <strong className="text-xl">College ID:</strong>{" "}
            <span className="text-xl">{student.college_id}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
