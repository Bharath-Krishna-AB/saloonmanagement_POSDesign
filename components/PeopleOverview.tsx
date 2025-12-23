"use client"

import * as React from "react"

import { motion } from "framer-motion"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import type { User } from "@/lib/types"

export default function PeopleOverview({ currentUser, activeTab, onTabChange }: { currentUser: User, activeTab: string, onTabChange: (tab: string) => void }) {
    const containerRef = React.useRef(null)
    // Removed local state

    // Animation for metrics bars
    useGSAP(() => {
        // Entrance animation for the whole section
        gsap.from(containerRef.current, {
            y: 8,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
        })

        // Button entrance animation
        gsap.from(".overview-btn", {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "back.out(1.7)",
            delay: 0.2
        })
    }, { scope: containerRef })

    return (
        <div
            ref={containerRef}
            className="w-full bg-transparent px-4 pb-8 flex justify-center"
        >
            <div className="w-full max-w-[1920px] px-6">
                {/* Page Title - User & Role */}
                <div className="flex flex-col gap-0 mb-6">
                    <h1 className="text-[62px] font-light text-neutral-800 tracking-tight leading-none">
                        {currentUser.name}
                    </h1>
                    <span className="text-sm font-bold text-neutral-400 uppercase tracking-[0.2em] pl-1">
                        {currentUser.role}
                    </span>
                </div>

                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
                    {/* Button Row (Interactive Tabs) */}
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 button-row">
                        {["Active", "Completed", "My Work"].map((tab) => {
                            const isActive = activeTab === tab
                            return (
                                <button
                                    key={tab}
                                    onClick={() => onTabChange(tab)}
                                    className={cn(
                                        "overview-btn relative h-12 px-8 rounded-full flex items-center justify-center font-medium shadow-sm transition-colors duration-200 outline-none",
                                        isActive ? "text-white" : "text-neutral-600 hover:text-neutral-900 bg-white/60 hover:bg-white/90 border border-transparent hover:border-neutral-200"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeOverviewTab"
                                            className="absolute inset-0 bg-[#000] rounded-full -z-10"
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 30
                                            }}
                                        />
                                    )}
                                    <span className="relative z-10">{tab}</span>
                                </button>
                            )
                        })}
                    </div>


                </div>
            </div>
        </div>
    )
}
