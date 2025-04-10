"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

export default function SendMail() {
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingEmail, setFetchingEmail] = useState(false);

  const handleFetchEmail = async () => {
    if (!studentId) {
      //@ts-ignore

      toast.error("Please enter a student ID.");
      return;
    }

    setFetchingEmail(true);
    try {
      const response = await axios.get(
        `https://ai-teacher-api-xnd1.onrender.com/student/${studentId}/details`
      );
      const { Semail } = response.data;
      if (Semail) {
        setEmail(Semail);
      //@ts-ignore

        toast.success("Student email fetched!");
      } else {
      //@ts-ignore

        toast.error("Email not found for this student.");
      }
    } catch (error) {
      console.error(error);
      //@ts-ignore

      toast.error("Failed to fetch student details.");
    } finally {
      setFetchingEmail(false);
    }
  };

  const handleSendEmail = async () => {
    if (!email || !message) {
      //@ts-ignore

      toast.error("Please fill out both fields.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("https://ai-teacher-api-xnd1.onrender.com/teacher/send_Mail", {
        email,
        msg: message,
      });
      //@ts-ignore

      toast.success("Email sent successfully!");
      setEmail("");
      setMessage("");
      setStudentId("");
    } catch (error) {
      console.error(error);
      //@ts-ignore
      
      toast.error("Failed to send email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-full max-w-md shadow-md p-6 rounded space-y-4">
        <h2 className="text-2xl font-bold text-center">Send Email to Student</h2>

        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
          <Button onClick={handleFetchEmail} disabled={fetchingEmail}>
            {fetchingEmail ? "Fetching..." : "Fetch Email"}
          </Button>
        </div>

        <Input
          type="email"
          placeholder="Student's Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <textarea
          placeholder="Your Message"
          rows={5}
          className="w-full border border-gray-300 p-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <Button onClick={handleSendEmail} disabled={loading} className="w-full">
          {loading ? "Sending..." : "Send Email"}
        </Button>
      </div>
    </div>
  );
}
