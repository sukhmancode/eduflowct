"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

type ClassItem = {
  id: number;
  Cname: string;
  mst1_url: string | null;
  mst2_url: string | null;
  teacher_id: number;
};

export default function UploadMSTmarks() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [mst1ClassId, setMst1ClassId] = useState<string>("");
  const [mst2ClassId, setMst2ClassId] = useState<string>("");
  const [mst1File, setMst1File] = useState<File | null>(null);
  const [mst2File, setMst2File] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const mst1InputRef = useRef<HTMLInputElement | null>(null);
  const mst2InputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const id = sessionStorage.getItem("teacherId");
    if (id) {
      setTeacherId(id);
    } else {
      //@ts-ignore

      toast.error("Teacher ID not found in session!");
    }
  }, []);

  useEffect(() => {
    if (!teacherId) return;
    setLoading(true);
    axios
      .get(`https://ai-teacher-api-xnd1.onrender.com/teacher/${teacherId}/classes`)
      .then((res) => setClasses(res.data))
      //@ts-ignore

      .catch(() => toast.error("Failed to fetch class list."))
      .finally(() => setLoading(false));
  }, [teacherId]);

  const handleUpload = async (type: "mst1" | "mst2") => {
    const classId = type === "mst1" ? mst1ClassId : mst2ClassId;
    const file = type === "mst1" ? mst1File : mst2File;

    if (!classId || !file) {
      //@ts-ignore

      toast.error("Please select a class and upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const endpoint =
      type === "mst1"
        ? `https://ai-teacher-api-xnd1.onrender.com/teacher/upload-mst1/${classId}`
        : `https://ai-teacher-api-xnd1.onrender.com/teacher/upload-mst2/${classId}`;

    try {
      await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      //@ts-ignore

      toast.success(`Successfully uploaded ${type.toUpperCase()} file!`);

      // Reset form
      if (type === "mst1") {
        setMst1ClassId("");
        setMst1File(null);
        if (mst1InputRef.current) mst1InputRef.current.value = "";
      } else {
        setMst2ClassId("");
        setMst2File(null);
        if (mst2InputRef.current) mst2InputRef.current.value = "";
      }

      // Refresh class data
      const updated = await axios.get(
        `https://ai-teacher-api-xnd1.onrender.com/teacher/${teacherId}/classes`
      );
      setClasses(updated.data);
    } catch (err) {
      console.error("Upload failed:", err);
      //@ts-ignore

      toast.error("Upload failed.");
    }
  };

  return (
    <div className="w-fit mx-auto">
      <Card className="p-7">
        <h2 className="text-2xl font-semibold mb-4">Upload MST Marks</h2>
        <Tabs defaultValue="mst1">
          <TabsList className="mb-4">
            <TabsTrigger value="mst1">MST-1</TabsTrigger>
            <TabsTrigger value="mst2">MST-2</TabsTrigger>
          </TabsList>

          {/* MST-1 TAB */}
          <TabsContent value="mst1">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label>Select Class</Label>
                <Select onValueChange={(val) => setMst1ClassId(val)} value={mst1ClassId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose class" />
                  </SelectTrigger>
                  <SelectContent>
                    {loading ? (
                      <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : (
                      classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>
                          {cls.Cname} {cls.mst1_url ? "✅" : ""}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Upload MST-1 File</Label>
                <Input
                  ref={mst1InputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.csv,.xlsx"
                  onChange={(e) => setMst1File(e.target.files?.[0] || null)}
                />
                {mst1File && (
                  <p className="text-sm text-muted-foreground mt-1">{mst1File.name}</p>
                )}
              </div>

              <Button onClick={() => handleUpload("mst1")}>Upload MST-1</Button>
            </div>
          </TabsContent>

          {/* MST-2 TAB */}
          <TabsContent value="mst2">
            <div className="space-y-4">
              <div>
                <Label>Select Class</Label>
                <Select onValueChange={(val) => setMst2ClassId(val)} value={mst2ClassId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose class" />
                  </SelectTrigger>
                  <SelectContent>
                    {loading ? (
                      <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : (
                      classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>
                          {cls.Cname} {cls.mst2_url ? "✅" : ""}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Upload MST-2 File</Label>
                <Input
                  ref={mst2InputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.csv,.xlsx"
                  onChange={(e) => setMst2File(e.target.files?.[0] || null)}
                />
                {mst2File && (
                  <p className="text-sm text-muted-foreground mt-1">{mst2File.name}</p>
                )}
              </div>

              <Button onClick={() => handleUpload("mst2")}>Upload MST-2</Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
