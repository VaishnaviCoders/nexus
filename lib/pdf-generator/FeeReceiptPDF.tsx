"use client"

import { Document, Page, Text, View, StyleSheet, Svg, Path, Circle, Image } from "@react-pdf/renderer"

import { formatCurrencyIN, formatDateIN, formatDateTimeIN, numberToWords, } from "@/lib/utils"
import { PaymentStatus } from "@/generated/prisma/enums"
import { FeeRecord } from "@/types"
import { CopyType } from "@/components/dashboard/Fees/download-receipt-dialog"

// Using standard fonts (Helvetica) instead of registering custom fonts to avoid loading errors
// Helvetica is built-in to react-pdf

const colors = {
  primary: "#1e3a5f",
  primaryLight: "#2563eb",
  secondary: "#1f2937",
  accent: "#0d9488",
  muted: "#64748b",
  border: "#e2e8f0",
  background: "#f8fafc",
  white: "#ffffff",
  success: "#059669",
  warning: "#d97706",
  error: "#dc2626",
  gold: "#b8860b",
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    padding: 30,
    backgroundColor: colors.white,
    position: "relative",
  },
  // Decorative border
  borderOuter: {
    position: "absolute",
    top: 15,
    left: 15,
    right: 15,
    bottom: 15,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 4,
  },
  borderInner: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 2,
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoText: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "bold",
  },
  orgDetails: {
    flex: 1,
  },
  logoImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    objectFit: 'contain',
  },
  orgName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 3,
  },
  orgAddress: {
    fontSize: 8,
    color: colors.muted,
    marginBottom: 1,
  },
  receiptTitle: {
    alignItems: "center",
  },
  receiptTitleBox: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  receiptTitleText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  copyType: {
    fontSize: 8,
    color: colors.muted,
    marginTop: 4,
  },
  // Receipt meta info
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 4,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metaItem: {
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 7,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.secondary,
  },
  // Info sections
  twoColumn: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 15,
  },
  infoBox: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 4,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  infoLabel: {
    width: 80,
    fontSize: 8,
    color: colors.muted,
  },
  infoValue: {
    flex: 1,
    fontSize: 8,
    color: colors.secondary,
  },
  // Payment table
  tableSection: {
    marginBottom: 15,
  },
  tableTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  table: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    color: colors.white,
    fontSize: 7,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  tableRowAlt: {
    backgroundColor: colors.background,
  },
  tableCell: {
    fontSize: 8,
    color: colors.secondary,
  },
  // Column widths
  colSno: { width: "6%" },
  colDate: { width: "16%" },
  colMethod: { width: "14%" },
  colReceipt: { width: "24%" },
  colStatus: { width: "12%" },
  colAmount: { width: "28%", textAlign: "right" as const },
  // Status badge
  statusBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 6,
    fontWeight: "bold",
    color: colors.white,
    textTransform: "uppercase",
  },
  paidStatus: { backgroundColor: colors.success },
  pendingStatus: { backgroundColor: colors.warning },
  failedStatus: { backgroundColor: colors.error },
  // Summary
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  summaryBox: {
    width: 220,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  summaryLabel: {
    fontSize: 8,
    color: colors.muted,
  },
  summaryValue: {
    fontSize: 8,
    fontWeight: "bold",
    color: colors.secondary,
  },
  summaryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: colors.primary,
  },
  summaryTotalLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.white,
  },
  summaryTotalValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.white,
  },
  // Amount in words
  amountWords: {
    marginTop: 12,
    padding: 10,
    backgroundColor: colors.background,
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  amountWordsLabel: {
    fontSize: 7,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  amountWordsValue: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.secondary,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 35,
    left: 40,
    right: 40,
  },
  footerTop: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    marginBottom: 8,
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerNotes: {
    flex: 1,
  },
  footerNote: {
    fontSize: 7,
    color: colors.muted,
    marginBottom: 2,
  },
  signatureSection: {
    alignItems: "center",
  },
  signatureLine: {
    width: 100,
    borderTopWidth: 1,
    borderTopColor: colors.secondary,
    marginBottom: 3,
  },
  signatureLabel: {
    fontSize: 7,
    color: colors.muted,
  },
  // QR placeholder
  qrSection: {
    alignItems: "center",
    marginRight: 20,
  },
  qrBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  qrText: {
    fontSize: 5,
    color: colors.muted,
  },
  // Seal
  sealContainer: {
    position: "absolute",
    bottom: 80,
    right: 60,
    opacity: 0.15,
  },
  // Watermark
  watermark: {
    position: "absolute",
    top: "40%",
    left: "25%",
    fontSize: 50,
    color: colors.border,
    fontWeight: "bold",
    transform: "rotate(-35deg)",
    opacity: 0.4,
    letterSpacing: 4,
  },
})

interface FeeReceiptPDFProps {
  feeRecord: FeeRecord
  copyType?: CopyType
}

export function FeeReceiptPage({ feeRecord, copyType = "ORIGINAL" }: FeeReceiptPDFProps) {

  console.log("Record ", feeRecord)
  const { fee, student, feeCategory, grade, section, payments } = feeRecord
  const successfulPayments = payments.filter((p) => p.status === "COMPLETED")
  const latestPayment = successfulPayments[0]
  const primaryParent = student.parents?.find((p) => p.isPrimary)?.parent

  const getStatusStyle = (status: PaymentStatus) => {
    switch (status) {
      case "COMPLETED":
        return styles.paidStatus
      case "PENDING":
        return styles.pendingStatus
      default:
        return styles.failedStatus
    }
  }

  const feeDate = new Date(fee.dueDate)
  const academicYear = `${feeDate.getFullYear()}-${(feeDate.getFullYear() + 1).toString().slice(-2)}`

  return (
    <Page size="A4" style={styles.page}>
      {/* Decorative borders */}
      <View style={styles.borderOuter} />
      <View style={styles.borderInner} />

      {/* Watermark */}
      <Text style={styles.watermark}>{copyType}</Text>

      {/* Official Seal */}
      {/* <View style={styles.sealContainer}>
          <Svg width="80" height="80" viewBox="0 0 80 80">
            <Circle cx="40" cy="40" r="38" stroke={colors.primary} strokeWidth="2" fill="none" />
            <Circle cx="40" cy="40" r="32" stroke={colors.primary} strokeWidth="1" fill="none" />
            <Path d="M40 15 L43 30 L58 30 L46 40 L50 55 L40 46 L30 55 L34 40 L22 30 L37 30 Z" fill={colors.primary} />
          </Svg>
        </View> */}

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          {fee.organizationLogo ? (
            <Image src={fee.organizationLogo} style={styles.logoImage} />
          ) : (
            <Text style={styles.logoText}>{fee.organizationName?.charAt(0) || "E"}</Text>
          )}
        </View>
        <View style={styles.orgDetails}>
          <Text style={styles.orgName}>{fee.organizationName || "Educational Institution"}</Text>
          {/* {fee.organizationAddress && <Text style={styles.orgAddress}>{fee.organizationAddress}</Text>} */}
          {fee.organizationEmail && <Text style={styles.orgAddress}>Email: {fee.organizationEmail}</Text>}
          {fee.organizationPhone && <Text style={styles.orgAddress}>Phone: {fee.organizationPhone}</Text>}
        </View>
        <View style={styles.receiptTitle}>
          <View style={styles.receiptTitleBox}>
            <Text style={styles.receiptTitleText}>Fee Receipt</Text>
          </View>
          <Text style={styles.copyType}>( {copyType} )</Text>
        </View>
      </View>

      {/* Receipt Meta Info */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Receipt No</Text>
          <Text style={styles.metaValue}>
            {latestPayment?.receiptNumber || "N/A"}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Date</Text>
          <Text style={styles.metaValue}>
            {latestPayment ? formatDateIN(latestPayment.paymentDate) : "-"}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Academic Year</Text>
          <Text style={styles.metaValue}>{academicYear}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Fee Status</Text>
          <View
            style={[
              styles.statusBadge,
              fee.status === "PAID"
                ? styles.paidStatus
                : fee.status === "UNPAID"
                  ? styles.pendingStatus
                  : styles.failedStatus,
            ]}
          >
            <Text style={styles.statusText}>{fee.status}</Text>
          </View>
        </View>
      </View>

      {/* Two Column Info */}
      <View style={styles.twoColumn}>
        {/* Student Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Student Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>
              {student.firstName} {student.lastName}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Roll Number</Text>
            <Text style={styles.infoValue}>{student.rollNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Grade / Section</Text>
            <Text style={styles.infoValue}>
              {grade.grade} - {section.name}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Contact</Text>
            <Text style={styles.infoValue}>{student.phoneNumber}</Text>
          </View>
          {primaryParent && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Parent/Guardian</Text>
              <Text style={styles.infoValue}>
                {primaryParent.firstName} {primaryParent.lastName}
              </Text>
            </View>
          )}
        </View>

        {/* Fee Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Fee Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fee Category</Text>
            <Text style={styles.infoValue}>{feeCategory.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Fee Amount</Text>
            <Text style={styles.infoValue}>{formatCurrencyIN(fee.totalFee)}</Text>
          </View>
          {feeCategory.description && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Description</Text>
              <Text style={styles.infoValue}>{feeCategory.description}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Due Date</Text>
            <Text style={styles.infoValue}>{formatDateIN(fee.dueDate)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fee ID</Text>
            <Text style={styles.infoValue}>{fee.id}</Text>
          </View>
        </View>
      </View>

      {/* Payment Table */}
      <View style={styles.tableSection}>
        <Text style={styles.tableTitle}>Payment History</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colSno]}>#</Text>
            <Text style={[styles.tableHeaderCell, styles.colDate]}>Date</Text>
            <Text style={[styles.tableHeaderCell, styles.colMethod]}>Method</Text>
            <Text style={[styles.tableHeaderCell, styles.colReceipt]}>Transaction ID</Text>
            <Text style={[styles.tableHeaderCell, styles.colReceipt]}>Receipt Number</Text>
            <Text style={[styles.tableHeaderCell, styles.colStatus]}>Status</Text>
            <Text style={[styles.tableHeaderCell, styles.colAmount]}>Amount</Text>
          </View>
          {payments.length > 0 ? (
            payments.map((payment, index) => (
              <View key={payment.id} style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}>
                <Text style={[styles.tableCell, styles.colSno]}>{index + 1}</Text>
                <Text style={[styles.tableCell, styles.colDate]}>{formatDateIN(payment.paymentDate)}</Text>
                <Text style={[styles.tableCell, styles.colMethod]}>
                  {(payment.paymentMethod.charAt(0) +
                    payment.paymentMethod.slice(1).toLowerCase().replace(/_/g, ' '))}
                </Text>
                <Text style={[styles.tableCell, styles.colReceipt]}>
                  {payment.transactionId || " - "}
                </Text>
                <Text style={[styles.tableCell, styles.colReceipt]}>
                  {payment.receiptNumber || " - "}
                </Text>
                <View style={styles.colStatus}>
                  <View style={[styles.statusBadge, getStatusStyle(payment.status)]}>
                    <Text style={styles.statusText}>{payment.status}</Text>
                  </View>
                </View>
                <Text style={[styles.tableCell, styles.colAmount, { fontWeight: "bold" }]}>
                  {formatCurrencyIN(payment.amountPaid)}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { textAlign: "center", width: "100%" }]}>No payment records</Text>
            </View>
          )}
        </View>
      </View>

      {/* Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Fee Amount</Text>
            <Text style={styles.summaryValue}>{formatCurrencyIN(fee.totalFee)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Amount Paid</Text>
            <Text style={[styles.summaryValue, { color: colors.success }]}>{formatCurrencyIN(fee.paidAmount)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Balance Due</Text>
            <Text style={[styles.summaryValue, { color: fee.pendingAmount > 0 ? colors.error : colors.success }]}>
              {formatCurrencyIN(fee.pendingAmount)}
            </Text>
          </View>
          <View style={styles.summaryTotal}>
            <Text style={styles.summaryTotalLabel}>Net Received</Text>
            <Text style={styles.summaryTotalValue}>{formatCurrencyIN(fee.paidAmount)}</Text>
          </View>
        </View>
      </View>

      {/* Amount in Words */}
      <View style={styles.amountWords}>
        <Text style={styles.amountWordsLabel}>Amount in Words</Text>
        <Text style={styles.amountWordsValue}>{numberToWords(fee.paidAmount).toUpperCase()}</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerTop}>
          <View style={styles.footerContent}>
            <View style={styles.footerNotes}>
              <Text style={styles.footerNote}>• This is a computer-generated receipt.</Text>
              <Text style={styles.footerNote}>• Please retain this receipt for your records.</Text>
              <Text style={styles.footerNote}>
                • For queries: {fee.organizationEmail || "accounts@institution.edu"}
              </Text>
              <Text style={[styles.footerNote, { marginTop: 4 }]}>Generated: {formatDateTimeIN(new Date())}</Text>
            </View>
            <View style={styles.signatureSection}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Authorized Signatory</Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  )
}

export function FeeReceiptPDF(props: FeeReceiptPDFProps) {
  return (
    <Document>
      <FeeReceiptPage {...props} />
    </Document>
  )
}
