"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { searchApplicant } from "@/app/actions"

export function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [interviewRef, setInterviewRef] = useState(searchParams.get("ref") || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (interviewRef.trim()) {
      router.push(`/?ref=${encodeURIComponent(interviewRef.trim())}`)
    }
    searchApplicant(interviewRef)
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="กรอกเลขประจำตัวผู้สมัคร (InterviewRef)"
            value={interviewRef}
            onChange={(e) => setInterviewRef(e.target.value)}
            className="pl-10 h-12 text-lg"
            required
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <Button
          type="submit"
          className="h-12 px-8 text-white font-medium shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
          style={{
            background: "linear-gradient(90deg, #f81a64 0, #f52222 50%, #ff691d 86%, #ffb623)",
            border: "none",
          }}
          disabled={isSubmitting || !interviewRef.trim()}
        >
          ค้นหา
        </Button>
      </div>
    </form>
  )
}
