import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getCvData } from "@/lib/cv-data";
import { seedData } from "@/lib/seed-data";
import { CvClient } from "@/components/cv/cv-client";

export default async function CvPage() {
  const data = await getCvData();
  const personalInfo = data.personalInfo ?? seedData.personalInfo;

  if (!personalInfo) {
    notFound();
  }

  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-16">Loading...</div>}>
      <CvClient data={data} personalInfo={personalInfo} />
    </Suspense>
  );
}
