"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import html2canvas from "html2canvas-pro"

interface ResumePdfPreviewProps {
  isOpen: boolean
  onClose: () => void
  previewRef: React.RefObject<HTMLDivElement>
  fileName?: string
}

export function ResumePdfPreview({ isOpen, onClose, previewRef, fileName = "resume" }: ResumePdfPreviewProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const canvasContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && previewRef.current) {
      generatePreview()
    }
  }, [isOpen, previewRef])

  const generatePreview = async () => {
    if (!previewRef.current) return

    setLoading(true)
    try {
      // Capture the resume at A4 proportions
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, // High quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        imageTimeout: 0,
      })

      const image = canvas.toDataURL("image/png")
      setPreview(image)
    } catch (error) {
      console.error("Failed to generate preview:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPdf = async () => {
    // Trigger the existing PDF download from resume-export
    const downloadBtn = document.querySelector('button:has-text("Download PDF")')
    if (downloadBtn) {
      ;(downloadBtn as HTMLButtonElement).click()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            className={`relative z-10 rounded-2xl shadow-2xl flex flex-col overflow-hidden bg-white ${
              fullscreen ? "fixed inset-4" : "max-w-3xl mx-4"
            }`}
            initial={{ y: 60, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                📄 PDF Preview
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFullscreen(!fullscreen)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                  title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {fullscreen ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm12 2a1 1 0 100-2h-4a1 1 0 100 2h2.586l-2.293 2.293a1 1 0 101.414 1.414L15 6.414V8a1 1 0 100-2v-2zm2 6a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 110-2h2.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1zM7 12a1 1 0 100 2H4.414l2.293 2.293a1 1 0 11-1.414 1.414L5 13.586V14a1 1 0 01-2 0v-4a1 1 0 011-1h4z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 3a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm12 0a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13 6.414V4a1 1 0 011-1h4zM3 12a1 1 0 011 1v4a1 1 0 01-1 1H3v-4a1 1 0 011-1zm14 0a1 1 0 110 2h-4a1 1 0 110-2h4zm-8 2a1 1 0 100-2h4a1 1 0 100 2h-4z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                  title="Close preview"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
                  <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                  <p className="text-sm font-medium">Generating PDF preview...</p>
                </div>
              ) : preview ? (
                <div
                  ref={canvasContainerRef}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                  style={{
                    aspectRatio: "210 / 297", // A4 proportions
                    width: "100%",
                    maxWidth: fullscreen ? "none" : "500px",
                    maxHeight: fullscreen ? "none" : "700px",
                  }}
                >
                  <img
                    src={preview}
                    alt="PDF Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      backgroundColor: "white",
                    }}
                  />
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <p className="text-sm">No preview available</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-500">
                💡 This is a preview of your PDF. The actual download may differ slightly due to browser rendering differences.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={generatePreview}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  🔄 Refresh
                </button>
                <button
                  onClick={handleDownloadPdf}
                  className="px-5 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/25 transition-all duration-200"
                >
                  ⬇️ Download PDF
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
