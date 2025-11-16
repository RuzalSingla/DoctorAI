import React from 'react'
import HistoryList from './_components/HistoryList'
import { Button } from '@/components/ui/button'
import DoctorsAgentList from './_components/DoctorsAgentList'
import AddNewSessionDialog from './_components/AddNewSessionDialog'
import Link from 'next/link'
function Dashboard(){
    return(
        <div>
            <div className='flex justify-between items-center'>
                <h2 className='font-bold text-2xl'>My Dashboard</h2>
                <AddNewSessionDialog/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="p-4 rounded-md bg-white dark:bg-slate-900 shadow">
                    <h3 className="font-semibold">Nutrition Planner</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Get personalized meal plans based on health, allergies and goals.</p>
                    <div className="mt-3">
                        <Link href="/dashboard/nutrition">
                            <Button>Open Nutrition Planner</Button>
                        </Link>
                    </div>
                </div>

                <div className="p-4 rounded-md bg-white dark:bg-slate-900 shadow">
                    <h3 className="font-semibold">Appointments</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage your upcoming appointments and bookings.</p>
                    <div className="mt-3">
                        <Link href="/dashboard/appointments">
                            <Button>Open Appointments</Button>
                        </Link>
                    </div>
                </div>

                <div className="p-4 rounded-md bg-white dark:bg-slate-900 shadow">
                    <h3 className="font-semibold">Reminders</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Set medication and appointment reminders.</p>
                    <div className="mt-3">
                        <Link href="/dashboard/reminders">
                            <Button>Open Reminders</Button>
                        </Link>
                    </div>
                </div>
            </div>

            <HistoryList />    
            <DoctorsAgentList />
        </div>
    )
}

export default Dashboard