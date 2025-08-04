import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import PartyNavbar from './components/PartyNavbar'
import Hero from './components/Hero'
import CategoryList from './components/CategoryList'
import DrinksList from './components/DrinksList'
import PartyCategories from './components/PartyCategories'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AdminApp from './admin/pages/AdminApp'
import ScrollToTop from './components/ScrollToTop'
import useScrollToTop from './hooks/useScrollToTop'
import './App.css'

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null)

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
  }

  const handleBackToCategories = () => {
    setSelectedCategory(null)
  }

  const HomePage = () => (
    <>
      <Hero />
      {selectedCategory ? (
        <DrinksList 
          categoryId={selectedCategory.id}
          categoryName={selectedCategory.name}
          onBack={handleBackToCategories}
        />
      ) : (
        <CategoryList onCategorySelect={handleCategorySelect} />
      )}
    </>
  )

  const ContactPage = () => (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Contact />
      </main>
      <Footer />
    </div>
  )

  const PartyContactPage = () => (
    <div className="min-h-screen flex flex-col">
      <PartyNavbar />
      <main className="flex-1">
        <Contact isPartyContext={true} />
      </main>
      <Footer />
    </div>
  )

  const PublicRoutes = () => {
    useScrollToTop() // Hook će automatski skrolovati na vrh pri promeni rute
    
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Admin routes - bez navbar-a */}
        <Route path="/admin/*" element={<AdminApp />} />
        
        {/* Public routes - sa navbar-om */}
        <Route path="/" element={<PublicRoutes />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/contact/party" element={<PartyContactPage />} />
        
        {/* Party routes - sa party navbar-om */}
        <Route path="/party" element={<PartyCategories />} />
      </Routes>
    </Router>
  )
}

export default App
