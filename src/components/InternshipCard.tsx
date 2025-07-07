import Link from "next/link";
import Image from "next/image";

interface InternshipCardProps {
  internship: {
    id: number;
    title: string;
    description: string;
    location: string | null;
    isRemote: boolean | null;
    salary: string | null;
    category: string | null;
    experienceLevel: string | null;
    companyName: string;
    companyLogo: string | null;
    viewCount: number | null;
    createdAt: Date;
  };
}

export function InternshipCard({ internship }: InternshipCardProps) {
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-2xl p-6 shadow-soft hover:shadow-md transition-all duration-200 hover:border-[#ff4e4e]/20">
      {/* Company Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {internship.companyLogo ? (
            <Image
              src={internship.companyLogo}
              alt={`${internship.companyName} logo`}
              width={40}
              height={40}
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-[#ff4e4e]/10 rounded-lg flex items-center justify-center">
              <span className="text-[#ff4e4e] font-medium text-sm">
                {internship.companyName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {internship.companyName}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {getTimeAgo(internship.createdAt)}
            </p>
          </div>
        </div>
        
        {internship.category && (
          <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            {internship.category}
          </span>
        )}
      </div>

      {/* Job Title */}
      <h3 className="text-xl font-medium tracking-tight text-black dark:text-white mb-2">
        {internship.title}
      </h3>

      {/* Description */}
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 line-clamp-2">
        {internship.description}
      </p>

      {/* Job Details */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
        {(internship.location ?? internship.isRemote) && (
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>
              {internship.isRemote 
                ? "Remote" 
                : internship.location ?? "Location not specified"
              }
            </span>
          </div>
        )}
        
        {internship.experienceLevel && (
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12,6 12,12 16,14"></polyline>
            </svg>
            <span>{internship.experienceLevel}</span>
          </div>
        )}
        
        {internship.salary && (
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            <span>{internship.salary}</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          {internship.viewCount && internship.viewCount > 0 && (
            <span>{internship.viewCount} views</span>
          )}
        </div>
        
        <Link
          href={`/internships/${internship.id}`}
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary bg-[#ff4e4e] text-white hover:bg-red-600 shadow-soft"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
