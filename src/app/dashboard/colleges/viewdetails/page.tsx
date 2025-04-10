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
import "../styles/popup.scss";

interface ViewDeatils {
  id: number;
  Colname: string;
  Ccontact: string;
  Cemail: string;
}

export default function page() {
  const [collegeid, setCollegeId] = useState<string | null>();
  const [collegeName, setCollegeName] = useState<string>();
  const [detail, setDetail] = useState<ViewDeatils>();

  const handleCollegeDetails = (collegeid: string) => {
    const url1 = `https://ai-teacher-api-xnd1.onrender.com/college/${collegeid}/details
        `;

    axios
      .get(url1)
      .then(({ data }) => {
        setCollegeName(data.Colname);
        setDetail(data);
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
          <div className="view-details-content-container">
            <h2 className="welcome-message"> Welcome, {collegeName}</h2>
            <div className="flex flex-wrap p-5 gap-3  details-content">
              {detail ? (
                <>
                  <p className="heading">
                    College Id:{" "}
                    <span className="teacher-detail">{detail.id}</span>
                  </p>
                  <p className="heading">
                    College Name:{" "}
                    <span className="teacher-detail">{detail.Colname}</span>
                  </p>
                  <p className="heading">
                    College Contact:{" "}
                    <span className="teacher-detail">{detail.Cemail}</span>
                  </p>
                  <p className="heading">
                    College Email:{" "}
                    <span className="teacher-detail">{detail.Cemail}</span>
                  </p>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
