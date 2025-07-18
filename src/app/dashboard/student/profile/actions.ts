"use server";
import { db } from "~/server/db";
import { students } from "~/server/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile } from "fs/promises";
import path from "path";
import { eq } from "drizzle-orm";

export async function updateStudentProfile(formData: FormData, userId: string) {
  // Handle file uploads
  let imageUrl: string | undefined;
  let cvUrl: string | undefined;

  const photo = formData.get("photo");
  if (photo && typeof photo === "object" && "arrayBuffer" in photo) {
    const buffer = Buffer.from(await photo.arrayBuffer());
    const filename = `student-photo-${userId}-${Date.now()}`;
    const filePath = path.join("public", "uploads", filename);
    await writeFile(filePath, buffer);
    imageUrl = `/uploads/${filename}`;
  }

  const cv = formData.get("cv");
  if (cv && typeof cv === "object" && "arrayBuffer" in cv) {
    const buffer = Buffer.from(await cv.arrayBuffer());
    const filename = `student-cv-${userId}-${Date.now()}`;
    const filePath = path.join("public", "uploads", filename);
    await writeFile(filePath, buffer);
    cvUrl = `/uploads/${filename}`;
  }

  // Prepare update data
  const updateData: Partial<typeof students.$inferInsert> = {
    firstName: typeof formData.get("firstName") === "string" ? formData.get("firstName") as string : undefined,
    lastName: typeof formData.get("lastName") === "string" ? formData.get("lastName") as string : undefined,
    phone: typeof formData.get("phone") === "string" ? formData.get("phone") as string : undefined,
    dateOfBirth: typeof formData.get("dateOfBirth") === "string" ? formData.get("dateOfBirth") as string : undefined,
    course: typeof formData.get("course") === "string" ? formData.get("course") as string : undefined,
    yearOfStudy: typeof formData.get("yearOfStudy") === "string" ? Number(formData.get("yearOfStudy")) : undefined,
    gpa: typeof formData.get("gpa") === "string" ? formData.get("gpa") as string : undefined,
    skills: typeof formData.get("skills") === "string" ? formData.get("skills") as string : undefined,
    bio: typeof formData.get("bio") === "string" ? formData.get("bio") as string : undefined,
  };

  // Only set image/cvUrl if they exist in schema
  if (imageUrl) (updateData as Partial<{ image: string }>).image = imageUrl;
  if (cvUrl) updateData.cvUrl = cvUrl;

  await db.update(students)
    .set(updateData)
    .where(eq(students.userId, userId));

  revalidatePath("/dashboard/student");
  redirect("/dashboard/student");
}
