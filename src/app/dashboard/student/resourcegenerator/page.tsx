"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Globe, Youtube, BookOpenCheck } from "lucide-react";

const resources = {
  topic: "Science",
  resources: {
    study_articles: [
      {
        title: "Science News Explores",
        url: "https://www.snexplores.org/",
      },
      {
        title: "National Geographic - Science",
        url: "https://www.nationalgeographic.com/science/",
      },
      {
        title: "ScienceDaily: Your source for the latest research news",
        url: "https://www.sciencedaily.com/",
      },
      {
        title: "Smithsonian Magazine - Science & Nature",
        url: "https://www.smithsonianmag.com/science-nature/",
      },
    ],
    youtube_videos: [
      {
        title: "Veritasium",
        embedUrl: "https://www.youtube.com/embed/6g4dkBF5anU", // Sample video
      },
      {
        title: "Kurzgesagt – In a Nutshell",
        embedUrl: "https://www.youtube.com/embed/IfMb_Y0Rqtc",
      },
      {
        title: "minutephysics",
        embedUrl: "https://www.youtube.com/embed/hWz5ltE_I4c",
      },
      {
        title: "SciShow",
        embedUrl: "https://www.youtube.com/embed/EkdVtp4qu1s",
      },
    ],
    learning_platforms: [
      {
        name: "Khan Academy - Science",
        url: "https://www.khanacademy.org/science",
      },
    ],
  },
};

export default function ResourceGenerator() {
  const { topic, resources: res } = resources;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">
        Resource Generator: {topic}
      </h1>

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
              {res.study_articles.map((item, idx) => (
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
              {res.youtube_videos.map((video, idx) => (
                <div key={idx} className="w-full aspect-video">
                  <iframe
                    src={video.embedUrl}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded-lg"
                  ></iframe>
                </div>
              ))}
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
              {res.learning_platforms.map((item, idx) => (
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
    </div>
  );
}
