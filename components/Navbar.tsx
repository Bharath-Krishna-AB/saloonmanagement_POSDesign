"use client"

import * as React from "react"
import { Bell, Settings, User as UserIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import MobileMenu from "./MobileMenu"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check } from "lucide-react"

import type { User } from "@/lib/types"

const NAV_ITEMS = [
  "Dashboard",
  "Appointments",
  "Customers",
  "Services",
  "Staff",
  "Billing",
]

interface NavbarProps {
  currentUser: User
  onUserChange: (user: User) => void
  users: User[]
}

export default function Navbar({ currentUser, onUserChange, users }: NavbarProps) {
  const [activeTab, setActiveTab] = React.useState("Customers")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  return (
    <>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <div className="w-full bg-transparent p-4 flex justify-center items-center relative z-[200]">
        <nav className="w-full max-w-[1920px] flex items-center px-6 py-2 gap-3">
          {/* Left Section: Logo */}
          <div className="flex items-center shrink-0">
            <div className="border border-neutral-300 rounded-full px-5 py-2 bg-white/50 backdrop-blur-sm">
              <span className="text-xl font-medium tracking-tight text-neutral-800">
                Crextio
              </span>
            </div>
          </div>

          {/* Center Section: Navigation Pills (Desktop: > 1160px) */}
          <div className="hidden min-[1160px]:flex items-center bg-white/50 backdrop-blur-sm rounded-full p-1 shadow-sm border border-white/20 ml-auto mr-3">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = item === activeTab
                return (
                  <li key={item} className="relative z-0">
                    <button
                      onClick={() => setActiveTab(item)}
                      type="button"
                      className={cn(
                        "relative px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 ease-in-out cursor-pointer outline-none",
                        isActive ? "text-white" : "text-neutral-600 hover:text-neutral-900"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-[#2A2A2A] rounded-full shadow-sm -z-10"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                      {/* Hover state for inactive tabs */}
                      {!isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-white/60 -z-10 opacity-0"
                          whileHover={{
                            opacity: 1,
                            scale: 1.02,
                          }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                      <span className="relative z-10">{item}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Right Section: Actions (Always Visible or Hidden? Keeping visible for now as space permits) */}
          <div className="flex items-center gap-3 ml-auto min-[1160px]:ml-0">
            {/* Settings Button */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/50 hover:bg-white/80 h-10 w-10 shadow-sm overflow-hidden p-0"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center w-full h-full"
              >
                <Settings className="h-5 w-5 text-neutral-700" />
              </motion.div>
            </Button>

            {/* Notification Bell */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/50 hover:bg-white/80 h-10 w-10 text-neutral-700 shadow-sm relative overflow-hidden"
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Bell className="h-5 w-5" />
              </motion.div>
              <span className="absolute top-2.5 right-3 h-2 w-2 rounded-full bg-yellow-400 border border-white" />
            </Button>

            {/* Profile Avatar with Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-white/50 hover:bg-white/80 h-10 w-10 shadow-sm overflow-hidden p-0 relative outline-none ring-0 focus-visible:ring-0"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center w-full h-full"
                  >
                    <UserIcon className="h-5 w-5 text-neutral-700" />
                  </motion.div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 !bg-white/80 !backdrop-blur-xl !border-white/20 !shadow-xl !rounded-2xl" sideOffset={8}>
                {users.map((user) => {
                  const isSelected = currentUser.name === user.name;
                  return (
                    <DropdownMenuItem
                      key={user.name}
                      onClick={() => onUserChange(user)}
                      className={cn(
                        "relative flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-colors outline-none",
                        isSelected ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900 hover:bg-white/40"
                      )}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="activeRole"
                          className="absolute inset-0 bg-white shadow-sm border border-neutral-100 rounded-xl -z-10"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <div className="flex flex-col z-10">
                        <span className="font-semibold text-sm">{user.name}</span>
                        <span className="text-[10px] uppercase tracking-wider opacity-60 font-bold">{user.role}</span>
                      </div>

                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="relative z-10"
                        >
                          <Check className="w-4 h-4 text-neutral-900" />
                        </motion.span>
                      )}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* Mobile Hamburger (Visible < 1160px) */}
          <div className="flex min-[1160px]:hidden ml-3">
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="h-10 w-10 rounded-full bg-white/50 hover:bg-white/80 flex flex-col items-center justify-center gap-[5px] relative z-50 shadow-sm transition-colors border border-white/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={isMobileMenuOpen ? "open" : "closed"}
            >
              <motion.div
                className="w-4 h-0.5 bg-neutral-800 rounded-full"
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: 45, y: 8 }
                }}
              />
              <motion.div
                className="w-4 h-0.5 bg-neutral-800 rounded-full"
                variants={{
                  closed: { opacity: 1 },
                  open: { opacity: 0 }
                }}
              />
              <motion.div
                className="w-4 h-0.5 bg-neutral-800 rounded-full"
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: -45, y: -6 }
                }}
              />
            </motion.button>
          </div>
        </nav>
      </div>
    </>
  )
}
