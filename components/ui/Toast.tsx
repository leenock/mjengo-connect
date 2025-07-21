"use client"
import { useEffect } from "react"
import { CheckCircle, XCircle, X, Loader2 } from "lucide-react"

interface ToastProps {
  message: string
  type: "success" | "error" | "loading"
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    // Don't auto-dismiss loading toasts
    if (type === "loading") return

    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [onClose, duration, type])

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      case "error":
        return "bg-red-50 border-red-200 text-red-800"
      case "loading":
        return "bg-blue-50 border-blue-200 text-blue-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "loading":
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
      default:
        return null
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg border max-w-md ${getToastStyles()}`}>
        <div className="flex-shrink-0">{getIcon()}</div>
        <p className="font-medium text-sm">{message}</p>
        {type !== "loading" && (
          <button
            onClick={onClose}
            className={`flex-shrink-0 ml-2 p-1 rounded-lg transition-colors ${
              type === "success"
                ? "hover:bg-green-100 text-green-600"
                : type === "error"
                  ? "hover:bg-red-100 text-red-600"
                  : "hover:bg-blue-100 text-blue-600"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
