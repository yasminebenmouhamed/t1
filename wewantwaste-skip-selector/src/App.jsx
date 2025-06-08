import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { AlertTriangle, Truck, Calendar, ArrowLeft, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

function App() {
  const [skips, setSkips] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSkip, setSelectedSkip] = useState(null)
  const [carouselIndex, setCarouselIndex] = useState(0)

  // Fetching API data
  useEffect(() => {
    const fetchSkips = async () => {
      try {
        const response = await fetch('https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft')
        const data = await response.json()
        setSkips(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchSkips()
  }, [])

  // Calculate total price including VAT
  const calculateTotalPrice = (priceBeforeVat, vat) => {
    return Math.round(priceBeforeVat * (1 + vat / 100))
  }

  // Handle skip selection
  const handleSelectSkip = (skip) => {
    setSelectedSkip(skip)
    console.log('Skip selected:', skip)
  }

  // Carousel navigation
  const goToNext = () => {
    setCarouselIndex((prevIndex) => (prevIndex + 1) % skips.length)
  }

  const goToPrev = () => {
    setCarouselIndex((prevIndex) => (prevIndex - 1 + skips.length) % skips.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen animated-gradient flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full pulse-glow"
        />
      </div>
    )
  }

  // Determine skips to display in carousel
  const displayedSkips = []
  if (skips.length > 0) {
    const prevIndex = (carouselIndex - 1 + skips.length) % skips.length
    const nextIndex = (carouselIndex + 1) % skips.length
    displayedSkips.push(skips[prevIndex])
    displayedSkips.push(skips[carouselIndex])
    displayedSkips.push(skips[nextIndex])
  }

  return (
    <div className="min-h-screen animated-gradient text-white">
      {/* Header with progress bar */}
      <header className="bg-gray-800/30 backdrop-blur-md border-b border-gray-700/50">
        <div className="container mx-auto px-4 py-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-6"
          >
            <h1 className="text-3xl font-bold text-green-400 float-animation">We Want Waste</h1>
          </motion.div>
          
          {/* Progress Bar */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center space-x-2 overflow-x-auto pb-2"
          >
            {[
              { step: 1, label: 'Postcode', icon: '📍', active: false, completed: true },
              { step: 2, label: 'Waste Type', icon: '🗑️', active: false, completed: true },
              { step: 3, label: 'Select Skip', icon: '🚛', active: true, completed: false },
              { step: 4, label: 'Permit Check', icon: '📋', active: false, completed: false },
              { step: 5, label: 'Choose Date', icon: '📅', active: false, completed: false },
              { step: 6, label: 'Payment', icon: '💳', active: false, completed: false },
            ].map((item, index) => (
              <motion.div 
                key={item.step} 
                className="flex items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div 
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-500 ${
                    item.active 
                      ? 'bg-green-400 text-black shadow-lg shadow-green-400/30' 
                      : item.completed 
                        ? 'bg-green-600 text-white shadow-lg shadow-green-600/30' 
                        : 'bg-gray-700/50 text-gray-300 backdrop-blur-sm'
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                </motion.div>
                {index < 5 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <ArrowRight className="w-5 h-5 text-gray-500 mx-3" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Choose Your Skip Size
          </motion.h2>
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Select the skip size that best suits your needs
          </motion.p>
        </motion.div>

        {/* Skip Carousel */}
        <div className="carousel-container relative w-full max-w-5xl mx-auto">
          <Button 
            onClick={goToPrev} 
            className="carousel-arrow left bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="carousel-wrapper flex justify-center items-center w-full">
            {displayedSkips.map((skip, index) => {
              const isCenter = index === 1; // The second element is the center
              return (
                <motion.div
                  key={skip.id}
                  className={`carousel-item ${isCenter ? 'center-item' : ''}`}
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: isCenter ? 1.1 : 1 }}
                  transition={{
                    duration: 0.5,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: isCenter ? -15 : -5, 
                    scale: isCenter ? 1.15 : 1.05,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Card className={`card-shine bg-gray-800/40 backdrop-blur-md border-gray-600/50 hover:border-green-400/70 transition-all duration-500 overflow-hidden ${
                    selectedSkip?.id === skip.id ? 'ring-2 ring-green-400 border-green-400 shadow-2xl shadow-green-400/20' : 'hover:shadow-2xl hover:shadow-gray-900/50'
                  }`}>
                    <CardHeader className="relative p-0">
                      {/* Skip Image */}
                      <motion.div 
                        className="h-56 bg-gradient-to-br from-green-400/20 via-green-500/15 to-green-600/20 flex items-center justify-center relative overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="absolute top-4 right-4 z-10">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                          >
                            <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-3 py-1 shadow-lg">
                              {skip.size} Yards
                            </Badge>
                          </motion.div>
                        </div>
                        
                        {/* Stylized skip icon with animation */}
                        <motion.div 
                          className="text-7xl text-green-400 group-hover:scale-110 transition-transform duration-500"
                          animate={{ 
                            y: [0, -5, 0],
                            rotate: [0, 2, -2, 0]
                          }}
                          transition={{ 
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          🚛
                        </motion.div>
                        
                        {/* "Not allowed on road" badge if applicable */}
                        {!skip.allowed_on_road && (
                          <motion.div 
                            className="absolute bottom-4 left-4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            <Badge variant="destructive" className="flex items-center space-x-1 shadow-lg">
                              <AlertTriangle className="w-3 h-3" />
                              <span className="text-xs font-medium">Not allowed on road</span>
                            </Badge>
                          </motion.div>
                        )}
                      </motion.div>
                    </CardHeader>
                    
                    <CardContent className="p-6 space-y-4">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <CardTitle className="text-2xl font-bold text-white mb-4">
                          Skip {skip.size} Yards
                        </CardTitle>
                      </motion.div>
                      
                      <motion.div 
                        className="space-y-3 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="flex items-center space-x-3 text-gray-300">
                          <Calendar className="w-5 h-5 text-green-400" />
                          <span className="text-sm font-medium">Hire period: {skip.hire_period_days} days</span>
                        </div>
                        
                        {skip.allows_heavy_waste && (
                          <div className="flex items-center space-x-3 text-gray-300">
                            <Truck className="w-5 h-5 text-green-400" />
                            <span className="text-sm font-medium">Heavy waste allowed</span>
                          </div>
                        )}
                      </motion.div>
                      
                      <motion.div 
                        className="mb-6"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, type: "spring" }}
                      >
                        <div className="text-4xl font-bold text-green-400 mb-2">
                          £{calculateTotalPrice(skip.price_before_vat, skip.vat)}
                        </div>
                        <div className="text-sm text-gray-400">
                          (£{skip.price_before_vat} ex VAT + {skip.vat}% VAT)
                        </div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <Button
                          onClick={() => handleSelectSkip(skip)}
                          className={`w-full font-bold py-4 text-lg transition-all duration-500 transform ${
                            selectedSkip?.id === skip.id 
                              ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30' 
                              : 'bg-green-400 hover:bg-green-500 text-black shadow-lg shadow-green-400/30 hover:shadow-green-400/50'
                          }`}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <motion.div className="flex items-center justify-center space-x-2">
                            {selectedSkip?.id === skip.id ? (
                              <>
                                <span>Selected</span>
                                <motion.div
                                  animate={{ x: [0, 5, 0] }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                >
                                  <ArrowRight className="w-5 h-5" />
                                </motion.div>
                              </>
                            ) : (
                              <>
                                <span>Select this skip</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                              </>
                            )}
                          </motion.div>
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
          <Button 
            onClick={goToNext} 
            className="carousel-arrow right bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg"
          >
            <ArrowRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Confirmation message if a skip is selected */}
        <AnimatePresence>
          {selectedSkip && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
              className="mt-16 flex justify-center"
            >
              <div className="bg-green-600/20 backdrop-blur-md border border-green-600/50 rounded-2xl p-8 max-w-md mx-auto shadow-2xl shadow-green-600/30 text-center">
                <motion.h3 
                  className="text-3xl font-bold text-green-400 mb-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Skip selected!
                </motion.h3>
                <motion.p 
                  className="text-lg text-gray-200 mb-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  You have chosen the {selectedSkip.size} Yards skip for £{calculateTotalPrice(selectedSkip.price_before_vat, selectedSkip.vat)}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  <Button className="w-full font-bold py-4 text-lg bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30">
                    Continue to next step
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App