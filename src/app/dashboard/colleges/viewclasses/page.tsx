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

interface ClassType {
  id: number;
  Cname: string;
}

export default function page() {
  const [collegeid, setCollegeId] = useState<string | null>();
  const [collegeName, setCollegeName] = useState<string>();
  const [classes, setClasses] = useState<ClassType[]>();

  const handleCollegeDetails = (collegeid: string) => {
    const url1 = `https://ai-teacher-api-xnd1.onrender.com/college/${collegeid}/details
        `;
    const urlClasses = `https://ai-teacher-api-xnd1.onrender.com/college/${collegeid}/class_list/`;
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
      .get(urlClasses)
      .then(({ data }) => {
        setClasses(data);
        console.log(data);
      })
      .catch((e) => {
        console.log(e);
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
          <div className="view-classes-content-container">
            <h2 className="welcome-message"> Welcome, {collegeName}</h2>
            <div className="flex flex-wrap p-5 gap-3">
              {classes?.map((data, index) => {
                return (
                  <div className="card-container" key={index}>
                    <div className="card-secondary-heading">
                      Class Id: {data.id}
                    </div>
                    <div className="card-number">Class Name: {data.Cname}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
