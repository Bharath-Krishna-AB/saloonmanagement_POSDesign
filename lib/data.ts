import { User } from "./types"

export const USERS: User[] = [
    { name: "Alice", role: "Manager", avatar: "https://i.pravatar.cc/150?u=Alice", email: "alice@example.com" },
    { name: "Bob", role: "Stylist", avatar: "https://i.pravatar.cc/150?u=Bob", email: "bob@example.com" },
    { name: "Charlie", role: "Stylist", avatar: "https://i.pravatar.cc/150?u=Charlie", email: "charlie@example.com" },
    { name: "Diana", role: "Stylist", avatar: "https://i.pravatar.cc/150?u=Diana", email: "diana@example.com" },
    { name: "Evan", role: "Stylist", avatar: "https://i.pravatar.cc/150?u=Evan", email: "evan@example.com" },
]

export const CATEGORIES = ["Hair", "Skin", "Mani | Pedi", "Make Up", "Add-on Services", "Packages"]

export const MOCK_CATALOG: Record<string, { name: string, price: number, duration: string }[]> = {
    "Hair": [
        { name: "Bangs | Fringe Cut", price: 230, duration: "30m" },
        { name: "Classic Hair Cut", price: 400, duration: "45m" },
        { name: "Layer Trimming", price: 700, duration: "60m" },
        { name: "Style Changing", price: 900, duration: "90m" },
        { name: "Advance Hair Cut", price: 1000, duration: "90m" },
        { name: "Kids Cut", price: 300, duration: "30m" },
        { name: "Hair & Beard Setting", price: 1000, duration: "60m" },
    ],
    "Skin": [
        { name: "Basic Facial", price: 500, duration: "45m" },
        { name: "Deep Cleanse", price: 800, duration: "60m" },
        { name: "Hydra Facial", price: 1200, duration: "90m" },
    ],
    "Mani | Pedi": [
        { name: "Classic Manicure", price: 500, duration: "45m" },
        { name: "Gel Manicure", price: 800, duration: "60m" },
    ],
    "Make Up": [
        { name: "Party Makeup", price: 1500, duration: "60m" },
        { name: "Bridal Makeup", price: 5000, duration: "180m" },
    ],
    "Add-on Services": [
        { name: "Scalp Massage", price: 300, duration: "15m" },
    ],
    "Packages": [
        { name: "Full Makeover", price: 6000, duration: "240m" },
    ]
}
