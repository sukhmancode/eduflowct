"use client";

import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/index.scss";

import "../styles/addteacher.scss";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";

export default function Page() {
  const [collegeId, setCollegeId] = useState<string | null>(null);
  const [collegeName, setCollegeName] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const idRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const storedCollegeId = sessionStorage.getItem("collegeId");
    setCollegeId(storedCollegeId);

    if (storedCollegeId) {
      axios
        .get(
          `https://ai-teacher-api-xnd1.onrender.com/college/${storedCollegeId}/details`
        )
        .then(({ data }) => setCollegeName(data.Colname))
        .catch(() => console.log("Error fetching college details"));
    }
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (
      idRef.current &&
      nameRef.current &&
      emailRef.current &&
      phoneRef.current &&
      passRef.current &&
      collegeId
    ) {
      const payload = {
        id: Number(idRef.current.value),
        Tname: nameRef.current.value,
        Tpass: passRef.current.value,
        college_id: Number(collegeId),
        Temail: emailRef.current.value,
        Tcontact: phoneRef.current.value,
      };
      console.log(payload, payload.college_id);
      try {
        const response = await axios.post(
          "https://ai-teacher-api-xnd1.onrender.com/college/add_teacher/",
          payload
        );

        if (response.status === 200) {
          toast.success("Teacher Added Sucessfully!");

          // Clear inputs
          idRef.current.value = "";
          nameRef.current.value = "";
          emailRef.current.value = "";
          phoneRef.current.value = "";
          passRef.current.value = "";
        } else {
          alert("Failed to add teacher.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please fill in all fields.");
      setLoading(false);
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
        <div className="add-teacher-content-container md:pl-[300px]">
          <h2 className="welcome-message">Welcome, {collegeName}</h2>
          <div className="flex justify-center">
            <div className="add-teacher-form-container flex bg-muted/40">
              <h2 className="p-3 pl-5 text-2xl font-bold">Add Teacher</h2>
              <form className="add-teacher-form" onSubmit={handleFormSubmit}>
                <div className="input-wrapper">
                  <label htmlFor="tid">Teacher ID:</label>
                  <input
                    type="number"
                    id="tid"
                    ref={idRef}
                    className="bg-secondary"
                    required
                  />
                </div>

                <div className="input-wrapper">
                  <label htmlFor="tname">Teacher Name:</label>
                  <input
                    type="text"
                    id="tname"
                    ref={nameRef}
                    className="bg-secondary"
                    required
                  />
                </div>

                <div className="input-wrapper">
                  <label htmlFor="temail">Teacher Email:</label>
                  <input
                    type="email"
                    id="temail"
                    ref={emailRef}
                    className="bg-secondary"
                    required
                  />
                </div>

                <div className="input-wrapper">
                  <label htmlFor="tphone">Teacher Contact:</label>
                  <input
                    type="text"
                    id="tphone"
                    ref={phoneRef}
                    className="bg-secondary"
                    required
                  />
                </div>

                <div className="input-wrapper">
                  <label htmlFor="tpass">Teacher Password:</label>
                  <input
                    type="password"
                    id="tpass"
                    ref={passRef}
                    className="bg-secondary"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4"
                >
                  {loading ? "Adding..." : "Add Teacher"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
