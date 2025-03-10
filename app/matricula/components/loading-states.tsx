'use client'

import React from "react"

// This file contains loading state integration for heavy components

export function useLoadingState(initialState = false) {
  const [isLoading, setIsLoading] = React.useState(initialState)
  
  const startLoading = React.useCallback(() => {
    setIsLoading(true)
  }, [])
  
  const stopLoading = React.useCallback(() => {
    setIsLoading(false)
  }, [])
  
  return {
    isLoading,
    startLoading,
    stopLoading
  }
}

// Utility to simulate loading for demo purposes
export function useSimulatedLoading(duration = 1500) {
  const { isLoading, startLoading, stopLoading } = useLoadingState(true)
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      stopLoading()
    }, duration)
    
    return () => clearTimeout(timer)
  }, [duration, stopLoading])
  
  return { isLoading }
}
