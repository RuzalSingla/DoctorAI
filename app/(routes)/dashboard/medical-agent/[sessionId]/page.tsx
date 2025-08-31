"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { doctorAgent } from "../../_components/DoctorAgentCard";
import { Circle, PhoneCall } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  selectedDoctor: doctorAgent;
  createdOn: string;
};

function MedicalVoiceAgent() {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>();
  const [aiReply, setAiReply] = useState<string>("");

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
      setAiReply(result.data.aiReply);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-5 border rounded-3xl bg-secondary">
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle className="h-4 w-4" /> Not Connected
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

          <div className="mt-32 text-center">
            <h2 className="text-gray-400">Assistant Msg</h2>
            <h2 className="text-lg">{aiReply || "Waiting for AI..."}</h2>

            <h2 className="mt-5 text-gray-400">User Msg</h2>
            <h2 className="text-lg">{sessionDetail.notes}</h2>
          </div>

          <Button className="mt-20">
            <PhoneCall />
            Start Call
          </Button>
        </div>
      )}
    </div>
  );
}

export default MedicalVoiceAgent;
