
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";
import { useTranslation, Trans } from "react-i18next";
import LanguageSwitcher from './components/LanguageSwitcher';

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t, i18n, ready } = useTranslation();

  // Add loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ready) {
      setLoading(false);
    }
  }, [ready]);

    const [formData, setFormData] = useState({
    fullname: "",
    
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("http://localhost:5000/api/contact", formData)
      alert(response.data.message)
      setFormData({ fullname: "", email: "", subject: "", message: "" })
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong!")
    }
  }

  const carouselImages = [
    "https://lsc.cornell.edu/wp-content/uploads/2021/07/k-g-g0905-achi-39404-lyj2328-1-tutoring.jpg",
    "https://lsc.cornell.edu/wp-content/uploads/2021/07/k-g-g0905-achi-39404-lyj2328-1-tutoring.jpg",
    "https://lsc.cornell.edu/wp-content/uploads/2021/07/k-g-g0905-achi-39404-lyj2328-1-tutoring.jpg",
    "https://lsc.cornell.edu/wp-content/uploads/2021/07/k-g-g0905-achi-39404-lyj2328-1-tutoring.jpg",
  ]

  const subjects = [
    t('subjects.math'),
    t('subjects.physics'),
    t('subjects.chemistry'),
    t('subjects.biology'),
    t('subjects.english'),
    t('subjects.history'),
    t('subjects.geography'),
    t('subjects.computerScience'),
    t('subjects.economics'),
    t('subjects.literature'),
    t('subjects.french'),
    t('subjects.german'),
    t('subjects.spanish'),
    t('subjects.art'),    
    t('subjects.etc')
  ]

  const tutors = [
    {
      name: "Alice Johnson",
      desc: "Expert in Mathematics and Physics with 10+ years of experience.",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4.9,
      students: 150,
    },
    {
      name: "Michael Smith",
      desc: "Dedicated English and Literature tutor with modern methods.",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.8,
      students: 120,
    },
    {
      name: "Sara Lee",
      desc: "Passionate about Computer Science and helping students succeed.",
      img: "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 5.0,
      students: 200,
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  const changeLanguage = async (lng) => {
    try {
      await i18n.changeLanguage(lng);
      localStorage.setItem('i18nextLng', lng);
    } catch (err) {
      console.error('Language change failed:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading translations...</div>;
  }
  
  return (
    <div className="home-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-brand">
            <span className="nav-icon">🎓</span>
            <span className="nav-title">{t('navbar.brand')}</span>
          </div>
          <div className="nav-buttons">
            <button className="btn btn-ghost" onClick={() => navigate("/main_login_form")}>
              {t('navbar.login')}
            </button>
            <button className="btn btn-primary" onClick={() => navigate("/main_register_form")}>
              {t('navbar.register')}
            </button>
            <select 
              onChange={(e) => changeLanguage(e.target.value)} 
              value={i18n.language}
              className="language-switcher"
            >
              <option value="en">EN</option>
              <option value="ka">KA</option>
            </select>
          </div>
        </div>
      </nav>

      {/* Hero Carousel Section */}
      <section className="hero-section">
        <div className="carousel-container">
          {carouselImages.map((img, index) => (
            <div key={index} className={`carousel-slide ${index === currentSlide ? "active" : ""}`}>
              <img src={img || "/placeholder.svg"} alt={`Slide ${index + 1}`} className="carousel-image" />
              <div className="carousel-overlay"></div>
            </div>
          ))}

          {/* Carousel Content Overlay */}
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                {t('hero.title')} <span className="gradient-text">{t('hero.title1')}</span>
              </h1>
              <p className="hero-description">{t('hero.description')}</p>
              <button className="btn btn-hero" onClick={() => navigate("/main_login_form")}>
                {t('hero.cta')}
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>

          {/* Carousel Controls */}
          <button onClick={prevSlide} className="carousel-btn carousel-prev">
            ‹
          </button>
          <button onClick={nextSlide} className="carousel-btn carousel-next">
            ›
          </button>

          {/* Carousel Indicators */}
          <div className="carousel-indicators">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`indicator ${index === currentSlide ? "active" : ""}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="subjects-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('subjects.title')}</h2>
            <p className="section-description">
              {t('subjects.description')}
            </p>
          </div>

          <div className="subjects-grid">
            {subjects.map((subject, index) => (
              <div key={index} className="subject-card" onClick={() => navigate("/main_login_form")}>
                <div className="subject-icon">📚</div>
                <h3 className="subject-title">{subject}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tutors Section */}
      <section className="tutors-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t("tutors.title")}</h2>
            <p className="section-description">
              {t("tutors.description")}
            </p>
          </div>

          <div className="tutors-grid">
            {tutors.map((tutor, index) => (
              <div key={index} className="tutor-card" onClick={() => navigate("/main_login_form")}>
                <div className="tutor-header">
                  <div className="tutor-avatar-container">
                    <img src={tutor.img || "/placeholder.svg"} alt={tutor.name} className="tutor-avatar" />
                    <div className="online-indicator"></div>
                  </div>
                  <h3 className="tutor-name">{tutor.name}</h3>
                </div>
                <div className="tutor-content">
                  <p className="tutor-description">{tutor.desc}</p>
                  <div className="tutor-stats">
                    <div className="tutor-rating">
                      <span className="star">⭐</span>
                      <span className="rating-value">{tutor.rating}</span>
                    </div>
                    <div className="tutor-students">{tutor.students} {t("tutors.students")}</div>
                  </div>
                  <button className="btn btn-primary btn-full">{t("tutors.viewProfile")}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-section">
        <div className="container">
          <h2 className="section-title">{t('tutors.aboutTutorfind')}</h2>
          <div className="about-content">
            <p className="about-text">
              {t('tutors.aboutDescription')}
            </p>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-number">10K+</div>
                <div className="stat-label">{t('tutors.activestudents')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎓</div>
                <div className="stat-number">500+</div>
                <div className="stat-label">{t('tutors.experttutors')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-number">4.9</div>
                <div className="stat-label">{t('tutors.averageRating')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="contact-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('contact.title')}</h2>
            <p className="section-description">{t('contact.description')}</p>
          </div>

          <div className="contact-card">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullname" className="form-label">
                    <span className="label-icon">👤</span>
                    {t('contact.fullName')}
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className="form-input"
                    placeholder={t('contact.fullNamePlaceholder')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    <span className="label-icon">✉️</span>
                    {t('contact.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder={t('contact.emailPlaceholder')}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">
                  <span className="label-icon">📄</span>
                  {t('contact.subject')}
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-input"
                  placeholder={t('contact.subjectPlaceholder')}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  <span className="label-icon">💬</span>
                  {t('contact.message')}
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="form-textarea"
                  placeholder={t('contact.messagePlaceholder')}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-large">
                {t('contact.submit')}
                <span className="btn-icon">📤</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-brand">
                <span className="footer-icon">🎓</span>
                <span className="footer-title">TutorFind</span>
              </div>
              <p className="footer-description">
                {t('footer.description')}</p>
            </div>
            <div className="footer-section">
              <h3 className="footer-heading">{t('footer.platform.platform')}</h3>
              <ul className="footer-links">
                <li>
                  <a href="#">{t('footer.platform.findTutor')}</a>
                </li>
                <li>
                  <a href="#">{t('footer.platform.becometutor')}</a>
                </li>
                <li>
                  <a href="#">{t('footer.platform.subject')}</a>
                </li>
                <li>
                  <a href="#">{t('footer.platform.pricing')}</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h3 className="footer-heading">{t('footer.Support.support')}</h3>
              <ul className="footer-links">
                <li>
                  <a href="#">{t('footer.Support.help')}</a>
                </li>
                <li>
                  <a href="#">{t('footer.Support.contact')}</a>
                </li>
                <li>
                  <a href="#">{t('footer.Support.safety')}</a>
                </li>
                <li>
                  <a href="#">{t('footer.Support.comunity')}</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h3 className="footer-heading">{t('footer.Company.company')}</h3>
              <ul className="footer-links">
                <li>
                  <a href="#">{t('footer.Company.about')}</a>
                </li>
                <li>
                  <a href="#">{t('footer.Company.careers')}</a>
                </li>
                <li>
                  <a href="#">{t('footer.Company.press')}</a>
                </li>
                <li>
                  <a href="#">{t('footer.Company.blog')}</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {t('footer.rigths')}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home

