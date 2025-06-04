'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CalendarEventType } from '@prisma/client';
import {
  AlertCircle,
  CheckCircle,
  Link,
  Loader2,
  Info,
  HelpCircle,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { PopoverContent } from '@radix-ui/react-popover';
import { goggleImportHolidayFormSchema } from '@/lib/schemas';
import { z } from 'zod';
import { ImportGoogleSheetHolidayAction } from '@/lib/data/holiday/import-google-sheet-holiday-action';

interface ParsedHoliday {
  name: string;
  startDate: Date;
  endDate: Date;
  type: CalendarEventType;
  reason: string;
  isRecurring: boolean;
}

const EXPECTED_HEADERS = [
  'name',
  'startDate',
  'endDate',
  'type',
  'reason',
  'isRecurring',
];

// Enhanced date parsing to handle multiple formats

const HolidayGoogleSheetImporter = () => {
  const [sheetUrl, setSheetUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [parsedData, setParsedData] = useState<z.infer<
    typeof goggleImportHolidayFormSchema
  > | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  const parseFlexibleDate = (
    dateString: string,
    rowIndex: number
  ): Date | null => {
    if (!dateString || typeof dateString !== 'string') {
      setParseError(
        `Invalid date at row ${rowIndex + 2}. Date string is empty or invalid.`
      );
      return null;
    }

    const trimmed = dateString.trim();
    if (!trimmed) {
      setParseError(`Empty date at row ${rowIndex + 2}.`);
      return null;
    }

    // Helper function to validate days in a month
    const isValidDayForMonth = (
      day: number,
      month: number,
      year: number
    ): boolean => {
      const daysInMonth = new Date(year, month, 0).getDate(); // Get days in month
      return day >= 1 && day <= daysInMonth;
    };

    // Try ISO format (YYYY-MM-DD)
    if (trimmed.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const date = new Date(trimmed);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }

    // Try DD/MM/YYYY, DD-MM-YYYY
    const standardMatch = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (standardMatch) {
      const [_, day, month, year] = standardMatch.map(Number);
      if (month >= 1 && month <= 12 && isValidDayForMonth(day, month, year)) {
        const date = new Date(year, month - 1, day);
        if (
          !isNaN(date.getTime()) &&
          date.getDate() === day &&
          date.getMonth() === month - 1 &&
          date.getFullYear() === year
        ) {
          return date;
        }
      }
    }

    // Try MM/DD/YYYY, MM-DD-YYYY (less common for Indian users)
    if (standardMatch) {
      const [_, month, day, year] = standardMatch.map(Number);
      if (month >= 1 && month <= 12 && isValidDayForMonth(day, month, year)) {
        const date = new Date(year, month - 1, day);
        if (
          !isNaN(date.getTime()) &&
          date.getDate() === day &&
          date.getMonth() === month - 1 &&
          date.getFullYear() === year
        ) {
          return date;
        }
      }
    }

    // Try DD.MM.YYYY
    const dotMatch = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    if (dotMatch) {
      const [_, day, month, year] = dotMatch.map(Number);
      if (month >= 1 && month <= 12 && isValidDayForMonth(day, month, year)) {
        const date = new Date(year, month - 1, day);
        if (
          !isNaN(date.getTime()) &&
          date.getDate() === day &&
          date.getMonth() === month - 1 &&
          date.getFullYear() === year
        ) {
          return date;
        }
      }
    }

    setParseError(
      `Invalid date format at row ${
        rowIndex + 2
      }. Supported formats: DD/MM/YYYY, DD-MM-YYYY, MM/DD/YYYY, MM-DD-YYYY, YYYY-MM-DD, DD.MM.YYYY`
    );
    return null;
  };

  const validateRow = (row: any, rowIndex: number): ParsedHoliday | null => {
    const { name, startdate, enddate, type, reason, isrecurring } = row;

    console.log(`Row ${rowIndex + 2}:`, row);
    console.log(`startdate value: "${startdate}" (type: ${typeof startdate})`);

    // Validate name
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      setParseError(`Missing or invalid name at row ${rowIndex + 2}`);
      return null;
    }
    if (name.trim().length > 100) {
      setParseError(
        `Name too long at row ${rowIndex + 2} (max 100 characters)`
      );
      return null;
    }

    // Validate reason
    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      setParseError(`Missing or invalid reason at row ${rowIndex + 2}`);
      return null;
    }
    if (reason.trim().length > 200) {
      setParseError(
        `Reason too long at row ${rowIndex + 2} (max 200 characters)`
      );
      return null;
    }

    // Validate dates
    if (
      !startdate ||
      typeof startdate !== 'string' ||
      startdate.trim() === ''
    ) {
      setParseError(`Missing or invalid start date at row ${rowIndex + 2}`);
      return null;
    }
    if (!enddate || typeof enddate !== 'string' || enddate.trim() === '') {
      setParseError(`Missing or invalid end date at row ${rowIndex + 2}`);
      return null;
    }

    const start = parseFlexibleDate(startdate, rowIndex);
    const end = parseFlexibleDate(enddate, rowIndex);

    if (!start) return null; // Error already set in parseFlexibleDate
    if (!end) return null; // Error already set in parseFlexibleDate

    if (end < start) {
      setParseError(`End date must be after start date at row ${rowIndex + 2}`);
      return null;
    }

    // Validate type
    const validTypes = Object.values(CalendarEventType);
    if (!type || !validTypes.includes(type)) {
      setParseError(
        `Invalid type at row ${
          rowIndex + 2
        }: "${type}". Must be one of: ${validTypes.join(', ')}`
      );
      return null;
    }

    // Parse recurring flag
    const isRecurringBool = String(isrecurring).toLowerCase() === 'true';

    return {
      name: name.trim(),
      startDate: start,
      endDate: end,
      type,
      reason: reason.trim(),
      isRecurring: isRecurringBool,
    };
  };

  const parseCSV = useCallback((csvContent: string): ParsedHoliday[] | null => {
    try {
      setParseError(null);

      const result = Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim().toLowerCase(),
      });

      if (result.errors.length > 0) {
        setParseError(`CSV parsing error: ${result.errors[0].message}`);
        return null;
      }

      const headers = result.meta.fields || [];
      const missingHeaders = EXPECTED_HEADERS.filter(
        (h) => !headers.includes(h.toLowerCase())
      );

      if (missingHeaders.length > 0) {
        setParseError(
          `Missing required columns: ${missingHeaders.join(
            ', '
          )}. Expected: ${EXPECTED_HEADERS.join(', ')}`
        );
        return null;
      }

      if (result.data.length === 0) {
        setParseError('No data rows found in the sheet');
        return null;
      }

      const parsed: ParsedHoliday[] = [];
      for (let i = 0; i < result.data.length; i++) {
        const row = result.data[i] as any;
        const holiday = validateRow(row, i);
        if (!holiday) return null;
        parsed.push(holiday);
      }

      return parsed;
    } catch (error) {
      setParseError(
        `Failed to parse CSV: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      return null;
    }
  }, []);

  const handleGoogleSheetImport = async () => {
    if (!sheetUrl.trim()) {
      toast.error('Please enter a Google Sheet URL');
      return;
    }

    const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) {
      toast.error('Invalid Google Sheet URL format');
      return;
    }

    const sheetId = match[1];
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

    try {
      setIsImporting(true);
      setParseError(null);
      setImportSuccess(false);

      const response = await fetch(csvUrl);

      if (!response.ok) {
        if (response.status === 403 || response.status === 404) {
          toast.error(
            "Cannot access sheet. Please ensure it's publicly accessible with link sharing enabled."
          );
        } else {
          toast.error(`Failed to fetch sheet (${response.status})`);
        }
        return;
      }

      const text = await response.text();
      if (!text.trim()) {
        toast.error('Sheet appears to be empty');
        return;
      }

      const parsed = parseCSV(text);
      if (parsed && parsed.length > 0) {
        setParsedData(parsed);
        setImportSuccess(true);
        toast.success(
          `Successfully imported ${parsed.length} holiday${
            parsed.length === 1 ? '' : 's'
          }!`
        );
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Import failed: ${message}`);
      setParseError(`Network error: ${message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleSaveHolidays = async (
    data: z.infer<typeof goggleImportHolidayFormSchema>
  ) => {
    try {
      // Validate parsedData
      const validatedData = goggleImportHolidayFormSchema.parse(data);
      await ImportGoogleSheetHolidayAction(validatedData);
      toast.success('Holidays saved successfully!');
    } catch (error) {
      console.error('Validation or API error:', error);
      toast.error('Invalid data format');
    }
  };

  const getTypeColor = (type: CalendarEventType) => {
    switch (type) {
      case 'PLANNED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SUDDEN':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'INSTITUTION_SPECIFIC':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-0 space-y-6">
      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            Google Sheets URL{' '}
            <Popover>
              <PopoverTrigger>
                <HelpCircle className="ml-1 h-5 w-5 text-blue-500" />
              </PopoverTrigger>
              <PopoverContent className="mt-10 px-16">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2 text-sm">
                      <span>
                        <strong>Required columns:</strong> name, startDate,
                        endDate, type, reason, isRecurring
                      </span>
                      <br />
                      <span>
                        <strong>Supported date formats:</strong> DD/MM/YYYY,
                        MM/DD/YYYY, YYYY-MM-DD, DD-MM-YYYY
                      </span>
                      <br />
                      <span>
                        <strong>Valid types:</strong> PLANNED, SUDDEN,
                        INSTITUTION_SPECIFIC
                      </span>
                    </div>
                  </AlertDescription>
                </Alert>
              </PopoverContent>
            </Popover>
          </CardTitle>
          <CardDescription>
            <p className="text-muted-foreground text-sm">
              {' '}
              Paste your Google Sheets URL below. Make sure the sheet is
              publicly accessible.
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 ">
              <Input
                id="sheet-url"
                placeholder="https://docs.google.com/spreadsheets/d/..."
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleGoogleSheetImport}
                disabled={!sheetUrl.trim() || isImporting}
                className="min-w-[120px]"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : importSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Imported
                  </>
                ) : (
                  <>
                    <Link className="w-4 h-4 mr-2" />
                    Import
                  </>
                )}
              </Button>
            </div>
          </div>

          {parseError && (
            <Alert variant="warning">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{parseError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {parsedData && parsedData.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-2 text-left font-medium">Name</th>
                  <th className="px-4 py-2 text-left font-medium">
                    Start Date
                  </th>
                  <th className="px-4 py-2 text-left font-medium">End Date</th>
                  <th className="px-4 py-2 text-left font-medium">Type</th>
                  <th className="px-4 py-2 text-left font-medium">Reason</th>
                  <th className="px-4 py-2 text-left font-medium">Recurring</th>
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
                      {Intl.DateTimeFormat('en-US').format(holiday.startDate)}
                    </td>
                    <td className="px-4 py-2">
                      {Intl.DateTimeFormat('en-US').format(holiday.endDate)}
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
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button
          disabled={!parsedData}
          onClick={() => parsedData && handleSaveHolidays(parsedData)}
        >
          Import Holidays
        </Button>
      </div>
    </div>
  );
};

export default HolidayGoogleSheetImporter;
