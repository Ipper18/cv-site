"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { CvData, CvEducation, CvExperience, CvProject, CvSkillCategory, CvPersonalInfo } from "@/lib/cv-data";
import { normalizeImagePath } from "@/lib/image-paths";
import { formatDateRange } from "@/lib/utils";
import { useLanguage } from "@/components/i18n/language-provider";
import { useCvTranslation } from "@/components/i18n/use-cv-translation";

type Props = {
  data: CvData;
  personalInfo: CvPersonalInfo;
};

type UiLabels = {
  educationTitle: string;
  educationSubtitle: string;
  skillsTitle: string;
  skillsSubtitle: string;
  experienceTitle: string;
  experienceSubtitle: string;
  projectsTitle: string;
  projectsSubtitle: string;
  techStack: string;
  links: string;
  gallery: string;
  close: string;
  email: string;
  city: string;
  github: string;
  linkedin: string;
  website: string;
};

export function CvClient({ data, personalInfo }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { language, isTyping } = useLanguage();
  const { data: localizedData, personalInfo: localizedPersonal, loading, error } = useCvTranslation(data, personalInfo, language);
  const dateLocale = language === "pl" ? "pl-PL" : "en-US";

  const ui: UiLabels = useMemo(
    () =>
      language === "pl"
        ? {
          educationTitle: "Edukacja",
          educationSubtitle: "Formalne wyksztalcenie i certyfikacje",
          skillsTitle: "Umiejetnosci",
          skillsSubtitle: "Technologie, narzedzia i specjalizacje",
          experienceTitle: "Doswiadczenie",
          experienceSubtitle: "Ostatnie zaangazowania i projekty",
          projectsTitle: "Projekty",
          projectsSubtitle: "Wybrane realizacje i dema",
          techStack: "Stos technologiczny",
          links: "Linki",
          gallery: "Galeria",
          close: "Zamknij",
          email: "Email",
          city: "Miasto",
          github: "GitHub",
          linkedin: "LinkedIn",
          website: "Strona WWW",
        }
        : {
          educationTitle: "Education",
          educationSubtitle: "Formal training and certifications",
          skillsTitle: "Skills",
          skillsSubtitle: "Technologies, tools, and specializations",
          experienceTitle: "Experience",
          experienceSubtitle: "Recent engagements and deliveries",
          projectsTitle: "Projects",
          projectsSubtitle: "Featured builds and demos",
          techStack: "Tech stack",
          links: "Links",
          gallery: "Gallery",
          close: "Close",
          email: "Email",
          city: "City",
          github: "GitHub",
          linkedin: "LinkedIn",
          website: "Website",
        },
    [language],
  );

  const querySlug = searchParams.get("project");
  const projectsBySlug = useMemo(() => new Map(localizedData.projects.map((p) => [p.slug, p])), [localizedData.projects]);
  const selectedProject = querySlug ? projectsBySlug.get(querySlug) : undefined;
  const effectivePersonalInfo: CvPersonalInfo = localizedPersonal ?? personalInfo;

  const handleSelectProject = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("project", slug);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleCloseDrawer = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("project");
    const query = params.toString();
    const next = query ? `${pathname}?${query}` : pathname;
    router.push(next, { scroll: false });
  };

  return (
    <div className={`relative ${isTyping || loading ? "language-typing" : ""}`}>
      <Script src="https://platform.linkedin.com/badges/js/profile.js" strategy="afterInteractive" />
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 lg:flex-row">
        <aside className="lg:w-1/3 lg:min-h-screen lg:sticky lg:top-8">
          <ProfileCard personalInfo={effectivePersonalInfo} labels={ui} />
        </aside>
        <main className="flex-1 space-y-16">
          {error ? <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{error}</p> : null}

          <section className="fade-section space-y-6">
            <SectionHeader title={ui.educationTitle} subtitle={ui.educationSubtitle} />
            <div className="space-y-4">
              {localizedData.education.map((entry) => (
                <EducationCard key={entry.id ?? entry.school} education={entry} locale={dateLocale} />
              ))}
            </div>
          </section>

          <section className="fade-section space-y-6">
            <SectionHeader title={ui.skillsTitle} subtitle={ui.skillsSubtitle} />
            <div className="space-y-6">
              {localizedData.skillCategories.map((category) => (
                <SkillCard key={category.id ?? category.name} category={category} />
              ))}
            </div>
          </section>

          <section className="fade-section space-y-6">
            <SectionHeader title={ui.experienceTitle} subtitle={ui.experienceSubtitle} />
            <div className="space-y-4">
              {localizedData.experiences.map((experience) => (
                <ExperienceCard key={experience.id ?? experience.company} experience={experience} locale={dateLocale} />
              ))}
            </div>
          </section>

          <section className="fade-section space-y-6">
            <SectionHeader title={ui.projectsTitle} subtitle={ui.projectsSubtitle} />
            <div className="grid gap-4 md:grid-cols-2">
              {localizedData.projects.map((project) => (
                <button
                  key={project.id ?? project.slug}
                  type="button"
                  onClick={() => handleSelectProject(project.slug)}
                  className={`rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${selectedProject?.slug === project.slug ? "ring-2 ring-[var(--accent)]" : ""
                    }`}
                >
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{project.techTags.join(" • ")}</p>
                  <h3 className="mt-2 text-xl font-semibold text-[var(--foreground)]">{project.name}</h3>
                  <p className="mt-3 text-sm text-[var(--muted)]">{project.shortDescription}</p>
                </button>
              ))}
            </div>
          </section>
        </main>
      </div>

      <ProjectDrawer project={selectedProject} onClose={handleCloseDrawer} labels={ui} />
    </div>
  );
}

function ProfileCard({ personalInfo, labels }: { personalInfo: CvPersonalInfo; labels: UiLabels }) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white p-8 shadow-xl">
      <div className="flex flex-col items-center text-center">
        <div className="relative h-32 w-32 overflow-hidden rounded-full">
          <Image src={normalizeImagePath(personalInfo.photoUrl)} alt={personalInfo.fullName} fill sizes="128px" className="object-cover" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold">{personalInfo.fullName}</h1>
        <p className="text-[var(--accent)]">{personalInfo.title}</p>
        <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{personalInfo.shortBio}</p>
      </div>
      <div className="mt-6 space-y-3 text-sm">
        <ContactRow label={labels.email} value={personalInfo.email} />
        <ContactRow label={labels.city} value={personalInfo.city} />
        <ContactRow label={labels.github} href={personalInfo.githubUrl} value={personalInfo.githubUrl.replace(/^https?:\/\//, "")} />
        {personalInfo.websiteUrl ? (
          <ContactRow label={labels.website} href={personalInfo.websiteUrl} value={personalInfo.websiteUrl.replace(/^https?:\/\//, "")} />
        ) : null}
        <ContactRow label={labels.linkedin} href={personalInfo.linkedinUrl} value={personalInfo.linkedinUrl.replace(/^https?:\/\//, "")} />
        <LinkedInBadge />
      </div>
    </div>
  );
}

function ContactRow({ label, value, href }: { label: string; value: string; href?: string }) {
  const content = (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{label}</span>
      <span className="text-sm font-medium text-[var(--foreground)]">{value}</span>
    </div>
  );
  if (href) {
    return (
      <Link href={href} target="_blank" className="block hover:text-[var(--accent)]">
        {content}
      </Link>
    );
  }
  return content;
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.4em] text-[var(--accent)]">{title}</p>
      <p className="mt-1 text-sm text-[var(--muted)]">{subtitle}</p>
    </div>
  );
}

function EducationCard({ education, locale }: { education: CvEducation; locale: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex flex-wrap items-center justify-between text-sm text-[var(--muted)]">
        <span>{education.school}</span>
        <span>{formatDateRange(education.startDate, education.endDate, locale)}</span>
      </div>
      <h3 className="mt-2 text-lg font-semibold text-[var(--foreground)]">
        {education.degree} • {education.field}
      </h3>
      <p className="mt-2 text-sm text-[var(--muted)]">{education.description}</p>
    </div>
  );
}

function SkillCard({ category }: { category: CvSkillCategory }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <p className="text-sm font-semibold text-[var(--foreground)]">{category.name}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <span key={skill.id ?? skill.name} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-[var(--muted)]">
            {skill.name}
            {skill.level ? <span className="text-[var(--accent)]"> • {skill.level}</span> : null}
          </span>
        ))}
      </div>
    </div>
  );
}

function ExperienceCard({ experience, locale }: { experience: CvExperience; locale: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex flex-wrap items-center justify-between text-sm text-[var(--muted)]">
        <span>{experience.company}</span>
        <span>{formatDateRange(experience.startDate, experience.endDate, locale)}</span>
      </div>
      <h3 className="mt-2 text-lg font-semibold text-[var(--foreground)]">{experience.role}</h3>
      {experience.location ? <p className="text-sm text-[var(--muted)]">{experience.location}</p> : null}
      <p className="mt-3 text-sm text-[var(--muted)]">{experience.description}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {experience.technologiesList.map((tech) => (
          <span key={tech} className="rounded-full bg-teal-50 px-3 py-1 text-[var(--accent)]">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectDrawer({ project, onClose, labels }: { project?: CvProject; onClose: () => void; labels: UiLabels }) {
  const isOpen = Boolean(project);
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-xl overflow-y-auto bg-white px-6 py-10 shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {project ? (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">{labels.projectsTitle}</p>
                <h2 className="text-2xl font-semibold text-[var(--foreground)]">{project.name}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-200 px-3 py-1 text-sm text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {labels.close}
              </button>
            </div>
            <p className="text-sm leading-relaxed text-[var(--muted)]">{project.longDescription}</p>
            <div>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">{labels.techStack}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {project.techTags.map((tag) => (
                  <span key={tag} className="rounded-full bg-teal-50 px-3 py-1 text-xs text-[var(--accent)]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {project.links.length ? (
              <div>
                <h3 className="text-sm font-semibold text-[var(--foreground)]">{labels.links}</h3>
                <div className="mt-2 space-y-2 text-sm">
                  {project.links.map((link) => (
                    <Link
                      key={link.id ?? link.label}
                      href={link.url}
                      target="_blank"
                      className="block rounded-2xl border border-slate-200 px-4 py-2 text-[var(--accent)] transition hover:border-[var(--accent)]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
            {project.images.length ? (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-[var(--foreground)]">{labels.gallery}</h3>
                {project.images.map((image) => (
                  <div key={image.id ?? image.imageUrl} className="overflow-hidden rounded-2xl">
                    <Image src={normalizeImagePath(image.imageUrl)} alt={image.altText} width={960} height={540} className="h-auto w-full object-cover" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </aside>
    </>
  );
}

function LinkedInBadge() {
  return (
    <div className="flex justify-center">
      <div
        className="badge-base LI-profile-badge"
        data-locale="pl_PL"
        data-size="medium"
        data-theme="light"
        data-type="VERTICAL"
        data-vanity="igor-pakowski-781142232"
        data-version="v1"
      >
        <a className="badge-base__link LI-simple-link" href="https://pl.linkedin.com/in/igor-pakowski-781142232?trk=profile-badge">
          Igor Pakowski
        </a>
      </div>
    </div>
  );
}
