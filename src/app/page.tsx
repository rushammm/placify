import { Suspense } from "react";
import Link from "next/link";
// import { db } from "~/server/db";
import { internships, companies } from "~/server/db/schema";
import { desc, eq, sql } from "drizzle-orm";

// Components
import { InternshipCard } from "~/components/InternshipCard";
import { StatsCard } from "~/components/StatsCard";
import { SignInButton } from "~/components/auth/SignInButton";
import { SignUpButton } from "~/components/auth/SignUpButton";

async function getFeaturedInternships() {
  return await db
    .select({
      id: internships.id,
      title: internships.title,
      description: internships.description,
      location: internships.location,
      isRemote: internships.isRemote,
      salary: internships.salary,
      category: internships.category,
      experienceLevel: internships.experienceLevel,
      companyName: companies.name,
      companyLogo: companies.logo,
      viewCount: internships.viewCount,
      createdAt: internships.createdAt,
    })
    .from(internships)
    .innerJoin(companies, eq(internships.companyId, companies.id))
    .where(eq(internships.status, "active"))
    .orderBy(desc(internships.isFeatured), desc(internships.createdAt))
    .limit(6);
}

async function getPlatformStats() {
  const [
    totalInternships,
    totalCompanies,
    activeInternships,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(internships),
    db.select({ count: sql<number>`count(*)` }).from(companies),
    db.select({ count: sql<number>`count(*)` }).from(internships).where(eq(internships.status, "active")),
  ]);

  return {
    totalInternships: totalInternships[0]?.count ?? 0,
    totalCompanies: totalCompanies[0]?.count ?? 0,
    activeInternships: activeInternships[0]?.count ?? 0,
  };
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...new Array<number>(6)].map((_, i) => (
        <div key={i} className="animate-pulse bg-gray-200 dark:bg-black rounded-2xl h-64"></div>
      ))}
    </div>
  );
}

function StatsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {[...new Array<number>(3)].map((_, i) => (
        <div key={i} className="animate-pulse bg-gray-200 dark:bg-black rounded-2xl h-24"></div>
      ))}
    </div>
  );
}

async function FeaturedInternships() {
  const internships = await getFeaturedInternships();

  if (internships.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p className="text-lg">No internships available at the moment.</p>
        <p className="text-sm mt-2">Check back soon for new opportunities!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {internships.map((internship) => (
        <InternshipCard key={internship.id} internship={internship} />
      ))}
    </div>
  );
}

async function PlatformStats() {
  const stats = await getPlatformStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <StatsCard
        title="Active Internships"
        value={stats.activeInternships}
        description="Currently available positions"
      />
      <StatsCard
        title="Total Opportunities"
        value={stats.totalInternships}
        description="All-time internship postings"
      />
      <StatsCard
        title="Partner Companies"
        value={stats.totalCompanies}
        description="Trusted industry partners"
      />
    </div>
  );
}

import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) {
    // Fetch user from DB
    const user = await db.query.users.findFirst({ where: (u, { eq }) => eq(u.id, session.user.id) });
    if (user && (!user.role || user.role === "null")) {
      redirect("/onboarding");
    }
    // Role-based dashboard redirect
    if (user && user.role === "student") {
      redirect("/dashboard/student");
    }
    // Add more role redirects here as needed
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
            <SignInButton />
            <SignUpButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-[#45cee3]/20 to-[#39a7b8]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              <span className="bg-gradient-to-r from-black via-gray-800 to-black dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent animate-pulse">
                Find Your Perfect
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#45cee3] via-[#39a7b8] to-[#2d8a99] bg-clip-text text-transparent animate-bounce">
                Placement
              </span>
            </h1>
          </div>
          
          <div className="animate-fade-in-up delay-300">
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto mb-12 font-light">
              Connect with leading companies, showcase your skills, and launch your career with meaningful internship opportunities that shape your future.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-500">
            <SignUpButton 
              variant="primary" 
              size="large"
              className="w-full sm:w-auto bg-gradient-to-r from-[#45cee3] to-[#39a7b8] hover:from-[#39a7b8] hover:to-[#2d8a99] transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Get Started
            </SignUpButton>
            
            <Link 
              href="#featured-internships"
              className="group inline-flex items-center justify-center px-8 py-4 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 dark:border-white/10 text-black dark:text-white hover:bg-white/20 dark:hover:bg-white/10 w-full sm:w-auto transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Browse Opportunities
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {/* Floating Cards */}
          <div className="absolute top-20 left-0 hidden lg:block animate-float">
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/20 dark:border-white/10 shadow-xl">
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200">500+ Companies</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Hiring now</div>
            </div>
          </div>
          
          <div className="absolute bottom-20 right-0 hidden lg:block animate-float delay-1000">
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/20 dark:border-white/10 shadow-xl">
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200">98% Success Rate</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Placement guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-black dark:text-white mb-4">
              Trusted by Students Worldwide
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Join thousands of successful placements and start your journey today
            </p>
          </div>
          <Suspense fallback={<StatsLoadingSkeleton />}>
            <PlatformStats />
          </Suspense>
        </div>
      </section>

      {/* Featured Internships */}
      <section id="featured-internships" className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#45cee3] rounded-2xl mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-black dark:text-white mb-6">
              Featured Opportunities
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
              Discover exciting internship opportunities from top companies across various industries and kickstart your career journey.
            </p>
          </div>
          
          <Suspense fallback={<LoadingSkeleton />}>
            <FeaturedInternships />
          </Suspense>
          
          <div className="text-center mt-16">
            <Link
              href="/internships"
              className="group inline-flex items-center justify-center px-8 py-4 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#45cee3] bg-[#45cee3] text-white hover:bg-[#39a7b8] shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              View All Internships
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-white/10 dark:bg-white/5 backdrop-blur-lg border-y border-white/20 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Simple steps to find and secure your ideal internship opportunity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-lg rounded-3xl p-8 mb-6 inline-block border border-white/20 dark:border-white/10 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-[#45cee3] to-[#39a7b8] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  1
                </div>
              </div>
              <h3 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                Create Your Profile
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                Build a comprehensive profile showcasing your skills, education, and aspirations to stand out from the crowd.
              </p>
            </div>
            
            <div className="group text-center transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-3xl p-8 mb-6 inline-block border border-white/20 dark:border-white/10 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-[#45cee3] to-[#39a7b8] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  2
                </div>
              </div>
              <h3 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                Browse & Apply
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                Explore opportunities from top companies and apply with your personalized application in just a few clicks.
              </p>
            </div>
            
            <div className="group text-center transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-lg rounded-3xl p-8 mb-6 inline-block border border-white/20 dark:border-white/10 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-[#45cee3] to-[#39a7b8] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  3
                </div>
              </div>
              <h3 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                Start Your Journey
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                Get matched with companies, complete your internship, and build valuable experience for your future career.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#45cee3]/5 via-transparent to-[#39a7b8]/5"></div>
          <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/20 dark:border-white/10 shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto mb-10">
              Join thousands of students who have found their dream internships through our platform and take the first step towards your successful career.
            </p>
            
            <SignUpButton 
              variant="primary" 
              size="large"
              className="inline-flex bg-gradient-to-r from-[#45cee3] to-[#39a7b8] hover:from-[#39a7b8] hover:to-[#2d8a99] transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl px-10 py-4 text-lg"
            >
              Create Your Account
            </SignUpButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/50 dark:bg-black/50 backdrop-blur-xl border-t border-white/20 dark:border-white/10 py-16 px-6">
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
