"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Globe, Youtube, BookOpenCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResourceGenerator() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://ai-teacher-api-xnd1.onrender.com/student/resource_generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query_text: query }),
      });

      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">
        Resources
      </h1>

      {/* Search Bar */}
      <div className="w-full max-w-xl flex gap-2 mb-6">
        <Input
          placeholder="Enter a topic (e.g., AI, Science, Math)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={fetchResources} disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </Button>
      </div>

      {data && (
        <div className="grid md:grid-cols-3 gap-6 w-full max-w-6xl">
          {/* Study Articles */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-blue-700">
                <BookOpenCheck className="w-5 h-5" />
                Study Articles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.resources.study_articles.map((item: any, idx: number) => (
                  <li key={idx}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline text-sm"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* YouTube Videos */}
          <Card className="shadow-lg md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-red-600">
                <Youtube className="w-5 h-5" />
                YouTube Channels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {data.resources.youtube_videos.map((video: any, idx: number) => {
                  const videoId = new URL(video.url).searchParams.get("v");
                  const embedUrl = videoId
                    ? `https://www.youtube.com/embed/${videoId}`
                    : video.url.replace("watch?v=", "embed/");

                  return (
                    <div key={idx} className="w-full aspect-video">
                      <iframe
                        src={embedUrl}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full rounded-lg"
                      ></iframe>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Learning Platforms */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-green-700">
                <Globe className="w-5 h-5" />
                Learning Platforms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.resources.learning_platforms.map((item: any, idx: number) => (
                  <li key={idx}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline text-sm"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
