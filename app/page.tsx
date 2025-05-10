"use client"

import { SearchForm } from "@/components/search-form"
import { ResultsDisplay } from "@/components/results-display"
import { useEffect, useState } from "react"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <main
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "radial-gradient(circle at center, #5a0060 0%, #3a0042 40%, #320038 100%)",
      }}
    >
      {/* Floating bubbles background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large slow-moving bubbles */}
        <div
          className="absolute h-64 w-64 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), rgba(255,255,255,0.1))",
            top: "10%",
            left: "5%",
            animation: "float 25s ease-in-out infinite, pulse 8s ease-in-out infinite",
          }}
        ></div>
        <div
          className="absolute h-96 w-96 rounded-full opacity-5"
          style={{
            background: "radial-gradient(circle at 40% 40%, rgba(255,255,255,0.4), rgba(255,255,255,0.1))",
            top: "60%",
            left: "60%",
            animation: "float 30s ease-in-out infinite, pulse 10s ease-in-out infinite",
            animationDelay: "2s",
          }}
        ></div>
        <div
          className="absolute h-80 w-80 rounded-full opacity-5"
          style={{
            background: "radial-gradient(circle at 60% 60%, rgba(255,255,255,0.3), rgba(255,255,255,0.1))",
            top: "30%",
            left: "70%",
            animation: "float 28s ease-in-out infinite, pulse 9s ease-in-out infinite",
            animationDelay: "5s",
          }}
        ></div>

        {/* Medium bubbles */}
        <div
          className="absolute h-40 w-40 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), rgba(255,255,255,0.1))",
            top: "70%",
            left: "20%",
            animation: "floatReverse 20s ease-in-out infinite, pulse 7s ease-in-out infinite",
            animationDelay: "1s",
          }}
        ></div>
        <div
          className="absolute h-32 w-32 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle at 40% 40%, rgba(255,255,255,0.4), rgba(255,255,255,0.1))",
            top: "40%",
            left: "30%",
            animation: "float 18s ease-in-out infinite, pulse 6s ease-in-out infinite",
            animationDelay: "3s",
          }}
        ></div>

        {/* Small bubbles */}
        <div
          className="absolute h-16 w-16 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), rgba(255,255,255,0.1))",
            top: "25%",
            left: "85%",
            animation: "floatFast 15s ease-in-out infinite, pulseFast 4s ease-in-out infinite",
          }}
        ></div>
        <div
          className="absolute h-12 w-12 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle at 40% 40%, rgba(255,255,255,0.5), rgba(255,255,255,0.1))",
            top: "80%",
            left: "40%",
            animation: "floatFast 12s ease-in-out infinite, pulseFast 3s ease-in-out infinite",
            animationDelay: "2s",
          }}
        ></div>
        <div
          className="absolute h-10 w-10 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle at 40% 40%, rgba(255,255,255,0.5), rgba(255,255,255,0.1))",
            top: "15%",
            left: "50%",
            animation: "floatFast 10s ease-in-out infinite, pulseFast 3s ease-in-out infinite",
            animationDelay: "4s",
          }}
        ></div>
        <div
          className="absolute h-8 w-8 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle at 40% 40%, rgba(255,255,255,0.5), rgba(255,255,255,0.1))",
            top: "60%",
            left: "10%",
            animation: "floatFast 8s ease-in-out infinite, pulseFast 2s ease-in-out infinite",
            animationDelay: "1s",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl relative z-10">
        <div
          className={`text-center mb-10 transition-all duration-1000 ${isLoaded ? "opacity-100 transform-none" : "opacity-0 translate-y-10"}`}
        >
          <div className="relative inline-block">
            <h1
              className="text-4xl md:text-5xl font-extrabold mb-6 text-transparent bg-clip-text relative z-10"
              style={{
                backgroundImage: "linear-gradient(90deg, #f81a64 0, #f52222 50%, #ff691d 86%, #ffb623)",
                textShadow: "0 0 20px rgba(248, 26, 100, 0.3), 0 0 40px rgba(255, 182, 35, 0.2)",
                animation: "textShine 3s ease-in-out infinite",
              }}
            >
              ระบบตรวจสอบผลการสมัคร YWC20
            </h1>
            <div
              className="absolute -inset-1 blur-xl opacity-30 rounded-lg z-0"
              style={{
                background: "linear-gradient(90deg, #f81a64 0, #f52222 50%, #ff691d 86%, #ffb623)",
                animation: "pulse 4s ease-in-out infinite",
              }}
            ></div>
          </div>

          <div className="relative inline-block mt-2">
            <p
              className="text-lg md:text-xl font-medium max-w-2xl mx-auto text-transparent bg-clip-text relative z-10"
              style={{
                backgroundImage: "linear-gradient(90deg, #f81a64 0, #f52222 50%, #ff691d 86%, #ffb623)",
                textShadow: "0 0 10px rgba(248, 26, 100, 0.2), 0 0 20px rgba(255, 182, 35, 0.1)",
              }}
            >
              กรอกเลขประจำตัวผู้สมัคร (InterviewRef) เพื่อตรวจสอบสถานะการสมัครของคุณ
            </p>
            <div
              className="absolute -inset-1 blur-lg opacity-20 rounded-lg z-0"
              style={{
                background: "linear-gradient(90deg, #f81a64 0, #f52222 50%, #ff691d 86%, #ffb623)",
              }}
            ></div>
          </div>
        </div>

        <div
          className={`bg-white/60 backdrop-blur-md rounded-xl shadow-lg p-6 md:p-8 border border-white/20 transition-all duration-1000 ${isLoaded ? "opacity-100 transform-none" : "opacity-0 translate-y-10"}`}
          style={{ transitionDelay: "200ms" }}
        >
          <SearchForm />
          <ResultsDisplay />
        </div>

        <footer
          className={`mt-12 text-center text-sm transition-all duration-1000 ${isLoaded ? "opacity-100 transform-none" : "opacity-0"}`}
          style={{ transitionDelay: "400ms" }}
        >
          <div className="relative inline-block">
            <p
              className="text-transparent bg-clip-text relative z-10"
              style={{
                backgroundImage: "linear-gradient(90deg, #f81a64 0, #f52222 50%, #ff691d 86%, #ffb623)",
                textShadow: "0 0 5px rgba(248, 26, 100, 0.2)",
              }}
            >
              © {new Date().getFullYear()} YWC20 - Young Webmaster Camp
            </p>
            <div
              className="absolute -inset-1 blur-md opacity-10 rounded-lg z-0"
              style={{
                background: "linear-gradient(90deg, #f81a64 0, #f52222 50%, #ff691d 86%, #ffb623)",
              }}
            ></div>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(0) translateX(20px);
          }
          75% {
            transform: translateY(20px) translateX(10px);
          }
        }
        
        @keyframes floatReverse {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(20px) translateX(-10px);
          }
          50% {
            transform: translateY(0) translateX(-20px);
          }
          75% {
            transform: translateY(-20px) translateX(-10px);
          }
        }
        
        @keyframes floatFast {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-15px) translateX(15px);
          }
          50% {
            transform: translateY(0) translateX(30px);
          }
          75% {
            transform: translateY(15px) translateX(15px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.05;
            transform: scale(1);
          }
          50% {
            opacity: 0.1;
            transform: scale(1.05);
          }
        }
        
        @keyframes pulseFast {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.15;
            transform: scale(1.1);
          }
        }
        
        @keyframes textShine {
          0%, 100% {
            text-shadow: 0 0 20px rgba(248, 26, 100, 0.3), 0 0 40px rgba(255, 182, 35, 0.2);
          }
          50% {
            text-shadow: 0 0 25px rgba(248, 26, 100, 0.4), 0 0 50px rgba(255, 182, 35, 0.3);
          }
        }
      `}</style>
    </main>
  )
}
