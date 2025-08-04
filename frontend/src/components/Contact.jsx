import ContactHero from './ContactHero'

const Contact = ({ isPartyContext = false }) => {
  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Adresa',
      info: 'Кнеза Милоша 10',
      subInfo: '35230 Ћуприја, Србија'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Telefon',
      info: '+381 11 123 4567',
      subInfo: 'Dostupni smo 24/7'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email',
      info: 'info@timeout.rs',
      subInfo: 'Odgovorićemo u roku od 24h'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Radno vreme',
      info: 'Pon - Ned: 08:00 - 02:00',
      subInfo: 'Kuhinja radi do 01:00'
    }
  ]

  const workingHours = [
    { day: 'Ponedeljak - Četvrtak', hours: '08:00 - 02:00' },
    { day: 'Petak - Subota', hours: '08:00 - 03:00' },
    { day: 'Nedelja', hours: '08:00 - 02:00' }
  ]

  return (
    <>
      <ContactHero />
      <div id="contact" className="min-h-screen bg-gray-50 pt-2 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Contact Grid */}
            <div className="mb-16">
              {/* Contact Information */}
              <div className="max-w-4xl mx-auto">
                <h3 className="text-3xl font-bold text-gray-800 mb-12 text-center">Kontakt informacije</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {contactInfo.map((contact, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-4">
                        {contact.icon}
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2 text-lg">{contact.title}</h4>
                      <p className="text-gray-900 font-medium mb-1">{contact.info}</p>
                      <p className="text-gray-600 text-sm">{contact.subInfo}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="text-center mb-16">
              <h3 className="text-2xl font-bold text-gray-800 mb-8">Pronađite nas</h3>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <iframe
                  src="https://maps.google.com/maps?q=Кнеза+Милоша+10,+Ћуприја+35230,+Србија&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="TimeOut Lokacija - Кнеза Милоша 10, Ћуприја"
                ></iframe>
              </div>
              <div className="mt-4 text-center">
                <p className="text-gray-600 font-medium">Кнеза Милоша 10, Ћуприја 35230, Србија</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Кнеза+Милоша+10,+Ћуприја+35230,+Србија"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-2 text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Otvori u Google Maps
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-8">Pratite nas na instagramu</h3>
              <div className="flex justify-center space-x-6">
                <a
                  href="https://www.instagram.com/timeoutloungebar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center hover:bg-orange-700 transition-colors duration-200 transform hover:scale-110"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contact
