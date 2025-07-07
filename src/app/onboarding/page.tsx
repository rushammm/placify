import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { auth } from "~/server/auth";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  // Fetch user from DB
  const user = await db.query.users.findFirst({ where: (u, { eq }) => eq(u.id, session.user.id) });
  if (!user) redirect("/api/auth/signin");

  // If already has a role, redirect to home
  if (user.role && user.role !== "null") redirect("/");

  // Render onboarding form (role selection and info collection)
  const OnboardingForm = (await import("./OnboardingForm")).OnboardingForm;
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
        </div>
      </nav>
      <main className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="max-w-xl w-full py-20">
          <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Complete Your Onboarding
          </h1>
          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-white/10 shadow-2xl">
            <OnboardingForm userId={user.id} />
          </div>
        </div>
      </main>
      <footer className="bg-white/50 dark:bg-black/50 backdrop-blur-xl border-t border-white/20 dark:border-white/10 py-8 px-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-[#45cee3] to-[#39a7b8] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Placify
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Connecting talent with opportunity
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
