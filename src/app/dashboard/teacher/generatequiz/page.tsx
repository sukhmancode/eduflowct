"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

type Class = {
  id: number
  Cname: string
}

type QuizQuestion = {
  question: string
  options: string[]
  answer: string
}

export default function GenerateQuiz() {
  const [teacherId] = useState(1) // static teacher ID
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedClass, setSelectedClass] = useState<number | null>(null)
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("EASY")
  const [numQues, setNumQues] = useState(5)
  const [quiz, setQuiz] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch class list
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch(`https://ai-teacher-api-xnd1.onrender.com/teacher/${teacherId}/classes`)
        const data = await res.json()
        setClasses(data)
      } catch (err) {
        console.error("Failed to fetch classes", err)
      }
    }
    fetchClasses()
  }, [teacherId])

  const handleGenerate = async () => {
    if (!selectedClass) return
    setLoading(true)
    try {
      const res = await fetch(
        `https://ai-teacher-api-xnd1.onrender.com/teacher/${selectedClass}/generate_quiz`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic,
            difficulty,
            num_ques: numQues,
          }),
        }
      )
      const data = await res.json()
      setQuiz(data)
    } catch (error) {
      console.error("Quiz generation failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🎓 AI Quiz Generator</h1>

      <div className="space-y-4 bg-white dark:bg-neutral-900 shadow-md rounded-lg p-6">
        <div>
          <label className="block mb-1 font-medium">Select Class</label>
          <select
            className="w-full px-4 py-2 rounded border bg-white dark:bg-neutral-800"
            onChange={(e) => setSelectedClass(Number(e.target.value))}
            defaultValue=""
          >
            <option disabled value="">-- Choose a Class --</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.Cname} (ID: {cls.id})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Topic</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded border bg-white dark:bg-neutral-800"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. OOPS, Data Structures"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Difficulty</label>
          <select
            className="w-full px-4 py-2 rounded border bg-white dark:bg-neutral-800"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Number of Questions</label>
          <input
            type="number"
            className="w-full px-4 py-2 rounded border bg-white dark:bg-neutral-800"
            value={numQues}
            onChange={(e) => setNumQues(Number(e.target.value))}
            min={1}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !selectedClass || !topic}
          className="w-full py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
        >
          {loading ? "Generating Quiz..." : "Generate Quiz"}
        </button>
      </div>

      {quiz.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">📋 Generated Quiz</h2>
          <div className="space-y-6">
            {quiz.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg shadow"
              >
                <h3 className="font-semibold mb-2">{i + 1}. {q.question}</h3>
                <ul className="space-y-1">
                  {q.options.map((opt, j) => (
                    <li
                      key={j}
                      className={`pl-2 border-l-4 ${opt === q.answer
                        ? 'border-green-500 font-bold text-green-700 dark:text-green-400'
                        : 'border-transparent'
                      }`}
                    >
                      {opt}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
