"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Teacher {
  Tname: string;
  id: number;
  college_id: number;
  Tcontact:string;
  Temail:string;
}

export default function TeacherDetail() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [teacherID, setTeacherID] = useState<string | null>(null);

  // Get teacher ID from sessionStorage on client-side
  useEffect(() => {
    const storedTeacherID = sessionStorage.getItem("teacherId");
    if (!storedTeacherID) {
      router.push("/"); // Redirect if no teacherID found
      return;
    }
    setTeacherID(storedTeacherID);
  }, [router]);

  // Fetch teacher details once teacherID is available
  useEffect(() => {
    if (!teacherID) return;

    axios
      .get(`https://ai-teacher-api-xnd1.onrender.com/teacher/${teacherID}/detail`)
      .then((response) => {
        setTeacher(response.data);
      })
      .catch((error) => {
        console.error("Error fetching teacher details:", error);
      })
      .finally(() => setLoading(false));
  }, [teacherID]);

  if (loading) return <p className="text-center text-gray-500">Loading teacher details...</p>;

  return (
    <div className="flex justify-center items-center ">
      <Card className="w-96 shadow-lg border border-gray-200 bg-[##404040]">
        <CardHeader>
          <CardTitle className="text-xl">Teacher Details</CardTitle>
        </CardHeader>
        <CardContent>
          {teacher ? (
            <div className="space-y-2">
              <p><strong>Name:</strong> {teacher.Tname}</p>
              <p><strong>Teacher ID:</strong> {teacher.id}</p>
              <p><strong>College ID:</strong> {teacher.college_id}</p>
              <p><strong>Email:</strong> {teacher.Temail}</p>
              <p><strong>Contact:</strong> {teacher.Tcontact}</p>
            </div>
          ) : (
            <p className="text-red-500">Teacher details not found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
