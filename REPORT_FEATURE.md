# Medical Report Generation Feature

## Overview
This feature automatically generates a comprehensive medical consultation report after each voice consultation session with the AI Medical Agent.

## Features Implemented

### 1. **Automatic Report Generation**
   - Report is automatically generated when the call ends
   - Uses AI (Gemini 2.5 Flash) to analyze the conversation
   - Stores report in the database for future reference

### 2. **Report Components**
   - **Session Information**: Patient name, agent, date/time, session ID
   - **Chief Complaint**: Main health concern summarized
   - **Consultation Summary**: 2-3 sentence overview
   - **Symptoms**: List of all symptoms mentioned
   - **Duration & Severity**: How long symptoms lasted and severity level
   - **Medications**: Any medications mentioned during consultation
   - **Recommendations**: AI-generated suggestions and next steps
   - **Disclaimer**: Professional medical disclaimer

### 3. **User Interface Features**
   - **View Report Button**: Opens a dialog with formatted report
   - **Download Report**: Downloads report as a text file
   - **Generate Report Button**: Manual option to generate report if needed
   - **Loading State**: Shows when report is being generated

### 4. **Report Display**
   - Beautiful, professional-looking format
   - Color-coded severity badges (mild/moderate/severe)
   - Icons for each section
   - Responsive design
   - Printable format

## Files Created/Modified

### New Files:
1. **`app/(routes)/dashboard/medical-agent/[sessionId]/_components/MedicalReport.tsx`**
   - React component for displaying the medical report
   - Professional formatting with cards and badges
   - Color-coded severity indicators

2. **`components/ui/card.tsx`**
   - Reusable Card UI component

3. **`components/ui/badge.tsx`**
   - Reusable Badge UI component for severity indicators

### Modified Files:
1. **`app/(routes)/dashboard/medical-agent/[sessionId]/page.tsx`**
   - Added report generation logic
   - Added UI for viewing and downloading reports
   - Integrated report checking on page load
   - Auto-generates report after call ends

2. **`app/api/users/medical-report/route.tsx`**
   - Fixed content parsing from AI response
   - Added GET endpoint to fetch existing reports
   - Improved error handling
   - Saves both report and conversation to database

## How It Works

### Flow:
1. User starts a voice consultation with AI Medical Agent
2. Conversation is recorded in real-time
3. When user ends the call, report generation starts automatically
4. AI analyzes the conversation and generates structured report
5. Report is saved to database
6. User can view the report in a modal dialog
7. User can download the report as a text file

### API Endpoints:

#### POST `/api/users/medical-report`
Generates a new medical report from conversation data.

**Request Body:**
```json
{
  "sessionId": "string",
  "sessionDetail": { /* session info */ },
  "messages": [ /* conversation array */ ]
}
```

**Response:**
```json
{
  "success": true,
  "report": {
    "sessionId": "string",
    "agent": "string",
    "user": "string",
    "timestamp": "ISO date string",
    "chiefComplaint": "string",
    "summary": "string",
    "symptoms": ["symptom1", "symptom2"],
    "duration": "string",
    "severity": "mild|moderate|severe",
    "medicationsMentioned": ["med1", "med2"],
    "recommendations": ["rec1", "rec2"]
  }
}
```

#### GET `/api/users/medical-report?sessionId=xxx`
Retrieves existing report for a session.

**Response:**
```json
{
  "success": true,
  "report": { /* report object */ },
  "hasReport": true
}
```

## Database Schema
The `SessionChatTable` already has a `report` field (json type) to store the generated reports.

## Dependencies
- `class-variance-authority` - For badge styling variants

## Usage

1. **During Consultation**: Have a conversation with the AI Medical Agent
2. **End Call**: Click "Disconnect" button
3. **View Report**: Click "View Report" to see the formatted report
4. **Download**: Click "Download Report" to save as text file
5. **Manual Generation**: If needed, click "Generate Report" to create report manually

## Future Enhancements (Optional)

- PDF export instead of plain text
- Email report to patient
- Print-optimized CSS
- Report history view
- Edit report before finalizing
- Multiple report templates
- Integration with patient health records

## Notes

- Reports persist in the database
- Can be viewed again by revisiting the session
- Professional disclaimer included in all reports
- AI-generated content may require human review
- Suitable for preliminary consultation summaries
