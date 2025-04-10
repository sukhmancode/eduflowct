"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Class {
  id: number;
  Cname: string;
}

interface Assignment {
  title: string;
  grade: number;
  url: string | null;
  Submitted_At: string | null;
}

interface Student {
  id: number;
  Sname: string;
  college_id: number;
  assignments: Assignment[];
}

export default function Classes() {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [teacherID, setTeacherID] = useState<string | null>(null);
  const [teacherName, setTeacherName] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[] | null>(null);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const storedTeacherID = sessionStorage.getItem("teacherId");
    setTeacherID(storedTeacherID);
  }, []);

  useEffect(() => {
    if (!teacherID) {
      return;
    }
    // Fetch teacher details
    axios
      .get(`https://ai-teacher-api-xnd1.onrender.com/teacher/${teacherID}/detail`)
      .then((response) => {
        const { Tname } = response.data;
        setTeacherName(Tname);
      })
      .catch((error) => console.error("Error fetching teacher details"));

    // Fetch classes
    axios
      .get(`https://ai-teacher-api-xnd1.onrender.com/teacher/${teacherID}/classes`)
      .then((response) => setClasses(response.data))
      .catch((error) => console.error("Error fetching classes"));
  }, [teacherID]);

  const handleViewStudents = (classId: number) => {
    setSelectedClass(classId);
    setLoading(true);
    axios
      .get(`https://ai-teacher-api-xnd1.onrender.com/teacher/viewstudents/${classId}`)
      .then((response) => setStudents(response.data))
      .catch((error) => console.error("Error fetching students"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="w-full">
        {teacherName && (
          <div className="mb-4 p-4 text-bold text-3xl text-white shadow-sm rounded">
            <h2 className="text-3xl text-black p-5
   rounded font-bold uppercase">Welcome, {teacherName}</h2>
          </div>
        )}

        <div className="flex flex-wrap gap-4">
          {classes.length > 0 ? (
            classes.map((cls) => (
              <Card key={cls.id} className="shadow-lg border bg-secondary border-gray-200">
                <CardHeader     />
                <CardContent className="flex gap-4 flex-col">
                  <p className="text-2xl font-semibold">{cls.Cname}</p>
                  <div className="flex items-center bg-primary rounded-md w-fit cursor-pointer">
                  <Button onClick={() => handleViewStudents(cls.id)} className="">
                    View Students
                  </Button>
                  <ChevronRight fill="#" size={32}/>
                  </div>
           
                </CardContent>
              </Card>
            ))
          ) : (
            <h1>No classes available</h1>
          )}
        </div>
      </div>

      {selectedClass && (
        <div className="mt-6 ">
          <h2 className="text-xl font-bold">Students in Class <span>{selectedClass}</span></h2>
          <div className="mt-4 flex flex-col">
            {loading ? (
              <Button type="button" className="bg-indigo-500 flex items-center" disabled>
                <svg className="mr-3 w-5 h-5 animate-spin" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                </svg>
                <p className="text-2xl text-white">Loading...</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevron-right-icon lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
              </Button>
            ) : students && students.length > 0 ? (
              students.map((student) => (
                <Card key={student.id} className="shadow-md border border-gray-200 my-2">
                  <CardHeader>
                    <CardTitle>
                      {student.Sname} (ID: {student.college_id})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold">Assignments:</h3>
                    <ul className="list-disc list-inside ">
                    {student.assignments.map((assignment, index) => (
                      <li key={index} className="mt-2 list-none">
                        <div>
                          <p>
                            <span className="font-medium">{assignment.title}</span>
                          </p>
                          {assignment.url ? (
                            <div className="mt-2">
                              <a
                                href={assignment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button className="cursor-pointer text-white text-1xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                                  View
                                </Button>
                                
                                <p className="mt-3">Grade: <span className="text-semibold text-white text-xl font-semibold">{assignment.grade}</span></p>
                              </a>
                            </div>
                          ) : (
                            <h2 className="font-semibold text-red-500 mt-2">Not submitted yet</h2>
                          )}
                        </div>
                      </li>
                    ))}

                    </ul>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardTitle className="text-white text-3xl">No students found.</CardTitle></Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
