"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Sidebar from "../components/Sidebar";
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Data {
  id: string | number;
  name: string;
  email: string;
  number: number | string;
  pass: string;
}

export default function Page() {
  const idRef = useRef<HTMLInputElement | null>(null);
  const name = useRef<HTMLInputElement | null>(null);
  const email = useRef<HTMLInputElement | null>(null);
  const pass = useRef<HTMLInputElement | null>(null);
  const pnumber = useRef<HTMLInputElement | null>(null);

  const [loading, setloading] = useState<boolean>(false);
  const [collegeId, setCollegeId] = useState<string | null>(null);
  const [collegeName, setCollegeName] = useState<string>();
  const [existingIds, setExistingIds] = useState<number[]>([]);
  const [idError, setIdError] = useState<string | null>(null);

  // Fetch college details and student list
  const handleCollegeDetails = async (collegeid: string) => {
    const url1 = `https://ai-teacher-api-xnd1.onrender.com/college/${collegeid}/details`;
    const url2 = `https://ai-teacher-api-xnd1.onrender.com/college/${collegeid}/student_list/`;

    try {
      const [{ data: collegeData }, { data: studentList }] = await Promise.all([
        axios.get(url1),
        axios.get(url2),
      ]);

      setCollegeName(collegeData.Colname);
      const ids = studentList.map((student: any) => student.id);
      setExistingIds(ids);
    } catch {
      //@ts-ignore
      toast.error("Error fetching college or student details.");
    }
  };

  useEffect(() => {
    const storedId = sessionStorage.getItem("collegeId");
    setCollegeId(storedId);
    if (storedId) handleCollegeDetails(storedId);
  }, []);

  // Validate ID live
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (existingIds.includes(value)) {
      setIdError("Student with this ID is already enrolled.");
    } else {
      setIdError(null);
    }
  };

  // Submit handler
  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    setloading(true);

    const obj: Data = {
      id: 0,
      name: "",
      email: "",
      number: 0,
      pass: "",
    };

    if (
      idRef.current &&
      name.current &&
      email.current &&
      pass.current &&
      pnumber.current &&
      collegeId
    ) {
      obj.id = idRef.current.value;
      obj.email = email.current.value;
      obj.name = name.current.value;
      obj.number = pnumber.current.value;
      obj.pass = pass.current.value;

      try {
        const response = await axios.post(
          "https://ai-teacher-api-xnd1.onrender.com/college/add_student/",
          { ...obj, college_id: Number(collegeId) }
        );

        if (response.status === 200 && response.data.Message === "Success") {
      //@ts-ignore

          toast.success("Student added successfully!");

          idRef.current.value = "";
          name.current.value = "";
          email.current.value = "";
          pass.current.value = "";
          pnumber.current.value = "";
          setIdError(null);
        } else {
      //@ts-ignore

          toast.error("Failed to add student. Please check the data.");
        }
      } catch (err) {
        console.error(err);
      //@ts-ignore

        toast.error("Something went wrong.");
      } finally {
        setloading(false);
      }
    } else {
      //@ts-ignore

      toast.error("Please fill all fields.");
      setloading(false);
    }
  };

  return (
    <div className="add-teacher-container flex">
      <div className="sidebar-container-page">
        <Sidebar />
      </div>
      <div className="content-container w-full">
        <div className="navbar">
          <Navbar />
        </div>
        <div className="add-teacher-content-container min-h-[89vh] md:pl-[300px] bg-gradient-to-br from-slate-50 via-slate-200 to-slate-100">
          <h2 className="welcome-message">Welcome, {collegeName}</h2>
          <div className="flex justify-center">
            <div className="add-teacher-form-container flex bg-white rounded-xl shadow-md p-8">
              <form
                onSubmit={handleFormSubmit}
                className="space-y-5 w-full max-w-md"
              >
                <div className="max-w-xl  bg-white shadow-md rounded-xl p-6 mb-6 ">
                  <h2 className="text-2xl font-bold ">
                    Welcome, {collegeName}
                  </h2>
                </div>

                {/* ID */}
                <div>
                  <label
                    htmlFor="sid"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Student Roll Number
                  </label>
                  <input
                    id="sid"
                    type="number"
                    placeholder="Student ID"
                    onChange={handleIdChange}
                    ref={idRef}
                    className={`w-full px-4 py-2 rounded-md border ${
                      idError ? "border-red-500" : "border-gray-300"
                    } bg-white focus:outline-none focus:ring-2 ${
                      idError ? "focus:ring-red-500" : "focus:ring-black"
                    } transition`}
                  />
                  {idError && (
                    <p className="text-sm text-red-600 mt-1">{idError}</p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label
                    htmlFor="sname"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Student Name
                  </label>
                  <input
                    id="sname"
                    type="text"
                    placeholder="John Doe"
                    ref={name}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black transition"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="semail"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Student Email
                  </label>
                  <input
                    id="semail"
                    type="email"
                    placeholder="abc@example.com"
                    ref={email}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black transition"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="snumber"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Student Phone Number
                  </label>
                  <input
                    id="snumber"
                    type="text"
                    placeholder="+91 98145-90391"
                    ref={pnumber}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black transition"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="spass"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Student Password
                  </label>
                  <input
                    id="spass"
                    type="password"
                    placeholder="Password"
                    ref={pass}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black transition"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !!idError}
                  className="w-full bg-black hover:bg-neutral-800 text-white font-semibold py-2 rounded-md transition"
                >
                  {loading ? "Adding..." : "Add Student"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
