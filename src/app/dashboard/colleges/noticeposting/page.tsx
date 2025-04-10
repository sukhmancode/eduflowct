"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/index.scss";

export default function PostNotice() {
  const router = useRouter();
  const [collegeId, setCollegeId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Fetch collegeId from sessionStorage
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const id = sessionStorage.getItem("collegeId");
      if (!id) {
        toast.error("College ID not found in session!");
        router.push("/");
      } else {
        setCollegeId(id);
      }
    }
  }, [router]);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    } else {
      toast.error("Please select an image!");
    }
  };

  // Handle form submission
  const handlePostNotice = async () => {
    if (!title || !description || !image) {
      toast.error("All fields are required including image!");
      return;
    }

    if (!collegeId) {
      toast.error("College ID is missing!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);

    try {
      const response = await fetch(
        `https://ai-teacher-api-xnd1.onrender.com/college/${collegeId}/send_notice/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Error posting notice.");

      await response.json();
      toast.success("Notice posted successfully!");

      // Optional: Reset form
      setTitle("");
      setDescription("");
      setImage(null);
    } catch (error) {
      toast.error("Error posting notice.");
      console.error("Post error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="add-teacher-container flex">
      <div className="sidebar-container-page">
        <Sidebar />
      </div>
      <div className="content-container w-full">
        <div className="navbar">
          <Navbar />
        </div>
        <div className="flex justify-center items-center self-center">
          <Card className="w-full md:w-[500px] shadow-2xl border border-gray-200 p-6 mt-5">
            <CardHeader />
            <h1 className="text-center font-semibold text-3xl mb-4">
              Upload Notice!
            </h1>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-1">
                <Label>Notice Title</Label>
                <Input
                  type="text"
                  placeholder="Enter notice title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Description</Label>
                <Textarea
                  placeholder="Enter notice description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="mb-1">Upload Image</Label>
                <Input type="file" onChange={handleFileChange} />
              </div>
              <Button
                onClick={handlePostNotice}
                className="w-full mt-3"
                disabled={loading}
              >
                {loading ? "Posting..." : "Post Notice"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
