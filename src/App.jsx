import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Save form data to Firestore
    try {
      await addDoc(collection(db, 'formSubmissions'), {
        name: formData.name,
        email: formData.email,
        timestamp: serverTimestamp(), // Firestore auto-generates the timestamp
      });
      console.log('Form Data Submitted:', formData);
      setSubmitted(true);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">AI Solutions</div>
        <ul className="navbar-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#testimonials">Testimonials</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header id="home" className="hero-header">
        <div className="hero-text">
          <h1>Welcome to Our Webpage</h1>
          <p>Empowering businesses with cutting-edge AI technology</p>
        </div>
      </header>

      {/* Feature Cards */}
      <section id="features" className="cards-section">
        <h2>Our Features</h2>
        <div className="cards-container">
          <div className="card">
            <h3>AI Automation</h3>
            <p>Automate your processes with intelligent AI solutions for higher efficiency.</p>
          </div>
          <div className="card">
            <h3>Data Analytics</h3>
            <p>Leverage AI to gain deep insights into your data for smarter decision-making.</p>
          </div>
          <div className="card">
            <h3>AI Integration</h3>
            <p>Seamlessly integrate AI into your existing workflows and tools.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <h2>What Our Clients Say</h2>
        <div className="testimonials-container">
          <div className="testimonial-card">
            <p>"AI Solutions transformed the way we do business. The AI-powered automation saved us so much time and improved our efficiency!"</p>
            <p>- Sarah W., CEO of Tech Innovations</p>
          </div>
          <div className="testimonial-card">
            <p>"The integration of AI into our system was seamless. The team at AI Solutions supported us every step of the way!"</p>
            <p>- John M., CTO of FinTech Solutions</p>
          </div>
          <div className="testimonial-card">
            <p>"We were able to make data-driven decisions thanks to AI Solutions' powerful analytics tools. Highly recommend!"</p>
            <p>- Emily T., Marketing Director at Retail Corp</p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="contact" className="form-section">
        <h2>Get in Touch</h2>
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="name">Full Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="email">Email Address:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit">Submit</button>
          </form>
        ) : (
          <div className="thank-you-message">
            <p>Thank you for getting in touch! We'll get back to you shortly.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
