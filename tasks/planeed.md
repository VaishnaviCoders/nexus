✅ Problem:
Right now, you don’t have a model that defines academic year ranges per class or grade. So when calculating working days, attendance, or anything date-based, the system doesn’t know:

What’s the start date and end date of the academic year per grade group or section?

Which calendar range to use for different grades?

✅ Solution: Create an AcademicYear model that supports:
Organization-specific academic years

Grade-based (or range-based) applicability

Optional description (e.g. "Session 2025–26")

model AcademicYear {
id String @id @default(cuid())
name String // e.g. "2025–2026"
description String? // Optional note
startDate DateTime
endDate DateTime
organization Organization @relation(fields: [organizationId], references: [id])
organizationId String

grades Grade[] @relation("YearGrades")

createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

model Grade {
id String @id @default(cuid())
grade String
organizationId String
organization Organization @relation(fields: [organizationId], references: [id])

academicYear AcademicYear? @relation("YearGrades", fields: [academicYearId], references: [id])
academicYearId String?

students Student[]
section Section[]
}

const academicYear = await prisma.grade.findUnique({
where: { id: gradeId },
include: { academicYear: true },
});

const holidays = await prisma.academicCalendar.findMany({
where: {
organizationId: orgId,
startDate: {
lte: academicYear.academicYear.endDate,
},
endDate: {
gte: academicYear.academicYear.startDate,
},
},
});

✅ Summary
Step Action
1 Get academic year (startDate & endDate) for the grade
2 Fetch all AcademicCalendar events overlapping with that range
3 Expand date ranges, count unique days
4 Optionally skip weekends if needed
