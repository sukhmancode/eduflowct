"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, ChevronRight, Loader2, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type Question = {
  id: number;
  question: string;
  options: string[];
  answer: string;
};

export default function SolveQuiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [answered, setAnswered] = useState<number[]>([]);

  useEffect(() => {
    setLoading(true);
    fetch("/api/quiz") // Replace with your actual API endpoint
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load quiz:", err);
        setLoading(false);
      });
  }, []);

  const handleNext = () => {
    if (selected === questions[currentIndex].answer) {
      setScore(prev => prev + 1);
    }

    setAnswered(prev => [...prev, currentIndex]);
    setSelected(null);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelected(null);
    setScore(0);
    setShowResults(false);
    setAnswered([]);
  };

  const currentQuestion = questions[currentIndex];
  const progressPercentage = questions.length > 0 ? ((answered.length) / questions.length) * 100 : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Loading your quiz...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6 text-center">
            <p className="text-lg text-red-500">Failed to load quiz questions.</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    let message = "Great effort!";
    let textColor = "text-yellow-500";
    
    if (percentage >= 80) {
      message = "Outstanding!";
      textColor = "text-green-500";
    } else if (percentage <= 40) {
      message = "Keep practicing!";
      textColor = "text-blue-500";
    }

    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-3xl font-bold">Quiz Completed!</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 text-center">
            <div className="mb-6">
              <Trophy className="h-16 w-16 mx-auto text-yellow-400 mb-2" />
              <h3 className={`text-2xl font-bold ${textColor} mb-2`}>{message}</h3>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-lg mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 font-medium">Your Score</span>
                <span className="font-bold">{score} / {questions.length}</span>
              </div>
              <Progress value={percentage} className="h-3" />
              <p className="mt-2 text-2xl font-bold">{percentage}%</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full text-lg py-6" onClick={restartQuiz}>
              Take Quiz Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col justify-center items-center">

    <div className="max-w-[600px] w-full justify-center p-4 my-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-500">
            Progress: {answered.length} of {questions.length} questions answered
          </span>
          <span className="text-sm font-medium">
            Score: {score}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <Card className="mb-6 shadow-md overflow-hidden border-t-4 border-primary">
        <CardHeader className="bg-gray-50 pb-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Question {currentIndex + 1} of {questions.length}</span>
            {score > 0 && <span className="text-sm font-medium text-green-600 flex items-center"><CheckCircle className="h-4 w-4 mr-1" /> {score} correct</span>}
          </div>
          <CardTitle className="text-xl font-bold mt-2">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <RadioGroup
            value={selected || ""}
            onValueChange={setSelected}
            className="space-y-4"
          >
            {currentQuestion.options.map((option, idx) => (
              <div 
                key={idx} 
                className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                  selected === option 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <RadioGroupItem value={option} id={`option-${idx}`} className="h-5 w-5" />
                <Label htmlFor={`option-${idx}`} className="flex-grow text-lg cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="pt-4 pb-6">
          <Button
            onClick={handleNext}
            disabled={!selected}
            className={`w-full py-6 text-lg font-medium flex items-center justify-center ${
              !selected ? 'opacity-70' : 'opacity-100'
            }`}
          >
            {currentIndex === questions.length - 1 ? (
              "Submit Quiz"
            ) : (
              <>
                Next Question <ChevronRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
    </div>

  );
}