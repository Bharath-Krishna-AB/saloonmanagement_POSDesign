import { useEffect, useState } from "react";
import { ServiceItem, User } from "@/lib/types";

const parseDurationToMinutes = (durationStr: string | undefined): number => {
    if (!durationStr) return 0;
    const match = durationStr.match(/(\d+)m/);
    return match ? parseInt(match[1]) : 30;
};

// Pure Scheduling Logic
export const scheduleServices = (
    currentServices: Record<string, ServiceItem[]>,
    users: User[]
): Record<string, ServiceItem[]> | null => {
    // 1. Deep copy to avoid mutation and track changes
    const nextServices = JSON.parse(JSON.stringify(currentServices)) as Record<string, ServiceItem[]>;
    let hasChanges = false;

    // 2. Build Staff Availability Timeline
    // Initialize with "now" or 0.
    // If we want "real-time", we assume any gap before "now" is lost time?
    // Constraints: "Use current system time as reference."
    const now = Date.now();
    const staffNextFree: Record<string, number> = {};
    users.forEach(u => staffNextFree[u.name] = now);

    // 3. Flatten and Sort all services
    type ServiceOp = ServiceItem & { cid: string; idx: number };
    const allOps: ServiceOp[] = [];

    Object.entries(nextServices).forEach(([cid, services]) => {
        services.forEach((s, idx) => {
            allOps.push({ ...s, cid, idx });
        });
    });

    // Sort by startTime
    allOps.sort((a, b) => (a.startTime || 0) - (b.startTime || 0));

    // 4. Process Services
    for (const op of allOps) {
        // Effective start time: If it's a future task, respect startTime.
        // If it's passed, treat as "now" for availability checks?
        // Prompt: "free at or before serviceStartTime".
        const opStart = op.startTime || now;
        const durationMin = parseDurationToMinutes(op.duration);
        const durationMs = durationMin * 60000;

        // A. Existing Assignments (Ongoing or Fixed)
        if (op.employee !== "Unassigned" && op.status !== "Queued") {
            // Update staff timeline
            // If the service started in the past, they are free at start + duration.
            // But if start + duration < now, they are free NOW.

            // Note: If 'Completed', we might ignore, but for "Timeline" logic, 
            // previous tasks block earlier slots if we were visualizing.
            // For *scheduling future*, we only care if they are busy *after* now?
            // "No employee can be double-assigned".
            // We should block the slot [start, start + duration].

            // If the slot ends in the future, it pushes nextFreeAt.
            const opEnd = opStart + durationMs;
            if (opEnd > staffNextFree[op.employee]) {
                staffNextFree[op.employee] = opEnd;
            }
            continue;
        }

        // B. Unassigned / Queued Services
        // We need to assign someone.
        if (op.employee === "Unassigned" || op.status === "Queued") {
            // Find valid candidates
            // Candidate is valid if nextFree <= opStart
            // But opStart might be *earlier* than now if it was queued long ago?
            // "Use current system time". If serviceStartTime was 10:00 and it's 10:05, 
            // and staff became free at 10:02, can we assign?
            // Yes. "Free at or before serviceStartTime" is strict? 
            // Or "Free now"? 
            // Let's assume strict constraint: We can only start IF staff is free.
            // If staff is free LATER than start time, we might need to delay start time?
            // PROMPT: "Assign the earliest available employee who is free at or before serviceStartTime."
            // "If no employee is available: mark as 'queued' (do NOT force)."

            const candidates = users.filter(u => staffNextFree[u.name] <= opStart);

            if (candidates.length > 0) {
                // Heuristic: Pick the one with the *earliest* free time? 
                // Or just first one? "earliest available employee".
                // Sort candidates by free time (descending? ascending?).
                // They are all free <= opStart. So they are "equally" ready.
                // We pick 0.
                const chosen = candidates[0];

                // Assign
                nextServices[op.cid][op.idx].employee = chosen.name;
                nextServices[op.cid][op.idx].status = "Ongoing"; // Or whatever logic for future
                // Lock start time if it was dynamic/missing
                if (!nextServices[op.cid][op.idx].startTime) {
                    nextServices[op.cid][op.idx].startTime = opStart;
                }

                // Update Timeline
                const newEnd = opStart + durationMs;
                staffNextFree[chosen.name] = newEnd;
                hasChanges = true;
            } else {
                // No one free. Mark Queued if not already.
                if (nextServices[op.cid][op.idx].status !== "Queued") {
                    nextServices[op.cid][op.idx].status = "Queued";
                    // Ensure unassigned
                    if (nextServices[op.cid][op.idx].employee !== "Unassigned") {
                        nextServices[op.cid][op.idx].employee = "Unassigned";
                    }
                    hasChanges = true;
                }
            }
        }
    }

    return hasChanges ? nextServices : null;
};

export function useScheduler(
    services: Record<string, ServiceItem[]>,
    setServices: React.Dispatch<React.SetStateAction<Record<string, ServiceItem[]>>>,
    users: User[]
) {
    useEffect(() => {
        const run = () => {
            const updates = scheduleServices(services, users);
            if (updates) {
                setServices(updates);
            }
        };

        // Run immediately
        run();

        // Run periodically to catch time-based slot openings (if logic allows)
        const timer = setInterval(run, 5000);

        return () => clearInterval(timer);
    }, [services, users, setServices]);
}
