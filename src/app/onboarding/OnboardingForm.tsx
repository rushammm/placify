"use client";
import { useState } from "react";
import { completeOnboarding } from "./actions";
type Role = "student" | "company" | "university";

export function OnboardingForm({ userId }: { userId: string }) {
  const [role, setRole] = useState<Role | null>(null);
  const [form, setForm] = useState<Record<string, string | number | undefined>>({});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showUniversityInput, setShowUniversityInput] = useState(false);

  const handleRoleSelect = (r: Role) => {
    setRole(r);
    setStep(2);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!role) throw new Error("Role not selected");
      // Convert form to correct type
      if (role === "student") {
        const universityId = form.universityId && !isNaN(Number(form.universityId)) ? Number(form.universityId) : undefined;
        const yearOfStudy = form.yearOfStudy && !isNaN(Number(form.yearOfStudy)) ? Number(form.yearOfStudy) : undefined;
        const data = {
          firstName: form.firstName as string,
          lastName: form.lastName as string,
          phone: form.phone as string,
          dateOfBirth: form.dateOfBirth as string,
          address: form.address as string,
          universityId,
          course: form.course as string,
          yearOfStudy,
          gpa: form.gpa as string,
          skills: form.skills as string,
          bio: form.bio as string,
          cvUrl: form.cvUrl as string,
          portfolioUrl: form.portfolioUrl as string,
          linkedinUrl: form.linkedinUrl as string,
          githubUrl: form.githubUrl as string,
        };
        await completeOnboarding({ userId, role, data });
      } else if (role === "company") {
        const data = {
          name: form.name as string,
          email: form.email as string,
          phone: form.phone as string,
          website: form.website as string,
          logo: form.logo as string,
          description: form.description as string,
          industry: form.industry as string,
          size: form.size as string,
          address: form.address as string,
          city: form.city as string,
          country: form.country as string,
          position: form.position as string,
        };
        await completeOnboarding({ userId, role, data });
      } else if (role === "university") {
        const data = {
          name: form.name as string,
          email: form.email as string,
          phone: form.phone as string,
          address: form.address as string,
          website: form.website as string,
          logo: form.logo as string,
          description: form.description as string,
          position: form.position as string,
          department: form.department as string,
        };
        await completeOnboarding({ userId, role, data });
      }
      window.location.href = "/";
    } catch {
      setError("Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  };

  // Render role selection
  if (step === 1) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Select your role</h2>
        <div className="flex gap-4">
          <button onClick={() => handleRoleSelect("student")} className="px-4 py-2 rounded bg-blue-500 text-white">Student</button>
          <button onClick={() => handleRoleSelect("company")} className="px-4 py-2 rounded bg-green-500 text-white">Company</button>
          <button onClick={() => handleRoleSelect("university")} className="px-4 py-2 rounded bg-purple-500 text-white">University</button>
        </div>
      </div>
    );
  }

  // Render form per role
  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
      {role === "student" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
            <input name="firstName" placeholder="First Name" onChange={handleChange} required
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
            <input name="lastName" placeholder="Last Name" onChange={handleChange} required
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
            <input name="phone" placeholder="Phone" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Birth</label>
            <input name="dateOfBirth" type="date" placeholder="Date of Birth" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
            <input name="address" placeholder="Address" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">University</label>
            <select
              name="universityId"
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400"
              value={form.universityId ?? ""}
              onChange={e => {
                if (e.target.value === "other") {
                  setShowUniversityInput(true);
                  setForm({ ...form, universityId: undefined });
                } else {
                  setShowUniversityInput(false);
                  setForm({ ...form, universityId: e.target.value });
                }
              }}
            >
              <option value="">Select from list (optional)</option>
              {/* You can map real universities here if you want */}
              <option value="other">Other (enter manually)</option>
            </select>
            {showUniversityInput && (
              <input
                name="newUniversityName"
                placeholder="Enter your university name"
                className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400 mt-2"
                onChange={handleChange}
                required
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course</label>
            <input name="course" placeholder="Course" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year of Study</label>
            <input name="yearOfStudy" placeholder="Year of Study" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GPA</label>
            <input name="gpa" placeholder="GPA" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills</label>
            <textarea name="skills" placeholder="Skills (comma separated)" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary resize-none dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
            <textarea name="bio" placeholder="Bio" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary resize-none dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CV URL</label>
            <input name="cvUrl" placeholder="CV URL" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Portfolio URL</label>
            <input name="portfolioUrl" placeholder="Portfolio URL" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">LinkedIn URL</label>
            <input name="linkedinUrl" placeholder="LinkedIn URL" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GitHub URL</label>
            <input name="githubUrl" placeholder="GitHub URL" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
        </>
      )}
      {role === "company" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Name</label>
            <input name="name" placeholder="Company Name" onChange={handleChange} required
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Email</label>
            <input name="email" placeholder="Company Email" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
            <input name="phone" placeholder="Phone" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website</label>
            <input name="website" placeholder="Website" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Logo URL</label>
            <input name="logo" placeholder="Logo URL" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <input name="description" placeholder="Description" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Industry</label>
            <input name="industry" placeholder="Industry" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Size</label>
            <input name="size" placeholder="Company Size" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
            <input name="address" placeholder="Address" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
            <input name="city" placeholder="City" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Country</label>
            <input name="country" placeholder="Country" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Position</label>
            <input name="position" placeholder="Your Position" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
        </>
      )}
      {role === "university" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">University Name</label>
            <input name="name" placeholder="University Name" onChange={handleChange} required
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">University Email</label>
            <input name="email" placeholder="University Email" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
            <input name="phone" placeholder="Phone" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
            <input name="address" placeholder="Address" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website</label>
            <input name="website" placeholder="Website" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Logo URL</label>
            <input name="logo" placeholder="Logo URL" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <input name="description" placeholder="Description" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Position</label>
            <input name="position" placeholder="Your Position" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
            <input name="department" placeholder="Department" onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400" />
          </div>
        </>
      )}
      {error && <div className="text-red-500">{error}</div>}
      <button type="submit" className="w-full inline-flex items-center justify-center px-4 py-2 rounded-xl font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary bg-primary text-white hover:bg-cyan-400 shadow-soft disabled:opacity-60 disabled:cursor-not-allowed" disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
    </form>
  );
}
