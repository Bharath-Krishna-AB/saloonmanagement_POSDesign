"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: "default" | "destructive"
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "default"
}: ConfirmationModalProps) {
    // Prevent background scroll
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => { document.body.style.overflow = 'unset' }
    }, [isOpen])

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden"
                    >
                        <div className="p-6 flex flex-col items-center text-center">
                            {/* Icon */}
                            <div className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center mb-4",
                                variant === "destructive" ? "bg-red-50 text-red-500" : "bg-neutral-100 text-neutral-600"
                            )}>
                                <AlertTriangle className="w-6 h-6" />
                            </div>

                            <h3 className="text-lg font-bold text-neutral-900 mb-2">
                                {title}
                            </h3>
                            <p className="text-sm text-neutral-500 leading-relaxed mb-6">
                                {description}
                            </p>

                            <div className="flex gap-3 w-full">
                                <Button
                                    variant="ghost"
                                    onClick={onClose}
                                    className="flex-1 rounded-xl h-11 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                                >
                                    {cancelLabel}
                                </Button>
                                <Button
                                    onClick={() => {
                                        onConfirm()
                                        onClose()
                                    }}
                                    className={cn(
                                        "flex-1 rounded-xl h-11 text-white shadow-lg transition-all",
                                        variant === "destructive"
                                            ? "bg-red-500 hover:bg-red-600 shadow-red-500/20"
                                            : "bg-[#2A2A2A] hover:bg-[#2A2A2A]/90 shadow-neutral-900/20"
                                    )}
                                >
                                    {confirmLabel}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
