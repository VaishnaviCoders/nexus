'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  CalendarIcon,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Upload,
  Download,
  FileText,
  Link,
  Copy,
  CheckCircle,
  CalendarDays,
  Clock,
  TrendingUp,
  Users,
  FileSpreadsheet,
  PlusCircle,
  Loader2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import CreateSingleHolidayForm from './create-single-holiday-form';
import HolidayGoogleSheetImporter from './holiday-google-sheet-importer';
import { createSingleHolidayAction } from '@/lib/data/holiday/create-single-holiday';
import { deleteSingleHolidayAction } from '@/lib/data/holiday/delete-single-holiday';
import { createCsvHolidayAction } from '@/lib/data/holiday/create-csv-holiday';
import { deleteAllHolidaysAction } from '@/lib/data/holiday/delete-all-holidays';
import { CalendarEventType } from '@/generated/prisma/enums';

interface HolidayManagementProps {
  holidays: Holiday[];
  holidaysSummary: {
    totalDays: number | 0;
    totalWorkingDays: number | 0;
    totalHolidays: number | 0;
    totalWeekendDays: number | 0;
  };
}

interface Holiday {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  type: CalendarEventType;
  reason: string | null;
  organizationId: string;
  isRecurring: boolean;
}

type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

export default function HolidayManagement({
  holidays,
  holidaysSummary,
}: HolidayManagementProps) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [emergencyHolidayName, setEmergencyHolidayName] = useState('');
  const [csvBulkHolidays, setCsvBulkHolidays] = useState('');
  const [isCsvBulkUploading, setIsCsvBulkUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [copied, setCopied] = useState(false);

  // Sample CSV template
  const csvTemplate = `Independence Day,2024-08-15,2024-08-15,PLANNED,National Holiday,true
Raksha Bandhan,2024-08-19,2024-08-19,PLANNED,Sibling festival,true
Janmashtami,2024-08-26,2024-08-26,PLANNED,Birth of Lord Krishna,true
Ganesh Chaturthi,2024-09-07,2024-09-07,PLANNED,Festival,true
Eid-e-Milad,2024-09-16,2024-09-16,PLANNED,Prophet's birthday,true
Gandhi Jayanti,2024-10-02,2024-10-02,PLANNED,National holiday,true
Dussehra,2024-10-11,2024-10-13,PLANNED,Festival of Victory,true
Diwali Break,2024-11-01,2024-11-07,PLANNED,Festival of Lights,true
Guru Nanak Jayanti,2024-11-15,2024-11-15,PLANNED,Sikh religious festival,true
Christmas,2024-12-25,2024-12-25,PLANNED,Christian holiday,true
Winter Break,2024-12-24,2025-01-02,PLANNED,Year-end vacation,false
Makar Sankranti,2025-01-14,2025-01-14,PLANNED,Harvest festival,true
Republic Day,2025-01-26,2025-01-26,PLANNED,National holiday,true
Maha Shivratri,2025-02-26,2025-02-26,PLANNED,Hindu festival,true
Holi,2025-03-14,2025-03-14,PLANNED,Festival of Colors,true
Summer Break,2025-04-20,2025-06-10,PLANNED,Annual vacation,false`;

  const addEmergencyHoliday = async () => {
    try {
      setIsSubmitting(true);
      await createSingleHolidayAction({
        name: emergencyHolidayName,
        startDate: dateRange?.from ?? new Date(),
        endDate: dateRange?.to ?? new Date(),
        type: CalendarEventType.SUDDEN,
        reason: 'Its an emergency Holiday',
        isRecurring: false,
      });
      setIsSubmitting(false);
      toast.success('Emergency holiday declared!');

      setEmergencyHolidayName('');
      setDateRange({ from: new Date(), to: new Date() });
    } catch (err) {
      console.error(err);
      toast.error('Failed to declare emergency holiday');
    }
  };

  const deleteHoliday = async (id: string) => {
    await deleteSingleHolidayAction(id);
    toast.success('Holiday deleted successfully');
  };

  const csvHandleBulkImport = async () => {
    const lines = csvBulkHolidays
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line); // Split by new lines and trim
    const holidaysToCreate = [];
    for (const line of lines) {
      const [name, startDate, endDate, type, reason, isRecurring] = line
        .split(',')
        .map((item) => item.trim());
      // Validate the data
      if (!name || !startDate || !endDate || !type) {
        toast.error('Please ensure all fields are filled out correctly.');
        return;
      }

      // Validate date format (YYYY-MM-DD)
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(endDate)
      ) {
        toast.error('Date format must be YYYY-MM-DD.');
        return;
      }
      // Validate type
      const validTypes = ['PLANNED', 'SUDDEN', 'INSTITUTION_SPECIFIC'];
      if (!validTypes.includes(type)) {
        toast.error(`Type must be one of: ${validTypes.join(', ')}`);
        return;
      }

      // / Validate isRecurring
      const isRecurringBool = isRecurring === 'true';
      // Push the validated holiday object to the array
      holidaysToCreate.push({
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        type,
        reason: reason || null, // Allow reason to be optional
        isRecurring: isRecurringBool,
      });
    }

    // Insert into the database
    try {
      setIsCsvBulkUploading(true);
      await Promise.all(
        holidaysToCreate.map((holiday) => createCsvHolidayAction(holiday))
      );
      setCsvBulkHolidays(''); // Clear the textarea after successful import
      setIsCsvBulkUploading(false);
      toast.success('Holidays imported successfully!');
    } catch (error) {
      console.error('Error importing holidays:', error);
      toast.error('Failed to import holidays.');
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'holiday_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  const copyTemplate = () => {
    navigator.clipboard.writeText(csvTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Template copied to clipboard');
  };

  const getHolidayTypeConfig = (type: CalendarEventType) => {
    switch (type) {
      case CalendarEventType.PLANNED:
        return {
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: 'bg-blue-100',
          label: 'Planned',
        };
      case CalendarEventType.SUDDEN:
        return {
          badge: 'bg-orange-50 text-orange-700 border-orange-200',
          icon: 'bg-orange-100',
          label: 'Emergency',
        };
      case CalendarEventType.INSTITUTION_SPECIFIC:
        return {
          badge: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: 'bg-purple-100',
          label: 'Institution',
        };
      default:
        return {
          badge: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: 'bg-gray-100',
          label: 'Other',
        };
    }
  };

  const isHolidayActive = (holiday: Holiday) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to the start of the day

    const startDate = new Date(holiday.startDate);
    startDate.setHours(0, 0, 0, 0); // Set time to the start of the day

    const endDate = new Date(holiday.endDate);
    endDate.setHours(23, 59, 59, 999); // Set time to the end of the day

    return startDate <= today && endDate >= today;
  };

  const getHolidayDuration = (holiday: Holiday) => {
    const start = new Date(holiday.startDate);
    const end = new Date(holiday.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const deleteAllHolidays = async () => {
    await deleteAllHolidaysAction();
    toast.success('All holidays deleted successfully');
  };

  return (
    <div className="space-y-8 px-2">
      {/* Academic Year Summary */}
      <Card className="tbg-gradient-to-br from-blue-50 to-indigo-50 ">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            Academic Year Overview
          </CardTitle>
          <CardDescription className="text-base">
            Real-time calculation of working days and holiday impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CalendarDays className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  TOTAL
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {holidaysSummary.totalDays}
              </p>
              <p className="text-sm text-gray-600 font-medium">Total Days</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  WORKING
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {holidaysSummary.totalWorkingDays}
              </p>
              <p className="text-sm text-gray-600 font-medium">Working Days</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <CalendarIcon className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                  HOLIDAYS
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {holidaysSummary.totalHolidays}
              </p>
              <p className="text-sm text-gray-600 font-medium">Holiday Days</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
                  WEEKENDS
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {' '}
                {holidaysSummary.totalWeekendDays}
              </p>
              <p className="text-sm text-gray-600 font-medium">Weekend Days</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Emergency Holiday Declaration */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl text-orange-800">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              Emergency Holiday Declaration
            </CardTitle>
            <CardDescription className="text-orange-700 text-base">
              Instantly declare emergency holidays for unexpected situations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="emergency-name" className="text-sm font-medium">
                Holiday Name
              </Label>
              <Input
                id="emergency-name"
                placeholder="e.g., Weather Emergency, Strike, Power Outage"
                value={emergencyHolidayName}
                onChange={(e) => setEmergencyHolidayName(e.target.value)}
                className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal bg-white border-orange-200 hover:bg-orange-50',
                      !dateRange && 'text-muted-foreground'
                    )}
                  >
                    {dateRange?.from ? (
                      dateRange.to ? (
                        `${format(dateRange.from, 'PPP')} - ${format(
                          dateRange.to,
                          'PPP'
                        )}`
                      ) : (
                        format(dateRange.from, 'PPP')
                      )
                    ) : (
                      <span>Select date range</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button
              onClick={addEmergencyHoliday}
              disabled={
                !emergencyHolidayName || !dateRange?.from || isSubmitting
              }
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Adding...
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Declare Emergency Holiday
                </>
              )}
            </Button>

            <Alert className="border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                This will immediately mark the selected dates as non-working
                days and prevent attendance recording.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Bulk Import Options - Redesigned */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl text-blue-800">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Upload className="w-5 h-5 text-blue-600" />
              </div>
              Bulk Import Holidays
            </CardTitle>
            <CardDescription className="text-blue-700 text-base">
              Import multiple holidays using various convenient methods
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {/* Import Options */}
              <Dialog
                open={isBulkDialogOpen}
                onOpenChange={setIsBulkDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-white border-blue-200 hover:bg-blue-50 text-blue-700 justify-start h-auto p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">
                          Import from Spreadsheet
                        </div>
                        <div className="text-sm text-blue-600">
                          CSV, Google Sheets, or paste data
                        </div>
                      </div>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">
                      Import Holidays
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      Choose your preferred method to import multiple holidays
                      into the system
                    </DialogDescription>
                  </DialogHeader>

                  <Tabs defaultValue="sheet" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 h-12">
                      <TabsTrigger
                        value="sheet"
                        className="flex items-center gap-2"
                      >
                        <Link className="w-4 h-4" />
                        Google Sheets
                      </TabsTrigger>
                      <TabsTrigger
                        value="single"
                        className="flex items-center gap-2"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Single Holiday
                      </TabsTrigger>
                      <TabsTrigger
                        value="paste"
                        className="flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Paste Data
                      </TabsTrigger>
                      <TabsTrigger
                        value="template"
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Template
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="sheet" className="space-y-6 mt-6">
                      <HolidayGoogleSheetImporter />
                    </TabsContent>

                    <TabsContent value="single" className="space-y-6 mt-6">
                      <CreateSingleHolidayForm />
                    </TabsContent>

                    <TabsContent value="paste" className="space-y-6 mt-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-base font-medium">
                            Paste CSV Data
                          </Label>
                          <p className="text-sm text-muted-foreground mb-3">
                            Format: Name, Start Date, End Date, Type, Reason, Is
                            Recurring
                          </p>
                          <Textarea
                            value={csvBulkHolidays}
                            onChange={(e) => setCsvBulkHolidays(e.target.value)}
                            placeholder="Paste your holiday data here..."
                            rows={10}
                            className="font-mono text-sm"
                          />
                        </div>
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Date Format:</strong> YYYY-MM-DD |{' '}
                            <strong>Type:</strong> PLANNED, SUDDEN, or
                            INSTITUTION_SPECIFIC |{' '}
                            <strong>Is Recurring:</strong> true or false
                          </AlertDescription>
                        </Alert>
                        <Button
                          onClick={csvHandleBulkImport}
                          disabled={!csvBulkHolidays.trim()}
                          className="w-full"
                        >
                          {isCsvBulkUploading ? (
                            <>
                              <Loader2 className="animate-spin mr-2 h-4 w-4" />
                              Uploading
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Import Holidays
                            </>
                          )}
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="template" className="space-y-6 mt-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-base font-medium">
                            CSV Template
                          </Label>
                          <p className="text-sm text-muted-foreground mb-3">
                            Download or copy this template to get started
                            quickly
                          </p>
                          <div className="bg-gray-50 border rounded-lg p-4">
                            <p className="text-base py-2 ">
                              Holiday Name,Start Date,End Date,Type,Reason,Is
                              Recurring
                            </p>
                            <pre className="text-sm font-mono whitespace-pre-wrap overflow-x-auto text-gray-700">
                              {csvTemplate}
                            </pre>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            onClick={downloadTemplate}
                            variant="outline"
                            className="flex-1"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Template
                          </Button>
                          <Button
                            onClick={copyTemplate}
                            variant="outline"
                            className="flex-1"
                          >
                            {copied ? (
                              <CheckCircle className="w-4 h-4 mr-2" />
                            ) : (
                              <Copy className="w-4 h-4 mr-2" />
                            )}
                            {copied ? 'Copied!' : 'Copy Template'}
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={downloadTemplate}
                  className="bg-white border-blue-200 hover:bg-blue-50 text-blue-700 h-auto p-3"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span className="text-sm">Download Template</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={copyTemplate}
                  className="bg-white border-blue-200 hover:bg-blue-50 text-blue-700 h-auto p-3"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  <span className="text-sm">
                    {copied ? 'Copied!' : 'Copy Template'}
                  </span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Holidays Showcase - Completely Redesigned */}
      <Card className="border-0 shadow-lg p-0">
        <CardHeader className="pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold">
                Holidays & Events
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Manage all holidays and non-working days that affect attendance
                calculations
              </CardDescription>
            </div>

            <div className="flex items-center space-x-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant={'outline'}
                    className="hover:text-red-500 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. All holidays will be
                      permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button
                        variant="outline"
                        onClick={deleteAllHolidays}
                        className="hover:text-red-500 transition-colors duration-200 "
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete All
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsBulkDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Holiday
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {holidays.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <CalendarIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No holidays added yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start by adding holidays to ensure accurate attendance
                calculations and better planning.
              </p>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsBulkDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Holiday
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {holidays.map((holiday) => {
                const typeConfig = getHolidayTypeConfig(holiday.type);
                const isActive = isHolidayActive(holiday);
                const duration = getHolidayDuration(holiday);

                console.log('Holidays', holidays);

                return (
                  <Card
                    key={holiday.id}
                    className={cn(
                      'border-0 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer',
                      isActive && 'ring-2 ring-green-200 bg-green-50'
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn('p-2 rounded-lg', typeConfig.icon)}
                          >
                            <CalendarIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg leading-tight">
                              {holiday.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant="outline"
                                className={typeConfig.badge}
                              >
                                {typeConfig.label}
                              </Badge>
                              {holiday.isRecurring && (
                                <Badge variant="outline" className="text-xs">
                                  Recurring
                                </Badge>
                              )}
                              {isActive && (
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  Active Now
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => deleteHoliday(holiday.id)}
                            variant={'destructive'}
                            size={'sm'}
                          >
                            <Trash2 className="w-2 h-2 " />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Start Date</p>
                            <p className="font-medium">
                              {new Date(holiday.startDate).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                }
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">End Date</p>
                            <p className="font-medium">
                              {new Date(holiday.endDate).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                }
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>
                              {duration} day{duration > 1 ? 's' : ''}
                            </span>
                          </div>
                          {holiday.reason && (
                            <div
                              className="text-sm text-muted-foreground truncate max-w-[220px]"
                              title={holiday.reason}
                            >
                              {holiday.reason}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
