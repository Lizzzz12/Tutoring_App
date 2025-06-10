import { useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import LanguageSwitcher from './components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const RegisterForm = () => {
  const { t } = useTranslation();
  const [userType, setUserType] = useState("Student")
  const [isLoading, setIsLoading] = useState(false)
  const [studentData, setStudentData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
  })

  const [teacherData, setTeacherData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    subject: "",
    price: "",
    img_url: "",
    availability: "",
    tutoring_location: "Online",
    username: "",
    password: "",
  })

  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("") // 'success' or 'error'

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value)
    setMessage("")
    setMessageType("")
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (userType === "Student") {
      setStudentData((prev) => ({ ...prev, [name]: value }))
    } else {
      setTeacherData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      if (userType === "Student") {
        const response = await axios.post("http://localhost:5000/api/student_register", studentData)
        if (response.data) {
          setMessage(t("register.successStudent") )
          setMessageType("success")
          setStudentData({ firstname: "", lastname: "", email: "", username: "", password: "" })
        }
      } else {
        const response = await axios.post("http://localhost:5000/api/register_teachers", teacherData)
        if (response.data.success) {
          setMessage(
            t("register.successTeacher")   
          )
          setMessageType("success")
          setTeacherData({
            firstname: "",
            lastname: "",
            email: "",
            phone: "",
            address: "",
            description: "",
            subject: "",
            price: "",
            img_url: "",
            availability: "",
            tutoring_location: "Online",
            username: "",
            password: "",
          })
        } else {
          setMessage(`Error: ${response.data.message}`)
          setMessageType("error")
        }
      }
    } catch (error) {
      console.error(error)
      setMessage(t("register.error") )
      setMessageType("error")
    } finally {
      setIsLoading(false)
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    outline: "none",
    fontFamily: "inherit",
    background: "white",
  }

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#374151",
    fontSize: "0.9rem",
  }

  const fieldContainerStyle = {
    marginBottom: "20px",
  }

  const handleInputFocus = (e) => {
    e.target.style.borderColor = "#667eea"
    e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)"
  }

  const handleInputBlur = (e) => {
    e.target.style.borderColor = "#e5e7eb"
    e.target.style.boxShadow = "none"
  }

  const renderInput = (label, name, type = "text", value, required = true, icon = "📝") => (
    <div style={fieldContainerStyle}>
      <label style={labelStyle}>
        <span style={{ marginRight: "8px" }}>{icon}</span>
        {label}
        {required && <span style={{ color: "#ef4444", marginLeft: "4px" }}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        style={inputStyle}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        required={required}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  )

  const renderTextarea = (label, name, value, icon = "📄") => (
    <div style={fieldContainerStyle}>
      <label style={labelStyle}>
        <span style={{ marginRight: "8px" }}>{icon}</span>
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={handleChange}
        style={{
          ...inputStyle,
          minHeight: "100px",
          resize: "vertical",
        }}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        rows="4"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  )

  const renderSelect = (label, name, value, options, icon = "📋") => (
    <div style={fieldContainerStyle}>
      <label style={labelStyle}>
        <span style={{ marginRight: "8px" }}>{icon}</span>
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={handleChange}
        style={inputStyle}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )

  const renderStudentForm = () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
      <div>
        {renderInput(t("register.firstName"), "firstname", "text", studentData.firstname, true, "👤")}
        {renderInput(t("register.email") , "email", "email", studentData.email, true, "✉️")}
        {renderInput(t("register.password") , "password", "password", studentData.password, true, "🔒")}
      </div>
      <div>
        {renderInput(t("register.lastName"), "lastname", "text", studentData.lastname, true, "👤")}
        {renderInput(t("register.username") , "username", "text", studentData.username, true, "🏷️")}
      </div>
    </div>
  )

  const renderTeacherForm = () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
      <div>
        {renderInput(t("register.firstName"), "firstname", "text", teacherData.firstname, true, "👤")}
        {renderInput(t("register.email") , "email", "email", teacherData.email, true, "✉️")}
        {renderInput(t("register.address")  , "address", "text", teacherData.address, false, "🏠")}
        {renderInput(t("register.subject") , "subject", "text", teacherData.subject, true, "📚")}
        {renderInput(t("register.imageUrl")  , "img_url", "text", teacherData.img_url, false, "🖼️")}
        {renderSelect(
          t("register.location") ,
          "tutoring_location",
          teacherData.tutoring_location,
          [
            { value: "Online", label: t("register.online")   },
            { value: "In Person", label: t("register.inPerson")  },
            { value: "Both", label: t("register.both")   },
          ],
          "📍",
        )}
        {renderInput(t("register.username") , "username", "text", teacherData.username, true, "🏷️")}
      </div>
      <div>
        {renderInput(t("register.lastName"), "lastname", "text", teacherData.lastname, true, "👤")}
        {renderInput(t("register.phone")   , "phone", "text", teacherData.phone, false, "📞")}
        {renderTextarea(t("register.description"), "description", teacherData.description, "📝")}
        {renderInput(t("register.price"), "price", "number", teacherData.price, false, "💰")}
        {renderInput(t("register.availability"), "availability", "text", teacherData.availability, false, "⏰")}
        {renderInput(t("register.password") , "password", "password", teacherData.password, true, "🔒")}
      </div>
    </div>
  )

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "40px 20px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          left: "5%",
          width: "300px",
          height: "300px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          filter: "blur(60px)",
          zIndex: 1,
        }}
      ></div>
      <LanguageSwitcher />
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          right: "5%",
          width: "400px",
          height: "400px",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "50%",
          filter: "blur(80px)",
          zIndex: 1,
        }}
      ></div>

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>{userType === "Student" ? "🎓" : "👨‍🏫"}</div>
          <h2
            style={{
              margin: "0 0 8px 0",
              fontSize: "2.5rem",
              fontWeight: "700",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t("register.welcome")}
          </h2>
          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "1.1rem",
            }}
          >
            {t("register.subtext") }
          </p>
        </div>

        {/* User Type Selection */}
        <div
          style={{
            marginBottom: "32px",
            padding: "24px",
            background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
            borderRadius: "16px",
            border: "1px solid #bae6fd",
          }}
        >
          <label style={labelStyle}>
            <span style={{ marginRight: "8px" }}>👥</span>
            {t("register.selectUserType")}
          </label>
          <select
            value={userType}
            onChange={handleUserTypeChange}
            style={{
              ...inputStyle,
              fontSize: "1.1rem",
              fontWeight: "600",
            }}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          >
            <option value="Student"> {t("register.studentOption") }</option>
            <option value="Teacher">{t("register.teacherOption")}</option>
          </select>
        </div>

        <form onSubmit={handleSubmit}>
          {userType === "Student" ? renderStudentForm() : renderTeacherForm()}

          {/* Submit Button */}
          <div style={{ marginTop: "32px" }}>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "16px 24px",
                background: isLoading
                  ? "linear-gradient(135deg, #9ca3af, #6b7280)"
                  : "linear-gradient(135deg, #667eea, #764ba2)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = "translateY(-2px)"
                  e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.4)"
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.3)"
                }
              }}
            >
              {isLoading ? (
                <>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      border: "2px solid rgba(255, 255, 255, 0.3)",
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  ></div>
                  Creating Account...
                </>
              ) : (
                <>{t("register.submitStudent") } {userType}</>
              )}
            </button>
          </div>
        </form>

        {/* Success/Error Message */}
        {message && (
          <div
            style={{
              marginTop: "24px",
              padding: "16px 20px",
              borderRadius: "12px",
              border: `1px solid ${messageType === "success" ? "#10b981" : "#f87171"}`,
              background:
                messageType === "success"
                  ? "linear-gradient(135deg, #d1fae5, #a7f3d0)"
                  : "linear-gradient(135deg, #fee2e2, #fecaca)",
              color: messageType === "success" ? "#065f46" : "#dc2626",
              display: "flex",
              alignItems: "center",
              fontSize: "0.95rem",
            }}
          >
            <span style={{ marginRight: "12px", fontSize: "1.2rem" }}>{messageType === "success" ? "✅" : "⚠️"}</span>
            {message}
          </div>
        )}

        {/* Navigation Links */}
        <div style={{ marginTop: "32px", display: "flex", gap: "16px" }}>
          <Link
            to="/main_login_form"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "12px 24px",
              background: "transparent",
              color: "#667eea",
              border: "2px solid #667eea",
              borderRadius: "12px",
              fontSize: "0.95rem",
              fontWeight: "500",
              textDecoration: "none",
              transition: "all 0.3s ease",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#667eea"
              e.target.style.color = "white"
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent"
              e.target.style.color = "#667eea"
            }}
          >
            {t("register.alreadyHaveAccount") }
          </Link>
          <Link
            to="/"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "12px 24px",
              background: "transparent",
              color: "#64748b",
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              fontSize: "0.95rem",
              fontWeight: "500",
              textDecoration: "none",
              transition: "all 0.3s ease",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "#667eea"
              e.target.style.color = "#667eea"
              e.target.style.background = "rgba(102, 126, 234, 0.05)"
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "#e5e7eb"
              e.target.style.color = "#64748b"
              e.target.style.background = "transparent"
            }}
          >
             {t("register.goBack")}
          </Link>
        </div>

        {/* Additional Info for Teachers */}
        {userType === "Teacher" && (
          <div
            style={{
              marginTop: "24px",
              padding: "20px",
              background: "linear-gradient(135deg, #fef3c7, #fde68a)",
              borderRadius: "12px",
              border: "1px solid #f59e0b",
              color: "#92400e",
              fontSize: "0.9rem",
              lineHeight: "1.6",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <span style={{ fontSize: "1.2rem" }}>💡</span>
              <div>
                <strong>{t("register.teacherNoteTitle") }</strong>
                <br />
               {t("register.teacherNoteText") }
                </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animation for loading spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @media (max-width: 768px) {
            .form-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  )
}

export default RegisterForm
