import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 to-white">
      {/* Header/Navigation */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image 
              src="/om.png"
              alt="PanditJi Logo"
              width={24}
              height={24} 
            />
            <span className="text-2xl font-bold bg-linear-to-r from-[#FF9933] to-[#FF7722] bg-clip-text text-transparent">
              PanditJi
            </span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-700 hover:text-[#FF9933] font-semibold transition">Features</a>
            <a href="#rituals" className="text-gray-700 hover:text-[#FF9933] font-semibold transition">Rituals</a>
            <a href="#about" className="text-gray-700 hover:text-[#FF9933] font-semibold transition">About</a>
          </div>
          <button className="bg-linear-to-r from-[#FF9933] to-[#FF7722] text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition transform hover:scale-105">
            Download App
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-block">
                <span className="bg-orange-100 text-[#FF7722] px-4 py-2 rounded-full text-sm font-semibold">
                  🪔 Your Personal Spiritual Guide
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Perform Hindu Rituals{' '}
                <span className="bg-linear-to-r from-[#FF9933] to-[#FF7722] bg-clip-text text-transparent">
                  With Devotion
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Experience authentic Hindu pujas guided step-by-step. Learn mantras, understand rituals, and connect with your spiritual roots-all from your smartphone.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-linear-to-r from-[#FF9933] to-[#FF7722] text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition transform hover:scale-105 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  App Store
                </button>
                <button className="bg-white border-2 border-[#FF9933] text-[#FF9933] px-8 py-4 rounded-full font-semibold text-lg hover:bg-orange-50 transition flex items-center gap-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  Play Store
                </button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#FF9933]">50+</div>
                  <div className="text-sm text-gray-600">Rituals</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#FF9933]">100K+</div>
                  <div className="text-sm text-gray-600">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#FF9933]">4.8★</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              </div>
            </div>

            {/* Right - Mobile Mockup */}
            <div className="relative flex justify-center items-center">
              <div className="relative">
                {/* Phone Frame */}
                <div className="relative w-75 h-150">
                  {/* Phone Body */}
                  <div className="absolute inset-0 bg-linear-to-b from-gray-800 to-gray-900 rounded-[3rem] shadow-2xl p-3">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-3xl z-10"></div>
                    
                    {/* Screen */}
                    <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                      {/* App Screenshot Content */}
                      <div className="h-full bg-linear-to-b from-orange-50 to-white">
                        {/* Status Bar */}
                        <div className="px-6 pt-8 pb-4 flex justify-between text-xs">
                          <span>{new Date().toISOString().split("T")[1].substring(0, 5)}</span>
                        </div>

                        {/* App Content */}
                        <div className="px-6 space-y-4">
                          <h2 className="text-2xl font-bold text-gray-900">Today's Puja</h2>
                          
                          {/* Featured Ritual Card */}
                          <div className="bg-linear-to-br from-[#FF9933] to-[#FF7722] rounded-2xl p-6 text-white shadow-lg">
                            <div className="text-4xl mb-2">🪔</div>
                            <h3 className="font-bold text-lg mb-1">Morning Aarti</h3>
                            <p className="text-sm opacity-90 mb-3">Start your day with blessings</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs">15 mins</span>
                              <button className="bg-white text-[#FF9933] px-4 py-1.5 rounded-full text-sm font-semibold">
                                Begin →
                              </button>
                            </div>
                          </div>

                          {/* Ritual List */}
                          <div className="space-y-3">
                            <h3 className="font-semibold text-gray-700 text-sm">Popular Rituals</h3>
                            {[
                              { icon: '🙏', name: 'Ganesh Puja', time: '20 min' },
                              { icon: '🌺', name: 'Lakshmi Puja', time: '25 min' },
                              { icon: '🔱', name: 'Shiva Aarti', time: '15 min' }
                            ].map((ritual, i) => (
                              <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="text-2xl">{ritual.icon}</div>
                                  <div>
                                    <div className="font-semibold text-sm text-gray-900">{ritual.name}</div>
                                    <div className="text-xs text-gray-500">{ritual.time}</div>
                                  </div>
                                </div>
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Side Buttons */}
                  <div className="absolute -right-1 top-24 w-1 h-12 bg-gray-700 rounded-r"></div>
                  <div className="absolute -right-1 top-40 w-1 h-16 bg-gray-700 rounded-r"></div>
                  <div className="absolute -left-1 top-32 w-1 h-8 bg-gray-700 rounded-l"></div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-orange-200 rounded-full blur-2xl opacity-60"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-200 rounded-full blur-3xl opacity-40"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for{' '}
              <span className="bg-linear-to-r from-[#FF9933] to-[#FF7722] bg-clip-text text-transparent">
                Sacred Rituals
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Authentic guidance for every Hindu ritual, festival, and daily worship practice
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📖',
                title: 'Step-by-Step Guidance',
                description: 'Detailed instructions for every ritual, from preparation to completion'
              },
              {
                icon: '🎵',
                title: 'Audio Mantras',
                description: 'Listen to correct pronunciation and chant along with sacred mantras'
              },
              {
                icon: '📅',
                title: 'Festival Calendar',
                description: 'Never miss an auspicious day with personalized reminders'
              },
              {
                icon: '🌐',
                title: 'Multiple Languages',
                description: 'Available in Hindi, English, Sanskrit, and regional languages'
              },
              {
                icon: '📱',
                title: 'Offline Access',
                description: 'Download rituals and perform pujas without internet connection'
              },
              {
                icon: '👨‍👩‍👧',
                title: 'Family Sharing',
                description: 'Share your spiritual journey with family members'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-linear-to-br from-orange-50 to-white p-8 rounded-2xl border border-orange-100 hover:shadow-xl transition group">
                <div className="text-5xl mb-4 group-hover:scale-110 transition">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rituals Section */}
      <section id="rituals" className="py-20 bg-linear-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explore{' '}
              <span className="bg-linear-to-r from-[#FF9933] to-[#FF7722] bg-clip-text text-transparent">
                Sacred Rituals
              </span>
            </h2>
            <p className="text-xl text-gray-600">Complete guides for all Hindu pujas and ceremonies</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '🪔', name: 'Daily Aarti', count: '12 types' },
              { icon: '🙏', name: 'Deity Worship', count: '25 pujas' },
              { icon: '🎉', name: 'Festivals', count: '40+ festivals' },
              { icon: '💍', name: 'Weddings', count: '16 rituals' },
              { icon: '👶', name: 'Birth Ceremonies', count: '8 sanskar' },
              { icon: '🌾', name: 'Harvest & Seasonal', count: '10 occasions' },
              { icon: '🏠', name: 'Griha Pravesh', count: '5 ceremonies' },
              { icon: '🕉️', name: 'Special Pujas', count: '20+ types' }
            ].map((ritual, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-orange-100 hover:shadow-lg transition cursor-pointer group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition">{ritual.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{ritual.name}</h3>
                <p className="text-sm text-[#FF7722]">{ritual.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-[#FF9933] to-[#FF7722]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Begin Your Spiritual Journey Today
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of devotees performing authentic Hindu rituals with PanditJi
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-[#FF9933] px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition transform hover:scale-105">
              Download for iOS
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition">
              Download for Android
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image 
                  src="/om.png"
                  alt="PanditJi Logo"
                  width={24}
                  height={24} 
                />
                <span className="text-xl font-bold">PanditJi</span>
              </div>
              <p className="text-gray-400">Your personal guide to authentic Hindu rituals and spiritual practices.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Rituals</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-[#FF9933] transition">Daily Aarti</a></li>
                <li><a href="#" className="hover:text-[#FF9933] transition">Festival Pujas</a></li>
                <li><a href="#" className="hover:text-[#FF9933] transition">Special Occasions</a></li>
                <li><a href="#" className="hover:text-[#FF9933] transition">All Rituals</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-[#FF9933] transition">About Us</a></li>
                <li><a href="mailto:contact@webifo.com" className="hover:text-[#FF9933] transition">Contact</a></li>
                <li><a href="#" className="hover:text-[#FF9933] transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#FF9933] transition">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="https://facebook.com/webifo" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#FF9933] transition">
                  <span>f</span>
                </a>
                <a href="https://twitter.com/webifo" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#FF9933] transition">
                  <span>𝕏</span>
                </a>
                <a href="https://linkedin.com/company/webifo" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#FF9933] transition">
                  <span>in</span>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 PanditJi. All rights reserved. Made with devotion</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
