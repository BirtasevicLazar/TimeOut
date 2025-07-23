const ContactHero = () => {
  return (
    <div className="relative h-[30vh] overflow-visible">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('/pzo2.jpg')`
        }}
      />
      
      {/* Curved bottom edge */}
      <div className="absolute -bottom-1 left-0 right-0 h-8 bg-gray-50 rounded-t-[4rem] z-20"></div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-white px-6 max-w-lg">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Kontakt
          </h1>
          <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
            Posetite nas ili nas kontaktirajte
          </p>
        </div>
      </div>
    </div>
  )
}

export default ContactHero
