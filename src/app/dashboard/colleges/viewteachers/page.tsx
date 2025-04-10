/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Sidebar from "../components/Sidebar";
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/index.scss";
import "../styles/sidebar.scss";
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
          <div className="view-teachers-content-container">
            <h2 className="welcome-message"> Welcome, {collegeName}</h2>
            <div className="flex flex-wrap p-5 gap-3">
              {teachers?.map((data, index) => {
                return (
                  <div className="card-container" key={index}>
                    <div className="card-secondary-heading">
                      Teacher Id: {data.id}
                    </div>
                    <div className="card-number">
                      Teacher Name: {data.Tname}
                    </div>
                    <button
                      className="view-details"
                      onClick={() => {
                        handleDetails(data.id);
                      }}
                    >
                      View Details
                    </button>
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
