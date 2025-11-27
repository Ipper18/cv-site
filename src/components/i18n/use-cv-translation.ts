"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { CvData, CvPersonalInfo, CvEducation, CvExperience, CvProject, CvSkillCategory } from "@/lib/cv-data";
import type { Language } from "./language-provider";

type TranslationMap = Record<string, string>;

async function requestTranslations(texts: string[], targetLang: "EN" | "PL"): Promise<TranslationMap> {
  const response = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texts, targetLang }),
  });

  if (!response.ok) {
    throw new Error(`Translation failed: ${response.statusText}`);
  }

  const payload = (await response.json()) as { translations: TranslationMap };
  return payload.translations;
}

function collectTexts(data: CvData, personalInfo: CvPersonalInfo | null): string[] {
  const texts: string[] = [];
  if (personalInfo) {
    texts.push(
      personalInfo.fullName,
      personalInfo.title,
      personalInfo.shortBio,
      personalInfo.city,
      personalInfo.githubUrl,
      personalInfo.linkedinUrl,
      personalInfo.websiteUrl ?? "",
    );
  }

  const pushEdu = (edu: CvEducation) => {
    texts.push(edu.school, edu.degree, edu.field, edu.description);
  };
  data.education.forEach(pushEdu);

  data.skillCategories.forEach((cat) => {
    texts.push(cat.name);
    cat.skills.forEach((skill) => {
      texts.push(skill.name);
      if (skill.level) texts.push(skill.level);
    });
  });

  data.experiences.forEach((exp) => {
    texts.push(exp.company, exp.role, exp.description);
    if (exp.location) texts.push(exp.location);
  });

  data.projects.forEach((project) => {
    texts.push(project.name, project.shortDescription, project.longDescription, project.techStack);
    project.links.forEach((link) => texts.push(link.label));
    project.images.forEach((image) => texts.push(image.altText));
  });

  return Array.from(new Set(texts.filter(Boolean)));
}

function applyTranslations(map: TranslationMap, data: CvData, personalInfo: CvPersonalInfo | null): { data: CvData; personalInfo: CvPersonalInfo | null } {
  const t = (value: string | undefined) => (value ? map[value] ?? value : value);

  const translatedPersonal = personalInfo
    ? {
        ...personalInfo,
        fullName: t(personalInfo.fullName) ?? personalInfo.fullName,
        title: t(personalInfo.title) ?? personalInfo.title,
        shortBio: t(personalInfo.shortBio) ?? personalInfo.shortBio,
        city: t(personalInfo.city) ?? personalInfo.city,
        githubUrl: t(personalInfo.githubUrl) ?? personalInfo.githubUrl,
        linkedinUrl: t(personalInfo.linkedinUrl) ?? personalInfo.linkedinUrl,
        websiteUrl: t(personalInfo.websiteUrl) ?? personalInfo.websiteUrl,
      }
    : null;

  const translatedEducation: CvEducation[] = data.education.map((edu) => ({
    ...edu,
    school: t(edu.school) ?? edu.school,
    degree: t(edu.degree) ?? edu.degree,
    field: t(edu.field) ?? edu.field,
    description: t(edu.description) ?? edu.description,
  }));

  const translatedSkills: CvSkillCategory[] = data.skillCategories.map((cat) => ({
    ...cat,
    name: t(cat.name) ?? cat.name,
    skills: cat.skills.map((skill) => ({
      ...skill,
      name: t(skill.name) ?? skill.name,
      level: skill.level ? t(skill.level) ?? skill.level : undefined,
    })),
  }));

  const translatedExperiences: CvExperience[] = data.experiences.map((exp) => ({
    ...exp,
    company: t(exp.company) ?? exp.company,
    role: t(exp.role) ?? exp.role,
    location: exp.location ? t(exp.location) ?? exp.location : undefined,
    description: t(exp.description) ?? exp.description,
  }));

  const translatedProjects: CvProject[] = data.projects.map((project) => {
    const techStackTranslated = t(project.techStack) ?? project.techStack;
    return {
      ...project,
      name: t(project.name) ?? project.name,
      shortDescription: t(project.shortDescription) ?? project.shortDescription,
      longDescription: t(project.longDescription) ?? project.longDescription,
      techStack: techStackTranslated,
      techTags: project.techTags, // keep original tags to avoid mutating known tech names
      links: project.links.map((link) => ({
        ...link,
        label: t(link.label) ?? link.label,
      })),
      images: project.images.map((image) => ({
        ...image,
        altText: t(image.altText) ?? image.altText,
      })),
    };
  });

  return {
    personalInfo: translatedPersonal,
    data: {
      ...data,
      education: translatedEducation,
      skillCategories: translatedSkills,
      experiences: translatedExperiences,
      projects: translatedProjects,
    },
  };
}

export function useCvTranslation(data: CvData, personalInfo: CvPersonalInfo | null, language: Language) {
  const cacheRef = useRef<Map<string, string>>(new Map());
  const [translated, setTranslated] = useState<{ data: CvData; personalInfo: CvPersonalInfo | null } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const texts = useMemo(() => collectTexts(data, personalInfo), [data, personalInfo]);

  useEffect(() => {
    let active = true;
    if (language === "pl") {
      setTranslated(null);
      setLoading(false);
      setError(null);
      return () => {
        active = false;
      };
    }

    async function translate() {
      setLoading(true);
      setError(null);
      try {
        const missing = texts.filter((txt) => !cacheRef.current.has(txt));
        if (missing.length) {
          const translations = await requestTranslations(missing, "EN");
          Object.entries(translations).forEach(([source, target]) => {
            cacheRef.current.set(source, target);
          });
        }
        if (!active) return;
        const map: TranslationMap = {};
        texts.forEach((txt) => {
          const value = cacheRef.current.get(txt);
          if (value) {
            map[txt] = value;
          }
        });
        setTranslated(applyTranslations(map, data, personalInfo));
      } catch (err) {
        console.error(err);
        if (active) setError("Nie udało się pobrać tłumaczenia.");
      } finally {
        if (active) setLoading(false);
      }
    }

    translate();

    return () => {
      active = false;
    };
  }, [language, data, personalInfo, texts]);

  return {
    personalInfo: translated?.personalInfo ?? personalInfo,
    data: translated?.data ?? data,
    loading,
    error,
  };
}
