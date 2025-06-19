"use client"
import React from 'react'
import { usePathname } from 'next/navigation'
import FloatingCart from './FloatingCart'

export default function LayoutWithCart({ children }) {
  const pathname = usePathname();
  return (
    <>
      {children}
      {!pathname.startsWith('/admin') && <FloatingCart />}
    </>
  );
}
