"use client";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Image from "next/image";
import domToImage from "dom-to-image-more";

export default function CertificateGenerator() {
  const [name, setName] = useState<string>("");
  const [rollNo, setRollNo] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const certRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    if (name.trim() && rollNo.trim()) {
      setShowModal(true);
    } else {
      //@ts-ignore
      toast.error("Please fill out both fields.");
    }
  };

  const fixColors = (element: HTMLElement) => {
    const all = element.querySelectorAll("*");
    all.forEach((el) => {
      const style = window.getComputedStyle(el);
      if (style.color.includes("oklch")) {
        (el as HTMLElement).style.color = "#000";
      }
      if (style.backgroundColor.includes("oklch")) {
        (el as HTMLElement).style.backgroundColor = "#fff";
      }
    });
  };

  const handleDownloadAsImage = async (): Promise<void> => {
    const element = certRef.current;
    if (!element) return;

    setLoading(true);
    try {
      fixColors(element); // Patch unsupported CSS colors
      const dataUrl: string = await domToImage.toPng(element);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${name}_Certificate.png`;
      link.click();
    } catch (error) {
      console.error("Image generation failed:", error);
      //@ts-ignore
      toast.error("Failed to generate certificate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Certificate Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Enter Roll Number"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
          />
          <Button className="w-full" onClick={handleGenerate}>
            Generate Certificate
          </Button>
        </CardContent>
      </Card>

      {/* Certificate Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Certificate Preview</DialogTitle>
          </DialogHeader>

          <div
            ref={certRef}
            className="bg-white p-10 border-4 border-indigo-600 rounded-xl shadow-lg text-center"
            style={{ color: "#000", backgroundColor: "#fff" }}
          >
            <Image
              src="/gne.jpg"
              width={100}
              height={100}
              alt="GNE Logo"
              className="mx-auto mb-4"
            />
            <h2 className="text-3xl font-bold text-indigo-700 mb-4">
              Certificate of Achievement
            </h2>
            <p className="text-lg">This is to certify that</p>
            <h3 className="text-2xl font-semibold mt-2">{name}</h3>
            <p className="mt-2">Roll No: {rollNo}</p>
            <p className="mt-4 text-gray-600">
              has successfully completed the requirements.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Date: {new Date().toLocaleDateString()}
            </p>
          </div>

          <Button className="mt-4 w-full" onClick={handleDownloadAsImage} disabled={loading}>
            {loading ? "Generating..." : "Download as Image"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
