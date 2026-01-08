export interface User {
    name: string
    role: string // Changed to string to be flexible or keep as union if consistent
    avatar?: string
    email?: string
}

export interface ServiceItem {
    id: string
    name: string
    employee: string
    status: "Ongoing" | "Completed" | "Queued"
    price?: number
    duration?: string
    startTime?: number // timestamp in ms
}

// Dummy export to ensure this is treated as a module if interface-only causes issues (rare but possible in some configs)
export const TYPES_VERSION = "1.0.0";
