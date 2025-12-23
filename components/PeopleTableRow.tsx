"use client"

// Imports for PeopleTableRow
import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RotateCcw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/types"
import { ServiceItem } from "./EditCustomerModal"

interface Person {
    id: string
    name: string
    employee?: string
    status?: string
    price?: number
    totalRate: string
    date?: string
    time?: string
    details?: {
        phone: string
        sex: string
    }
}

interface PeopleTableRowProps {
    person: Person
    isActive: boolean
    userRole: string | undefined
    activeTab: string
    customerServices?: ServiceItem[]
    onSelect: (id: string) => void
    onEdit: (person: Person) => void
    onApprove: (id: string) => void
    onRevert: (id: string) => void
}

export default function PeopleTableRow({
    person,
    isActive,
    userRole,
    activeTab,
    customerServices = [],
    onSelect,
    onEdit,
    onApprove,
    onRevert
}: PeopleTableRowProps) {
    const isReadyToApprove = customerServices.length > 0 && customerServices.every(s => s.status === 'Completed')

    return (
        <motion.div
            layout
            className={cn(
                "people-row rounded-xl cursor-pointer relative transition-all group mb-2 border",
                // Mobile: Flex Column (Card), Desktop: Grid
                "flex flex-col gap-3 p-4 md:gap-4 md:px-6 md:py-4 md:grid md:items-center",
                userRole === "Manager"
                    ? "md:grid-cols-[3fr_2fr_1.5fr_1.5fr_1.5fr]"
                    : "md:grid-cols-[3fr_2fr_2fr_2fr]",
                isActive
                    ? "bg-[#FFD75E] border-[#FFD75E] shadow-sm"
                    : "bg-white border-neutral-100 hover:border-neutral-200 hover:shadow-sm"
            )}
            onClick={() => onSelect(person.id)}
            whileHover={!isActive ? {
                scale: 1.002,
                boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                y: -1
            } : {}}
            transition={{ duration: 0.2 }}
        >
            {/* Name + Avatar (Mobile: Top Left) */}
            <div className="flex items-center gap-3 z-10 w-full md:w-auto">
                <Avatar className="h-10 w-10 border border-white/40 shadow-sm">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${person.id}`} />
                    <AvatarFallback className="bg-neutral-200 text-neutral-600 text-xs font-medium">
                        {person.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className={cn("font-medium text-base transition-colors duration-300", isActive ? "text-[#2A2A2A]" : "text-[#3A3A3A]")}>
                        {person.name}
                    </span>
                    <span className={cn("text-xs font-medium mt-0.5 transition-colors", isActive ? "text-[#2A2A2A]" : "text-neutral-500")}>
                        {person.details?.phone || "-"}
                    </span>
                </div>
            </div>

            {/* Mobile: Divider */}
            <div className="h-px bg-neutral-200/50 w-full md:hidden" />

            {/* Date/Time + Total Rate - Vertical Stack on Mobile */}
            <div className="flex justify-between items-center md:contents">
                {/* Date/Time */}
                {/* Time Only */}
                <div className={cn("text-sm font-medium transition-colors duration-300 flex flex-col md:block", isActive ? "text-[#2A2A2A]" : "text-neutral-600")}>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1 md:hidden">Time</span>
                    <span>
                        {person.time || "2:00 PM"}
                    </span>
                </div>

                {/* Total Rate */}
                <div className={cn("text-sm font-medium transition-colors duration-300 flex flex-col md:block text-right md:text-left", isActive ? "text-[#2A2A2A]" : "text-neutral-600")}>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1 md:hidden">Total</span>
                    {person.totalRate}
                </div>
            </div>

            {/* Mobile: Divider */}
            <div className="h-px bg-neutral-200/50 w-full md:hidden" />

            {/* Buttons Row (Mobile: Full Width) */}
            <div className="flex items-center justify-end gap-2 w-full md:contents">
                {/* Details Button */}
                <div className="flex items-center z-10">
                    <Button
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation()
                            onEdit(person)
                        }}
                        className={cn(
                            "h-9 px-4 rounded-full text-xs font-semibold uppercase tracking-wide transition-all duration-300 hover:shadow-sm border border-transparent flex-1 md:flex-none",
                            isActive ? "bg-white/80 text-[#2A2A2A] hover:bg-white" : "bg-neutral-100/50 text-neutral-600 hover:bg-white hover:border-neutral-200"
                        )}
                    >
                        Details
                    </Button>
                </div>

                {/* Approve Section - Only for Manager */}
                {userRole === "Manager" && (
                    <div className="flex items-center z-10">
                        {person.status === "Approved" || person.status === "Completed" ? (
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onRevert(person.id)
                                }}
                                className="h-9 px-4 rounded-full text-xs font-semibold uppercase tracking-wide transition-all duration-300 shadow-sm hover:shadow-md bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                            >
                                <RotateCcw className="w-3.5 h-3.5 md:mr-2" />
                                <span className="hidden md:inline">Revert</span>
                                <span className="md:hidden">Revert</span>
                            </Button>
                        ) : (
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onApprove(person.id)
                                }}
                                disabled={!isReadyToApprove}
                                title="All services must be completed before approval"
                                className={cn(
                                    "h-9 px-6 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-300",
                                    "disabled:bg-transparent disabled:border-2 disabled:border-dotted disabled:border-neutral-300 disabled:text-neutral-400 disabled:shadow-none disabled:cursor-not-allowed",
                                    "bg-[#2A2A2A] text-white hover:bg-black hover:shadow-md border border-transparent shadow-sm"
                                )}
                            >
                                Approve
                            </Button>
                        )}
                    </div>
                )}
            </div>

        </motion.div>
    )
}
