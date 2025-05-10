"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { searchApplicant } from "@/app/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Globe,
  X,
  ExternalLink,
  Download,
  ZoomIn,
  ZoomOut,
  Printer,
  Share2,
  Mail,
  Github,
  Linkedin,
  Facebook,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"

type ApplicantData = {
  name: string
  status: string
  major?: string
  interviewDate?: string
  interviewLocation?: string
  additionalInfo?: string
  resumeUrl?: string
  portfolioUrl?: string
  portfolioImages?: string[] 
  contact?: {
    facebook?: string
    email?: string
    github?: string
    linkedin?: string
  }
}

export function ResultsDisplay() {
  const searchParams = useSearchParams()
  const interviewRef = searchParams.get("ref")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [applicantData, setApplicantData] = useState<ApplicantData | null>(null)
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [pdfLoading, setPdfLoading] = useState(true)
  const [pdfError, setPdfError] = useState(false)
  const [pdfViewerType, setPdfViewerType] = useState<"google" | "pdfjs" | "browser">("google")
  const [pdfScale, setPdfScale] = useState(1.0)
  const pdfContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchData() {
      if (!interviewRef) return

      setIsLoading(true)
      setError(null)

      try {
        const data = await searchApplicant(interviewRef)

        // เพิ่มรูปภาพตัวอย่างสำหรับ portfolio (ในสถานการณ์จริงข้อมูลนี้จะมาจาก API)
        if (data && data.portfolioUrl && !(data as any).portfolioImages) {
          (data as any).portfolioImages = [
            "/1.jpg", "/2.jpg", "/3.jpg", "/4.jpg", "/5.jpg",
            "/6.jpg", "/7.jpg", "/8.jpg", "/9.jpg", "/10.jpg",
            "/11.jpg", "/12.jpg", "/13.jpg", "/14.jpg", "/15.jpg",
            "/16.jpg", "/17.jpg", "/18.jpg"
          ];
        }

        setApplicantData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการค้นหาข้อมูล")
        setApplicantData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [interviewRef])

  // Reset PDF loading state when modal opens
  useEffect(() => {
    if (isResumeModalOpen) {
      setPdfLoading(true)
      setPdfError(false)
      setPdfScale(1.0)
    }
  }, [isResumeModalOpen])

  // Function to handle PDF viewer errors and switch to fallback
  const handlePdfError = () => {
    setPdfError(true)
    setPdfLoading(false)

    // Try next viewer type
    if (pdfViewerType === "google") {
      setPdfViewerType("pdfjs")
    } else if (pdfViewerType === "pdfjs") {
      setPdfViewerType("browser")
    }
  }

  // Function to handle PDF loading success
  const handlePdfLoad = () => {
    setPdfLoading(false)
    setPdfError(false)
  }

  // Function to zoom in/out PDF
  const handleZoom = (zoomIn: boolean) => {
    setPdfScale((prevScale) => {
      const newScale = zoomIn ? prevScale + 0.2 : prevScale - 0.2
      return Math.max(0.5, Math.min(2.5, newScale)) // Limit scale between 0.5 and 2.5
    })
  }

  // Function to print PDF
  const handlePrintPdf = () => {
    const iframe = document.getElementById("pdf-iframe") as HTMLIFrameElement
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.focus()
      iframe.contentWindow.print()
    } else if (applicantData?.resumeUrl) {
      // Fallback: open in new window and print
      const printWindow = window.open(applicantData.resumeUrl, "_blank")
      if (printWindow) {
        printWindow.addEventListener("load", () => {
          printWindow.print()
        })
      }
    }
  }

  // Function to share PDF
  const handleSharePdf = () => {
    if (navigator.share && applicantData?.resumeUrl) {
      navigator
        .share({
          title: `Resume ของ ${applicantData.name}`,
          url: applicantData.resumeUrl,
        })
        .catch((err) => console.error("Error sharing:", err))
    } else if (applicantData?.resumeUrl) {
      // Fallback: copy to clipboard
      navigator.clipboard
        .writeText(applicantData.resumeUrl)
        .then(() => alert("ลิงก์ถูกคัดลอกไปยังคลิปบอร์ดแล้ว"))
        .catch((err) => console.error("Error copying to clipboard:", err))
    }
  }

  // Get appropriate PDF viewer URL based on current viewer type
  const getPdfViewerUrl = () => {
    if (!applicantData?.resumeUrl) return ""

    switch (pdfViewerType) {
      case "google":
        return `https://drive.google.com/file/d/1RuioNCkiu0fruahD2R8YboImbY1SXot9/view?usp=sharing`
      case "pdfjs":
        return `https://drive.google.com/file/d/1RuioNCkiu0fruahD2R8YboImbY1SXot9/view?usp=sharing`
      case "browser":
        return applicantData.resumeUrl
      default:
        return applicantData.resumeUrl
    }
  }

  if (!interviewRef) {
    return <div className="text-center py-8 text-gray-500">กรุณากรอกเลขประจำตัวผู้สมัครเพื่อค้นหาข้อมูล</div>
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>เกิดข้อผิดพลาด</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!applicantData) {
    return (
      <Alert variant="destructive" className="my-4">
        <XCircle className="h-4 w-4" />
        <AlertTitle>ไม่พบข้อมูล</AlertTitle>
        <AlertDescription>ไม่พบข้อมูลผู้สมัครที่ตรงกับเลขประจำตัว "{interviewRef}" กรุณาตรวจสอบเลขประจำตัวอีกครั้ง</AlertDescription>
      </Alert>
    )
  }

  // ข้อมูลติดต่อตัวอย่าง (ในสถานการณ์จริงข้อมูลนี้จะมาจาก API)
  const contactInfo = {
    facebook: "https://www.facebook.com/chaiyapol.wongsuwan.1/",
    email: "tenda2526@gmail.com",
    github: "https://github.com/Temda",
    linkedin: "https://www.linkedin.com/in/chaiyapol/",
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-gray-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <StatusIcon status={applicantData.status} />
            <span>ผลการค้นหา</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoItem label="เลขประจำตัว" value={interviewRef} />
              <InfoItem label="ชื่อ-นามสกุล" value={applicantData.name} />
              <InfoItem label="สถานะ" value={getStatusText(applicantData.status)} />
            </div>

            {applicantData.major && <InfoItem label="สาขา" value={applicantData.major} />}

            {applicantData.interviewDate && <InfoItem label="วันสัมภาษณ์" value={applicantData.interviewDate} />}

            {applicantData.interviewLocation && (
              <InfoItem label="สถานที่สัมภาษณ์" value={applicantData.interviewLocation} />
            )}

            {applicantData.additionalInfo && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">ข้อมูลเพิ่มเติม</h3>
                <p className="text-gray-700">{applicantData.additionalInfo}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Card */}
      <Card className="overflow-hidden border-t-4" style={{ borderTopColor: "#6366f1" }}>
        <CardHeader className="bg-gray-50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-indigo-600"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>ช่องทางการติดต่อ</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-wrap justify-center gap-8">
            {/* Facebook */}
            <a
              href={contactInfo.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center transition-transform hover:scale-110"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 p-3 shadow-md transition-all group-hover:shadow-lg">
                <Facebook className="h-10 w-10 text-blue-600" />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700">Facebook</span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${contactInfo.email}`}
              className="group flex flex-col items-center transition-transform hover:scale-110"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 p-3 shadow-md transition-all group-hover:shadow-lg">
                <Mail className="h-10 w-10 text-red-600" />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700">Email</span>
            </a>

            {/* GitHub */}
            <a
              href={contactInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center transition-transform hover:scale-110"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 p-3 shadow-md transition-all group-hover:shadow-lg">
                <Github className="h-10 w-10 text-gray-800" />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700">GitHub</span>
            </a>

            {/* LinkedIn */}
            <a
              href={contactInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center transition-transform hover:scale-110"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 p-3 shadow-md transition-all group-hover:shadow-lg">
                <Linkedin className="h-10 w-10 text-blue-700" />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700">LinkedIn</span>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Resume Card */}
      {applicantData.resumeUrl && (
        <>
          <Card className="overflow-hidden border-t-4" style={{ borderTopColor: "#f81a64" }}>
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-pink-600" />
                <span>Resume</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <p className="text-gray-700 mb-2">ประวัติและเอกสารสมัครงานของผู้สมัคร</p>
                  <p className="text-sm text-gray-500">
                    อัพเดทล่าสุด:{" "}
                    {new Date().toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
                <Button
                  className="shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105"
                  style={{
                    background: "linear-gradient(90deg, #f81a64 0, #f52222 50%)",
                    border: "none",
                  }}
                  onClick={() => setIsResumeModalOpen(true)}
                >
                  <FileText className="mr-2 h-4 w-4" /> ดูเอกสาร Resume
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Resume PDF Modal */}
          <Dialog open={isResumeModalOpen} onOpenChange={setIsResumeModalOpen}>
            <DialogContent className="max-w-5xl w-[90vw] max-h-[90vh] p-0 overflow-hidden">
              <DialogHeader className="p-6 pb-2">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl flex items-center gap-2">
                    <FileText className="h-5 w-5 text-pink-600" />
                    Resume: {applicantData.name}
                  </DialogTitle>
                  <DialogClose className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-100">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </DialogClose>
                </div>
                <DialogDescription className="text-sm text-gray-500 mt-1">
                  อัพเดทล่าสุด:{" "}
                  {new Date().toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}
                </DialogDescription>
              </DialogHeader>

              <div className="px-6 pb-6">
                {/* PDF Viewer Controls */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleZoom(true)}
                      disabled={pdfLoading || pdfError}
                    >
                      <ZoomIn className="h-4 w-4" />
                      <span className="sr-only">Zoom In</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleZoom(false)}
                      disabled={pdfLoading || pdfError}
                    >
                      <ZoomOut className="h-4 w-4" />
                      <span className="sr-only">Zoom Out</span>
                    </Button>
                    <span className="text-sm text-gray-500">{Math.round(pdfScale * 100)}%</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handlePrintPdf} disabled={pdfLoading || pdfError}>
                      <Printer className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">พิมพ์</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleSharePdf} disabled={pdfLoading || pdfError}>
                      <Share2 className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">แชร์</span>
                    </Button>
                  </div>
                </div>

                {/* PDF Viewer Container */}
                <div
                  ref={pdfContainerRef}
                  className="bg-gray-100 rounded-lg overflow-hidden h-[65vh] w-full relative"
                  style={{
                    transform: pdfViewerType === "browser" ? `scale(${pdfScale})` : "none",
                    transformOrigin: "center top",
                  }}
                >
                  {/* Loading Indicator */}
                  {pdfLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-t-pink-600 border-r-pink-600 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-600">กำลังโหลด PDF...</p>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {pdfError && pdfViewerType === "browser" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                      <div className="flex flex-col items-center text-center p-6">
                        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่สามารถแสดงไฟล์ PDF ได้</h3>
                        <p className="text-gray-600 mb-4">เบราว์เซอร์ของคุณอาจไม่รองรับการแสดงไฟล์ PDF โดยตรง</p>
                        <Button
                          onClick={() => window.open(applicantData.resumeUrl, "_blank")}
                          className="shadow-md"
                          style={{
                            background: "linear-gradient(90deg, #f81a64 0, #f52222 50%)",
                            border: "none",
                          }}
                        >
                          <Download className="mr-2 h-4 w-4" /> ดาวน์โหลด PDF
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* PDF Viewer iframe */}
                  <iframe
                    id="pdf-iframe"
                    src={getPdfViewerUrl()}
                    className="w-full h-full"
                    style={{
                      transform: pdfViewerType !== "browser" ? `scale(${pdfScale})` : "none",
                      transformOrigin: "center top",
                    }}
                    title={`Resume ของ ${applicantData.name}`}
                    frameBorder="0"
                    onLoad={handlePdfLoad}
                    onError={handlePdfError}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
                  ></iframe>
                </div>

                {/* Bottom Controls */}
                <div className="flex justify-end mt-4 gap-2">
                  <Button variant="outline" onClick={() => setIsResumeModalOpen(false)}>
                    ปิด
                  </Button>
                  <Button
                    className="shadow-md transition-all duration-300 hover:shadow-lg"
                    style={{
                      background: "linear-gradient(90deg, #f81a64 0, #f52222 50%)",
                      border: "none",
                    }}
                    onClick={() => window.open(applicantData.resumeUrl, "_blank")}
                  >
                    <Download className="mr-2 h-4 w-4" /> ดาวน์โหลด PDF
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* Portfolio Card */}
      {applicantData.portfolioUrl && (
        <>
          <Card className="overflow-hidden border-t-4" style={{ borderTopColor: "#ff691d" }}>
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-5 w-5 text-orange-500" />
                <span>Portfolio</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <p className="text-gray-700 mb-2">ผลงานและโปรเจกต์ที่ผ่านมาของผู้สมัคร</p>
                  <p className="text-sm text-gray-500">สามารถเข้าชมผลงานได้ผ่านลิงก์ด้านล่าง</p>
                </div>
                <Button
                  className="shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105"
                  style={{
                    background: "linear-gradient(90deg, #ff691d 0, #ffb623 100%)",
                    border: "none",
                  }}
                  onClick={() => setIsPortfolioModalOpen(true)}
                >
                  <Globe className="mr-2 h-4 w-4" /> ดูผลงาน Portfolio
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Gallery Modal */}
          <Dialog open={isPortfolioModalOpen} onOpenChange={setIsPortfolioModalOpen}>
            <DialogContent className="max-w-5xl w-[90vw] max-h-[90vh] p-0 overflow-hidden">
              <DialogHeader className="p-6 pb-2">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl flex items-center gap-2">
                    <Globe className="h-5 w-5 text-orange-500" />
                    Portfolio: {applicantData.name}
                  </DialogTitle>
                  <DialogClose className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-100">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </DialogClose>
                </div>
                <DialogDescription className="text-sm text-gray-500 mt-1">
                  ผลงานและโปรเจกต์ที่ผ่านมาของผู้สมัคร
                </DialogDescription>
              </DialogHeader>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* ถ้ามีรูปที่เลือกไว้ แสดงรูปขนาดใหญ่ */}
                {selectedImage ? (
                  <div className="mb-6">
                    <div className="relative">
                      <img
                        src={selectedImage || "/placeholder.svg"}
                        alt="Portfolio image"
                        className="w-full h-auto rounded-lg shadow-lg"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        onClick={() => setSelectedImage(null)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  // แสดงกริดรูปภาพทั้งหมด
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {applicantData.portfolioImages?.map((image, index) => (
                      <div
                        key={index}
                        className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                        onClick={() => setSelectedImage(image)}
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Portfolio image ${index + 1}`}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <span className="text-white font-medium px-3 py-1 rounded-full bg-black/50">ดูเต็มจอ</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setIsPortfolioModalOpen(false)}>
                    ปิด
                  </Button>
                  <Button
                    className="shadow-md transition-all duration-300 hover:shadow-lg"
                    style={{
                      background: "linear-gradient(90deg, #ff691d 0, #ffb623 100%)",
                      border: "none",
                    }}
                    onClick={() => window.open(applicantData.portfolioUrl, "_blank")}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" /> เยี่ยมชมเว็บไซต์ Portfolio
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}

function StatusIcon({ status }: { status: string }) {
  if (status === "passed") {
    return <CheckCircle2 className="h-5 w-5 text-green-500" />
  } else if (status === "failed") {
    return <XCircle className="h-5 w-5 text-red-500" />
  } else {
    return <AlertCircle className="h-5 w-5 text-yellow-500" />
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case "passed":
      return "ผ่านการคัดเลือก"
    case "failed":
      return "ไม่ผ่านการคัดเลือก"
    case "pending":
      return "รอผลการพิจารณา"
    default:
      return status
  }
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-gray-900">{value}</p>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-full" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-full" />
      </div>
    </div>
  )
}
