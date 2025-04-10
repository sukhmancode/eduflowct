import axios from "axios";
import React, { useEffect, useState } from "react";
import "../styles/popup.scss";

interface Props {
  tid: number;
  onclick: () => any;
}
interface Data {
  Tcontact: number;
  Temail: string;
  Tname: string;
  id: number;
}
export default function PopUpForTeacher({ tid, onclick }: Props) {
  const [collegeName, setCollegeName] = useState<string>();
  const [collegeid, setCollegeId] = useState<string | null>();
  const [detail, setDetails] = useState<Data>();

  const getTdetails = (collegeid: string) => {
    const url1 = `https://ai-teacher-api-xnd1.onrender.com/college/${collegeid}/search_teacher/${tid}?College_id=${collegeid}`;
    const url = `https://ai-teacher-api-xnd1.onrender.com/college/${collegeid}/details`;
    axios
      .get(url)
      .then(({ data }) => {
        console.log(data);
        setCollegeName(data.Colname);
      })
      .catch(() => {
        console.log("error");
      });
    axios
      .get(url1)
      .then(({ data }) => {
        setDetails(data[0]);
      })
      .catch(() => {
        console.log("error");
      });
  };
  useEffect(() => {
    const collegeId = sessionStorage.getItem("collegeId");
    setCollegeId(collegeId);
    if (collegeId) {
      getTdetails(collegeId);
    }
  }, []);
  console.log(detail);
  return (
    <>
      <div className="popup-container">
        <div className="popup-content-container">
          {detail ? (
            <>
              <p className="heading">
                Teacher Id: <span className="teacher-detail">{detail.id}</span>
              </p>
              <p className="heading">
                Teacher Name:{" "}
                <span className="teacher-detail">{detail.Tname}</span>
              </p>
              <p className="heading">
                Teacher Contact:{" "}
                <span className="teacher-detail">{detail.Tcontact}</span>
              </p>
              <p className="heading">
                Teacher Email:{" "}
                <span className="teacher-detail">{detail.Temail}</span>
              </p>
            </>
          ) : (
            ""
          )}
          <button className="view-details" onClick={onclick}>
            Done
          </button>
        </div>
      </div>
    </>
  );
}
