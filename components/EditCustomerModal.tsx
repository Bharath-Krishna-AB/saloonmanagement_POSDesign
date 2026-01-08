"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Trash2, ChevronDown, Search, Check, User as UserIcon, Clock, Calendar, RotateCcw, Camera, Sparkles, Timer, Pen } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import ConfirmationModal from "./ConfirmationModal"

// --- Types ---
import type { User, ServiceItem } from "@/lib/types"


interface EditCustomerModalProps {
    isOpen: boolean
    onClose: () => void
    customer: {
        id: string
        name: string
    } | null
    initialServices: ServiceItem[]
    onSave: (services: ServiceItem[], customerData?: any) => void
    mode?: 'edit' | 'create'
    currentUser?: User
    staffAvailability?: Record<string, Date>
}

// --- Mock Data ---

import { USERS, CATEGORIES, MOCK_CATALOG } from "@/lib/data"

// Derive STAFF_LIST directly in component or just use USERS
const MOCK_STAFF = USERS.map((u, i) => ({
    id: `staff-${i}`,
    name: u.name,
    role: u.role.toUpperCase(),
    image: u.avatar
}))

// --- Sub-Components ---

// Helper: Floating Label Input
interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
}

function FloatingInput({ label, value, className, ...props }: FloatingInputProps) {
    const [isFocused, setIsFocused] = React.useState(false)
    const hasValue = value && String(value).length > 0

    return (
        <div className="relative group">
            <input
                {...props}
                value={value}
                onFocus={(e) => { setIsFocused(true); props.onFocus?.(e) }}
                onBlur={(e) => { setIsFocused(false); props.onBlur?.(e) }}
                className={cn(
                    "w-full bg-white border-2 border-neutral-100 rounded-2xl px-5 pt-6 pb-2 text-base font-bold text-neutral-900 outline-none transition-all duration-300",
                    "focus:border-[#2A2A2A] focus:shadow-lg placeholder:opacity-0",
                    className
                )}
                placeholder={label} // Native placeholder hidden by opacity, used for accessibility
            />
            <label
                className={cn(
                    "absolute left-5 transition-all duration-300 pointer-events-none font-bold uppercase tracking-wider",
                    (isFocused || hasValue)
                        ? "top-3 text-[10px] text-neutral-400"
                        : "top-1/2 -translate-y-1/2 text-xs text-neutral-400 group-hover:text-neutral-500"
                )}
            >
                {label}
            </label>
        </div>
    )
}

// 0. Basic Details Section (Revamped with Photo Upload)
interface BasicDetailsSectionProps {
    onNext: (data: { name: string, phone: string, sex: string, avatar?: string }) => void
    onClose: () => void
}

function BasicDetailsSection({ onNext, onClose }: BasicDetailsSectionProps) {
    const [name, setName] = React.useState("")
    const [phone, setPhone] = React.useState("")
    const [sex, setSex] = React.useState("Female")
    const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null)

    const containerRef = React.useRef<HTMLDivElement>(null)
    const avatarRef = React.useRef<HTMLDivElement>(null)
    const formRef = React.useRef<HTMLDivElement>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

        // Avatar Pop
        tl.fromTo(avatarRef.current,
            { scale: 0.5, opacity: 0, y: 20 },
            { scale: 1, opacity: 1, y: 0, duration: 0.6 }
        )
            // Form Stagger
            .fromTo(formRef.current?.children ? Array.from(formRef.current.children) : [],
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.1, duration: 0.5 },
                "-=0.3"
            )
    }, { scope: containerRef })

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (/^\d*$/.test(value) && value.length <= 10) {
            setPhone(value)
        }
    }

    const isValidPhone = phone.length === 10

    return (
        <div ref={containerRef} className="absolute inset-0 bg-[#FDfAf5] z-[70] flex flex-col p-8 rounded-t-[32px] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-2 shrink-0">
                <h2 className="text-2xl font-black text-neutral-900 tracking-tight">New Customer</h2>
                <Button variant="ghost" onClick={onClose} size="icon" className="rounded-full hover:bg-neutral-100"><X className="w-6 h-6 text-neutral-500" /></Button>
            </div>

            <div className="flex-1 flex flex-col overflow-y-auto pb-4">
                {/* Avatar */}
                <div className="flex justify-center py-6 shrink-0">
                    <div
                        ref={avatarRef}
                        className="relative group cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {/* Pulse Effect */}
                        <div className="absolute inset-0 bg-[#2A2A2A]/10 rounded-full scale-110 animate-pulse group-hover:scale-125 transition-transform duration-500" />

                        <div className="relative w-28 h-28 rounded-full bg-white border-2 border-dashed border-neutral-300 flex items-center justify-center group-hover:border-[#2A2A2A] transition-colors overflow-hidden shadow-sm">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-10 h-10 text-neutral-300 group-hover:text-[#2A2A2A] transition-colors duration-300" />
                            )}
                        </div>

                        <div className="absolute bottom-0 right-0 w-9 h-9 bg-[#2A2A2A] rounded-full flex items-center justify-center text-white border-4 border-[#FDfAf5] shadow-md group-hover:scale-110 transition-transform">
                            <Camera className="w-4 h-4" />
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileSelect}
                        />
                    </div>
                </div>

                {/* Form */}
                <div ref={formRef} className="space-y-6 flex-1 px-1">
                    <FloatingInput
                        label="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <div className="space-y-1">
                        <FloatingInput
                            label="Phone Number"
                            value={phone}
                            onChange={handlePhoneChange}
                            type="tel"
                            maxLength={10}
                        />
                        {phone.length > 0 && phone.length < 10 && (
                            <p className="text-[10px] text-red-500 font-bold ml-2">Must be 10 digits</p>
                        )}
                    </div>

                    {/* Gender Segmented Control */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 ml-2">Gender</label>
                        <div className="flex bg-white rounded-2xl p-1.5 border border-neutral-200/60 shadow-sm relative isolate">
                            {["Female", "Male", "Other"].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setSex(s)}
                                    className="relative flex-1 py-3 text-sm font-bold z-10 transition-colors duration-300"
                                    style={{ color: sex === s ? '#fff' : '#737373' }}
                                >
                                    {s}
                                    {sex === s && (
                                        <motion.div
                                            layoutId="gender-blob"
                                            className="absolute inset-0 bg-[#2A2A2A] rounded-xl -z-10 shadow-md"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="pt-4 shrink-0">
                <Button
                    onClick={() => onNext({ name, phone, sex, avatar: avatarPreview || undefined })}
                    disabled={!name || !isValidPhone}
                    className="w-full h-14 rounded-2xl bg-[#2A2A2A] text-white text-lg font-bold shadow-xl shadow-[#2A2A2A]/20 transition-all hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                >
                    Continue
                </Button>
            </div>
        </div>
    )
}

// 1. Assign Staff Section

interface AssignStaffSectionProps {
    onBack: () => void
    onConfirm: (staff: typeof MOCK_STAFF[0]) => void
    selectedServicesCount: number
    reassignServiceName?: string
    staffAvailability?: Record<string, Date>
}

function AssignStaffSection({ onBack, onConfirm, selectedServicesCount, reassignServiceName, staffAvailability }: AssignStaffSectionProps) {
    const sectionRef = React.useRef<HTMLDivElement>(null)
    const [selectedStaffId, setSelectedStaffId] = React.useState<string | null>(null)
    const [filter, setFilter] = React.useState<"Available" | "All">("Available")

    // Live Update for Availability
    const [now, setNow] = React.useState(new Date())

    React.useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date())
        }, 10000) // Update every 10s for responsiveness
        return () => clearInterval(interval)
    }, [])

    useGSAP(() => {
        gsap.fromTo(sectionRef.current,
            { x: "100%", opacity: 0.5 },
            { x: "0%", opacity: 1, duration: 0.4, ease: "power3.out" }
        )
    }, { scope: sectionRef })

    const filteredStaff = MOCK_STAFF.map(staff => {
        const busyUntil = staffAvailability?.[staff.name]
        // Check relative to live 'now' state
        const isBusy = busyUntil && busyUntil > now

        return {
            ...staff,
            status: isBusy ? "Busy" : "Available",
            nextAvailable: isBusy ? busyUntil?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : undefined,
            rawBusyUntil: busyUntil // for sorting if needed
        }
    }).filter(staff => {
        if (filter === "Available") return staff.status === "Available"
        return true
    })

    return (
        <div ref={sectionRef} className="absolute inset-0 bg-[#FDfAf5] z-[60] flex flex-col overflow-hidden rounded-t-[32px]">
            {/* Header */}
            <div className="pt-6 px-6 pb-4 bg-white/50 border-b border-neutral-100 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-neutral-900">{reassignServiceName ? "Reassign Staff" : "Assign Staff"}</h2>
                        <span className="text-xs text-neutral-500 font-medium">
                            {reassignServiceName ? `For ${reassignServiceName}` : `For ${selectedServicesCount} selected services`}
                        </span>
                    </div>
                    <div className="flex bg-neutral-100 rounded-full p-1">
                        {(["Available", "All"] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                                    filter === f ? "bg-white shadow-sm text-neutral-900" : "text-neutral-400 hover:text-neutral-600"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Staff Grid */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#F6F5F0]/30">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-20">
                    {filteredStaff.map((staff) => {
                        const isAvailable = staff.status === "Available"
                        const isSelected = selectedStaffId === staff.id

                        return (
                            <div
                                key={staff.id}
                                onClick={() => !(!isAvailable) && setSelectedStaffId(staff.id)} // Prevent selection if busy
                                className={cn(
                                    "relative p-4 rounded-2xl border flex items-center gap-4 transition-all duration-300 group",
                                    !isAvailable ? "cursor-not-allowed opacity-60 bg-neutral-50" : "cursor-pointer",
                                    isSelected
                                        ? "bg-white border-[#2A2A2A] shadow-lg scale-[1.02]"
                                        : (isAvailable ? "bg-white border-neutral-100 hover:border-neutral-300 hover:shadow-md" : "border-transparent"),
                                )}
                            >
                                <div className="relative">
                                    <Avatar className={cn("h-14 w-14 border-2 shadow-sm", isSelected ? "border-[#2A2A2A]" : "border-white")}>
                                        <AvatarImage src={staff.image} />
                                        <AvatarFallback>{staff.name.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div className={cn(
                                        "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center",
                                        isAvailable ? "bg-emerald-500" : "bg-neutral-400"
                                    )}>
                                        {isAvailable ? (
                                            <Check className="w-3 h-3 text-white" />
                                        ) : (
                                            <Clock className="w-3 h-3 text-white" />
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col flex-1">
                                    <div className="flex justify-between items-start">
                                        <span className={cn("font-bold text-base leading-tight", isSelected ? "text-neutral-900" : "text-neutral-700")}>
                                            {staff.name}
                                        </span>
                                    </div>
                                    <span className="text-xs text-neutral-500 font-medium">{staff.role}</span>
                                    {!isAvailable && staff.nextAvailable && (
                                        <span className="text-[10px] bg-neutral-200/50 text-neutral-600 px-2 py-0.5 rounded-full w-fit mt-1.5 font-semibold">
                                            Free at {staff.nextAvailable}
                                        </span>
                                    )}
                                </div>

                                {isSelected && (
                                    <div className="absolute top-4 right-4 text-[#2A2A2A]">
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                            <div className="w-5 h-5 rounded-full bg-[#2A2A2A] flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        </motion.div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-neutral-200 flex items-center gap-3 z-20">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="flex-1 h-11 rounded-xl text-neutral-500 hover:text-neutral-900"
                >
                    Back
                </Button>
                <Button
                    onClick={() => {
                        const staff = MOCK_STAFF.find(s => s.id === selectedStaffId)
                        if (staff) onConfirm(staff)
                    }}
                    disabled={!selectedStaffId}
                    className="flex-[2] h-11 rounded-xl bg-[#2A2A2A] text-white hover:bg-[#2A2A2A]/90 transition-all shadow-lg disabled:opacity-50"
                >
                    Assign & Finish
                </Button>
            </div>
        </div>
    )
}

// 2. Add Service Section (Redesigned & Fixed)

interface AddServiceSectionProps {
    onClose: () => void
    onNext: (selected: { name: string, price: number, duration: string }[]) => void // Type update
}

function AddServiceSection({ onClose, onNext }: AddServiceSectionProps) {
    const sectionRef = React.useRef<HTMLDivElement>(null)
    const listRef = React.useRef<HTMLDivElement>(null)
    const [activeCategory, setActiveCategory] = React.useState("Hair")
    const [selectedServices, setSelectedServices] = React.useState<{ name: string, price: number, duration: string }[]>([]) // Capture duration
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isSearchFocused, setIsSearchFocused] = React.useState(false)

    // GSAP Entrance
    useGSAP(() => {
        gsap.fromTo(sectionRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }
        )
    }, { scope: sectionRef })

    // Animate list items on category change
    useGSAP(() => {
        if (listRef.current) {
            gsap.fromTo(listRef.current.children,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: "power2.out" }
            )
        }
    }, { dependencies: [activeCategory], scope: listRef })

    const handleSelect = (service: { name: string, price: number, duration: string }) => {
        const exists = selectedServices.find(s => s.name === service.name)
        if (exists) {
            setSelectedServices(selectedServices.filter(s => s.name !== service.name))
        } else {
            setSelectedServices([...selectedServices, { name: service.name, price: service.price, duration: service.duration }])
        }
    }

    const handleNext = () => {
        onNext(selectedServices)
    }

    const currentServices = (MOCK_CATALOG[activeCategory] || []).filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div ref={sectionRef} className="absolute inset-0 bg-[#FDfAf5] z-50 flex flex-col overflow-hidden rounded-t-[32px]">
            {/* Header Controls */}
            <div className="pt-8 px-5 md:px-8 pb-4 shrink-0 bg-[#FDfAf5] flex flex-col gap-6 z-20">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col min-w-0">
                        <h2 className="text-2xl font-black text-neutral-900 tracking-tight truncate">Select Services</h2>
                        <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider mt-1">Choose one or more</p>
                    </div>

                    {/* Search Bar - Expands */}
                    <motion.div
                        initial={false}
                        animate={{ width: isSearchFocused ? 260 : 44 }}
                        className={cn("relative h-11 rounded-full bg-white border border-neutral-200/60 flex items-center shadow-sm overflow-hidden transition-all shrink-0", isSearchFocused && "border-[#2A2A2A] ring-1 ring-[#2A2A2A]/10")}
                    >
                        <Search className={cn("w-4 h-4 absolute left-3.5 transition-colors z-10", isSearchFocused ? "text-[#2A2A2A]" : "text-neutral-400")} />
                        <input
                            type="text"
                            value={searchQuery}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={cn("w-full h-full bg-transparent pl-10 pr-4 text-sm font-semibold outline-none relative z-10", !isSearchFocused && "cursor-pointer")}
                            placeholder={isSearchFocused ? "Search..." : ""}
                        />
                        {!isSearchFocused && !searchQuery && (
                            <div className="absolute inset-0 cursor-pointer z-20" onClick={() => setIsSearchFocused(true)} />
                        )}
                    </motion.div>
                </div>

                {/* Categories - Animated Tabs */}
                {/* Categories - Animated Tabs */}
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                                "relative px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors z-10 border",
                                activeCategory === cat ? "text-white border-transparent" : "text-neutral-500 hover:text-neutral-900 border-neutral-100 bg-white"
                            )}
                        >
                            {activeCategory === cat && (
                                <motion.div
                                    layoutId="activeCategoryPill"
                                    className="absolute inset-0 bg-[#2A2A2A] rounded-full -z-10 shadow-lg"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Service Grid - Premium Cards */}
            <div className="flex-1 overflow-y-auto p-8 pt-4 bg-[#F6F5F0]/30 rounded-t-[32px] border-t border-neutral-200/40 relative">
                {/* Decorative background blur */}
                <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl -z-10" />

                <div ref={listRef} className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-32">
                    {currentServices.map((service) => {
                        const isSelected = selectedServices.some(s => s.name === service.name)
                        return (
                            <motion.div
                                key={service.name}
                                layout
                                onClick={() => handleSelect(service)}
                                className={cn(
                                    "relative p-6 rounded-[24px] bg-white border cursor-pointer flex flex-col justify-between transition-all duration-300 group overflow-hidden h-[150px] sm:h-[160px]",
                                    isSelected
                                        ? "border-[#2A2A2A] shadow-xl ring-1 ring-[#2A2A2A]/5 translate-y-[-2px]"
                                        : "border-neutral-100 shadow-sm hover:shadow-lg hover:border-neutral-200 hover:translate-y-[-2px]"
                                )}
                            >
                                <div className="flex justify-between items-start z-10 gap-3">
                                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                        <span className={cn("text-base font-bold leading-tight line-clamp-2", isSelected ? "text-neutral-900" : "text-neutral-700")}>
                                            {service.name}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                                            <Timer className="w-3.5 h-3.5" />
                                            {service.duration}
                                        </div>
                                    </div>

                                    {/* Selection Circle */}
                                    <div className={cn(
                                        "shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 border",
                                        isSelected ? "bg-[#2A2A2A] border-[#2A2A2A] scale-110" : "bg-white border-neutral-200 group-hover:border-neutral-300"
                                    )}>
                                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                </div>

                                <div className="flex items-end justify-between z-10 mt-auto">
                                    <span className={cn("text-xl font-black tracking-tight", isSelected ? "text-[#2A2A2A]" : "text-neutral-900")}>
                                        ₹{service.price}
                                    </span>
                                </div>

                                {/* Background Accent on Select */}
                                {isSelected && (
                                    <motion.div
                                        layoutId={`bg-${service.name}`}
                                        className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#FDfAf5] rounded-full opacity-60 blur-2xl pointer-events-none"
                                    />
                                )}
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {/* Sticky Bottom Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-white/50 flex items-center gap-4 z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <AnimatePresence>
                    {selectedServices.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute -top-14 left-0 right-0 flex justify-center pointer-events-none"
                        >
                            <span className="bg-[#2A2A2A] text-white text-[11px] font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3 text-yellow-500" />
                                {selectedServices.length} Service{selectedServices.length > 1 ? 's' : ''} Selected
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Button
                    variant="ghost"
                    onClick={onClose}
                    className="flex-1 h-14 rounded-2xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/50 font-bold text-base"
                >
                    Cancel
                </Button>
                <div className="relative flex-[2]">
                    <Button
                        onClick={handleNext}
                        disabled={selectedServices.length === 0}
                        className="w-full h-14 rounded-2xl bg-[#2A2A2A] text-white hover:bg-[#2A2A2A]/90 transition-all shadow-xl shadow-[#2A2A2A]/20 disabled:opacity-50 text-base font-bold"
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    )
}

// --- Main Modal Component ---

const MOCK_SERVICES_INIT: ServiceItem[] = [
    { id: "s1", name: "Haircut", employee: "Bob", status: "Ongoing" },
    { id: "s2", name: "Beard Trim", employee: "Charlie", status: "Completed" },
]

type ModalView = "list" | "add-service" | "assign-staff" | "details"

export default function EditCustomerModal({ isOpen, onClose, customer, initialServices, onSave, mode = 'edit', currentUser, staffAvailability }: EditCustomerModalProps) {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const modalRef = React.useRef<HTMLDivElement>(null)

    // State
    const [services, setServices] = React.useState<ServiceItem[]>([])
    const [view, setView] = React.useState<ModalView>("list")
    const [tempSelectedServices, setTempSelectedServices] = React.useState<{ name: string, price: number, duration: string }[]>([])
    const [editingServiceId, setEditingServiceId] = React.useState<string | null>(null)

    // New Customer Details State
    const [newCustomerDetails, setNewCustomerDetails] = React.useState<any>(null)

    // Confirmation State
    const [confirmation, setConfirmation] = React.useState<{
        isOpen: boolean
        title: string
        description: string
        action: () => void
        variant: "default" | "destructive"
        confirmLabel: string
    }>({
        isOpen: false,
        title: "",
        description: "",
        action: () => { },
        variant: "default",
        confirmLabel: "Confirm"
    })

    // Sync with props when opening
    React.useEffect(() => {
        if (isOpen) {
            if (mode === 'create') {
                setView("details")
                setServices([])
                setNewCustomerDetails(null)
            } else {
                setView("list")
                if (initialServices) {
                    setServices(initialServices)
                }
            }
        }
    }, [isOpen, initialServices, mode])

    // GSAP Animation for Entrance/Exit
    useGSAP(() => {
        if (isOpen) {
            // Entrance
            gsap.to(containerRef.current, {
                opacity: 1,
                duration: 0.3,
                ease: "power2.out",
                display: "flex"
            })

            gsap.fromTo(modalRef.current,
                { scale: 0.95, opacity: 0, y: 10 },
                { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "power3.out", delay: 0.05 }
            )
        } else {
            // Exit
            gsap.to(containerRef.current, {
                opacity: 0,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    if (containerRef.current) containerRef.current.style.display = "none"
                    setView("list")
                }
            })
        }
    }, { dependencies: [isOpen] })

    // Initialize display none
    React.useEffect(() => {
        if (containerRef.current) {
            gsap.set(containerRef.current, { opacity: 0, display: "none" })
        }
    }, [])

    const handleBasicDetailsNext = (data: any) => {
        setNewCustomerDetails(data)
        setView("add-service")
    }

    const handleServiceSelectionNext = (newServices: { name: string, price: number, duration: string }[]) => {
        setTempSelectedServices(newServices)
        setView("assign-staff")
    }

    const handleStaffAssignmentConfirm = (staff: typeof MOCK_STAFF[0]) => {
        if (editingServiceId) {
            // Reassign mode
            setServices(prev => prev.map(s => {
                if (s.id === editingServiceId) {
                    return { ...s, employee: staff.name }
                }
                return s
            }))
            setEditingServiceId(null)
        } else {
            // Add new services mode
            const added: ServiceItem[] = tempSelectedServices.map(s => ({
                id: Math.random().toString(36).substr(2, 9),
                name: s.name,
                employee: staff.name,
                status: "Ongoing",
                price: s.price,
                duration: s.duration
            }))
            setServices(prev => [...prev, ...added])
        }
        // If in create mode, we might want to stay in add-service or go to list. Going to list is cleaner.
        setView("list")
    }

    const handleReassignStart = (id: string) => {
        setEditingServiceId(id)
        setView("assign-staff")
    }

    const handleCompleteService = (id: string) => {
        setConfirmation({
            isOpen: true,
            title: "Complete Service",
            description: "Mark this service as completed?",
            action: () => {
                setServices(prev => prev.map(s => {
                    if (s.id === id) return { ...s, status: "Completed" }
                    return s
                }))
            },
            variant: "default",
            confirmLabel: "Complete"
        })
    }

    const handleRevertService = (id: string) => {
        setConfirmation({
            isOpen: true,
            title: "Revert Service",
            description: "Revert this service status to Ongoing?",
            action: () => {
                setServices(prev => prev.map(s => {
                    if (s.id === id) return { ...s, status: "Ongoing" }
                    return s
                }))
            },
            variant: "default",
            confirmLabel: "Revert"
        })
    }

    const handleRemoveService = (id: string) => {
        setServices(prev => prev.filter(s => s.id !== id))
    }

    const handleSaveChanges = () => {
        onSave(services, newCustomerDetails)
        onClose()
    }

    // Prevent background scroll
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => { document.body.style.overflow = 'unset' }
    }, [isOpen])

    if (!customer && !isOpen && mode !== 'create') return null

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center bg-black/20 backdrop-blur-sm p-0 sm:p-4"
        >
            <div
                ref={modalRef}
                className="relative w-full sm:max-w-md bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl sm:rounded-3xl rounded-t-[32px] overflow-hidden flex flex-col h-[85dvh] sm:h-[650px] transition-all"
            >
                {/* 
                   OVERLAYS
                */}

                {/* 0. Basic Details (Revamped) */}
                {view === "details" && (
                    <BasicDetailsSection
                        onNext={handleBasicDetailsNext}
                        onClose={onClose}
                    />
                )}

                {/* Add Service Step */}
                {view === "add-service" && (
                    <AddServiceSection
                        onClose={() => {
                            if (mode === 'create' && services.length === 0) {
                                setView("details")
                            } else {
                                setView("list")
                            }
                        }}
                        onNext={handleServiceSelectionNext}
                    />
                )}

                {/* Assign Staff Step */}
                {view === "assign-staff" && (
                    <AssignStaffSection
                        selectedServicesCount={tempSelectedServices.length}
                        onBack={() => {
                            if (editingServiceId) {
                                setEditingServiceId(null)
                                setView("list")
                            } else {
                                setView("add-service")
                            }
                        }}
                        onConfirm={handleStaffAssignmentConfirm}
                        reassignServiceName={editingServiceId ? services.find(s => s.id === editingServiceId)?.name : undefined}
                        staffAvailability={staffAvailability}
                    />
                )}

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200/50 bg-white/50 shrink-0">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                            <AvatarImage src={customer ? `https://i.pravatar.cc/150?u=${customer.id}` : (newCustomerDetails?.avatar || undefined)} />
                            <AvatarFallback className="bg-neutral-100 text-neutral-500">
                                {customer?.name?.substring(0, 2).toUpperCase() || newCustomerDetails?.name?.substring(0, 2).toUpperCase() || "NC"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg text-neutral-800 leading-tight">
                                {customer?.name || newCustomerDetails?.name || "New Customer"}
                            </span>
                            <span className="text-xs text-neutral-500 font-medium tracking-wide">
                                {customer ? "+91 98765 43210" : newCustomerDetails?.phone || "No phone"}
                            </span>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-neutral-100/80 -mr-2" onClick={onClose}>
                        <X className="h-5 w-5 text-neutral-500" />
                    </Button>
                </div>

                {/* Service List */}
                {view === "list" && (
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {services.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-neutral-400 border-2 border-dashed border-neutral-100 rounded-2xl">
                                <span className="text-sm font-medium">No services added yet</span>
                            </div>
                        ) : (
                            services.map((service, index) => (
                                <motion.div
                                    key={service.id || index}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-5 rounded-2xl bg-[#F6F5F0]/50 border border-neutral-200/60 flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-white border border-neutral-100 flex items-center justify-center shadow-sm text-neutral-500">
                                            {/* Icon based on service name or generic */}
                                            <span className="font-bold text-xs">{index + 1}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[#2A2A2A]">{service.name}</span>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <div className="flex items-center gap-1.5 cursor-pointer group/staff"
                                                    onClick={() => {
                                                        if (currentUser?.role === 'Manager') handleReassignStart(service.id)
                                                    }}
                                                >
                                                    <span className={cn(
                                                        "text-xs font-semibold text-neutral-500 transition-colors",
                                                        currentUser?.role === 'Manager' && "group-hover/staff:text-[#2A2A2A] underline decoration-dotted underline-offset-2 decoration-neutral-300"
                                                    )}>
                                                        {service.employee}
                                                    </span>
                                                    {currentUser?.role === 'Manager' && (
                                                        <Pen className="w-2.5 h-2.5 text-neutral-400 ml-1 hover:text-neutral-600 transition-colors" />
                                                    )}
                                                </div>
                                                <div className="h-1 w-1 rounded-full bg-neutral-300" />
                                                <span className="text-xs font-medium text-neutral-400">
                                                    ₹{service.price}
                                                </span>
                                                {service.duration && (
                                                    <>
                                                        <div className="h-1 w-1 rounded-full bg-neutral-300" />
                                                        <span className="text-xs font-medium text-neutral-400">
                                                            {service.duration}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Status Badge / Complete Button */}
                                        {service.status === "Completed" ? (
                                            <div className="flex items-center gap-1">
                                                <span className="px-3 py-1 rounded-lg bg-green-100/80 text-green-700 text-[10px] font-bold uppercase tracking-wider border border-green-200">
                                                    Completed
                                                </span>
                                                {currentUser?.role === 'Manager' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleRevertService(service.id)}
                                                        className="h-7 w-7 ml-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100/80 rounded-lg"
                                                        title="Revert Status"
                                                    >
                                                        <RotateCcw className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                            </div>
                                        ) : (
                                            (currentUser?.role === 'Manager' || service.employee === currentUser?.name) && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleCompleteService(service.id)}
                                                    className="h-auto min-h-0 px-3 py-1 rounded-lg bg-[#FFF5F5] border border-[#FFE0E0] text-[#FF4D4D] hover:bg-[#FFE0E0] hover:text-[#D93030] hover:border-[#FF4D4D]/20 transition-all text-[10px] font-bold uppercase tracking-wider shadow-none"
                                                >
                                                    Ongoing
                                                </Button>
                                            )
                                        )}

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveService(service.id)}
                                            className="h-8 w-8 text-neutral-300 hover:text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            ))
                        )}

                        <Button
                            variant="outline"
                            onClick={() => setView("add-service")}
                            className="w-full py-6 rounded-2xl border-2 border-dashed border-neutral-200 text-neutral-400 hover:text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50/50 gap-2 transition-all group"
                        >
                            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="font-semibold">Add Another Service</span>
                        </Button>
                    </div>
                )}

                {/* Footer actions */}
                <div className="p-5 sm:p-6 bg-white/80 backdrop-blur-xl border-t border-neutral-100 flex flex-col gap-4 shrink-0 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                    {/* Total Row */}
                    <div className="flex items-center justify-between px-1">
                        <div className="flex flex-col">
                            <span className="text-[10px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider">Total Payable</span>
                            <span className="text-xs font-semibold text-neutral-300">{services.length} Services</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl sm:text-3xl font-black text-[#2A2A2A] tracking-tight">
                                ₹{services.reduce((acc, s) => acc + (s.price || 0), 0).toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="flex-1 rounded-2xl h-12 sm:h-14 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/50 border-2 border-transparent hover:border-neutral-100 font-bold text-base transition-all"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveChanges}
                            className="flex-[2] rounded-2xl h-12 sm:h-14 bg-[#2A2A2A] text-white hover:bg-[#2A2A2A]/90 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all font-bold text-base shadow-lg shadow-[#2A2A2A]/10"
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>

            </div>

            <ConfirmationModal
                isOpen={confirmation.isOpen}
                onClose={() => setConfirmation(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmation.action}
                title={confirmation.title}
                description={confirmation.description}
                confirmLabel={confirmation.confirmLabel}
                variant={confirmation.variant}
            />
        </div>
    )
}
