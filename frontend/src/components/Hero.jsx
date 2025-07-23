const Hero = () => {
  const scrollToCategories = () => {
    window.scrollTo({
      top: window.innerHeight * 0.4,
      behavior: 'smooth'
    })
  }

  return (
    <div className="relative h-[50vh] overflow-visible">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('/pzo2.jpg')`
        }}
      />
      
      {/* Curved bottom edge */}
      <div className="absolute -bottom-1 left-0 right-0 h-8 bg-gray-50 rounded-t-[4rem] z-20"></div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-white px-6 max-w-lg">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Dobrodošli u
            <span className="block text-orange-400">TimeOut</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
            Vaš digitalni meni za nezaboravne trenutke
          </p>
          
          {/* Scroll indicator */}
          <div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer mb-4"
            onClick={scrollToCategories}
          >
            <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
