"use client";
import { useRef } from "react";

interface FilterFormProps {
  locations: string[];
  jobTypes: { value: string; label: string }[];
  experienceLevelOptions: { value: string; label: string }[];
  initialSearchParams: Record<string, string | undefined>;
}

export default function FilterForm({
  locations,
  jobTypes,
  experienceLevelOptions,
  initialSearchParams,
}: FilterFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const inputClass =
    "w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-[#45cee3] dark:bg-gray-900 dark:border-gray-700 dark:text-white placeholder-gray-400 transition duration-200";
  const selectClass =
    "w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-[#45cee3] dark:bg-gray-900 dark:border-gray-700 dark:text-white transition duration-200";

  const handleCurrentLocation = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        void fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
          .then((res) => res.json())
          .then((data: { address?: Record<string, string> }) => {
            const address = data.address;
            const city = address?.city ?? address?.town ?? address?.village ?? address?.state ?? "";
            const input = document.getElementById("location") as HTMLInputElement;
            if (input && city) input.value = city;
          })
          .catch(() => {/* ignore geolocation errors */});
      });
    }
  };

  return (
    <form
      ref={formRef}
      className="flex flex-wrap gap-4 mb-8"
      method="get"
      autoComplete="off"
    >
      {/* Location Input + Use Current Location */}
      <div className="flex flex-col min-w-[200px]">
        <label htmlFor="location" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
        <div className="flex gap-2">
          <input
            id="location"
            name="location"
            type="text"
            placeholder="Enter location"
            defaultValue={initialSearchParams.location ?? ""}
            className={inputClass}
            list="location-list"
          />
          <datalist id="location-list">
            {locations.map((loc) => (
              <option key={String(loc)} value={String(loc)} />
            ))}
          </datalist>
          <button
            type="button"
            className="flex items-center justify-center px-3 py-2 rounded-xl font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#45cee3] bg-[#45cee3] text-white hover:bg-[#39a7b8] shadow-soft"
            onClick={handleCurrentLocation}
            title="Use current location"
            aria-label="Use current location"
          >
            {/* Location Icon (Heroicons solid location-marker) */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c.554-1.11 2.25-3.36 4.5-6.09C19.5 12.09 21 10.09 21 8.25 21 5.35 18.65 3 15.75 3c-1.54 0-2.98.62-4.05 1.7A5.75 5.75 0 0 0 3 8.25c0 1.84 1.5 3.84 4.5 6.66C9.75 17.64 11.446 19.89 12 21z" />
              <circle cx="12" cy="8.25" r="2.25" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
      {/* Job Type Dropdown */}
      <div className="flex flex-col min-w-[200px]">
        <label htmlFor="jobType" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Job Type</label>
        <select id="jobType" name="jobType" defaultValue={initialSearchParams.jobType ?? ""} className={selectClass}>
          <option value="">All Job Types</option>
          {jobTypes.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>
      {/* Experience Level Dropdown */}
      <div className="flex flex-col min-w-[200px]">
        <label htmlFor="experienceLevel" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Experience Level</label>
        <select id="experienceLevel" name="experienceLevel" defaultValue={initialSearchParams.experienceLevel ?? ""} className={selectClass}>
          <option value="">All Experience Levels</option>
          {experienceLevelOptions.map((level) => (
            <option key={level.value} value={level.value}>{level.label}</option>
          ))}
        </select>
      </div>
      {/* Remote Only Checkbox */}
      <div className="flex flex-col justify-end">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <input
            type="checkbox"
            name="remoteOnly"
            defaultChecked={!!initialSearchParams.remoteOnly}
            className="accent-[#39a7b8]"
          />
          Remote Only
        </label>
      </div>
      <div className="flex items-end">
        <button type="submit" className="px-6 py-2 rounded-xl font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#45cee3] bg-[#45cee3] text-white hover:bg-[#39a7b8] shadow-soft">
          Apply Filters
        </button>
      </div>
    </form>
  );
}
