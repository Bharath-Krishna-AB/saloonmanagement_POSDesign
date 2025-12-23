"use client"

import * as React from "react"
import { ArrowUpRight, X } from "lucide-react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { motion } from "framer-motion"

const MENU_ITEMS = [
    { number: "01", label: "DASHBOARD", href: "#" },
    { number: "02", label: "APPOINTMENTS", href: "#" },
    { number: "03", label: "CUSTOMERS", href: "#" },
    { number: "04", label: "SERVICES", href: "#" },
    { number: "05", label: "STAFF", href: "#" },
    { number: "06", label: "BILLING", href: "#" },
]

interface MobileMenuProps {
    isOpen: boolean
    onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const tl = React.useRef<gsap.core.Timeline | null>(null)

    useGSAP(() => {
        // Set initial state for container
        gsap.set(containerRef.current, { yPercent: -100 })

        // Batch set initial state for ALL arrows to ensure they are hidden
        gsap.set(".menu-arrow", {
            opacity: 0,
            scale: 0,
            x: -10,
            y: 10,
            transformOrigin: "bottom left"
        })

        // Setup hover animations for menu items
        const items = gsap.utils.toArray<HTMLElement>(".menu-item")
        items.forEach((item) => {
            const arrow = item.querySelector(".menu-arrow")
            const textWrapper = item.querySelector(".menu-text-wrapper")

            item.addEventListener("mouseenter", () => {
                // Arrow Reveal
                if (arrow) {
                    gsap.to(arrow, {
                        opacity: 1,
                        scale: 1,
                        x: 0,
                        y: 0,
                        duration: 0.4,
                        ease: "back.out(2)",
                        overwrite: "auto"
                    })
                }
                // Text Shift
                if (textWrapper) {
                    gsap.to(textWrapper, {
                        x: 10,
                        duration: 0.4,
                        ease: "power2.out",
                        overwrite: "auto"
                    })
                }
            })

            item.addEventListener("mouseleave", () => {
                // Arrow Hide
                if (arrow) {
                    gsap.to(arrow, {
                        opacity: 0,
                        scale: 0,
                        x: -10,
                        y: 10,
                        duration: 0.3,
                        ease: "power2.in",
                        overwrite: "auto"
                    })
                }
                // Text Reset
                if (textWrapper) {
                    gsap.to(textWrapper, {
                        x: 0,
                        duration: 0.3,
                        ease: "power2.out",
                        overwrite: "auto"
                    })
                }
            })
        })

        // Initialize entrance timeline paused
        tl.current = gsap.timeline({ paused: true })
            .to(containerRef.current, {
                yPercent: 0,
                duration: 0.6,
                ease: "power4.out",
            })
            .from(".menu-close-btn", {
                y: 50,
                opacity: 0,
                duration: 0.4,
                ease: "back.out(1.5)"
            }, "-=0.4")
            .from(".menu-item", {
                y: 50,
                opacity: 0,
                duration: 0.3,
                stagger: 0.04,
                ease: "power2.out",
            }, "-=0.5")
            .from(".menu-footer", {
                opacity: 0,
                y: 20,
                duration: 0.4,
            }, "-=0.3")

    }, { scope: containerRef })

    // Control Animation based on isOpen prop
    React.useEffect(() => {
        if (tl.current) {
            if (isOpen) {
                tl.current.play()
            } else {
                tl.current.reverse()
            }
        }
    }, [isOpen])

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[300] h-[100dvh] w-full flex flex-col overflow-hidden"
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-white " />

            {/* Header with Close Button */}
            <div className="relative z-20 flex justify-end items-center px-6 pt-4 pb-2 shrink-0">
                <motion.button
                    onClick={onClose}
                    className="menu-close-btn h-12 w-12 rounded-full bg-neutral-950 text-white flex items-center justify-center shadow-lg cursor-pointer"
                    whileHover="hover"
                    whileTap="tap"
                    variants={{
                        hover: { scale: 1.1 },
                        tap: { scale: 0.95 }
                    }}
                >
                    <motion.div
                        variants={{
                            hover: { rotate: 90 }
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <X className="w-6 h-6 text-white" />
                    </motion.div>
                </motion.button>
            </div>

            {/* Main Content Area - Flex Grow to take available space */}
            <div className="relative z-10 flex flex-col flex-1 px-6 min-h-0">

                {/* Menu Items - Distributed vertically to fill space */}
                <div className="flex flex-col justify-between flex-1 w-full max-w-7xl mx-auto py-2">
                    {MENU_ITEMS.map((item) => (
                        <div
                            key={item.label}
                            className="menu-item group flex items-center justify-between border-b border-neutral-300/40 py-1.5 sm:py-3 cursor-pointer transition-colors duration-200 px-2 -mx-2 rounded-lg"
                            onClick={onClose}
                        >
                            <div className="menu-text-wrapper flex items-baseline gap-3 md:gap-6">
                                <span className="text-xs md:text-sm font-medium text-neutral-400 font-mono w-5">
                                    {item.number}
                                </span>
                                <span className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-[#2A2A2A] uppercase leading-none">
                                    {item.label}
                                </span>
                            </div>
                            {/* opacity-0 added here to ensure hidden by default before GSAP loads */}
                            <div className="menu-arrow text-[#2A2A2A] opacity-0">
                                <ArrowUpRight className="w-8 h-8 md:w-12 md:h-12" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer - Pinned to bottom, minimal height */}
                <div className="menu-footer relative z-10 w-full max-w-7xl mx-auto py-4 flex items-center justify-between border-t border-neutral-300/40 shrink-0 mt-1">
                    <div className="text-[9px] sm:text-[10px] text-neutral-400 uppercase tracking-widest sm:block">
                        © CREXTIO 2025 ALL RIGHTS RESERVED
                    </div>
                </div>
            </div>
        </div>
    )
}
