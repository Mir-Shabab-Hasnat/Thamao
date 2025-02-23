"use client"

import React from "react";
import { ThemeToggle } from "./landing/ThemeToggle"

import Logo from "./Logo"
import CustomUserButton from "./CustomUserButton"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 mb-4 mt-3">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-8">
            
              <Logo size={3}/>
            
            
          </div>

          <div className="flex items-center gap-4">
            
            <ThemeToggle />
            <CustomUserButton />
          </div>
        </div>
      </div>
    </header>
  )
}