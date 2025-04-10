"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, PlusCircle } from "lucide-react";

function getGradePoint(marks: number): number {
  if (marks >= 90) return 10;
  if (marks >= 80) return 9;
  if (marks >= 70) return 8;
  if (marks >= 60) return 7;
  if (marks >= 50) return 6;
  if (marks >= 40) return 5;
  return 0;
}

interface Subject {
  id: number;
  credit: number;
  marks: number;
}

export default function SgpaCalculator() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, credit: 3, marks: 90 },
  ]);
  const [sgpa, setSgpa] = useState<number | null>(null);

  const handleChange = (id: number, field: keyof Subject, value: number) => {
    if (field === "marks") value = Math.min(Math.max(0, value), 100);
    if (field === "credit") value = Math.max(0, value);

    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const addSubject = () => {
    const newId = subjects.length ? subjects[subjects.length - 1].id + 1 : 1;
    setSubjects([...subjects, { id: newId, credit: 3, marks: 0 }]);
  };

  const removeSubject = (id: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((s) => s.id !== id));
    }
  };

  const calculateSGPA = () => {
    const totalCredits = subjects.reduce((sum, s) => sum + s.credit, 0);

    if (totalCredits === 0) {
      setSgpa(0);
      return;
    }

    const weightedSum = subjects.reduce(
      (sum, s) => sum + s.credit * getGradePoint(s.marks),
      0
    );

    const sgpaResult = weightedSum / totalCredits;
    setSgpa(parseFloat(sgpaResult.toFixed(2)));
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">SGPA Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subjects.map((subject) => (
            <div key={subject.id} className="flex items-center gap-4">
              <Input
                type="number"
                min="0"
                placeholder="Credits"
                value={subject.credit}
                onChange={(e) =>
                  handleChange(subject.id, "credit", +e.target.value)
                }
              />
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="Marks (Max 100)"
                value={subject.marks}
                onChange={(e) =>
                  handleChange(subject.id, "marks", +e.target.value)
                }
              />
              <span className="text-sm text-gray-600">
                Grade: {getGradePoint(subject.marks)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSubject(subject.id)}
                disabled={subjects.length <= 1}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addSubject} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Subject
          </Button>
          <Button onClick={calculateSGPA} className="w-full">
            Calculate SGPA
          </Button>
          {sgpa !== null && (
            <div className="text-center text-lg font-semibold mt-4 p-4 bg-blue-50 rounded-md">
              SGPA: <span className="text-blue-600">{sgpa}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
