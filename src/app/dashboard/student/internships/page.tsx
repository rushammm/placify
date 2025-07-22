import { db } from "~/server/db";
import Link from "next/link";
import type { InferModel } from "drizzle-orm";
import type { internships, companies } from "~/server/db/schema";

// Helper to get unique values for a key from an array of objects
function getUniqueValues<T, K extends keyof T>(array: T[], key: K): T[K][] {
  return Array.from(new Set(array.map((item) => item[key]).filter((v): v is T[K] => v !== undefined && v !== null)));
}

type Internship = InferModel<typeof internships>;
type Company = InferModel<typeof companies>;


interface PageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

const jobTypes = [
  { value: "internship", label: "Internship" },
  { value: "full-time", label: "Full Time" },
  { value: "part-time", label: "Part Time" },
  { value: "remote", label: "Remote" },
];

const experienceLevelOptions = [
  { value: "fresher", label: "Fresher" },
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior Level" },
  { value: "lead", label: "Lead" },
];

import FilterForm from "./FilterForm";

// Use an async function for the page (Next.js 13+)
export default async function StudentInternshipsPage({ searchParams }: PageProps) {
  // Await searchParams since it's now a Promise in Next.js 15
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  // Fetch all internships with company info
  const internships: Internship[] = await db.query.internships.findMany({
    orderBy: (i, { desc }) => desc(i.createdAt),
  });

  // Get all companies for mapping
  const companies: Company[] = await db.query.companies.findMany({});
  const companyMap: Record<number, Company> = Object.fromEntries(companies.map((c) => [c.id, c]));

  // Filters
  // Only show filters if there is at least one non-empty value
  const locations = getUniqueValues<Internship, "location">(internships, "location")
    .filter((v): v is string => typeof v === "string" && v.trim() !== "");

  // Convert searchParams to a string-indexed object for FilterForm
  const initialSearchParams: Record<string, string | undefined> = {};
  if (resolvedSearchParams) {
    Object.entries(resolvedSearchParams).forEach(([key, value]) => {
      if (typeof value === "string") initialSearchParams[key] = value;
    });
  }

  // Apply filters from resolvedSearchParams
  let filtered: Internship[] = internships;
  if (resolvedSearchParams?.location) {
    const location =
      typeof resolvedSearchParams.location === "string"
        ? resolvedSearchParams.location
        : Array.isArray(resolvedSearchParams.location)
        ? resolvedSearchParams.location[0]
        : "";
    if (location) {
      filtered = filtered.filter((i: Internship) =>
        i.location?.toLowerCase().includes(location.toLowerCase())
      );
    }
  }
  if (resolvedSearchParams?.experienceLevel) {
    const experienceLevel =
      typeof resolvedSearchParams.experienceLevel === "string"
        ? resolvedSearchParams.experienceLevel
        : Array.isArray(resolvedSearchParams.experienceLevel)
        ? resolvedSearchParams.experienceLevel[0]
        : "";
    if (experienceLevel) {
      filtered = filtered.filter((i: Internship) =>
        i.experienceLevel?.toLowerCase() === experienceLevel.toLowerCase()
      );
    }
  }
  if (resolvedSearchParams?.jobType) {
    const jobType =
      typeof resolvedSearchParams.jobType === "string"
        ? resolvedSearchParams.jobType
        : Array.isArray(resolvedSearchParams.jobType)
        ? resolvedSearchParams.jobType[0]
        : "";
    if (jobType === "remote") filtered = filtered.filter((i: Internship) => i.isRemote);
    else if (jobType === "part-time") filtered = filtered.filter((i: Internship) => i.title?.toLowerCase().includes("part-time"));
    else if (jobType === "full-time") filtered = filtered.filter((i: Internship) => i.title?.toLowerCase().includes("full-time"));
    else if (jobType === "internship") filtered = filtered.filter((i: Internship) => i.title?.toLowerCase().includes("intern"));
  }
  if (resolvedSearchParams?.remoteOnly) {
    filtered = filtered.filter((i: Internship) => i.isRemote);
  }

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
            {/* You can add SignInButton/SignUpButton here if needed */}
          </div>
        </div>
      </nav>
      <main className="py-16 px-4 sm:px-8 bg-white dark:bg-black min-h-[80vh]">
        <div className="max-w-5xl mx-auto relative">
          {/* Back to Dashboard Button - top right, small */}
          <div className="absolute right-0 top-0 mt-2 mr-2 z-10">
            <Link
              href="/dashboard/student"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#45cee3] text-white text-sm font-medium shadow-soft hover:bg-[#39a7b8] focus:outline-none focus:ring-2 focus:ring-[#45cee3] transition-all"
              prefetch={false}
              aria-label="Back to Dashboard"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 20 20" aria-hidden="true" className="-ml-1 h-4 w-4"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16l-5-5 5-5"/></svg>
              Dashboard
            </Link>
          </div>
          <div className="mb-10 text-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
              Browse Internships
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-2 font-light">
              Find the best opportunities tailored for you.
            </p>
          </div>
          {/* Filters */}
          <div className="mb-10">
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-soft">
              <FilterForm
                locations={locations}
                jobTypes={jobTypes}
                experienceLevelOptions={experienceLevelOptions}
                initialSearchParams={initialSearchParams}
              />
            </div>
          </div>
          {/* Internship List */}
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="text-lg">No internships found for selected filters.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {filtered.map((internship) => (
                <div key={internship.id} className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-2xl p-6 shadow-soft hover:shadow-md transition-all duration-200 hover:border-[#ff4e4e]/20 flex flex-col gap-2">
                  <h2 className="text-2xl font-semibold mb-2">{internship.title}</h2>
                  <div className="text-gray-700 dark:text-gray-300 font-medium mb-1">{companyMap[internship.companyId]?.name ?? "Unknown Company"}</div>
                  <div className="flex gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span>{internship.location ?? "Location not specified"}</span>
                    <span>•</span>
                    <span>{internship.isRemote ? "Remote" : "Onsite"}</span>
                    {internship.experienceLevel && <><span>•</span><span>{internship.experienceLevel}</span></>}
                  </div>
                  <div className="line-clamp-3 text-gray-600 dark:text-gray-400 mb-4">{internship.description}</div>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{companyMap[internship.companyId]?.name ?? "Unknown Company"}</span>
                    <Link href={`/internships/${internship.id}`} className="inline-flex items-center px-4 py-2 rounded-xl font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#45cee3] bg-[#45cee3] text-white hover:bg-[#39a7b8] shadow-soft">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-white/50 dark:bg-black/50 backdrop-blur-xl border-t border-white/20 dark:border-white/10 py-16 px-6 mt-16">
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
