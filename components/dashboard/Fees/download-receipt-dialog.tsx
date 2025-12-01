"use client"

import type React from "react"

import { useState } from "react"
import { pdf } from "@react-pdf/renderer"
import { DownloadIcon, Loader2, MinusIcon, PlusIcon, FileTextIcon, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { FeeReceiptPDF, FeeReceiptPage } from "@/lib/pdf-generator/FeeReceiptPDF"
import type { FeeRecord } from "@/types"

interface DownloadReceiptDialogProps {
    record: FeeRecord
}

export type CopyType = "ORIGINAL" | "STUDENT COPY" | "ACCOUNT COPY"

export interface CopySelection {
    original: number
    studentCopy: number
    accountCopy: number
}
// Force rebuild to ensure latest PDF component is used
export function DownloadReceiptDialog({ record }: DownloadReceiptDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [copySelection, setCopySelection] = useState<CopySelection>({
        original: 1, // Default selected
        studentCopy: 0,
        accountCopy: 0,
    })
    const [downloadAsSinglePdf, setDownloadAsSinglePdf] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const copyTypes: { key: keyof CopySelection; label: string; type: CopyType }[] = [
        { key: "original", label: "Original", type: "ORIGINAL" },
        { key: "studentCopy", label: "Student Copy", type: "STUDENT COPY" },
        { key: "accountCopy", label: "Account Copy", type: "ACCOUNT COPY" },
    ]

    const totalCopies = copySelection.original + copySelection.studentCopy + copySelection.accountCopy

    const handleIncrement = (key: keyof CopySelection) => {
        setCopySelection((prev) => ({
            ...prev,
            [key]: Math.min(prev[key] + 1, 5), // Max 5 copies per type
        }))
    }

    const handleDecrement = (key: keyof CopySelection) => {
        setCopySelection((prev) => ({
            ...prev,
            [key]: Math.max(prev[key] - 1, 0),
        }))
    }

    const handleToggle = (key: keyof CopySelection, checked: boolean) => {
        setCopySelection((prev) => ({
            ...prev,
            [key]: checked ? 1 : 0,
        }))
    }

    const handleDownload = async () => {
        if (totalCopies === 0) return

        setIsDownloading(true)
        setErrorMessage(null)

        try {
            // Generate pages for each selected copy type
            const pages: { type: CopyType; count: number }[] = []

            if (copySelection.original > 0) {
                pages.push({ type: "ORIGINAL", count: copySelection.original })
            }
            if (copySelection.studentCopy > 0) {
                pages.push({ type: "STUDENT COPY", count: copySelection.studentCopy })
            }
            if (copySelection.accountCopy > 0) {
                pages.push({ type: "ACCOUNT COPY", count: copySelection.accountCopy })
            }

            const { Document } = await import("@react-pdf/renderer")

            // Import FeeReceiptPage dynamically or ensure it's available
            // Since we are in the same bundle, we can use the imported one.
            // But we need to make sure FeeReceiptPage is imported at the top.
            // See the import change below.

            if (downloadAsSinglePdf && totalCopies > 1) {
                const pdfDoc = (
                    <Document>
                        {pages.map((page) =>
                            Array.from({ length: page.count }).map((_, i) => (
                                <FeeReceiptPage
                                    key={`${page.type}-${i}`}
                                    feeRecord={record}
                                    copyType={page.type}
                                />
                            ))
                        )}
                    </Document>
                )

                const blob = await pdf(pdfDoc).toBlob()
                const url = URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.href = url
                link.download = `fee-receipt-${record.student.firstName}-${record.student.lastName}-combined.pdf`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(url)
            } else {
                // Generate individual PDFs and merge them (or download individually)
                // The original logic was downloading them individually if blobs.length > 1

                const blobs: Blob[] = []

                for (const page of pages) {
                    for (let i = 0; i < page.count; i++) {
                        const pdfDoc = <FeeReceiptPDF feeRecord={record} copyType={page.type} />
                        const blob = await pdf(pdfDoc).toBlob()
                        blobs.push(blob)
                    }
                }

                // If only one page, download directly
                if (blobs.length === 1) {
                    const url = URL.createObjectURL(blobs[0])
                    const link = document.createElement("a")
                    link.href = url
                    link.download = `fee-receipt-${record.student.firstName}-${record.student.lastName}-${record.fee.id.slice(0, 8)}.pdf`
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    URL.revokeObjectURL(url)
                } else {
                    // For multiple copies, download each separately with type label
                    for (let i = 0; i < pages.length; i++) {
                        const page = pages[i]
                        for (let j = 0; j < page.count; j++) {
                            const pdfDoc = <FeeReceiptPDF feeRecord={record} copyType={page.type} />
                            const blob = await pdf(pdfDoc).toBlob()
                            const url = URL.createObjectURL(blob)
                            const link = document.createElement("a")
                            link.href = url
                            const copyLabel = page.type.toLowerCase().replace(" ", "-")
                            const copyNum = page.count > 1 ? `-${j + 1}` : ""
                            link.download = `fee-receipt-${record.student.firstName}-${record.student.lastName}-${copyLabel}${copyNum}.pdf`
                            document.body.appendChild(link)
                            link.click()
                            document.body.removeChild(link)
                            URL.revokeObjectURL(url)
                            // Small delay between downloads
                            await new Promise((resolve) => setTimeout(resolve, 300))
                        }
                    }
                }
            }

            setIsOpen(false)
        } catch (error) {
            console.error("Error generating PDF:", error)
            setErrorMessage("Failed to generate PDF. Please try again.")
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild className="w-full">
                <Button variant="outline" aria-label="Download details" className="w-full">
                    <DownloadIcon className="h-4 w-4 mr-2 " />
                    Download Details
                </Button>

            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileTextIcon className="h-5 w-5" />
                        Download Fee Receipt
                    </DialogTitle>
                    <DialogDescription>
                        Select the types and number of copies you want to download for{" "}
                        <span className="font-medium">
                            {record.student.firstName} {record.student.lastName}
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {copyTypes.map(({ key, label, type }) => (
                        <div
                            key={key}
                            className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id={key}
                                    checked={copySelection[key] > 0}
                                    onCheckedChange={(checked) => handleToggle(key, checked as boolean)}
                                />
                                <Label htmlFor={key} className="flex flex-col cursor-pointer">
                                    <span className="font-medium">{label}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {key === "original" && "Main receipt copy"}
                                        {key === "studentCopy" && "Copy for student records"}
                                        {key === "accountCopy" && "Copy for accounts department"}
                                    </span>
                                </Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 bg-transparent"
                                    onClick={() => handleDecrement(key)}
                                    disabled={copySelection[key] === 0}
                                >
                                    <MinusIcon className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center font-medium tabular-nums">{copySelection[key]}</span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 bg-transparent"
                                    onClick={() => handleIncrement(key)}
                                    disabled={copySelection[key] >= 5}
                                >
                                    <PlusIcon className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    <div className="flex items-center space-x-2 py-2 bg-orange-50 border border-orange-200 p-3 rounded-md">
                        <Checkbox
                            id="single-pdf"
                            checked={downloadAsSinglePdf}
                            onCheckedChange={(checked) => setDownloadAsSinglePdf(checked as boolean)}
                            disabled={totalCopies <= 1}
                        />
                        <Label htmlFor="single-pdf" className={totalCopies <= 1 ? "text-muted-foreground" : "text-orange-500"}>
                            Download as single PDF
                        </Label>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-sm text-muted-foreground">Total copies to download:</span>
                        <span className="font-semibold text-lg">{totalCopies}</span>
                    </div>
                    {errorMessage && (
                        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            {errorMessage}
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleDownload} disabled={totalCopies === 0 || isDownloading}>
                        {isDownloading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <DownloadIcon className="h-4 w-4 mr-2" />
                                Download {totalCopies > 0 ? `(${totalCopies})` : ""}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
