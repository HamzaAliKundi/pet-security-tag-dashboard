import React, { createContext, useContext, useEffect, useState } from 'react'

// Shipping prices by country
const SHIPPING_PRICES: Record<string, { amount: number; currency: string; symbol: string }> = {
  US: { amount: 10.49, currency: 'USD', symbol: '$' },
  CA: { amount: 16.99, currency: 'CAD', symbol: '$' },
  // European countries
  GB: { amount: 2.90, currency: 'GBP', symbol: '£' },
  DE: { amount: 2.90, currency: 'GBP', symbol: '£' },
  FR: { amount: 2.90, currency: 'GBP', symbol: '£' },
  IT: { amount: 2.90, currency: 'GBP', symbol: '£' },
  ES: { amount: 2.90, currency: 'GBP', symbol: '£' },
  NL: { amount: 2.90, currency: 'GBP', symbol: '£' },
  BE: { amount: 2.90, currency: 'GBP', symbol: '£' },
  AT: { amount: 2.90, currency: 'GBP', symbol: '£' },
  CH: { amount: 2.90, currency: 'GBP', symbol: '£' },
  SE: { amount: 2.90, currency: 'GBP', symbol: '£' },
  NO: { amount: 2.90, currency: 'GBP', symbol: '£' },
  DK: { amount: 2.90, currency: 'GBP', symbol: '£' },
  FI: { amount: 2.90, currency: 'GBP', symbol: '£' },
  IE: { amount: 2.90, currency: 'GBP', symbol: '£' },
  PT: { amount: 2.90, currency: 'GBP', symbol: '£' },
  PL: { amount: 2.90, currency: 'GBP', symbol: '£' },
  GR: { amount: 2.90, currency: 'GBP', symbol: '£' },
  CZ: { amount: 2.90, currency: 'GBP', symbol: '£' },
  HU: { amount: 2.90, currency: 'GBP', symbol: '£' },
  RO: { amount: 2.90, currency: 'GBP', symbol: '£' },
  BG: { amount: 2.90, currency: 'GBP', symbol: '£' },
  HR: { amount: 2.90, currency: 'GBP', symbol: '£' },
  SK: { amount: 2.90, currency: 'GBP', symbol: '£' },
  SI: { amount: 2.90, currency: 'GBP', symbol: '£' },
  EE: { amount: 2.90, currency: 'GBP', symbol: '£' },
  LV: { amount: 2.90, currency: 'GBP', symbol: '£' },
  LT: { amount: 2.90, currency: 'GBP', symbol: '£' },
  LU: { amount: 2.90, currency: 'GBP', symbol: '£' },
  MT: { amount: 2.90, currency: 'GBP', symbol: '£' },
  CY: { amount: 2.90, currency: 'GBP', symbol: '£' },
}

// Default shipping price (GBP)
const DEFAULT_SHIPPING = { amount: 2.90, currency: 'GBP', symbol: '£' }

// Tag prices by country
const TAG_PRICES: Record<string, { amount: number; currency: string; symbol: string }> = {
  US: { amount: 3.99, currency: 'USD', symbol: '$' },
  CA: { amount: 5.59, currency: 'CAD', symbol: '$' },
  // All other countries default to GBP
}

// Default tag price (GBP)
const DEFAULT_TAG_PRICE = { amount: 2.99, currency: 'GBP', symbol: '£' }

// Subscription prices by country
const SUBSCRIPTION_PRICES: Record<string, {
  monthly: { amount: number; currency: string; symbol: string };
  yearly: { amount: number; currency: string; symbol: string };
  lifetime: { amount: number; currency: string; symbol: string };
}> = {
  US: {
    monthly: { amount: 3.69, currency: 'USD', symbol: '$' },
    yearly: { amount: 37.99, currency: 'USD', symbol: '$' },
    lifetime: { amount: 169.99, currency: 'USD', symbol: '$' }
  },
  CA: {
    monthly: { amount: 5.11, currency: 'CAD', symbol: '$' },
    yearly: { amount: 53.99, currency: 'CAD', symbol: '$' },
    lifetime: { amount: 239.99, currency: 'CAD', symbol: '$' }
  }
}

// Default subscription prices (GBP)
const DEFAULT_SUBSCRIPTION_PRICES = {
  monthly: { amount: 2.75, currency: 'GBP', symbol: '£' },
  yearly: { amount: 28.99, currency: 'GBP', symbol: '£' },
  lifetime: { amount: 129.99, currency: 'GBP', symbol: '£' }
}

interface LocalizationContextType {
  shippingPrice: { amount: number; currency: string; symbol: string }
  tagPrice: { amount: number; currency: string; symbol: string }
  subscriptionPrices: {
    monthly: { amount: number; currency: string; symbol: string };
    yearly: { amount: number; currency: string; symbol: string };
    lifetime: { amount: number; currency: string; symbol: string };
  }
  isLocalizing: boolean
  userCountry: string | null
  getShippingPrice: () => { amount: number; currency: string; symbol: string }
  getTagPrice: () => { amount: number; currency: string; symbol: string }
  getSubscriptionPrices: () => {
    monthly: { amount: number; currency: string; symbol: string };
    yearly: { amount: number; currency: string; symbol: string };
    lifetime: { amount: number; currency: string; symbol: string };
  }
}

const LocalizationContext = createContext<LocalizationContextType>({
  shippingPrice: DEFAULT_SHIPPING,
  tagPrice: DEFAULT_TAG_PRICE,
  subscriptionPrices: DEFAULT_SUBSCRIPTION_PRICES,
  isLocalizing: false,
  userCountry: null,
  getShippingPrice: () => DEFAULT_SHIPPING,
  getTagPrice: () => DEFAULT_TAG_PRICE,
  getSubscriptionPrices: () => DEFAULT_SUBSCRIPTION_PRICES,
})

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shippingPrice, setShippingPrice] = useState(DEFAULT_SHIPPING)
  const [tagPrice, setTagPrice] = useState(DEFAULT_TAG_PRICE)
  const [subscriptionPrices, setSubscriptionPrices] = useState(DEFAULT_SUBSCRIPTION_PRICES)
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
          
          // Set tag price based on country
          const tag = TAG_PRICES[countryCode] || DEFAULT_TAG_PRICE
          setTagPrice(tag)
          
          // Set subscription prices based on country
          const subscription = SUBSCRIPTION_PRICES[countryCode] || DEFAULT_SUBSCRIPTION_PRICES
          setSubscriptionPrices(subscription)
        } else {
          // Fallback to default
          setShippingPrice(DEFAULT_SHIPPING)
          setTagPrice(DEFAULT_TAG_PRICE)
          setSubscriptionPrices(DEFAULT_SUBSCRIPTION_PRICES)
        }
      } catch (error) {
        console.error('Failed to detect country by IP:', error)
        if (!cancelled) {
          setShippingPrice(DEFAULT_SHIPPING)
          setTagPrice(DEFAULT_TAG_PRICE)
          setSubscriptionPrices(DEFAULT_SUBSCRIPTION_PRICES)
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

  const getTagPrice = () => {
    return tagPrice
  }

  const getSubscriptionPrices = () => {
    return subscriptionPrices
  }

  return (
    <LocalizationContext.Provider
      value={{
        shippingPrice,
        tagPrice,
        subscriptionPrices,
        isLocalizing,
        userCountry,
        getShippingPrice,
        getTagPrice,
        getSubscriptionPrices,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  )
}

export const useLocalization = () => useContext(LocalizationContext)


