/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Sidebar from "../components/Sidebar";
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/index.scss";
import "../styles/addteacher.scss";
import axios from "axios";
import { Button } from "@/components/ui/button";

interface Data {
  id: string | number;
  name: string;
  email: string;
  number: number | string;
  pass: string;
}

export default function page() {
  const idRef = useRef<HTMLInputElement | null>(null);
  const name = useRef<HTMLInputElement | null>(null);
  const email = useRef<HTMLInputElement | null>(null);
  const pass = useRef<HTMLInputElement | null>(null);
  const pnumber = useRef<HTMLInputElement | null>(null);
  const [loading, setloading] = useState<boolean>(false);

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
    try {
      if (
        idRef.current &&
        name.current &&
        email.current &&
        pass.current &&
        pnumber.current
      ) {
        obj.id = idRef.current.value;
        obj.email = email.current.value;
        obj.name = name.current.value;
        obj.number = pnumber.current.value;
        obj.pass = pass.current.value;
        const response = await axios.post(
          "https://ai-teacher-api-xnd1.onrender.com/college/add_student/",
          obj
        );

        if (response.status === 200 && response.data.Message === "Success") {
          alert("Student added successfully!");

          idRef.current.value = "";
          name.current.value = "";
          pass.current.value = "";
          email.current.value = "";
          pnumber.current.value = "";
        } else {
          alert("Failed to add student. Please check the data.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while adding the student.");
    } finally {
      setloading(false);
    }
  };

  const [collegeid, setCollegeId] = useState<string | null>();
  const [collegeName, setCollegeName] = useState<string>();
  const handleCollegeDetails = (collegeid: string) => {
    const url1 = `https://ai-teacher-api-xnd1.onrender.com/college/${collegeid}/details
        `;
    axios
      .get(url1)
      .then(({ data }) => {
        console.log(data);
        setCollegeName(data.Colname);
      })
      .catch(() => {
        console.log("error");
      });
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
          <div className="add-teacher-content-container md:pl-[300px]">
            <h2 className="welcome-message"> Welcome, {collegeName}</h2>
            <div className="flex justify-center">
              <div className="add-teacher-form-container flex  bg-muted/40">
                <h2 className="p-3 pl-5 text-2xl font-bold">Add Student</h2>
                <form
                  action=""
                  className="add-teacher-form "
                  onSubmit={handleFormSubmit}
                >
                  <div className="input-wrapper">
                    <label htmlFor="sid">Student RollNumber:</label>
                    <input
                      type="number"
                      id="sid"
                      placeholder="Student Id"
                      className="bg-secondary "
                      ref={idRef}
                      required
                    />
                  </div>
                  <div className="input-wrapper">
                    <label htmlFor="sname">Student Name:</label>
                    <input
                      type="text"
                      id="sname"
                      placeholder="Student Name"
                      className="bg-secondary "
                      ref={name}
                      required
                    />
                  </div>
                  <div className="input-wrapper">
                    <label htmlFor="semail">Student Email:</label>
                    <input
                      type="email"
                      id="semail"
                      placeholder="abc@example.com"
                      className="bg-secondary "
                      ref={email}
                      required
                    />
                  </div>
                  <div className="input-wrapper">
                    <label htmlFor="snumber">Student Phone Number:</label>
                    <input
                      type="number"
                      id="snumber"
                      placeholder="+91 98145-90391"
                      className="bg-secondary "
                      ref={pnumber}
                      required
                    />
                  </div>
                  <div className="input-wrapper">
                    <label htmlFor="spass">Student Password:</label>
                    <input
                      type="password"
                      id="spass"
                      placeholder="Password"
                      className="bg-secondary "
                      ref={pass}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full ">
                    {loading ? "Adding..." : "Add Student"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
