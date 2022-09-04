import React from "react";
import "./MainLayout.css";
import { generateInitials } from "../../../utils";

export default function MainLayout({ selectedUser }) {
  return (
    <section>
      <div className="top-section">
        {selectedUser?.photo ? (
          <img src={selectedUser.photo} className="user-info-photo" />
        ) : (
          <span>{generateInitials(selectedUser.name)}</span>
        )}
      </div>
      <div className="body-section"></div>
    </section>
  );
}
