"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, PlusCircle } from "lucide-react";
function getGradePoint(marks: number): number {
    const gradeTable = [
      { min: 90, point: 10 },
      { min: 80, point: 9 },
      { min: 70, point: 8 },
      { min: 60, point: 7 },
      { min: 50, point: 6 },
      { min: 40, point: 5 },
      { min: 0, point: 0 },
    ];
  
    for (const entry of gradeTable) {
      if (marks >= entry.min) {
        return entry.point;
      }
    }
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
    if (field === "marks") value = Math.min(value, 100); // clamp max to 100
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const addSubject = () => {
    const newId = subjects.length ? subjects[subjects.length - 1].id + 1 : 1;
    setSubjects([...subjects, { id: newId, credit: 0, marks: 0 }]);
  };

  const removeSubject = (id: number) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const calculateSGPA = () => {
    const totalCredits = subjects.reduce((sum, s) => sum + s.credit, 0);
    const weightedSum = subjects.reduce(
      (sum, s) => sum + s.credit * getGradePoint(s.marks),
      0
    );
    const sgpaResult = totalCredits === 0 ? 0 : weightedSum / totalCredits;
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSubject(subject.id)}
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
            <div className="text-center text-lg font-semibold">
              SGPA: <span className="text-blue-600">{sgpa}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
