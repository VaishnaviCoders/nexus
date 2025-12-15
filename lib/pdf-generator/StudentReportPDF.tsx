import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"
import { formatCurrencyIN, formatDateIN } from "@/lib/utils"
import type { FeeStatus, Gender, PaymentMethod, PaymentStatus } from "@/generated/prisma/enums"

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Organization {
    id: string
    name: string
    email?: string
    phone?: string
    logo?: string
    website?: string
}

interface Student {
    id: string
    userId: string
    firstName: string
    middleName?: string
    lastName: string
    rollNumber: string
    email: string
    phoneNumber: string
    profileImage?: string
    dateOfBirth: string
    gender: Gender
    grade: { id: string; grade: string }
    section: { id: string; name: string }
    parents: Array<{
        isPrimary: boolean | null
        parent: {
            userId: string | null
            id: string
            firstName: string
            lastName: string
            email: string
            phoneNumber: string
            whatsAppNumber?: string
        }
    }>
}

interface FeeCategory {
    id: string
    name: string
    description?: string | null
}

interface Payment {
    id: string
    amount: number
    status: PaymentStatus
    paymentMethod: PaymentMethod
    paymentDate: Date
    receiptNumber: string | null
    transactionId: string | null
    payer: {
        firstName: string
        lastName: string
        email: string
    }
}

interface Fee {
    id: string
    totalFee: number
    paidAmount: number
    pendingAmount: number | null
    dueDate: Date | null
    status: FeeStatus
    feeCategory: FeeCategory
    payments: Payment[]
}

interface FeeSummary {
    totalFees: number
    totalPaid: number
    totalPending: number
    totalOverDue: number
}

interface AttendanceRecord {
    id: string
    date: Date
    status: string
    present: boolean
    note?: string | null
}

interface AttendanceSummary {
    totalDays: number
    presentDays: number
    absentDays: number
    lateDays: number
    percentage: number
}

interface ExamResult {
    id: string
    obtainedMarks: number | null
    percentage: number | null
    gradeLabel: string | null
    remarks: string | null
    isPassed: boolean | null
    isAbsent: boolean
    exam: {
        id: string
        title: string
        maxMarks: number
        startDate: Date
        subject: {
            id: string
            name: string
            code: string | null
        }
        examSession: {
            id: string
            title: string
        }
    }
}

interface LeaveRecord {
    id: string
    startDate: Date
    endDate: Date
    totalDays: number
    reason: string
    type: string
    currentStatus: string
    approvedBy: string | null
    approvedAt: Date | null
    rejectedNote: string | null
}

interface StudentReportPDFProps {
    academicYear: string
    organization: Organization
    student: Student
    fees: Fee[]
    feeSummary: FeeSummary
    attendance: AttendanceRecord[]
    attendanceSummary: AttendanceSummary
    examResults: ExamResult[]
    leaves: LeaveRecord[]
    reportGeneratedAt: string
    reportGeneratedBy?: string
}

// ============================================================================
// DESIGN TOKENS - Vercel-inspired color palette
// ============================================================================

const colors = {
    // Primary
    black: "#000000",
    white: "#FFFFFF",

    // Grays (Vercel palette)
    gray50: "#FAFAFA",
    gray100: "#F5F5F5",
    gray200: "#E5E5E5",
    gray300: "#D4D4D4",
    gray400: "#A3A3A3",
    gray500: "#737373",
    gray600: "#525252",
    gray700: "#404040",
    gray800: "#262626",
    gray900: "#171717",

    // Accent colors
    blue: "#0070F3",
    green: "#00A676",
    red: "#E5484D",
    amber: "#F5A623",
    cyan: "#06B6D4",
    violet: "#7C3AED",
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
    // Page & Layout
    page: {
        backgroundColor: colors.white,
        paddingTop: 40,
        paddingBottom: 60,
        paddingHorizontal: 40,
        fontFamily: "Helvetica",
        fontSize: 10,
        color: colors.gray800,
    },

    // Header
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 30,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray200,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    logo: {
        width: 48,
        height: 48,
        borderRadius: 8,
    },
    logoPlaceholder: {
        width: 48,
        height: 48,
        backgroundColor: colors.black,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    logoText: {
        color: colors.white,
        fontSize: 20,
        fontFamily: "Helvetica-Bold",
    },
    orgInfo: {
        gap: 2,
    },
    orgName: {
        fontSize: 16,
        fontFamily: "Helvetica-Bold",
        color: colors.black,
        letterSpacing: -0.3,
    },
    orgContact: {
        fontSize: 9,
        color: colors.gray500,
    },
    headerRight: {
        alignItems: "flex-end",
        gap: 4,
    },
    reportTitle: {
        fontSize: 11,
        fontFamily: "Helvetica-Bold",
        color: colors.black,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    academicYear: {
        fontSize: 9,
        color: colors.gray500,
    },
    generatedDate: {
        fontSize: 8,
        color: colors.gray400,
    },

    // Student Profile Section
    profileSection: {
        flexDirection: "row",
        gap: 24,
        marginBottom: 28,
        padding: 20,
        backgroundColor: colors.gray50,
        borderRadius: 8,
    },
    profileImageContainer: {
        width: 80,
        height: 100,
        backgroundColor: colors.gray200,
        borderRadius: 6,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
    },
    profileImage: {
        width: 80,
        height: 100,
        objectFit: "cover",
    },
    profilePlaceholder: {
        fontSize: 32,
        color: colors.gray400,
        fontFamily: "Helvetica-Bold",
    },
    profileInfo: {
        flex: 1,
        gap: 12,
    },
    studentName: {
        fontSize: 20,
        fontFamily: "Helvetica-Bold",
        color: colors.black,
        letterSpacing: -0.5,
    },
    rollNumber: {
        fontSize: 10,
        color: colors.gray500,
        marginTop: -8,
    },
    profileGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 16,
    },
    profileItem: {
        width: "30%",
        gap: 2,
    },
    profileLabel: {
        fontSize: 8,
        color: colors.gray400,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    profileValue: {
        fontSize: 10,
        color: colors.gray700,
        fontFamily: "Helvetica-Bold",
    },

    // Section Container
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray200,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: "Helvetica-Bold",
        color: colors.black,
        letterSpacing: -0.2,
    },
    sectionBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
    },

    // Summary Cards
    summaryGrid: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 16,
    },
    summaryCard: {
        flex: 1,
        padding: 14,
        backgroundColor: colors.gray50,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.gray200,
    },
    summaryCardAccent: {
        borderLeftWidth: 3,
    },
    summaryLabel: {
        fontSize: 8,
        color: colors.gray500,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 18,
        fontFamily: "Helvetica-Bold",
        color: colors.black,
        letterSpacing: -0.5,
    },
    summarySubtext: {
        fontSize: 8,
        color: colors.gray400,
        marginTop: 2,
    },

    // Tables
    table: {
        borderWidth: 1,
        borderColor: colors.gray200,
        borderRadius: 6,
        overflow: "hidden",
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: colors.gray100,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray200,
    },
    tableHeaderCell: {
        padding: 10,
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        color: colors.gray600,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: colors.gray100,
    },
    tableRowAlt: {
        backgroundColor: colors.gray50,
    },
    tableCell: {
        padding: 10,
        fontSize: 9,
        color: colors.gray700,
    },
    tableCellBold: {
        fontFamily: "Helvetica-Bold",
    },

    // Status Badges
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 3,
        fontSize: 7,
        fontFamily: "Helvetica-Bold",
        textTransform: "uppercase",
        letterSpacing: 0.3,
    },
    badgeSuccess: {
        backgroundColor: "#DCFCE7",
        color: "#166534",
    },
    badgeWarning: {
        backgroundColor: "#FEF3C7",
        color: "#92400E",
    },
    badgeDanger: {
        backgroundColor: "#FEE2E2",
        color: "#991B1B",
    },
    badgeInfo: {
        backgroundColor: "#DBEAFE",
        color: "#1E40AF",
    },
    badgeNeutral: {
        backgroundColor: colors.gray100,
        color: colors.gray600,
    },

    // Attendance Visualization
    attendanceBar: {
        height: 8,
        backgroundColor: colors.gray200,
        borderRadius: 4,
        marginTop: 8,
        overflow: "hidden",
        flexDirection: "row",
    },
    attendanceProgress: {
        height: 8,
        backgroundColor: colors.green,
        borderRadius: 4,
    },

    // Parent Section
    parentCard: {
        padding: 12,
        backgroundColor: colors.gray50,
        borderRadius: 6,
        marginBottom: 8,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    parentInfo: {
        gap: 2,
    },
    parentName: {
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        color: colors.gray800,
    },
    parentContact: {
        fontSize: 9,
        color: colors.gray500,
    },
    primaryBadge: {
        backgroundColor: colors.blue,
        color: colors.white,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 3,
        fontSize: 7,
        fontFamily: "Helvetica-Bold",
        alignSelf: "flex-start",
    },

    // Footer
    footer: {
        position: "absolute",
        bottom: 20,
        left: 40,
        right: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: colors.gray200,
    },
    footerText: {
        fontSize: 8,
        color: colors.gray400,
    },
    pageNumber: {
        fontSize: 8,
        color: colors.gray500,
        fontFamily: "Helvetica-Bold",
    },

    // Empty State
    emptyState: {
        padding: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyText: {
        fontSize: 10,
        color: colors.gray400,
        fontStyle: "italic",
    },

    // Divider
    divider: {
        height: 1,
        backgroundColor: colors.gray200,
        marginVertical: 16,
    },

    // Inline values
    inlineRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray100,
    },
    inlineLabel: {
        fontSize: 9,
        color: colors.gray500,
    },
    inlineValue: {
        fontSize: 9,
        color: colors.gray800,
        fontFamily: "Helvetica-Bold",
    },
})

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const StatusBadge = ({
    status,
    type,
}: { status: string; type: "fee" | "payment" | "attendance" | "leave" | "result" }) => {
    const getStyle = () => {
        if (type === "fee") {
            switch (status) {
                case "PAID":
                    return styles.badgeSuccess
                case "PARTIAL":
                    return styles.badgeWarning
                case "OVERDUE":
                    return styles.badgeDanger
                default:
                    return styles.badgeNeutral
            }
        }
        if (type === "payment") {
            switch (status) {
                case "COMPLETED":
                    return styles.badgeSuccess
                case "PENDING":
                    return styles.badgeWarning
                case "FAILED":
                    return styles.badgeDanger
                default:
                    return styles.badgeNeutral
            }
        }
        if (type === "attendance") {
            switch (status) {
                case "PRESENT":
                    return styles.badgeSuccess
                case "LATE":
                    return styles.badgeWarning
                case "ABSENT":
                    return styles.badgeDanger
                default:
                    return styles.badgeNeutral
            }
        }
        if (type === "leave") {
            switch (status) {
                case "APPROVED":
                    return styles.badgeSuccess
                case "PENDING":
                    return styles.badgeWarning
                case "REJECTED":
                    return styles.badgeDanger
                default:
                    return styles.badgeNeutral
            }
        }
        if (type === "result") {
            return status === "PASSED" ? styles.badgeSuccess : styles.badgeDanger
        }
        return styles.badgeNeutral
    }

    return <Text style={[styles.badge, getStyle()]}>{status}</Text>
}

const SummaryCard = ({
    label,
    value,
    subtext,
    accentColor,
}: {
    label: string
    value: string
    subtext?: string
    accentColor?: string
}) => (
    <View style={[styles.summaryCard, styles.summaryCardAccent, { borderLeftColor: accentColor || colors.gray300 }]}>
        <Text style={styles.summaryLabel}>{label}</Text>
        <Text style={styles.summaryValue}>{value}</Text>
        {subtext && <Text style={styles.summarySubtext}>{subtext}</Text>}
    </View>
)

const EmptyState = ({ message }: { message: string }) => (
    <View style={styles.emptyState}>
        <Text style={styles.emptyText}>{message}</Text>
    </View>
)

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const StudentReportPDF = ({
    academicYear,
    organization,
    student,
    fees,
    feeSummary,
    attendance,
    attendanceSummary,
    examResults,
    leaves,
    reportGeneratedAt,
    reportGeneratedBy,
}: StudentReportPDFProps) => {
    const fullName = [student.firstName, student.middleName, student.lastName].filter(Boolean).join(" ")

    const primaryParent = student.parents.find((p) => p.isPrimary)?.parent

    const formatPaymentMethod = (method: PaymentMethod) => {
        const methods: Record<string, string> = {
            CASH: "Cash",
            CHEQUE: "Cheque",
            BANK_TRANSFER: "Bank Transfer",
            ONLINE: "Online",
            UPI: "UPI",
            CARD: "Card",
        }
        return methods[method] || method
    }

    // Group exam results by session
    const examsBySession = examResults.reduce(
        (acc, result) => {
            const sessionTitle = result.exam.examSession.title
            if (!acc[sessionTitle]) {
                acc[sessionTitle] = []
            }
            acc[sessionTitle].push(result)
            return acc
        },
        {} as Record<string, ExamResult[]>,
    )

    return (
        <Document>
            {/* Page 1: Profile & Fee Details */}
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        {organization.logo ? (
                            <Image src={organization.logo || "/placeholder.svg"} style={styles.logo} />
                        ) : (
                            <View style={styles.logoPlaceholder}>
                                <Text style={styles.logoText}>{organization.name.charAt(0).toUpperCase()}</Text>
                            </View>
                        )}
                        <View style={styles.orgInfo}>
                            <Text style={styles.orgName}>{organization.name}</Text>
                            {organization.phone && <Text style={styles.orgContact}>{organization.phone}</Text>}
                            {organization.email && <Text style={styles.orgContact}>{organization.email}</Text>}
                        </View>
                    </View>
                    <View style={styles.headerRight}>
                        <Text style={styles.reportTitle}>Student Report</Text>
                        <Text style={styles.academicYear}>{academicYear}</Text>
                        <Text style={styles.generatedDate}>Generated: {formatDateIN(new Date(reportGeneratedAt))}</Text>
                    </View>
                </View>

                {/* Student Profile */}
                <View style={styles.profileSection}>
                    <View style={styles.profileImageContainer}>
                        {student.profileImage ? (
                            <Image src={student.profileImage || "/placeholder.svg"} style={styles.profileImage} />
                        ) : (
                            <Text style={styles.profilePlaceholder}>{student.firstName.charAt(0)}</Text>
                        )}
                    </View>
                    <View style={styles.profileInfo}>
                        <View>
                            <Text style={styles.studentName}>{fullName}</Text>
                            <Text style={styles.rollNumber}>Roll No: {student.rollNumber}</Text>
                        </View>
                        <View style={styles.profileGrid}>
                            <View style={styles.profileItem}>
                                <Text style={styles.profileLabel}>Class</Text>
                                <Text style={styles.profileValue}>
                                    {student.grade.grade} - {student.section.name}
                                </Text>
                            </View>
                            <View style={styles.profileItem}>
                                <Text style={styles.profileLabel}>Date of Birth</Text>
                                <Text style={styles.profileValue}>{formatDateIN(new Date(student.dateOfBirth))}</Text>
                            </View>
                            <View style={styles.profileItem}>
                                <Text style={styles.profileLabel}>Gender</Text>
                                <Text style={styles.profileValue}>
                                    {student.gender === "MALE" ? "Male" : student.gender === "FEMALE" ? "Female" : "Other"}
                                </Text>
                            </View>
                            <View style={styles.profileItem}>
                                <Text style={styles.profileLabel}>Phone</Text>
                                <Text style={styles.profileValue}>{student.phoneNumber || "—"}</Text>
                            </View>
                            <View style={styles.profileItem}>
                                <Text style={styles.profileLabel}>Email</Text>
                                <Text style={styles.profileValue}>{student.email || "—"}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Parent/Guardian */}
                {primaryParent && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Parent / Guardian</Text>
                        </View>
                        <View style={styles.parentCard}>
                            <View style={styles.parentInfo}>
                                <Text style={styles.parentName}>
                                    {primaryParent.firstName} {primaryParent.lastName}
                                </Text>
                                <Text style={styles.parentContact}>{primaryParent.phoneNumber}</Text>
                                <Text style={styles.parentContact}>{primaryParent.email}</Text>
                            </View>
                            <Text style={styles.primaryBadge}>PRIMARY</Text>
                        </View>
                    </View>
                )}

                {/* Fee Summary */}
                {fees.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Fee Overview</Text>
                        </View>
                        <View style={styles.summaryGrid}>
                            <SummaryCard
                                label="Total Fees"
                                value={formatCurrencyIN(feeSummary.totalFees)}
                                accentColor={colors.gray600}
                            />
                            <SummaryCard label="Paid" value={formatCurrencyIN(feeSummary.totalPaid)} accentColor={colors.green} />
                            <SummaryCard
                                label="Pending"
                                value={formatCurrencyIN(feeSummary.totalPending)}
                                accentColor={feeSummary.totalPending > 0 ? colors.amber : colors.gray300}
                            />
                            <SummaryCard
                                label="Overdue"
                                value={formatCurrencyIN(feeSummary.totalOverDue)}
                                accentColor={feeSummary.totalOverDue > 0 ? colors.red : colors.gray300}
                            />
                        </View>

                        {/* Fee Details Table */}
                        <View style={styles.table}>
                            <View style={styles.tableHeader}>
                                <Text style={[styles.tableHeaderCell, { width: "30%" }]}>Category</Text>
                                <Text style={[styles.tableHeaderCell, { width: "18%" }]}>Total</Text>
                                <Text style={[styles.tableHeaderCell, { width: "18%" }]}>Paid</Text>
                                <Text style={[styles.tableHeaderCell, { width: "18%" }]}>Due Date</Text>
                                <Text style={[styles.tableHeaderCell, { width: "16%" }]}>Status</Text>
                            </View>
                            {fees.map((fee, index) => (
                                <View key={fee.id} style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}>
                                    <Text style={[styles.tableCell, styles.tableCellBold, { width: "30%" }]}>{fee.feeCategory.name}</Text>
                                    <Text style={[styles.tableCell, { width: "18%" }]}>{formatCurrencyIN(fee.totalFee)}</Text>
                                    <Text style={[styles.tableCell, { width: "18%" }]}>{formatCurrencyIN(fee.paidAmount)}</Text>
                                    <Text style={[styles.tableCell, { width: "18%" }]}>
                                        {fee.dueDate ? formatDateIN(new Date(fee.dueDate)) : "—"}
                                    </Text>
                                    <View style={[styles.tableCell, { width: "16%" }]}>
                                        <StatusBadge status={fee.status} type="fee" />
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Footer */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>{organization.name} • Confidential</Text>
                    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
                </View>
            </Page>

            {/* Page 2: Payment History (if exists) */}
            {fees.some((f) => f.payments.length > 0) && (
                <Page size="A4" style={styles.page}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Payment History</Text>
                        <Text style={styles.academicYear}>
                            {fullName} • {student.rollNumber}
                        </Text>
                    </View>

                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderCell, { width: "15%" }]}>Date</Text>
                            <Text style={[styles.tableHeaderCell, { width: "20%" }]}>Category</Text>
                            <Text style={[styles.tableHeaderCell, { width: "18%" }]}>Amount</Text>
                            <Text style={[styles.tableHeaderCell, { width: "15%" }]}>Method</Text>
                            <Text style={[styles.tableHeaderCell, { width: "17%" }]}>Receipt</Text>
                            <Text style={[styles.tableHeaderCell, { width: "15%" }]}>Status</Text>
                        </View>
                        {fees.flatMap((fee) =>
                            fee.payments.map((payment, pIndex) => (

                                <View key={payment.id} style={[styles.tableRow, pIndex % 2 === 1 ? styles.tableRowAlt : {}]}>
                                    <Text style={[styles.tableCell, { width: "15%" }]}>
                                        {formatDateIN(new Date(payment.paymentDate))}
                                    </Text>
                                    <Text style={[styles.tableCell, { width: "20%" }]}>{fee.feeCategory.name}</Text>
                                    <Text style={[styles.tableCell, styles.tableCellBold, { width: "18%" }]}>
                                        {formatCurrencyIN(payment.amount)}
                                    </Text>
                                    <Text style={[styles.tableCell, { width: "15%" }]}>{formatPaymentMethod(payment.paymentMethod)}</Text>
                                    <Text style={[styles.tableCell, { width: "17%" }]}>{payment.receiptNumber || "—"}</Text>
                                    <View style={[styles.tableCell, { width: "15%" }]}>
                                        <StatusBadge status={payment.status} type="payment" />
                                    </View>
                                </View>
                            )),
                        )}
                    </View>

                    <View style={styles.footer} fixed>
                        <Text style={styles.footerText}>{organization.name} • Confidential</Text>
                        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
                    </View>
                </Page>
            )}

            {/* Page 3: Attendance */}
            {attendance.length > 0 && (
                <Page size="A4" style={styles.page}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Attendance Summary</Text>
                        <Text style={styles.academicYear}>
                            {fullName} • {student.rollNumber}
                        </Text>
                    </View>

                    {/* Attendance Stats */}
                    <View style={styles.summaryGrid}>
                        <SummaryCard label="Total Days" value={String(attendanceSummary.totalDays)} accentColor={colors.gray600} />
                        <SummaryCard
                            label="Present"
                            value={String(attendanceSummary.presentDays)}
                            subtext={`${((attendanceSummary.presentDays / attendanceSummary.totalDays) * 100 || 0).toFixed(1)}%`}
                            accentColor={colors.green}
                        />
                        <SummaryCard label="Absent" value={String(attendanceSummary.absentDays)} accentColor={colors.red} />
                        <SummaryCard label="Late" value={String(attendanceSummary.lateDays)} accentColor={colors.amber} />
                    </View>

                    {/* Attendance Progress Bar */}
                    <View style={{ marginBottom: 20 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                            <Text style={styles.profileLabel}>Overall Attendance</Text>
                            <Text
                                style={[styles.profileValue, { color: attendanceSummary.percentage >= 75 ? colors.green : colors.red }]}
                            >
                                {attendanceSummary.percentage.toFixed(1)}%
                            </Text>
                        </View>
                        <View style={styles.attendanceBar}>
                            <View
                                style={[
                                    styles.attendanceProgress,
                                    {
                                        width: `${Math.min(attendanceSummary.percentage, 100)}%`,
                                        backgroundColor: attendanceSummary.percentage >= 75 ? colors.green : colors.red,
                                    },
                                ]}
                            />
                        </View>
                    </View>

                    {/* Recent Attendance Records */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Records</Text>
                    </View>
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderCell, { width: "25%" }]}>Date</Text>
                            <Text style={[styles.tableHeaderCell, { width: "20%" }]}>Status</Text>
                            <Text style={[styles.tableHeaderCell, { width: "55%" }]}>Note</Text>
                        </View>
                        {attendance.slice(0, 20).map((record, index) => (
                            <View key={record.id} style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}>
                                <Text style={[styles.tableCell, { width: "25%" }]}>{formatDateIN(new Date(record.date))}</Text>
                                <View style={[styles.tableCell, { width: "20%" }]}>
                                    <StatusBadge status={record.status} type="attendance" />
                                </View>
                                <Text style={[styles.tableCell, { width: "55%" }]}>{record.note || "—"}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.footer} fixed>
                        <Text style={styles.footerText}>{organization.name} • Confidential</Text>
                        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
                    </View>
                </Page>
            )}

            {/* Page 4: Exam Results */}
            {examResults.length > 0 && (
                <Page size="A4" style={styles.page}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Examination Results</Text>
                        <Text style={styles.academicYear}>
                            {fullName} • {student.rollNumber}
                        </Text>
                    </View>

                    {Object.entries(examsBySession).map(([sessionTitle, results]) => (
                        <View key={sessionTitle} style={{ marginBottom: 20 }}>
                            <Text style={[styles.sectionTitle, { fontSize: 10, marginBottom: 8, color: colors.gray600 }]}>
                                {sessionTitle}
                            </Text>
                            <View style={styles.table}>
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.tableHeaderCell, { width: "25%" }]}>Subject</Text>
                                    <Text style={[styles.tableHeaderCell, { width: "15%" }]}>Max</Text>
                                    <Text style={[styles.tableHeaderCell, { width: "15%" }]}>Obtained</Text>
                                    <Text style={[styles.tableHeaderCell, { width: "15%" }]}>Percentage</Text>
                                    <Text style={[styles.tableHeaderCell, { width: "15%" }]}>Grade</Text>
                                    <Text style={[styles.tableHeaderCell, { width: "15%" }]}>Result</Text>
                                </View>
                                {results.map((result, index) => (
                                    <View key={result.id} style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}>
                                        <Text style={[styles.tableCell, styles.tableCellBold, { width: "25%" }]}>
                                            {result.exam.subject.name}
                                        </Text>
                                        <Text style={[styles.tableCell, { width: "15%" }]}>{result.exam.maxMarks}</Text>
                                        <Text style={[styles.tableCell, styles.tableCellBold, { width: "15%" }]}>
                                            {result.isAbsent ? "AB" : (result.obtainedMarks ?? "—")}
                                        </Text>
                                        <Text style={[styles.tableCell, { width: "15%" }]}>
                                            {result.percentage ? `${result.percentage.toFixed(1)}%` : "—"}
                                        </Text>
                                        <Text style={[styles.tableCell, styles.tableCellBold, { width: "15%" }]}>
                                            {result.gradeLabel || "—"}
                                        </Text>
                                        <View style={[styles.tableCell, { width: "15%" }]}>
                                            {result.isAbsent ? (
                                                <StatusBadge status="ABSENT" type="attendance" />
                                            ) : (
                                                <StatusBadge status={result.isPassed ? "PASSED" : "FAILED"} type="result" />
                                            )}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}

                    <View style={styles.footer} fixed>
                        <Text style={styles.footerText}>{organization.name} • Confidential</Text>
                        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
                    </View>
                </Page>
            )}

            {/* Page 5: Leave Records */}
            {leaves.length > 0 && (
                <Page size="A4" style={styles.page}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Leave Records</Text>
                        <Text style={styles.academicYear}>
                            {fullName} • {student.rollNumber}
                        </Text>
                    </View>

                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderCell, { width: "18%" }]}>From</Text>
                            <Text style={[styles.tableHeaderCell, { width: "18%" }]}>To</Text>
                            <Text style={[styles.tableHeaderCell, { width: "10%" }]}>Days</Text>
                            <Text style={[styles.tableHeaderCell, { width: "12%" }]}>Type</Text>
                            <Text style={[styles.tableHeaderCell, { width: "27%" }]}>Reason</Text>
                            <Text style={[styles.tableHeaderCell, { width: "15%" }]}>Status</Text>
                        </View>
                        {leaves.map((leave, index) => (

                            <View key={leave.id} style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}>
                                <Text style={[styles.tableCell, { width: "18%" }]}>{formatDateIN(new Date(leave.startDate))}</Text>
                                <Text style={[styles.tableCell, { width: "18%" }]}>{formatDateIN(new Date(leave.endDate))}</Text>
                                <Text style={[styles.tableCell, styles.tableCellBold, { width: "10%" }]}>{leave.totalDays}</Text>
                                <Text style={[styles.tableCell, { width: "12%" }]}>{leave.type}</Text>
                                <Text style={[styles.tableCell, { width: "27%" }]} numberOfLines={2}>
                                    {leave.reason}
                                </Text>
                                <View style={[styles.tableCell, { width: "15%" }]}>
                                    <StatusBadge status={leave.currentStatus} type="leave" />
                                </View>
                            </View>
                        ))}
                    </View>

                    <View style={styles.footer} fixed>
                        <Text style={styles.footerText}>{organization.name} • Confidential</Text>
                        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
                    </View>
                </Page>
            )}
        </Document>
    )
}


export default StudentReportPDF