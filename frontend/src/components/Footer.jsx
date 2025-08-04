import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-sm text-gray-400">
            Developed by{' '}
            <a 
              href="mailto:lazar.birtasevic1@gmail.com"
              className="text-orange-400 hover:text-orange-300 transition-colors duration-200 font-medium"
            >
              Lazar Birtašević
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
