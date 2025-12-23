"use client"

import * as React from "react"
import Navbar from "@/components/Navbar";
import PeopleOverview from "@/components/PeopleOverview";
import PeopleTable from "@/components/PeopleTable";


import type { User } from "@/lib/types"
import { USERS } from "@/lib/data"

export default function Home() {
  const [currentUser, setCurrentUser] = React.useState<User>(USERS[0])
  const [activeTab, setActiveTab] = React.useState("Active")

  return (
    <main className="flex flex-col flex-1">
      <Navbar currentUser={currentUser} onUserChange={setCurrentUser} users={USERS} />
      <PeopleOverview currentUser={currentUser} activeTab={activeTab} onTabChange={setActiveTab} />
      <PeopleTable currentUser={currentUser} activeTab={activeTab} />
    </main>
  );
}
