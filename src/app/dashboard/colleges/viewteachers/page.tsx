/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Sidebar from "../components/Sidebar";
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/index.scss";

import axios from "axios";
import "../styles/card.scss";
import PopUpForTeacher from "../components/PopUpForTeacher";

interface ClassType {
  id: number;
  Tname: string;
}

export default function page() {
  const [collegeid, setCollegeId] = useState<string | null>();
  const [collegeName, setCollegeName] = useState<string>();
  const [teachers, setteachers] = useState<ClassType[]>();
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(
    null
  );

  const handleCollegeDetails = (collegeid: string) => {
    const url1 = `https://ai-teacher-api-xnd1.onrender.com/college/${collegeid}/details
        `;
    const urlTeachers = `https://ai-teacher-api-xnd1.onrender.com/college/${collegeid}/teacher_list/`;
    axios
      .get(url1)
      .then(({ data }) => {
        console.log(data);
        setCollegeName(data.Colname);
      })
      .catch(() => {
        console.log("error");
      });
    axios
      .get(urlTeachers)
      .then(({ data }) => {
        setteachers(data);
        console.log(data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleDetails = (id: number) => {
    setSelectedTeacherId(id);
  };
  const close = () => {
    setSelectedTeacherId(null);
  };
  useEffect(() => {
    const collegeId = sessionStorage.getItem("collegeId");
    setCollegeId(collegeId);
    if (collegeId) handleCollegeDetails(collegeId);
  }, []);
  return (
    <>
      <div className="add-teacher-container  flex  ">
        <div className="sidebar-container-page ">
          <Sidebar />
        </div>
        <div className="content-container w-full">
          <div className="navbar">
            <Navbar />
          </div>
          <div className="view-teachers-content-container min-h-[89vh] md:pl-[300px] bg-gradient-to-br from-slate-50 via-slate-200 to-slate-100">
            <div className="max-w-xl  bg-white shadow-md rounded-xl p-6 mb-6 mt-1">
              <h2 className="text-2xl font-bold ">Welcome, {collegeName}</h2>
            </div>

            <div className="flex flex-wrap p-5 gap-3 justify-center">
              {teachers?.map((data, index) => {
                return (
                  <div
                    key={index}
                    className="relative group overflow-hidden p-6 rounded-xl bg-[#1e293b] text-white shadow-md hover:shadow-xl transition-all duration-300 w-full max-w-[400px]"
                  >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0">
                      <div className="absolute w-1/3 h-full bg-white/10 blur-md transform translate-x-full group-hover:animate-shimmer pointer-events-none" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <p className="text-sm text-gray-300 mb-2">Teacher ID</p>
                      <p className="text-xl font-bold mb-2">{data.id}</p>

                      <p className="text-sm text-gray-300 mb-1">Teacher Name</p>
                      <p className="text-lg font-semibold mb-4">{data.Tname}</p>

                      <button
                        onClick={() => handleDetails(data.id)}
                        className="mt-2 px-4 py-2 bg-white text-gray-800 rounded-md font-semibold transition hover:shadow-lg"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {selectedTeacherId !== null && (
            <PopUpForTeacher tid={selectedTeacherId} onclick={close} />
          )}
        </div>
      </div>
    </>
  );
}
