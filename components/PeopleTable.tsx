"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import PeopleTableHeader from "./PeopleTableHeader"
import PeopleTableRow from "./PeopleTableRow"
import MyWorkTable from "./MyWorkTable"
import EditCustomerModal, { ServiceItem } from "./EditCustomerModal"
import ConfirmationModal from "./ConfirmationModal"
import type { User } from "@/lib/types"

export interface Person {
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

const INITIAL_PEOPLE_DATA: Person[] = [
    {
        id: "1",
        name: "Esther Howard",
        employee: "Bob",
        status: "Active",
        price: 450,
        totalRate: "₹450",
        date: "Today",
        time: "2:00 PM",
        details: { phone: "+91 98765 43210", sex: "Female" }
    },
    {
        id: "2",
        name: "Ted Bundy",
        employee: "Charlie",
        status: "Completed",
        price: 210,
        totalRate: "₹210",
        date: "Yesterday",
        time: "11:30 AM",
        details: { phone: "+91 99887 76655", sex: "Male" }
    },
    {
        id: "3",
        name: "Leslie Alexander",
        employee: "Diana",
        status: "Active",
        price: 1200,
        totalRate: "₹1,200",
        date: "Today",
        time: "4:15 PM",
        details: { phone: "+91 91234 56789", sex: "Female" }
    },
    {
        id: "4",
        name: "Darlene Robertson",
        employee: "Evan",
        status: "Active",
        price: 850,
        totalRate: "₹850",
        date: "Tomorrow",
        time: "10:00 AM",
        details: { phone: "+91 98765 09876", sex: "Other" }
    },
    {
        id: "5",
        name: "Kristin Watson",
        employee: "Bob",
        status: "Completed",
        price: 350,
        totalRate: "₹350",
        date: "Yesterday",
        time: "1:45 PM",
        details: { phone: "+91 88997 76655", sex: "Female" }
    }
]

interface PeopleTableProps {
    currentUser: User
    activeTab: string
}

export default function PeopleTable({ currentUser, activeTab }: PeopleTableProps) {
    const userRole = currentUser.role
    const [selectedId, setSelectedId] = React.useState<string>("2")
    const [people, setPeople] = React.useState<Person[]>(INITIAL_PEOPLE_DATA)

    // Modal State
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
    const [editingCustomer, setEditingCustomer] = React.useState<Person | null>(null)
    const [modalMode, setModalMode] = React.useState<'edit' | 'create'>('edit')

    // Per-Customer Data Storage
    const [customerServices, setCustomerServices] = React.useState<Record<string, ServiceItem[]>>(() => {
        const initial: Record<string, ServiceItem[]> = {}
        INITIAL_PEOPLE_DATA.forEach(p => {
            // Generate services based on p.employee to ensure consistency
            const employeeName = p.employee || "Unassigned"

            // Randomly select a service name for variety, but assign to the correct employee
            const serviceName = ["Haircut", "Beard Trim", "Facial", "Manicure"][Math.floor(Math.random() * 4)]

            const services: ServiceItem[] = [
                {
                    id: Math.random().toString(36).substr(2, 9),
                    name: serviceName,
                    employee: employeeName,
                    status: p.status === "Completed" || p.status === "Approved" ? "Completed" : "Ongoing",
                    price: p.price || 0
                }
            ]

            initial[p.id] = services
        })
        return initial
    })

    // Search State
    const [searchQuery, setSearchQuery] = React.useState("")

    // Confirmation Modal State
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

    // Filtered Data
    const filteredPeople = people.filter(person => {
        const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase())
        // Treat "Completed" (legacy mock) and "Approved" as finished states
        const isFinished = person.status === 'Approved' || person.status === 'Completed'

        // Filter based on Tab
        if (activeTab === 'Completed') {
            return matchesSearch && isFinished
        }

        // "My Work" processing is handled by MyWorkTable now, but we might filter here if we used the old logic.
        // Since we switch components, this filter mainly applies to the Main View (Active/Completed).
        // However, if we are in "Active" tab:
        if (activeTab === 'Active') {
            return matchesSearch && !isFinished
        }

        // Fallback (shouldn't really be hit for rendering Main Table if we switch component, 
        // but useful for consistent data if needed or for "My Work" legacy compatibility)
        return matchesSearch
    }).sort((a, b) => (a.employee || "").localeCompare(b.employee || ""))

    const handleEditClick = (person: Person) => {
        setEditingCustomer(person)
        setModalMode('edit')
        // Initialize if not present
        if (!customerServices[person.id]) {
            setCustomerServices(prev => ({
                ...prev,
                [person.id]: [] // Should handle undefined gracefully in modal or here
            }))
        }
        setIsEditModalOpen(true)
    }

    const handleAddClick = () => {
        setEditingCustomer(null) // No customer yet
        setModalMode('create')
        setIsEditModalOpen(true)
    }

    const handleSaveCustomer = (services: ServiceItem[], customerData?: any) => {
        if (modalMode === 'create' && customerData) {
            const newId = (Math.random() + 1).toString(36).substring(7)
            const total = services.reduce((acc, curr) => acc + (curr.price || 0), 0)

            const newPerson: Person = {
                id: newId,
                name: customerData.name,
                employee: services.length > 0 && services[0].employee ? services[0].employee : "Unassigned",
                status: "Active",
                price: total,
                details: {
                    phone: customerData.phone,
                    sex: customerData.sex
                },
                totalRate: `₹${total.toLocaleString()}`,
                date: "Today", // Default for new
                time: "Now"
            }

            setPeople(prev => [newPerson, ...prev])
            setCustomerServices(prev => ({
                ...prev,
                [newId]: services
            }))
        } else if (modalMode === 'edit' && editingCustomer) {
            // Update existing services
            setCustomerServices(prev => ({
                ...prev,
                [editingCustomer.id]: services
            }))

            // Re-calculate price/employee if needed based on new services
            setPeople(prev => prev.map(p => {
                if (p.id === editingCustomer.id) {
                    const newPrice = services.reduce((acc, curr) => acc + (curr.price || 0), 0);
                    // Determine main employee logic: strictly first service?
                    const mainEmployee = services.length > 0 && services[0].employee ? services[0].employee : p.employee

                    return {
                        ...p,
                        name: customerData?.name ?? p.name,
                        price: newPrice,
                        totalRate: `₹${newPrice.toLocaleString()}`,
                        employee: mainEmployee,
                        details: customerData ? {
                            phone: customerData.phone,
                            sex: customerData.sex
                        } : p.details,
                    }
                }
                return p
            }))
        }
        setIsEditModalOpen(false)
    }

    // Get current services for the modal
    const currentServices = editingCustomer && customerServices[editingCustomer.id] ? customerServices[editingCustomer.id] : []

    const handleApprove = (id: string) => {
        setConfirmation({
            isOpen: true,
            title: "Approve Customer",
            description: "Are you sure you want to approve this customer? This will move them to the Approved list.",
            action: () => setPeople(prev => prev.map(p => p.id === id ? { ...p, status: 'Approved' } : p)),
            variant: "default",
            confirmLabel: "Approve"
        })
    }

    const handleRevert = (id: string) => {
        setConfirmation({
            isOpen: true,
            title: "Revert Customer",
            description: "Are you sure you want to revert this customer to Active status?",
            action: () => setPeople(prev => prev.map(p => p.id === id ? { ...p, status: 'Active' } : p)),
            variant: "default",
            confirmLabel: "Revert"
        })
    }

    const containerRef = React.useRef(null)

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } })

        // Container Entrance
        tl.from(containerRef.current, {
            y: 20,
            opacity: 0,
            duration: 0.7,
        })
            // Row Stagger
            .from(".people-row", {
                y: 10,
                opacity: 0,
                duration: 0.5,
                stagger: 0.05,
                clearProps: "all"
            }, "-=0.4")
    }, { scope: containerRef })

    return (
        <>
            <EditCustomerModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                customer={editingCustomer}
                initialServices={modalMode === 'create' ? [] : currentServices}
                onSave={handleSaveCustomer}
                mode={modalMode}
                currentUser={currentUser}
            />

            <ConfirmationModal
                isOpen={confirmation.isOpen}
                onClose={() => setConfirmation(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmation.action}
                title={confirmation.title}
                description={confirmation.description}
                confirmLabel={confirmation.confirmLabel}
                variant={confirmation.variant}
            />

            <div ref={containerRef} className="w-full flex-1 px-8 flex justify-center min-h-0 mt-6 pb-0">
                <div className="w-full max-w-[1700px] bg-[#FAFAFA]/50 backdrop-blur-xl rounded-t-[32px] rounded-b-none shadow-[0_2px_40px_rgba(0,0,0,0.04)] flex flex-col pt-2 pb-6">

                    {activeTab === 'My Work' ? (
                        <MyWorkTable
                            currentUser={currentUser}
                            people={people}
                            customerServices={customerServices}
                            onEditCustomer={handleEditClick}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            onAddClick={handleAddClick}
                            selectedId={selectedId}
                            onSelect={setSelectedId}
                        />
                    ) : (
                        <>
                            <PeopleTableHeader
                                userRole={userRole}
                                activeTab={activeTab}
                                searchQuery={searchQuery}
                                onSearchChange={setSearchQuery}
                                onAddClick={handleAddClick}
                            />

                            {/* Rows Container */}
                            <div className="flex flex-col gap-1 p-2 overflow-y-auto flex-1">
                                {filteredPeople.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-neutral-400 opacity-60">
                                        {/* Empty State Illustration or Icon */}
                                        <div className="w-16 h-16 rounded-full bg-neutral-100 mb-4 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                            </svg>
                                        </div>
                                        <span className="text-sm font-medium">No customers found</span>
                                        <p className="text-xs mt-1 max-w-[200px] text-center">Try adjusting your search.</p>
                                    </div>
                                ) : (
                                    filteredPeople.map((person) => (
                                        <PeopleTableRow
                                            key={person.id}
                                            person={person}
                                            isActive={selectedId === person.id}
                                            userRole={userRole}
                                            activeTab={activeTab}
                                            customerServices={customerServices[person.id]}
                                            onSelect={setSelectedId}
                                            onEdit={handleEditClick}
                                            onApprove={handleApprove}
                                            onRevert={handleRevert}
                                        />
                                    ))
                                )}
                            </div>
                        </>
                    )}

                </div>
            </div>
        </>
    )
}
