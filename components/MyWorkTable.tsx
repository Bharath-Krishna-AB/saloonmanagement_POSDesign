"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ChevronsUpDown, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import MyWorkRow, { ServiceItem } from "./MyWorkRow"
import type { User } from "@/lib/types"

interface PersonType {
    id: string
    name: string
    employee?: string
    status?: string
    price?: number
    totalRate: string
    details?: {
        phone: string
        sex: string
    }
}

interface MyWorkTableProps {
    currentUser: User
    people: PersonType[]
    customerServices: Record<string, ServiceItem[]>
    onEditCustomer: (person: PersonType) => void
    searchQuery: string
    onSearchChange: (query: string) => void
    onAddClick: () => void
    selectedId: string
    onSelect: (id: string) => void
}

export default function MyWorkTable({
    currentUser,
    people,
    customerServices,
    onEditCustomer,
    searchQuery,
    onSearchChange,
    onAddClick,
    selectedId,
    onSelect
}: MyWorkTableProps) {
    // Filter Logic:
    // 1. Employee is assigned to at least one service.
    // 2. Each row is one customer.
    // 3. Match Search Query

    const myWorkData = React.useMemo(() => {
        return people.filter(person => {
            const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase())
            const services = customerServices[person.id] || []
            // Check if ANY service is assigned to currentUser AND matches search
            return matchesSearch && services.some(s => s.employee === currentUser.name)
        }).map(person => {
            // Get only relevant services assigned to current user
            const myServices = (customerServices[person.id] || []).filter(s => s.employee === currentUser.name)
            return {
                person,
                services: myServices
            }
        })
    }, [people, customerServices, currentUser.name, searchQuery])

    return (
        <div className="w-full flex flex-col h-full bg-[#FAFAFA]/50 rounded-t-[32px] overflow-hidden">
            {/* 1️⃣ TOP FILTER / ACTION BAR */}
            <div className="flex flex-row items-center gap-4 px-6 py-5">
                {/* Left: Search Input */}
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
                </div>
            </div>

            {/* Header Row - HIDDEN ON MOBILE */}
            <div className="hidden md:grid grid-cols-[3fr_2fr_1.5fr_1fr_1fr] lg:grid-cols-[2.5fr_2fr_2fr_1.5fr_1fr] gap-4 px-6 py-3 border-b border-dashed border-neutral-200/60 mt-2">
                {["Customer", "Services", "Date", "Status", "Action"].map((col) => (
                    <div key={col} className={cn(
                        "text-[11px] font-medium text-neutral-400/80 uppercase tracking-widest flex items-center gap-1 cursor-pointer hover:text-neutral-500 transition-colors",
                        col === "Action" ? "justify-end pr-2" : "pl-2"
                    )}>
                        {col}
                        {col !== "Action" && <ChevronsUpDown className="h-3 w-3 opacity-50" />}
                    </div>
                ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {myWorkData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-neutral-400 opacity-60">
                        {/* Empty State Illustration or Icon */}
                        <div className="w-16 h-16 rounded-full bg-neutral-100 mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                            </svg>
                        </div>
                        <span className="text-sm font-medium">No customers found</span>
                        <p className="text-xs mt-1 max-w-[200px] text-center">Try adjusting your search or assign more services.</p>
                    </div>
                ) : (
                    myWorkData.map((item, idx) => (
                        <MyWorkRow
                            key={item.person.id}
                            person={item.person}
                            services={item.services}
                            index={idx}
                            onViewEdit={() => onEditCustomer(item.person)}
                            isActive={selectedId === item.person.id}
                            onSelect={() => onSelect(item.person.id)}
                        />
                    ))
                )}
            </div>
        </div>
    )
}
