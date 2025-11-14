import React, { createContext, useContext, useEffect, useState } from 'react'

// Shipping prices by country
const SHIPPING_PRICES: Record<string, { amount: number; currency: string; symbol: string }> = {
  US: { amount: 9.19, currency: 'USD', symbol: '$' },
  CA: { amount: 15.09, currency: 'CAD', symbol: '$' },
  // European countries
  GB: { amount: 2.90, currency: 'EUR', symbol: '€' },
  DE: { amount: 2.90, currency: 'EUR', symbol: '€' },
  FR: { amount: 2.90, currency: 'EUR', symbol: '€' },
  IT: { amount: 2.90, currency: 'EUR', symbol: '€' },
  ES: { amount: 2.90, currency: 'EUR', symbol: '€' },
  NL: { amount: 2.90, currency: 'EUR', symbol: '€' },
  BE: { amount: 2.90, currency: 'EUR', symbol: '€' },
  AT: { amount: 2.90, currency: 'EUR', symbol: '€' },
  CH: { amount: 2.90, currency: 'EUR', symbol: '€' },
  SE: { amount: 2.90, currency: 'EUR', symbol: '€' },
  NO: { amount: 2.90, currency: 'EUR', symbol: '€' },
  DK: { amount: 2.90, currency: 'EUR', symbol: '€' },
  FI: { amount: 2.90, currency: 'EUR', symbol: '€' },
  IE: { amount: 2.90, currency: 'EUR', symbol: '€' },
  PT: { amount: 2.90, currency: 'EUR', symbol: '€' },
  PL: { amount: 2.90, currency: 'EUR', symbol: '€' },
  GR: { amount: 2.90, currency: 'EUR', symbol: '€' },
  CZ: { amount: 2.90, currency: 'EUR', symbol: '€' },
  HU: { amount: 2.90, currency: 'EUR', symbol: '€' },
  RO: { amount: 2.90, currency: 'EUR', symbol: '€' },
  BG: { amount: 2.90, currency: 'EUR', symbol: '€' },
  HR: { amount: 2.90, currency: 'EUR', symbol: '€' },
  SK: { amount: 2.90, currency: 'EUR', symbol: '€' },
  SI: { amount: 2.90, currency: 'EUR', symbol: '€' },
  EE: { amount: 2.90, currency: 'EUR', symbol: '€' },
  LV: { amount: 2.90, currency: 'EUR', symbol: '€' },
  LT: { amount: 2.90, currency: 'EUR', symbol: '€' },
  LU: { amount: 2.90, currency: 'EUR', symbol: '€' },
  MT: { amount: 2.90, currency: 'EUR', symbol: '€' },
  CY: { amount: 2.90, currency: 'EUR', symbol: '€' },
}

// Default shipping price (EUR)
const DEFAULT_SHIPPING = { amount: 2.90, currency: 'EUR', symbol: '€' }

interface LocalizationContextType {
  shippingPrice: { amount: number; currency: string; symbol: string }
  isLocalizing: boolean
  userCountry: string | null
  getShippingPrice: () => { amount: number; currency: string; symbol: string }
}

const LocalizationContext = createContext<LocalizationContextType>({
  shippingPrice: DEFAULT_SHIPPING,
  isLocalizing: false,
  userCountry: null,
  getShippingPrice: () => DEFAULT_SHIPPING,
})

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shippingPrice, setShippingPrice] = useState(DEFAULT_SHIPPING)
  const [isLocalizing, setIsLocalizing] = useState(false)
  const [userCountry, setUserCountry] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    let cancelled = false

    const detectCountryByIP = async () => {
      try {
        setIsLocalizing(true)
        
        // Use ipapi.co for IP-based geolocation (free tier, no API key needed)
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()

        if (cancelled) return

        const countryCode = data?.country_code?.toUpperCase() || null

        if (countryCode) {
          setUserCountry(countryCode)
          
          // Set shipping price based on country
          const shipping = SHIPPING_PRICES[countryCode] || DEFAULT_SHIPPING
          setShippingPrice(shipping)
        } else {
          // Fallback to default
          setShippingPrice(DEFAULT_SHIPPING)
        }
      } catch (error) {
        console.error('Failed to detect country by IP:', error)
        if (!cancelled) {
          setShippingPrice(DEFAULT_SHIPPING)
        }
      } finally {
        if (!cancelled) {
          setIsLocalizing(false)
        }
      }
    }

    detectCountryByIP()

    return () => {
      cancelled = true
    }
  }, [])

  const getShippingPrice = () => {
    return shippingPrice
  }

  return (
    <LocalizationContext.Provider
      value={{
        shippingPrice,
        isLocalizing,
        userCountry,
        getShippingPrice,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  )
}

export const useLocalization = () => useContext(LocalizationContext)


