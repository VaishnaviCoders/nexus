'use client';

import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertCircle,
  CheckCircle,
  Copy,
  Download,
  FileText,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';
import { CalendarEventType } from '@prisma/client';
// import { createBulkHolidays } from "@/app/actions/holiday-actions"

// CSV template for holidays
const CSV_TEMPLATE = `Holiday Name,Start Date,End Date,Type,Reason,Is Recurring
Diwali,2024-11-12,2024-11-12,PLANNED,Festival celebration,true
Winter Break,2024-12-24,2024-12-31,PLANNED,Winter vacation,false
Emergency Closure,2024-03-15,2024-03-15,SUDDEN,Weather emergency,false
Republic Day,2024-01-26,2024-01-26,PLANNED,National holiday,true
Holi,2024-03-14,2024-03-14,PLANNED,Festival of colors,true`;

interface BulkImportFormProps {
  organizationId: string;
  onSuccess: () => void;
}

interface ParsedHoliday {
  name: string;
  startDate: Date;
  endDate: Date;
  type: CalendarEventType;
  reason: string;
  isRecurring: boolean;
}

export default function BulkImportForm({
  organizationId,
  onSuccess,
}: BulkImportFormProps) {
  const [csvText, setCsvText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [sheetUrl, setSheetUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedHoliday[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'holiday_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded successfully');
  };

  const copyTemplate = () => {
    navigator.clipboard.writeText(CSV_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Template copied to clipboard');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Read file content
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setCsvText(content);
      };
      reader.readAsText(selectedFile);
    }
  };

  const parseCSV = (csvContent: string): ParsedHoliday[] | null => {
    try {
      setParseError(null);

      // Split by lines and filter out empty lines
      const lines = csvContent.split('\n').filter((line) => line.trim());

      // Skip header row
      if (lines.length < 2) {
        setParseError(
          'CSV must contain a header row and at least one data row'
        );
        return null;
      }

      const dataRows = lines.slice(1);
      const parsedHolidays: ParsedHoliday[] = [];

      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i];
        const columns = row.split(',').map((col) => col.trim());

        if (columns.length < 6) {
          setParseError(
            `Row ${i + 2} has insufficient columns. Expected 6 columns.`
          );
          return null;
        }

        const [
          name,
          startDateStr,
          endDateStr,
          typeStr,
          reason,
          isRecurringStr,
        ] = columns;

        // Validate dates
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);

        if (isNaN(startDate.getTime())) {
          setParseError(`Invalid start date in row ${i + 2}: ${startDateStr}`);
          return null;
        }

        if (isNaN(endDate.getTime())) {
          setParseError(`Invalid end date in row ${i + 2}: ${endDateStr}`);
          return null;
        }

        // Validate type
        const type = typeStr as CalendarEventType;
        if (!Object.values(CalendarEventType).includes(type)) {
          setParseError(
            `Invalid type in row ${
              i + 2
            }: ${typeStr}. Must be PLANNED, SUDDEN, or INSTITUTION_SPECIFIC`
          );
          return null;
        }

        // Parse boolean
        const isRecurring = isRecurringStr.toLowerCase() === 'true';

        parsedHolidays.push({
          name,
          startDate,
          endDate,
          type,
          reason,
          isRecurring,
        });
      }

      return parsedHolidays;
    } catch (error) {
      setParseError(
        `Failed to parse CSV: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      return null;
    }
  };

  const handlePreview = () => {
    if (!csvText.trim()) {
      toast.error('Please enter or upload CSV data first');
      return;
    }

    const parsed = parseCSV(csvText);
    if (parsed) {
      setParsedData(parsed);
      setPreviewMode(true);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (!csvText.trim()) {
        toast.error('Please enter or upload CSV data first');
        return;
      }

      const parsed = parseCSV(csvText);
      if (!parsed) return;

      // Call server action to create bulk holidays
      //   await createBulkHolidays({
      //     holidays: parsed.map((holiday) => ({
      //       ...holiday,
      //       organizationId,
      //     })),
      //   })

      toast.success(`Successfully imported ${parsed.length} holidays`);
      setCsvText('');
      setFile(null);
      setPreviewMode(false);
      onSuccess();
    } catch (error) {
      toast.error(
        `Failed to import holidays: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSheetImport = async () => {
    try {
      setIsSubmitting(true);

      if (!sheetUrl.trim()) {
        toast.error('Please enter a Google Sheet URL');
        return;
      }

      // Extract sheet ID from URL
      const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (!match) {
        toast.error('Invalid Google Sheet URL format');
        return;
      }

      const sheetId = match[1];

      // Fetch CSV export from Google Sheets
      // Note: This requires the sheet to be publicly accessible with link sharing enabled
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

      const response = await fetch(csvUrl);
      if (!response.ok) {
        toast.error(
          "Failed to access Google Sheet. Make sure it's publicly accessible."
        );
        return;
      }

      const content = await response.text();
      setCsvText(content);

      const parsed = parseCSV(content);
      if (parsed) {
        setParsedData(parsed);
        setPreviewMode(true);
      }
    } catch (error) {
      toast.error(
        `Failed to import from Google Sheets: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {!previewMode ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="csv-upload">Upload CSV File</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  {file && (
                    <Button variant="outline" onClick={() => setFile(null)}>
                      Clear
                    </Button>
                  )}
                </div>
                {file && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Selected file: {file.name}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="csv-text">Or Paste CSV Data</Label>
                <Textarea
                  id="csv-text"
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder="Paste your CSV data here..."
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="sheet-url">Import from Google Sheets</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="sheet-url"
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                  />
                  <Button
                    onClick={handleGoogleSheetImport}
                    disabled={!sheetUrl || isSubmitting}
                    variant="outline"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Sheet must be publicly accessible with link sharing enabled
                </p>
              </div>

              <div className="space-y-2">
                <Label>CSV Template</Label>
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <pre className="text-xs font-mono whitespace-pre-wrap overflow-x-auto">
                    {CSV_TEMPLATE}
                  </pre>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={downloadTemplate}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                  <Button onClick={copyTemplate} variant="outline" size="sm">
                    {copied ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copied ? 'Copied!' : 'Copy Template'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {parseError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{parseError}</AlertDescription>
            </Alert>
          )}

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Date Format:</strong> YYYY-MM-DD | <strong>Type:</strong>{' '}
              PLANNED, SUDDEN, or INSTITUTION_SPECIFIC |{' '}
              <strong>Is Recurring:</strong> true or false
            </AlertDescription>
          </Alert>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handlePreview}
              disabled={!csvText.trim() || isSubmitting}
            >
              Preview Data
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!csvText.trim() || isSubmitting}
            >
              <FileText className="w-4 h-4 mr-2" />
              Import Holidays
            </Button>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Preview ({parsedData.length} holidays)
          </h3>

          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="px-4 py-2 text-left font-medium">Name</th>
                    <th className="px-4 py-2 text-left font-medium">
                      Start Date
                    </th>
                    <th className="px-4 py-2 text-left font-medium">
                      End Date
                    </th>
                    <th className="px-4 py-2 text-left font-medium">Type</th>
                    <th className="px-4 py-2 text-left font-medium">Reason</th>
                    <th className="px-4 py-2 text-left font-medium">
                      Recurring
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {parsedData.map((holiday, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-muted/30'}
                    >
                      <td className="px-4 py-2">{holiday.name}</td>
                      <td className="px-4 py-2">
                        {holiday.startDate.toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        {holiday.endDate.toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">{holiday.type}</td>
                      <td className="px-4 py-2">{holiday.reason}</td>
                      <td className="px-4 py-2">
                        {holiday.isRecurring ? 'Yes' : 'No'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPreviewMode(false)}>
              Back to Edit
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Importing...' : 'Confirm Import'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
