import prisma from '@/lib/db';

export default async function Page({
  params,
}: {
  params: Promise<{ sectionId: string }>;
}) {
  const { sectionId } = await params;
  const startDate = new Date();
  const endDate = new Date();

  const attendance = await prisma.studentAttendance.findMany({
    where: {
      sectionId: sectionId,
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
    include: {
      student: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
  return (
    <div>
      <h1>Section {sectionId}</h1>

      <h2>Attendance</h2>
      <ul>
        {attendance.map((attendance) => (
          <li key={attendance.id}>
            {new Intl.DateTimeFormat('en-IN').format(attendance.date)} {''}
            <div className="border-2 my-5">
              <p>Section ID: {attendance.sectionId}</p>
              <p>Attendance ID: {attendance.id}</p>
              <p>
                Student ID:{' '}
                {attendance.student.firstName +
                  ' ' +
                  attendance.student.lastName}
              </p>
              <p>Present: {attendance.present ? 'Yes' : 'No'}</p>
              <p>
                Date: {new Intl.DateTimeFormat('en-IN').format(attendance.date)}
              </p>
              <p>Status: {attendance.status}</p>
              <p>Notes: {attendance.notes || 'None'}</p>
              <p>Recorded By: {attendance.recordedBy}</p>
              <p>
                Created At:{' '}
                {new Intl.DateTimeFormat('en-IN').format(attendance.createdAt)}
              </p>
              <p>
                Updated At:{' '}
                {new Intl.DateTimeFormat('en-IN').format(attendance.updatedAt)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
