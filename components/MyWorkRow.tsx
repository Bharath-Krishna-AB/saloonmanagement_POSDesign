"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Pen } from "lucide-react"

// Types reused from EditCustomerModal.tsx or defined locally if necessary
export interface ServiceItem {
    id: string
    name: string
    employee: string
    status: "Ongoing" | "Completed"
    price?: number
}

interface Person {
    id: string
    name: string
    details?: {
        phone: string
        sex: string
    }
}

interface MyWorkRowProps {
    person: Person
    services: ServiceItem[]
    onViewEdit: (id: string) => void
    index: number
    isActive: boolean
    onSelect: () => void
}

export default function MyWorkRow({ person, services, onViewEdit, index, isActive, onSelect }: MyWorkRowProps) {
    const isCompleted = services.length > 0 && services.every(s => s.status === "Completed")
    const status = isCompleted ? "Completed" : "Ongoing"

    // Sort services: Ongoing first
    const sortedServices = [...services].sort((a, b) => {
        if (a.status === b.status) return 0
        return a.status === "Ongoing" ? -1 : 1
    })

    const visibleServices = sortedServices.slice(0, 2)
    const remainingCount = sortedServices.length - 2

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={!isActive ? {
                scale: 1.002,
                boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                y: -1
            } : {}}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            onClick={onSelect}
            className={cn(
                // Base: Flex Col (Mobile) - Grid (Desktop)
                "flex flex-col gap-3 p-4 md:grid md:grid-cols-[3fr_2fr_1.5fr_1fr_1fr] lg:md:grid-cols-[2.5fr_2fr_2fr_1.5fr_1fr] md:gap-4 md:px-6 md:py-4 md:items-center",
                "rounded-xl transition-all items-center group mb-2 border cursor-pointer",
                isActive
                    ? "bg-[#FFD75E] border-[#FFD75E] shadow-sm"
                    : "bg-white border-neutral-100 hover:border-neutral-200 hover:shadow-sm"
            )}
        >
            {/* Top Row (Mobile): Customer + Status */}
            <div className="flex justify-between items-center w-full md:contents">
                {/* Customer */}
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-neutral-100 shadow-sm">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${person.id}`} />
                        <AvatarFallback className="bg-neutral-100 text-neutral-600 text-xs font-bold">
                            {person.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className={cn("font-bold text-sm leading-tight transition-colors", isActive ? "text-[#2A2A2A]" : "text-neutral-900")}>
                            {person.name}
                        </span>
                        <span className={cn("text-xs font-medium mt-0.5 transition-colors", isActive ? "text-[#2A2A2A]" : "text-neutral-500")}>
                            {person.details?.phone || "No Phone"}
                        </span>
                    </div>
                </div>

                {/* Status (Mobile Only - moved from right side) */}
                <div className="md:hidden">
                    <span className={cn(
                        "inline-flex px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        status === "Ongoing" ? "bg-[#FFF9E5] text-[#B45309]" : "bg-neutral-100 text-neutral-600"
                    )}>
                        {status}
                    </span>
                </div>
            </div>

            {/* Mobile: Divider */}
            <div className="h-px bg-neutral-200/50 w-full md:hidden" />

            {/* Services (Pills) - Mobile: Full Width wrap */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mr-1 md:hidden">Services:</span>
                {visibleServices.length > 0 ? (
                    visibleServices.map(s => (
                        <span
                            key={s.id}
                            className={cn(
                                "inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border",
                                s.status === "Ongoing"
                                    ? "bg-amber-50 text-amber-700 border-amber-100"
                                    : "bg-neutral-50 text-neutral-500 border-neutral-100"
                            )}
                        >
                            {s.name}
                        </span>
                    ))
                ) : (
                    <span className="text-xs text-neutral-400 italic">No active services</span>
                )}
                {remainingCount > 0 && (
                    <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-50 px-2 py-1 rounded-md border border-neutral-100">
                        +{remainingCount} more
                    </span>
                )}
            </div>

            {/* Bottom Row (Mobile): Date/Time + Action */}
            <div className="flex justify-between items-center w-full md:contents">

                {/* Date/Time (Mock for now, or assume "Today") */}
                {/* Time Only */}
                <div className={cn("text-sm font-medium transition-colors flex items-center", isActive ? "text-[#2A2A2A]" : "text-neutral-600")}>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mr-2 md:hidden">Time:</span>
                    <span className={cn("text-sm transition-colors", isActive ? "text-[#2A2A2A]" : "text-neutral-600")}>2:00 PM</span>
                </div>

                {/* Status (Desktop Only) */}
                <div className="hidden md:block">
                    <span className={cn(
                        "inline-flex px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider",
                        status === "Ongoing" ? "bg-[#FFF9E5] text-[#B45309]" : "bg-neutral-100 text-neutral-600"
                    )}>
                        {status}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex justify-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation()
                            onViewEdit(person.id)
                        }}
                        className={cn(
                            "h-8 rounded-lg gap-2 text-xs font-semibold hover:shadow-sm",
                            isActive
                                ? "text-[#2A2A2A] hover:bg-white/50"
                                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                        )}
                    >
                        <Pen className="w-3.5 h-3.5" />
                        Edit
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
