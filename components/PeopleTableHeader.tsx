"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
    ChevronDown,
    Search,
    Plus,
    SlidersHorizontal,
    Share,
    ChevronsUpDown
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface PeopleTableHeaderProps {
    userRole: string
    searchQuery: string
    onSearchChange: (query: string) => void
    onAddClick: () => void
    activeTab: string
}

export default function PeopleTableHeader({ userRole, searchQuery, onSearchChange, onAddClick, activeTab }: PeopleTableHeaderProps) {
    const columns = [
        "Name", "Time", "Total Rate", "Details", "Approve"
    ].filter(col => userRole === "Manager" || col !== "Approve")

    return (
        <div className="w-full flex flex-col">
            {/* 1️⃣ TOP FILTER / ACTION BAR */}
            <div className="flex flex-row items-center gap-4 px-6 py-5">

                {/* Left: Search Input (Stretched & Styled) */}
                <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                        <Search className="h-4 w-4" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full h-11 pl-11 pr-4 rounded-full bg-white border border-neutral-200 focus:ring-0 text-sm text-neutral-800 placeholder:text-neutral-400 outline-none transition-all hover:border-neutral-300"
                    />
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    {/* Plus Button - Hide in Completed tab */}
                    {activeTab !== 'Completed' && (
                        <Button
                            onClick={onAddClick}
                            className={cn(
                                "h-10 pl-4 pr-5 rounded-full bg-[#2A2A2A] text-white shadow-lg flex items-center gap-2 group border border-transparent",
                                "transition-all duration-300 ease-out", // Smooth physics-like motion
                                "hover:-translate-y-[2px] hover:shadow-xl", // ONLY motion, no opacity/color change
                                "active:translate-y-0 active:scale-95" // Click feedback
                            )}
                        >
                            <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                                <Plus className="h-4 w-4" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wide">Add Customer</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* 2️⃣ TABLE COLUMN HEADER ROW - HIDDEN ON MOBILE */}
            <div className={cn(
                "hidden md:grid gap-4 px-6 py-3 border-b border-dashed border-neutral-200/60 mt-2",
                userRole === "Manager"
                    ? "grid-cols-[3fr_2fr_1.5fr_1.5fr_1.5fr]"
                    : "grid-cols-[3fr_2fr_2fr_2fr]"
            )}>
                {/* Columns */}
                {columns.map((col) => (
                    <div key={col} className="text-[11px] font-medium text-neutral-400/80 uppercase tracking-widest flex items-center gap-1 cursor-pointer hover:text-neutral-500 transition-colors">
                        {col === "Approve" && userRole === "Manager"
                            ? (activeTab === 'Completed' ? "Revert" : "Approve")
                            : col}
                        <ChevronsUpDown className="h-3 w-3 opacity-50" />
                    </div>
                ))}
            </div>
        </div>
    )
}
