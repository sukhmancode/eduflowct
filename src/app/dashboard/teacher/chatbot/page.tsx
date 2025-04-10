"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [fullResponse, setFullResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);

  const typeText = (text: string) => {
    let index = 0; 
    setResponse(text[0]);   
    setTyping(true);
  
    const interval = setInterval(() => {
      setResponse((prev) => prev + text[index]);
      index++;
  
      if (index >= text.length) {
        clearInterval(interval);
        setTyping(false);
      }
    }, 25);
  };
  

  const handleSend = async () => {
    if (!message.trim()) {
      //@ts-ignore
      toast.error("Please enter a message.");
      return;
    }

    setLoading(true);
    setResponse("Typing...");
    setFullResponse("");
    setTyping(true);

    try {
      const { data } = await axios.post(
        "https://ai-teacher-api-xnd1.onrender.com/student/chatbot",
        {
          query_text: message,
        }
      );


      const reply = data.FeedBack || "No response from chatbot.";
      console.log(reply);
      
      setFullResponse(reply);
      typeText(reply);
    } catch (error) {
      console.error("Error:", error);
      //@ts-ignore

      toast.error("Failed to get a response from chatbot.");
      setResponse("Oops! Something went wrong.");
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 ">
      <div className="w-full max-w-md p-6 rounded shadow space-y-4">
        <h1 className="text-2xl font-semibold text-center">Teacher Chatbot</h1>

        <textarea
          className="w-full border border-gray-300 p-2 rounded resize-none"
          rows={3}
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading || typing}
        />

        <Button onClick={handleSend} className="w-full" disabled={loading || typing}>
          {loading || typing ? "Sending..." : "Send"}
        </Button>

        {response && (
          <div className="mt-4 p-3 border rounded text-secondary text-sm whitespace-pre-line min-h-[50px]">
            {response}
            {typing && <span className="animate-pulse ml-1">|</span>}
          </div>
        )}
      </div>
    </div>
  );
}
