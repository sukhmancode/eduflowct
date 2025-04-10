import React from "react";
import "../styles/card.scss";
import Link from "next/link";

interface Props {
  secondaryHeading?: string;
  number?: number | string;
  secondary?: string;
  href?: string;
}
export default function Card({
  secondaryHeading,
  number,
  secondary,
  href,
}: Props) {
  return (
    <>
      <div className="card-container">
        <p className="card-secondary-heading">{secondaryHeading}</p>
        <p className="card-number ">
          <span>{number}</span>
          <span>{secondary}</span>
        </p>
        {href ? (
          <Link href={href}>
            <button className="view-details"> View Details </button>
          </Link>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
