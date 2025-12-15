"use client";

import { useState, useTransition } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
    AcademicYearsList,
    getStudentReport,
    StudentReportData
} from "@/lib/data/student/get-student-report";
import { pdf } from "@react-pdf/renderer";
import { StudentReportPDF } from "@/lib/pdf-generator/StudentReportPDF";

interface StudentReportDialogProps {
    studentId: string;
    academicYears: AcademicYearsList;
    currentAcademicYearId: string;
}

export function StudentReportDialog({
    studentId,
    academicYears,
    currentAcademicYearId,
}: StudentReportDialogProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [selectedAcademicYear, setSelectedAcademicYear] = useState(
        currentAcademicYearId
    );
    const [sections, setSections] = useState({
        feeDetails: true,
        attendance: true,
        examResults: false,
        leaveRecords: false,
    });

    const handleSectionChange = (section: keyof typeof sections) => {
        setSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleGenerateReport = () => {
        startTransition(async () => {
            try {
                // Fetch report data using server action (fully typed!)
                const reportData: StudentReportData = await getStudentReport({
                    studentId,
                    academicYearId: selectedAcademicYear,
                    includeSections: sections,
                });


                console.log(reportData);
                // Generate PDF with the typed data
                const blob = await pdf(
                    <StudentReportPDF
                        academicYear={reportData.academicYear.name}
                        organization={reportData.organization}
                        student={reportData.student}
                        fees={reportData.fees}
                        feeSummary={reportData.feeSummary}
                        attendance={reportData.attendance}
                        attendanceSummary={reportData.attendanceSummary}
                        examResults={reportData.examResults}
                        leaves={reportData.leaves}
                        reportGeneratedAt={reportData.reportGeneratedAt}
                        reportGeneratedBy={reportData.reportGeneratedBy}
                    />
                ).toBlob();

                // Download PDF
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `student-report-${reportData.student.rollNumber}-${reportData.academicYear.name}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                toast.success("Report generated successfully!");
                setOpen(false);
            } catch (error) {
                console.error("Error generating report:", error);
                toast.error("Failed to generate report. Please try again.");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                    <Download className="mr-2 h-4 w-4" />
                    Generate Report
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        Generate Student Report
                    </DialogTitle>
                    <DialogDescription>
                        Select academic year and sections to include in the report
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Academic Year Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="academic-year">Academic Year</Label>
                        <Select
                            value={selectedAcademicYear}
                            onValueChange={setSelectedAcademicYear}
                            disabled={isPending}
                        >
                            <SelectTrigger id="academic-year">
                                <SelectValue placeholder="Select Academic Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {academicYears.map((year) => (
                                    <SelectItem key={year.id} value={year.id}>
                                        {year.name} {year.isCurrent && "(Current)"}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sections to Include */}
                    <div className="space-y-3">
                        <Label>Include Sections:</Label>

                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="fees"
                                    checked={sections.feeDetails}
                                    onCheckedChange={() => handleSectionChange("feeDetails")}
                                    disabled={isPending}
                                />
                                <label
                                    htmlFor="fees"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    Fee Details & Payment History
                                </label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="attendance"
                                    checked={sections.attendance}
                                    onCheckedChange={() => handleSectionChange("attendance")}
                                    disabled={isPending}
                                />
                                <label
                                    htmlFor="attendance"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    Attendance Summary
                                </label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="exams"
                                    checked={sections.examResults}
                                    onCheckedChange={() => handleSectionChange("examResults")}
                                    disabled={isPending}
                                />
                                <label
                                    htmlFor="exams"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    Exam Results
                                </label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="leaves"
                                    checked={sections.leaveRecords}
                                    onCheckedChange={() => handleSectionChange("leaveRecords")}
                                    disabled={isPending}
                                />
                                <label
                                    htmlFor="leaves"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    Leave Records
                                </label>
                            </div>

                            {/* <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="documents"
                                    checked={sections.documents}
                                    onCheckedChange={() => handleSectionChange("documents")}
                                    disabled={isPending}
                                />
                                <label
                                    htmlFor="documents"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    Document Verification Status
                                </label>
                            </div> */}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleGenerateReport}
                        disabled={isPending}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Download className="mr-2 h-4 w-4" />
                                Generate Report
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}