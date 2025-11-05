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
  ClipboardList,
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
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "moderate":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "severe":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
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
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 print-w-100 bg-white text-slate-900">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-gradient-to-br from-violet-600 to-pink-500 p-2 shadow-md">
            <FileText className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Medical Consultation Report
            </h1>
            <p className="text-sm text-slate-600">
              AI-generated medical summary
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 no-print">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-md bg-slate-50 px-3 py-1.5 text-sm text-slate-900 ring-1 ring-slate-200 hover:opacity-95"
          >
            <FileText className="h-4 w-4" /> Print
          </button>
        </div>
      </div>

      {/* Basic Information */}
      <Card className="bg-white border border-slate-200 text-slate-900 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <User className="h-5 w-5 text-slate-700" />
            Session Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-800">
          <div>
            <p className="text-sm text-slate-600">Patient</p>
            <p className="font-medium text-slate-900">
              {report.user || "Anonymous"}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Consulting Agent</p>
            <p className="font-medium text-slate-900">{report.agent}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 flex items-center gap-1">
              <Calendar className="h-4 w-4 text-slate-700" />
              Date &amp; Time
            </p>
            <p className="font-medium text-slate-900">
              {formatDate(report.timestamp)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Session ID</p>
            <p className="font-mono text-xs text-slate-700">
              {report.sessionId}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Chief Complaint */}
      <Card className="bg-white border border-slate-200 text-slate-900 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <AlertCircle className="h-5 w-5 text-slate-700" />
            Chief Complaint
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-slate-900">{report.chiefComplaint}</p>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <ClipboardList className="h-5 w-5 text-slate-700" />
            Consultation Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="text-slate-800 leading-relaxed">
          <p className="whitespace-pre-wrap text-slate-800">{report.summary}</p>
        </CardContent>
      </Card>

      {/* Clinical Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Symptoms */}
        <Card className="bg-white border border-slate-200 text-slate-900 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Activity className="h-5 w-5 text-slate-700" />
              Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent>
            {report.symptoms && report.symptoms.length > 0 ? (
              <ul className="space-y-2">
                {report.symptoms.map((symptom, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1 text-slate-500">•</span>
                    <span className="text-slate-800">{symptom}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-600">No symptoms recorded</p>
            )}
          </CardContent>
        </Card>

        {/* Duration & Severity */}
        <Card className="bg-white border border-slate-200 text-slate-900 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Clock className="h-5 w-5 text-slate-700" />
              Duration & Severity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-800">
            <div>
              <p className="text-sm text-slate-600 mb-1">Duration</p>
              <p className="font-medium text-slate-900">
                {report.duration || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-2">Severity Level</p>
              <Badge
                className={
                  getSeverityColor(report.severity) +
                  " ring-1 ring-slate-200 px-3 py-1 rounded-full text-sm"
                }
              >
                {report.severity?.toUpperCase() || "UNKNOWN"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medications */}
      {report.medicationsMentioned &&
        report.medicationsMentioned.length > 0 && (
          <Card className="bg-white border border-slate-200 text-slate-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Pill className="h-5 w-5 text-slate-700" />
                Medications Mentioned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {report.medicationsMentioned.map((med, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-slate-700"
                  >
                    <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                    <span>{med}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

      {/* Recommendations */}
      <Card className="bg-white border border-slate-200 text-slate-900 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <ClipboardList className="h-5 w-5 text-slate-700" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {report.recommendations && report.recommendations.length > 0 ? (
            <ol className="space-y-3">
              {report.recommendations.map((rec, index) => (
                <li key={index} className="flex gap-3">
                  <span className="font-bold text-slate-800">{index + 1}.</span>
                  <span className="flex-1 text-slate-700">{rec}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-slate-500">No recommendations provided</p>
          )}
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="rounded-lg p-4 bg-slate-50 border border-slate-200 text-slate-700">
        <p className="text-sm">
          <strong>Disclaimer:</strong> This report is generated by an AI medical
          assistant and should not be considered as a substitute for
          professional medical advice, diagnosis, or treatment. Always seek the
          advice of your physician or other qualified health provider with any
          questions you may have regarding a medical condition.
        </p>
      </div>
    </div>
  );
}
