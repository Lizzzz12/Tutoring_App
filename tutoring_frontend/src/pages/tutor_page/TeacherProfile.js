import React, { useState, useEffect } from "react";
import "./TeacherProfile.css";

const TeacherProfile = () => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/teachers");
        if (!response.ok) {
          throw new Error("Failed to fetch teacher data");
        }
        const data = await response.json();

        // Find the first teacher with an img_url (or use a default if none exists)
        const teacherWithImage = data.data.rows.find((t) => t.img_url) || {
          img_url: "https://via.placeholder.com/150",
          firstname: "Teacher",
          lastname: "Name",
          description: "No description available",
        };

        setTeacher(teacherWithImage);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, []);

  if (loading) return <div className="page-wrapper">Loading...</div>;
  if (error) return <div className="page-wrapper">Error: {error}</div>;

  return (
    <div className="page-wrapper">
      {/* Tutor Profile Section */}
      <div className="profile-section">
        <div className="profile-content">
          <div className="profile-photo">
            {teacher?.img_url ? (
              <img
                src={teacher.img_url}
                alt={`${teacher.firstname} ${teacher.lastname}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />
            ) : (
              <span>Foto</span>
            )}
          </div>
          <p className="profile-text">
            {teacher?.description ||
              "Movami Profili: gadacxadebis sadac evseba tavis"}
          </p>
        </div>
      </div>

      {/* Entries Section */}
      <div className="entries-container">
        {/* First Entry */}
        <div className="entry">
          <div className="entry-content">
            <div className="entry-text">Gancxadeba</div>
            <div className="entry-actions">
              <button className="action-btn">+</button>
              <button className="action-btn">✗</button>
            </div>
          </div>
        </div>

        {/* Second Entry */}
        <div className="entry">
          <div className="entry-content">
            <div className="entry-text">Text</div>
            <div className="entry-actions">
              <button className="action-btn">+</button>
              <button className="action-btn">✗</button>
            </div>
          </div>
        </div>

        {/* Add New Entry Button */}
        <div className="add-btn">+ Add New Entry</div>
      </div>
    </div>
  );
};

export default TeacherProfile;
