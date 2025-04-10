"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Sidebar from "../components/Sidebar";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

interface ViewDetails {
  id: number;
  Colname: string;
  Ccontact: string;
  Cemail: string;
}

export default function Page() {
  const [collegeId, setCollegeId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ViewDetails>();

  useEffect(() => {
    const storedId = sessionStorage.getItem("collegeId");
    setCollegeId(storedId);

    if (storedId) {
      axios
        .get(
          `https://ai-teacher-api-xnd1.onrender.com/college/${storedId}/details`
        )
        .then(({ data }) => setDetail(data))
        .catch(() => console.error("Failed to fetch college details"));
    }
  }, []);

  return (
    <div className="flex">
      <div className="sidebar-container-page">
        <Sidebar />
      </div>
      <div className="content-container w-full">
        <div className="navbar">
          <Navbar />
        </div>

        <div className="min-h-[89vh] md:pl-[300px] bg-gradient-to-br from-slate-50 via-slate-200 to-slate-100 p-6">
          <div className="max-w-xl  bg-white shadow-md rounded-xl p-6 mb-6 mt-1">
            <h2 className="text-2xl font-bold text-center">
              Welcome, {detail?.Colname}
            </h2>
          </div>

          <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-4">
            {detail ? (
              <>
                <div className="text-gray-600">
                  <span className="font-semibold mr-2">🆔 College ID:</span>
                  <span className="text-black font-medium">{detail.id}</span>
                </div>
                <div className="text-gray-600">
                  <span className="font-semibold mr-2">🏫 College Name:</span>
                  <span className="text-black font-medium">
                    {detail.Colname}
                  </span>
                </div>
                <div className="text-gray-600">
                  <span className="font-semibold mr-2">
                    ☎️ College Contact:
                  </span>
                  <span className="text-black font-medium">
                    {detail.Ccontact}
                  </span>
                </div>
                <div className="text-gray-600">
                  <span className="font-semibold mr-2">📧 College Email:</span>
                  <span className="text-black font-medium">
                    {detail.Cemail}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-gray-500">Loading college details...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
