import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CategoryList from './components/CategoryList'
import DrinksList from './components/DrinksList'
import Contact from './components/Contact'
import AdminApp from './admin/pages/AdminApp'
import './App.css'

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null)

  const handleCategorySelect = (category) => {
    console.log('Selected category:', category)
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

  return (
    <Router>
      <Routes>
        {/* Admin routes - bez navbar-a */}
        <Route path="/admin/*" element={<AdminApp />} />
        
        {/* Public routes - sa navbar-om */}
        <Route path="/*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </>
        } />
      </Routes>
    </Router>
  )
}

export default App
