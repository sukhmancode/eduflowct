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

export interface Teacher {
  Tcontact: string;
  Temail: string;
  Tname: string;
  Tpass: string;
  college_id: number;
  id: number;
  subject: string;
}

export default function Page() {
  const [collegeid, setCollegeId] = useState<string | null>(null);
  const [collegeName, setCollegeName] = useState<string>("");
  const teacherRef = useRef<HTMLInputElement>(null);
  const [teacherData, setTeacherData] = useState<Teacher | null>(null);

  const handleCollegeDetails = (collegeid: string) => {
    const url1 = `https://ai-teacher-api-xnd1.onrender.com/college/${collegeid}/details`;
    axios
      .get(url1)
      .then(({ data }) => {
        console.log(data);
        setCollegeName(data.Colname);
      })
      .catch(() => {
        console.log("error fetching college details");
      });
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    if (teacherRef.current && collegeid) {
      const URL = `https://ai-teacher-api-xnd1.onrender.com/college/${collegeid}/search_teacher/${teacherRef.current.value}?College_id=${collegeid}`;
      axios.get(URL).then(({ data }) => {
        console.log(data);
        // Assumes API returns an array, taking first element as teacher data
        setTeacherData(data[0]);
      });
    }
  };

  useEffect(() => {
    const collegeIdFromStorage = sessionStorage.getItem("collegeId");
    setCollegeId(collegeIdFromStorage);
    if (collegeIdFromStorage) handleCollegeDetails(collegeIdFromStorage);
  }, []);

  return (
    <div className="add-teacher-container flex">
      <div className="sidebar-container-page">
        <Sidebar />
      </div>
      <div className="content-container w-full">
        <div className="navbar">
          <Navbar />
        </div>
        <div className="view-classes-content-container p-5 md:pl-[300px]">
          <div className="max-w-xl  bg-white shadow-md rounded-xl p-6 mb-6 mt-1">
            <h2 className="text-2xl font-bold ">Welcome, {collegeName}</h2>
          </div>
          <div className="flex flex-col items-center gap-5">
            <form
              className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md"
              onSubmit={handleSearch}
            >
              <input
                type="number"
                placeholder="Search Any Teacher Id:"
                style={{
                  border: "1px solid grey",
                  width: "100%",
                  borderRadius: 20,
                  padding: 5,
                }}
                ref={teacherRef}
              />
              <input
                type="submit"
                value="Search"
                style={{
                  background: "black",
                  borderRadius: 20,
                  color: "white",
                  padding: "5px 10px",
                }}
              />
            </form>
            {teacherData ? (
              <div className="teacher-details mt-5 w-full max-w-lg">
                <table className="min-w-full border-collapse border border-gray-400">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 px-4 py-2">
                        Field
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Name</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {teacherData.Tname}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        Email
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {teacherData.Temail}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        Contact
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {teacherData.Tcontact}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        Subject
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {teacherData.subject}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        College ID
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {teacherData.college_id}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        Teacher ID
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {teacherData.id}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-5 text-gray-500">
                No teacher details to display. Please search for a teacher.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
