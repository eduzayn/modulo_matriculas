'use client'

import React from "react"

interface SkeletonWrapperProps {
  isLoading: boolean
  skeleton: React.ReactNode
  children: React.ReactNode
}

export function SkeletonWrapper({ isLoading, skeleton, children }: SkeletonWrapperProps) {
  return isLoading ? <>{skeleton}</> : <>{children}</>
}
