import { auth } from "~/server/auth";
import { db } from "~/server/db";
import Link from "next/link";
import Image from "next/image";

// Components (reuse theme)
import { SignInButton } from "~/components/auth/SignInButton";
import { SignUpButton } from "~/components/auth/SignUpButton";

async function getStudentData(userId: string) {
  // Get student profile
  const student = await db.query.students.findFirst({ where: (s, { eq }) => eq(s.userId, userId) });
  return student;
}

async function getStudentApplications(studentId: number) {
  // Get all applications for this student
  return await db.query.applications.findMany({
    where: (a, { eq }) => eq(a.studentId, studentId),
    orderBy: (a, { desc }) => desc(a.appliedAt),
  });
}

async function getInternshipDetails(internshipId: number) {
  // Get internship and company details
  const internship = await db.query.internships.findFirst({ where: (i, { eq }) => eq(i.id, internshipId) });
  if (!internship) return null;
  const company = await db.query.companies.findFirst({ where: (c, { eq }) => eq(c.id, internship.companyId) });
  return { ...internship, company };
}

export default async function StudentDashboardPage() {
  const session = await auth();
  if (!session?.user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black">
        <h1 className="text-3xl font-bold mb-4">Please sign in to access your dashboard</h1>
        <SignInButton />
      </div>
    );
  }

  // Get student profile
  const student = await getStudentData(session.user.id);
  if (!student) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black">
        <h1 className="text-3xl font-bold mb-4">Student profile not found</h1>
        <SignUpButton />
      </div>
    );
  }

  // Applications
  const applications = await getStudentApplications(student.id);

  // Fetch internship details for each application
  const internshipsWithCompany = await Promise.all(
    applications.map(async (app) => {
      const details = await getInternshipDetails(app.internshipId);
      return { ...app, internship: details };
    })
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-white/20 dark:border-white/10 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#45cee3] to-[#39a7b8] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Placify
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <SignInButton />
            <SignUpButton />
          </div>
        </div>
      </nav>

      {/* Dashboard Header */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold tracking-tight text-black dark:text-white mb-2">
            Welcome, {student.firstName ?? session.user.name ?? "Student"}!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Here is your dashboard overview.
          </p>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <Image
              src={session.user.image ?? "/default-avatar.png"}
              alt="Profile Photo"
              width={128}
              height={128}
              className="w-32 h-32 rounded-full border-4 border-[#45cee3] object-cover shadow-lg"
            />
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold text-gray-700 dark:text-gray-200">Email:</div>
                  <div className="text-gray-900 dark:text-white">{session.user.email ?? "-"}</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-700 dark:text-gray-200">Phone:</div>
                  <div className="text-gray-900 dark:text-white">{student.phone ?? "-"}</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-700 dark:text-gray-200">University:</div>
                  <div className="text-gray-900 dark:text-white">{student.universityId ?? "-"}</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-700 dark:text-gray-200">Course:</div>
                  <div className="text-gray-900 dark:text-white">{student.course ?? "-"}</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-700 dark:text-gray-200">Year:</div>
                  <div className="text-gray-900 dark:text-white">{student.yearOfStudy ?? "-"}</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-700 dark:text-gray-200">GPA:</div>
                  <div className="text-gray-900 dark:text-white">{student.gpa ?? "-"}</div>
                </div>
              </div>
              <div className="mt-4 flex gap-4 flex-wrap">
                <Link href="/dashboard/student/profile" className="inline-block px-6 py-2 rounded-xl bg-[#45cee3] text-white font-semibold hover:bg-[#39a7b8] transition-all shadow-lg">
                  Edit Profile
                </Link>
                <Link href="/dashboard/student/internships" className="inline-block px-6 py-2 rounded-xl bg-[#39a7b8] text-white font-semibold hover:bg-[#45cee3] transition-all shadow-lg" prefetch={false}>
                  Browse Internships
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold tracking-tight text-black dark:text-white mb-4">
            Internship Applications
          </h3>
          {internshipsWithCompany.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400">You have not applied to any internships yet.</div>
          ) : (
            <div className="overflow-x-auto rounded-xl shadow-lg">
              <table className="min-w-full bg-white dark:bg-black/80 border border-white/20 dark:border-white/10">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Internship</th>
                    <th className="px-4 py-2 text-left">Company</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Applied At</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {internshipsWithCompany.map((app) => (
                    <tr key={app.id} className="border-t border-white/10 hover:bg-[#45cee3]/10 transition-all">
                      <td className="px-4 py-2 font-medium">
                        {app.internship?.title ?? "-"}
                      </td>
                      <td className="px-4 py-2">
                        {app.internship?.company?.name ?? "-"}
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${app.status === "accepted" ? "bg-green-200 text-green-800" : app.status === "rejected" ? "bg-red-200 text-red-800" : "bg-gray-200 text-gray-800"}`}>
                          {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : "-"}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-4 py-2">
                        <Link href={`/internships/${app.internshipId}`} className="text-[#45cee3] hover:underline font-semibold">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
