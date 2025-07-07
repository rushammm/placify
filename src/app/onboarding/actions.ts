"use server";
import { db } from "~/server/db";
import { users, students, companies, universities, universityUsers, companyUsers } from "~/server/db/schema";

import { eq } from "drizzle-orm";

// Types for onboarding data
type StudentData = {
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  universityId?: number;
  course?: string;
  yearOfStudy?: number;
  gpa?: string;
  skills?: string;
  bio?: string;
  cvUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
};

type CompanyData = {
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  logo?: string;
  description?: string;
  industry?: string;
  size?: string;
  address?: string;
  city?: string;
  country?: string;
  position: string;
};

type UniversityData = {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  logo?: string;
  description?: string;
  position: string;
  department?: string;
};

export async function completeOnboarding({ userId, role, data }: { userId: string, role: "student" | "company" | "university", data: StudentData | CompanyData | UniversityData }) {
  // Update user role
  await db.update(users).set({ role }).where(eq(users.id, userId));

  if (role === "student") {
    const studentData = data as StudentData & { newUniversityName?: string };
    let universityId = studentData.universityId;
    // If user entered a new university, insert it and use its id
    if (studentData.newUniversityName && studentData.newUniversityName.trim() !== "") {
      const [newUni] = await db.insert(universities).values({
        name: studentData.newUniversityName,
        isVerified: false,
      }).returning();
      universityId = newUni?.id;
    }
    await db.insert(students).values({
      userId,
      ...studentData,
      universityId: universityId ? Number(universityId) : undefined,
      isProfileComplete: true,
    });
  } else if (role === "company") {
    const companyData = data as CompanyData;
    const { position, ...companyFields } = companyData;
    const company = await db.insert(companies).values({
      ...companyFields,
      isVerified: false,
    }).returning();
    if (company[0]) {
      await db.insert(companyUsers).values({
        userId,
        companyId: company[0].id,
        position,
        isOwner: true,
      });
    }
  } else if (role === "university") {
    const universityData = data as UniversityData;
    const { position, department, ...universityFields } = universityData;
    const university = await db.insert(universities).values({
      ...universityFields,
      isVerified: false,
    }).returning();
    if (university[0]) {
      await db.insert(universityUsers).values({
        userId,
        universityId: university[0].id,
        position,
        department,
      });
    }
  }
}
