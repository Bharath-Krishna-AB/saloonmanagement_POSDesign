export interface User {
    name: string
    role: "Manager" | "Staff"
}

// Dummy export to ensure this is treated as a module if interface-only causes issues (rare but possible in some configs)
export const TYPES_VERSION = "1.0.0";
