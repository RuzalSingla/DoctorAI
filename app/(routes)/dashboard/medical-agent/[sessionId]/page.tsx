"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { doctorAgent } from "../../_components/DoctorAgentCard";
import { Circle, PhoneCall, PhoneOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Vapi from '@vapi-ai/web';



type SessionDetail = {
  id: number,
  notes: string,
  sessionId: string,
  selectedDoctor: doctorAgent,
  createdOn: string
  

};

type messages={
  role:string,
  text:string
}

function MedicalVoiceAgent() {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>();
  const [callStarted,setCallStarted]=useState(false);
  //const [aiReply, setAiReply] = useState<string>("");
  const [vapiInstance , setVapiInstance]=useState<any>();
  const [currentRole , setCurrentRole]=useState<string|null>();
  
  const [LiveTranscript , setLiveTranscript]=useState<string>();
  const [messages , setMessages]=useState<messages[]>([]);
  

 // ✅ Named event handlers
  const handleCallStart = () => {
    console.log("Call started");
    setCallStarted(true);
  };

  const handleCallEnd = () => {
    console.log("Call ended");
    setCallStarted(false);
  };

  const handleMessage = (message: any) => {
    if (message.type === "transcript") {
      const { role, transcriptType, transcript } = message;
      console.log(`${role}: ${transcript}`);
      if (transcriptType === "partial") {
        setLiveTranscript(transcript);
        setCurrentRole(role);
      } else if (transcriptType === "final") {
        setMessages((prev: any) => [...prev, { role, text: transcript }]);
        setLiveTranscript("");
        setCurrentRole(null);
      }
    }
  };
  

  
  // Start voice conversation
  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
  
  useEffect(() => {
    if (sessionId) {
      GetSessionDetails();
    }
  }, [sessionId]);

  const GetSessionDetails = async () => {
    try {
      const result = await axios.get(
        "/api/users/session-chat?sessionId=" + sessionId
      );
      console.log(result.data);

      // set state properly
      setSessionDetail(result.data.session);
      //setAiReply(result.data.aiReply);
    } catch (err) {
      console.error(err);
    }
  };




  const StartCall=()=>{
    //setLoading(true);
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi);

    const VapiAgentConfig={
      name:'AI Medical Doctor Voice Agent',
      firstMessage:"Hi there! I''m your Ai Medical Assistant. I'm here to help you with any health questions or concerns you might have today.How are you feeling?",
      transcriber:{
        provider:'assembly-ai',
        language:'en'

      },
      voice:{
        provider:'vapi',
        voiceId:sessionDetail?.selectedDoctor?.voiceId
      },
      model:{
        provider:'openai',
        model:'gpt-5',
        messages:[
          {
              role: 'system',
              content:sessionDetail?.selectedDoctor?.agentPrompt
          }
        ]
      }

    }
    //@ts-ignore
    vapi.start(VapiAgentConfig);
    // Listen for events
    vapi.on('call-start', () => {
      
      console.log('Call started')
      setCallStarted(true);
    });
    vapi.on('call-end', () => {
      console.log('Call ended')
      setCallStarted(false);
      
    });
    vapi.on('message', (message) => {
      if (message.type === 'transcript') {
        const{role , transcriptType , transcript }=message;
        console.log(`${message.role}: ${message.transcript}`);
        if(transcriptType=='partial')
        {
        setLiveTranscript(transcript);
        setCurrentRole(role);
        }
        else if(transcriptType=='final'){
          // Final Transcript
          setMessages((prev: any)=>[...prev , {role:role, text:transcript}])
          setLiveTranscript("");
          setCurrentRole(null);
        }
      }
    });

    // Attach handlers
    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("message", handleMessage);

    vapi.on('speech-start', () => {
      console.log('Assistant started speaking');
      setCurrentRole('assistant');
    });
    vapi.on('speech-end', () => {
      console.log('Assistant stopped speaking');
      setCurrentRole('user');
    });

  }

  const endCall = async() => {
    if (!vapiInstance)  return ;
      // Stop the call
      vapiInstance.stop();

      //Optinally remove listeners(good for memory management)
      // vapiInstance.off('call-start');
      // vapiInstance.off('call-end');
      // vapiInstance.off('message');

      // ✅ Proper cleanup
      
      vapiInstance.off("call-start", handleCallStart);
      vapiInstance.off("call-end", handleCallEnd);
      vapiInstance.off("message", handleMessage);


      // Reset the call state
      setCallStarted(false);
      setVapiInstance(null); // imp
try {
    const reportResult = await GenerateReport();
    console.log("Report generated:", reportResult);
  } catch (error) {
    console.error("Error generating report:", error);
    // Handle the error appropriately (e.g., show a user message)
  }
  };

  const GenerateReport=async()=> {
        const result=await axios.post('/api/users/medical-report',{
          messages:messages,
          sessionDetail:sessionDetail,
          sessionId: sessionId
        })
        console.log(result.data);
        return result.data;
  };




  return (
    <div className="p-5 border rounded-3xl bg-secondary">
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle className={`h-4 w-4 rounded-full ${callStarted ? 'bg-green-500' : 'bg-red-500'}`} />
{callStarted ? 'Connected...' : 'Not Connected'}

        </h2>
        <h2 className="font-bold text-xl text-gray-400">00:00</h2>
      </div>

      {sessionDetail && (
        <div className="flex items-center flex-col mt-10">
          <Image
            src={sessionDetail?.selectedDoctor?.image}
            alt={sessionDetail?.selectedDoctor?.specialist}
            width={120}
            height={120}
            className="h-[100px] w-[100px] object-cover rounded-full"
          />
          
          <h2 className="mt-2 text-lg">{sessionDetail?.selectedDoctor?.specialist}</h2>
          <p className="text-sm text-gray-400">AI Medical Voice Agent</p>
          <h2 className="mt-5 text-gray-400 text-center">Symptoms</h2>
          <h2 className="text-lg">{sessionDetail.notes}</h2>
          <div className="mt-12 overflow-y-auto flex flex-col  items-start px-7 md:px-18 lg:px-42 xl:px-62
          ">
            
            {messages?.map((msg:messages , index)=>(
            
                  <h2 className="text-gray-400 p-0.5" key ={index}>{msg.role}:{msg.text}</h2>
           

            ))}
            
            {LiveTranscript && LiveTranscript?.length>0&& <h2 className="text-lg">{currentRole}:{LiveTranscript}</h2>}

            {/*<h2 className="mt-5 text-gray-400">User Msg</h2>*/}
            
          </div>

          {!callStarted? <Button className="mt-20" onClick={StartCall}>
            <PhoneCall /> Start Call </Button>
            : <Button variant={'destructive'} onClick={endCall} > <PhoneOff /> Disconnect</Button>
          }
        </div>
      )}
    </div>
  );
}

export default MedicalVoiceAgent;