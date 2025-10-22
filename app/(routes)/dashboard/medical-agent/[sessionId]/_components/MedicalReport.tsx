"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  User, 
  Calendar, 
  AlertCircle, 
  Activity, 
  Clock, 
  Pill, 
  ClipboardList 
} from "lucide-react";

export type MedicalReportData = {
  sessionId: string;
  agent: string;
  user: string;
  timestamp: string;
  chiefComplaint: string;
  summary: string;
  symptoms: string[];
  duration: string;
  severity: "mild" | "moderate" | "severe";
  medicationsMentioned: string[];
  recommendations: string[];
};

type MedicalReportProps = {
  report: MedicalReportData;
};

export function MedicalReport({ report }: MedicalReportProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "mild":
        return "bg-green-100 text-green-800 border-green-300";
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "severe":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const formatDate = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timestamp;
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6 bg-white print-w-100">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b-2 border-primary pb-4">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Medical Consultation Report</h1>
            <p className="text-sm text-gray-500">AI-Generated Medical Summary</p>
          </div>
        </div>
        <div className="flex items-center gap-2 no-print">
          <button onClick={handlePrint} className="inline-flex items-center gap-2 px-3 py-1.5 border rounded bg-accent text-accent-foreground">
            <FileText className="h-4 w-4" /> Print
          </button>
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Session Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Patient</p>
            <p className="font-medium">{report.user || "Anonymous"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Consulting Agent</p>
            <p className="font-medium">{report.agent}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Date & Time
            </p>
            <p className="font-medium">{formatDate(report.timestamp)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Session ID</p>
            <p className="font-mono text-xs">{report.sessionId}</p>
          </div>
        </CardContent>
      </Card>

      {/* Chief Complaint */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Chief Complaint
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">{report.chiefComplaint}</p>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Consultation Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{report.summary}</p>
        </CardContent>
      </Card>

      {/* Clinical Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Symptoms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent>
            {report.symptoms && report.symptoms.length > 0 ? (
              <ul className="space-y-2">
                {report.symptoms.map((symptom, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No symptoms recorded</p>
            )}
          </CardContent>
        </Card>

        {/* Duration & Severity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Duration & Severity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Duration</p>
              <p className="font-medium">{report.duration || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Severity Level</p>
              <Badge className={getSeverityColor(report.severity)}>
                {report.severity?.toUpperCase() || "UNKNOWN"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medications */}
      {report.medicationsMentioned && report.medicationsMentioned.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Medications Mentioned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.medicationsMentioned.map((med, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  <span>{med}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <ClipboardList className="h-5 w-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {report.recommendations && report.recommendations.length > 0 ? (
            <ol className="space-y-3">
              {report.recommendations.map((rec, index) => (
                <li key={index} className="flex gap-3">
                  <span className="font-bold text-primary">{index + 1}.</span>
                  <span className="flex-1">{rec}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-gray-500">No recommendations provided</p>
          )}
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Disclaimer:</strong> This report is generated by an AI medical assistant and 
          should not be considered as a substitute for professional medical advice, diagnosis, or 
          treatment. Always seek the advice of your physician or other qualified health provider 
          with any questions you may have regarding a medical condition.
        </p>
      </div>
    </div>
  );
}
