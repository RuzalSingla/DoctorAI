"use client"
import React from 'react'
import {Button} from'@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useState } from 'react'
import axios from 'axios'
import { doctorAgent } from './DoctorAgentCard'
import SuggestedDoctorCard from './SuggestedDoctorCard'
import { useRouter } from 'next/navigation'

function AddNewSessionDialog() {
  const [note, setNote] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [suggestedDoctors, setsuggestedDoctors] = useState<doctorAgent[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent>();
  const router = useRouter();
  const OnClickNext = async () => {
    setLoading(true);
    const result = await axios.post('/api/users/suggest-doctors', {
      notes:note
    });

    console.log(result.data);
    setsuggestedDoctors(result.data);
    setLoading(false);
  }

  const onStartConsulation = async() => {
    setLoading(true);
    const result = await axios.post('/api/users/session-chat', {
      notes: note,
      selectedDoctor: selectedDoctor
    });
    console.log(result.data);
    if (result.data?.session?.sessionId) {
      console.log(result.data.session.sessionId);
      router.push('/dashboard/medical-agent/' + result.data.session.sessionId);
    }

    setLoading(false);
  }
  return (
        <Dialog>
            <DialogTrigger>
                <Button className='mt-3'>+ Start a Consultation</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Add Basic Details</DialogTitle>
                <DialogDescription asChild>
                    {suggestedDoctors.length === 0 ? (<div>
                      <h2>Add symptoms or any other details</h2>
                      <Textarea placeholder='Add Details here!' className='h-[200px] mt-1' onChange={(e) => setNote(e.target.value)}/>
                    </div>):(<div>
                      <h2>Select a Doctor</h2>
                        <div className='grid grid-cols-3 gap-5'>
                          {/* // Suggested Doctors */}
                          {suggestedDoctors.map((doctor, index) => (
                            <SuggestedDoctorCard doctorAgent={doctor} key={index}
                              setSelectedDoctor={setSelectedDoctor}
                              //@ts-ignore
                              selectedDoctor={selectedDoctor} />
                          ))}
                      </div>
                    </div>)}
                </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose>
                    <Button variant={'outline'}>Cancel</Button>
                  </DialogClose>
                  {suggestedDoctors.length === 0 ? ( <Button disabled={!note || loading} onClick={() => OnClickNext()}>
                    Next {loading ? <Loader2 className='animate-spin'/> : <ArrowRight/>} </Button>)
                    :(<Button disabled={loading || !selectedDoctor} onClick={() => onStartConsulation()}>Start Consultation
                    {loading ? <Loader2 className='animate-spin'/> : <ArrowRight/>}</Button>)}
                </DialogFooter>
            </DialogContent>
        </Dialog>
  )
}

export default AddNewSessionDialog