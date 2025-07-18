import { auth } from "~/server/auth";
import { db } from "~/server/db";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { updateStudentProfile } from "./actions";

// Components
import { SignInButton } from "~/components/auth/SignInButton";

async function getStudentData(userId: string) {
  const student = await db.query.students.findFirst({ where: (s, { eq }) => eq(s.userId, userId) });
  return student;
}

export default async function StudentProfilePage() {
  const session = await auth();
  if (!session?.user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black">
        <h1 className="text-3xl font-bold mb-4">Please sign in to edit your profile</h1>
        <SignInButton />
      </div>
    );
  }

  const student = await getStudentData(session.user.id);
  if (!student) {
    redirect("/dashboard/student");
  }


  async function handleFormAction(formData: FormData) {
    "use server";
    if (!session?.user) return;
    await updateStudentProfile(formData, session.user.id);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
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
            <Link href="/dashboard/student" className="text-[#45cee3] font-semibold hover:underline">Back to Dashboard</Link>
          </div>
        </div>
      </nav>
      <section className="py-12 px-6">
        <div className="max-w-2xl mx-auto bg-white dark:bg-black/80 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white mb-6">Edit Profile</h2>
          <form className="space-y-6" action={handleFormAction}>
            <div className="flex flex-col items-center mb-6">
              <Image
                src={session.user.image ?? "/default-avatar.png"}
                alt="Profile Photo"
                width={96}
                height={96}
                className="w-24 h-24 rounded-full border-4 border-[#45cee3] object-cover shadow-lg mb-2"
              />
              <div className="text-gray-700 dark:text-gray-200 font-medium">{session.user.email}</div>
              <label className="mt-2 block text-gray-700 dark:text-gray-200 font-semibold">Change Photo</label>
              <input name="photo" type="file" accept="image/*" className="mt-1" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">First Name</label>
                <input name="firstName" defaultValue={student.firstName ?? ""} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-black/30 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">Last Name</label>
                <input name="lastName" defaultValue={student.lastName ?? ""} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-black/30 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">Phone</label>
                <input name="phone" defaultValue={student.phone ?? ""} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-black/30 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">Date of Birth</label>
                <input name="dateOfBirth" type="date" defaultValue={student.dateOfBirth ?? ""} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-black/30 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">Course</label>
                <input name="course" defaultValue={student.course ?? ""} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-black/30 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">Year of Study</label>
                <input name="yearOfStudy" type="number" min="1" max="10" defaultValue={student.yearOfStudy ?? ""} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-black/30 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">GPA</label>
                <input name="gpa" defaultValue={student.gpa ?? ""} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-black/30 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">Skills</label>
                <input name="skills" defaultValue={student.skills ?? ""} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-black/30 text-gray-900 dark:text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">Bio</label>
                <textarea name="bio" defaultValue={student.bio ?? ""} rows={3} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-black/30 text-gray-900 dark:text-white" />
              </div>
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">Upload CV</label>
                <div className="flex items-center gap-4">
                  <input
                    id="cv-upload"
                    name="cv"
                    type="file"
                    accept="application/pdf,.doc,.docx"
                    className="hidden"
                  />
                  <label htmlFor="cv-upload" className="px-6 py-2 rounded-xl bg-[#45cee3] text-white font-semibold hover:bg-[#39a7b8] transition-all shadow-lg cursor-pointer">
                    Browse
                  </label>
                  <span id="cv-filename" className="text-gray-700 dark:text-gray-200"></span>
                </div>
                <script dangerouslySetInnerHTML={{__html:`
                  document.addEventListener('DOMContentLoaded', function() {
                    var input = document.getElementById('cv-upload');
                    var label = document.getElementById('cv-filename');
                    if(input && label) {
                      input.addEventListener('change', function() {
                        label.textContent = input.files && input.files.length > 0 ? input.files[0].name : '';
                      });
                    }
                  });
                `}} />
              </div>
            </div>
            <div className="flex justify-end mt-8">
              <button type="submit" className="px-8 py-3 rounded-xl bg-[#45cee3] text-white font-semibold hover:bg-[#39a7b8] transition-all shadow-lg">Save Changes</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
