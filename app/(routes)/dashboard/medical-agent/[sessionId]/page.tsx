// "use client";
// import { useParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { doctorAgent } from "../../_components/DoctorAgentCard";
// import { Circle, PhoneCall, PhoneOff, FileText, Download, Loader2 } from "lucide-react";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import Vapi from '@vapi-ai/web';
// import { MedicalReport, MedicalReportData } from "./_components/MedicalReport";

// type SessionDetail = {
//   id: number,
//   notes: string,
//   sessionId: string,
//   selectedDoctor: doctorAgent,
//   createdOn: string

// };

// type messages={
//   role:string,
//   text:string
// }

// function MedicalVoiceAgent() {
//   const { sessionId } = useParams();
//   const [sessionDetail, setSessionDetail] = useState<SessionDetail>();
//   const [callStarted,setCallStarted]=useState(false);
//   //const [aiReply, setAiReply] = useState<string>("");
//   const [vapiInstance , setVapiInstance]=useState<any>();
//   const [currentRole , setCurrentRole]=useState<string|null>();

//   const [LiveTranscript , setLiveTranscript]=useState<string>();
//   const [messages , setMessages]=useState<messages[]>([]);
//   const [report, setReport] = useState<MedicalReportData | null>(null);
//   const [isGeneratingReport, setIsGeneratingReport] = useState(false);
//   const [showReport, setShowReport] = useState(false);

//  // ✅ Named event handlers
//   const handleCallStart = () => {
//     console.log("Call started");
//     setCallStarted(true);
//   };

//   const handleCallEnd = () => {
//     console.log("Call ended");
//     setCallStarted(false);
//   };

//   const handleMessage = (message: any) => {
//     if (message.type === "transcript") {
//       const { role, transcriptType, transcript } = message;
//       console.log(`${role}: ${transcript}`);
//       if (transcriptType === "partial") {
//         setLiveTranscript(transcript);
//         setCurrentRole(role);
//       } else if (transcriptType === "final") {
//         setMessages((prev: any) => [...prev, { role, text: transcript }]);
//         setLiveTranscript("");
//         setCurrentRole(null);
//       }
//     }
//   };

//   // Start voice conversation
//   const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);

//   useEffect(() => {
//     if (sessionId) {
//       GetSessionDetails();
//       CheckExistingReport();
//     }
//   }, [sessionId]);

//   const GetSessionDetails = async () => {
//     try {
//       const result = await axios.get(
//         "/api/users/session-chat?sessionId=" + sessionId
//       );
//       console.log(result.data);

//       // set state properly
//       setSessionDetail(result.data.session);
//       //setAiReply(result.data.aiReply);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const CheckExistingReport = async () => {
//     try {
//       const result = await axios.get(
//         "/api/users/medical-report?sessionId=" + sessionId
//       );
//       if (result.data.success && result.data.hasReport) {
//         setReport(result.data.report);
//       }
//     } catch (err) {
//       console.error("Error checking existing report:", err);
//     }
//   };

//   const StartCall=()=>{
//     //setLoading(true);
//     const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
//     setVapiInstance(vapi);

//     const VapiAgentConfig={
//       name:'AI Medical Doctor Voice Agent',
//       firstMessage:"Hi there! I''m your Ai Medical Assistant. I'm here to help you with any health questions or concerns you might have today.How are you feeling?",
//       transcriber:{
//         provider:'assembly-ai',
//         language:'en'

//       },
//       voice:{
//         provider:'vapi',
//         voiceId:sessionDetail?.selectedDoctor?.voiceId
//       },
//       model:{
//         provider:'openai',
//         model:'gpt-5',
//         messages:[
//           {
//               role: 'system',
//               content:sessionDetail?.selectedDoctor?.agentPrompt
//           }
//         ]
//       }

//     }
//     //@ts-ignore
//     vapi.start(VapiAgentConfig);
//     // Listen for events
//     vapi.on('call-start', () => {

//       console.log('Call started')
//       setCallStarted(true);
//     });
//     vapi.on('call-end', () => {
//       console.log('Call ended')
//       setCallStarted(false);

//     });
//     vapi.on('message', (message) => {
//       if (message.type === 'transcript') {
//         const{role , transcriptType , transcript }=message;
//         console.log(`${message.role}: ${message.transcript}`);
//         if(transcriptType=='partial')
//         {
//         setLiveTranscript(transcript);
//         setCurrentRole(role);
//         }
//         else if(transcriptType=='final'){
//           // Final Transcript
//           setMessages((prev: any)=>[...prev , {role:role, text:transcript}])
//           setLiveTranscript("");
//           setCurrentRole(null);
//         }
//       }
//     });

//     // Attach handlers
//     vapi.on("call-start", handleCallStart);
//     vapi.on("call-end", handleCallEnd);
//     vapi.on("message", handleMessage);

//     vapi.on('speech-start', () => {
//       console.log('Assistant started speaking');
//       setCurrentRole('assistant');
//     });
//     vapi.on('speech-end', () => {
//       console.log('Assistant stopped speaking');
//       setCurrentRole('user');
//     });

//   }

//   const endCall = async() => {
//     if (!vapiInstance)  return ;
//       // Stop the call
//       vapiInstance.stop();

//       //Optinally remove listeners(good for memory management)
//       // vapiInstance.off('call-start');
//       // vapiInstance.off('call-end');
//       // vapiInstance.off('message');

//       // ✅ Proper cleanup

//       vapiInstance.off("call-start", handleCallStart);
//       vapiInstance.off("call-end", handleCallEnd);
//       vapiInstance.off("message", handleMessage);

//       // Reset the call state
//       setCallStarted(false);
//       setVapiInstance(null); // imp

//       // Auto-generate report after call ends
//       if (messages.length > 0) {
//         await GenerateReport();
//       }
//   };

//   const GenerateReport = async() => {
//     setIsGeneratingReport(true);
//     try {
//       const result = await axios.post('/api/users/medical-report',{
//         messages:messages,
//         sessionDetail:sessionDetail,
//         sessionId: sessionId
//       });
//       console.log("Report generated:", result.data);
//       if (result.data.success) {
//         setReport(result.data.report);
//         setShowReport(true);
//       }
//       return result.data;
//     } catch (error) {
//       console.error("Error generating report:", error);
//       alert("Failed to generate report. Please try again.");
//     } finally {
//       setIsGeneratingReport(false);
//     }
//   };

//   const downloadReport = () => {
//     if (!report) return;

//     // Create a formatted text version for download
//     const reportText = `
// MEDICAL CONSULTATION REPORT
// ========================================

// Session ID: ${report.sessionId}
// Patient: ${report.user}
// Consulting Agent: ${report.agent}
// Date & Time: ${new Date(report.timestamp).toLocaleString()}

// CHIEF COMPLAINT
// ----------------------------------------
// ${report.chiefComplaint}

// CONSULTATION SUMMARY
// ----------------------------------------
// ${report.summary}

// SYMPTOMS
// ----------------------------------------
// ${report.symptoms?.map((s, i) => `${i + 1}. ${s}`).join('\n') || 'None recorded'}

// DURATION: ${report.duration || 'Not specified'}
// SEVERITY: ${report.severity?.toUpperCase() || 'Not specified'}

// MEDICATIONS MENTIONED
// ----------------------------------------
// ${report.medicationsMentioned?.map((m, i) => `${i + 1}. ${m}`).join('\n') || 'None'}

// RECOMMENDATIONS
// ----------------------------------------
// ${report.recommendations?.map((r, i) => `${i + 1}. ${r}`).join('\n') || 'None'}

// ========================================
// DISCLAIMER: This report is generated by an AI medical assistant and should not be
// considered as a substitute for professional medical advice, diagnosis, or treatment.
// Always seek the advice of your physician or other qualified health provider.
// ========================================
//     `;

//     const blob = new Blob([reportText], { type: 'text/plain' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `medical-report-${report.sessionId}.txt`;
//     document.body.appendChild(a);
//     a.click();
//     window.URL.revokeObjectURL(url);
//     document.body.removeChild(a);
//   };

//   return (
//     <div className="p-5 border rounded-3xl bg-secondary">
//       <div className="flex justify-between items-center">
//         <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
//           <Circle className={`h-4 w-4 rounded-full ${callStarted ? 'bg-green-500' : 'bg-red-500'}`} />
// {callStarted ? 'Connected...' : 'Not Connected'}

//         </h2>
//         <h2 className="font-bold text-xl text-gray-400">00:00</h2>
//       </div>

//       {sessionDetail && (
//         <div className="flex items-center flex-col mt-10">
//           <Image
//             src={sessionDetail?.selectedDoctor?.image}
//             alt={sessionDetail?.selectedDoctor?.specialist}
//             width={120}
//             height={120}
//             className="h-[100px] w-[100px] object-cover rounded-full"
//           />

//           <h2 className="mt-2 text-lg">{sessionDetail?.selectedDoctor?.specialist}</h2>
//           <p className="text-sm text-gray-400">AI Medical Voice Agent</p>
//           <h2 className="mt-5 text-gray-400 text-center">Symptoms</h2>
//           <h2 className="text-lg">{sessionDetail.notes}</h2>
//           <div className="mt-12 overflow-y-auto flex flex-col  items-start px-7 md:px-18 lg:px-42 xl:px-62
//           ">

//             {messages?.map((msg:messages , index)=>(

//                   <h2 className="text-gray-400 p-0.5" key ={index}>{msg.role}:{msg.text}</h2>

//             ))}

//             {LiveTranscript && LiveTranscript?.length>0&& <h2 className="text-lg">{currentRole}:{LiveTranscript}</h2>}

//             {/*<h2 className="mt-5 text-gray-400">User Msg</h2>*/}

//           </div>

//           {!callStarted? <Button className="mt-20" onClick={StartCall}>
//             <PhoneCall /> Start Call </Button>
//             : <Button variant={'destructive'} onClick={endCall} > <PhoneOff /> Disconnect</Button>
//           }

//           {/* Report Section */}
//           <div className="mt-6 flex gap-4 items-center justify-center">
//             {isGeneratingReport && (
//               <div className="flex items-center gap-2 text-sm text-gray-500">
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 Generating report...
//               </div>
//             )}

//             {report && !isGeneratingReport && (
//               <>
//                 <Dialog open={showReport} onOpenChange={setShowReport}>
//                   <DialogTrigger asChild>
//                     <Button variant="outline" className="gap-2">
//                       <FileText className="h-4 w-4" />
//                       View Report
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
//                     <DialogHeader>
//                       <DialogTitle>Medical Consultation Report</DialogTitle>
//                     </DialogHeader>
//                     <MedicalReport report={report} />
//                   </DialogContent>
//                 </Dialog>

//                 <Button variant="outline" className="gap-2" onClick={downloadReport}>
//                   <Download className="h-4 w-4" />
//                   Download Report
//                 </Button>
//               </>
//             )}

//             {!report && !isGeneratingReport && messages.length > 0 && !callStarted && (
//               <Button onClick={GenerateReport} className="gap-2">
//                 <FileText className="h-4 w-4" />
//                 Generate Report
//               </Button>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default MedicalVoiceAgent;
"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { doctorAgent } from "../../_components/DoctorAgentCard";
import {
  Circle,
  PhoneCall,
  PhoneOff,
  FileText,
  Download,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Vapi from "@vapi-ai/web";
import { MedicalReport, MedicalReportData } from "./_components/MedicalReport";

type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  selectedDoctor: doctorAgent;
  createdOn: string;
};

type Message = {
  role: string;
  text: string;
};

function MedicalVoiceAgent() {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>();
  const [callStarted, setCallStarted] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>(null);
  const [currentRole, setCurrentRole] = useState<string | null>();
  const [LiveTranscript, setLiveTranscript] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [report, setReport] = useState<MedicalReportData | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showReport, setShowReport] = useState(false);

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

  // 🔹 Load session details & existing report
  useEffect(() => {
    if (sessionId) {
      GetSessionDetails();
      CheckExistingReport();
    }
  }, [sessionId]);

  const GetSessionDetails = async () => {
    try {
      const result = await axios.get(
        "/api/users/session-chat?sessionId=" + sessionId
      );
      setSessionDetail(result.data.session);
    } catch (err) {
      console.error(err);
    }
  };

  const CheckExistingReport = async () => {
    try {
      const result = await axios.get(
        "/api/users/medical-report?sessionId=" + sessionId
      );
      if (result.data.success && result.data.hasReport) {
        setReport(result.data.report);
      }
    } catch (err) {
      console.error("Error checking existing report:", err);
    }
  };

  // 🔹 Start voice conversation
  const StartCall = () => {
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi);

    const VapiAgentConfig = {
      name: "AI Medical Doctor Voice Agent",
      firstMessage:
        "Hi there! I'm your AI Medical Assistant. I'm here to help you with any health questions or concerns you might have today. How are you feeling?",
      transcriber: {
        provider: "assemblyai",
        language: "en",
      },
      voice: {
        provider: "vapi",
        voiceId: sessionDetail?.selectedDoctor?.voiceId,
      },
      model: {
        provider: "openai",
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: sessionDetail?.selectedDoctor?.agentPrompt,
          },
        ],
      },
    };

    // Start the AI call
    vapi.start(VapiAgentConfig);

    // Attach listeners
    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("message", handleMessage);

    vapi.on("speech-start", () => {
      console.log("Assistant started speaking");
      setCurrentRole("assistant");
    });
    vapi.on("speech-end", () => {
      console.log("Assistant stopped speaking");
      setCurrentRole("user");
    });
  };

  // 🔹 End call safely
  const endCall = async () => {
    if (!vapiInstance) return;

    try {
      console.log("Ending call...");
      await vapiInstance.stop();

      vapiInstance.off("call-start", handleCallStart);
      vapiInstance.off("call-end", handleCallEnd);
      vapiInstance.off("message", handleMessage);

      setCallStarted(false);
      setVapiInstance(null);

      if (messages.length > 0) {
        await GenerateReport();
      }
    } catch (err) {
      console.error("Error stopping call:", err);
    }
  };

  // 🔹 Cleanup on unmount (optional but best practice)
  useEffect(() => {
    return () => {
      if (vapiInstance) {
        vapiInstance.stop();
      }
    };
  }, [vapiInstance]);

  // 🔹 Generate medical report
  const GenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const result = await axios.post("/api/users/medical-report", {
        messages: messages,
        sessionDetail: sessionDetail,
        sessionId: sessionId,
      });
      if (result.data.success) {
        setReport(result.data.report);
        setShowReport(true);
      }
      return result.data;
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // 🔹 Download text report
  const downloadReport = () => {
    if (!report) return;

    const reportText = `
MEDICAL CONSULTATION REPORT
========================================
Session ID: ${report.sessionId}
Patient: ${report.user}
Consulting Agent: ${report.agent}
Date & Time: ${new Date(report.timestamp).toLocaleString()}

CHIEF COMPLAINT
----------------------------------------
${report.chiefComplaint}

CONSULTATION SUMMARY
----------------------------------------
${report.summary}

SYMPTOMS
----------------------------------------
${
  report.symptoms?.map((s, i) => `${i + 1}. ${s}`).join("\n") || "None recorded"
}

DURATION: ${report.duration || "Not specified"}
SEVERITY: ${report.severity?.toUpperCase() || "Not specified"}

MEDICATIONS MENTIONED
----------------------------------------
${
  report.medicationsMentioned?.map((m, i) => `${i + 1}. ${m}`).join("\n") ||
  "None"
}

RECOMMENDATIONS
----------------------------------------
${report.recommendations?.map((r, i) => `${i + 1}. ${r}`).join("\n") || "None"}

========================================
DISCLAIMER: This report is generated by an AI medical assistant and should not be 
considered as a substitute for professional medical advice, diagnosis, or treatment.
Always seek the advice of your physician or other qualified health provider.
========================================
`;

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `medical-report-${report.sessionId}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // 🔹 UI
  return (
    <div className="p-5 border rounded-3xl bg-secondary">
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle
            className={`h-4 w-4 rounded-full ${
              callStarted ? "bg-green-500" : "bg-red-500"
            }`}
          />
          {callStarted ? "Connected..." : "Not Connected"}
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

          <h2 className="mt-2 text-lg">
            {sessionDetail?.selectedDoctor?.specialist}
          </h2>
          <p className="text-sm text-gray-400">AI Medical Voice Agent</p>
          <h2 className="mt-5 text-gray-400 text-center">Symptoms</h2>
          <h2 className="text-lg">{sessionDetail.notes}</h2>

          <div className="mt-12 overflow-y-auto flex flex-col items-start px-7 md:px-18 lg:px-42 xl:px-62">
            {messages?.map((msg: Message, index) => (
              <h2 className="text-gray-400 p-0.5" key={index}>
                {msg.role}: {msg.text}
              </h2>
            ))}

            {LiveTranscript && LiveTranscript?.length > 0 && (
              <h2 className="text-lg">
                {currentRole}: {LiveTranscript}
              </h2>
            )}
          </div>

          {!callStarted ? (
            <Button className="mt-20" onClick={StartCall}>
              <PhoneCall /> Start Call
            </Button>
          ) : (
            <Button variant={"destructive"} onClick={endCall}>
              <PhoneOff /> Disconnect
            </Button>
          )}

          {/* Report Section */}
          <div className="mt-6 flex gap-4 items-center justify-center">
            {isGeneratingReport && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating report...
              </div>
            )}

            {report && !isGeneratingReport && (
              <>
                <Dialog open={showReport} onOpenChange={setShowReport}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <FileText className="h-4 w-4" />
                      View Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Medical Consultation Report</DialogTitle>
                    </DialogHeader>
                    <MedicalReport report={report} />
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={downloadReport}
                >
                  <Download className="h-4 w-4" />
                  Download Report
                </Button>
              </>
            )}

            {!report &&
              !isGeneratingReport &&
              messages.length > 0 &&
              !callStarted && (
                <Button onClick={GenerateReport} className="gap-2">
                  <FileText className="h-4 w-4" />
                  Generate Report
                </Button>
              )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicalVoiceAgent;
