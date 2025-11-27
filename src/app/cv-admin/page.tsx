import type React from "react";
import Link from "next/link";

import {
  deleteEducation,
  deleteExperience,
  deleteProject,
  deleteProjectImage,
  deleteProjectLink,
  deleteSkill,
  deleteSkillCategory,
  logoutAction,
  saveEducation,
  saveExperience,
  savePersonalInfo,
  saveProject,
  saveProjectImage,
  saveProjectLink,
  saveSkill,
  saveSkillCategory,
} from "@/app/cv-admin/actions";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { AdminTabs } from "@/components/admin/tabs";
import { requireAdminOrRedirect } from "@/lib/auth";
import { getCvData } from "@/lib/cv-data";
import { seedData } from "@/lib/seed-data";
import { toInputMonthValue } from "@/lib/utils";

const tabs = [
  { id: "personal", label: "Personal Info" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
];

export default async function AdminPage() {
  await requireAdminOrRedirect();
  const data = await getCvData();
  const fromSeed = data.fromSeed;
  const personalDefaults = data.personalInfo ?? seedData.personalInfo;

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-12 text-[var(--foreground)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--accent)]">CV Admin Panel</p>
              <h1 className="text-3xl font-semibold">Manage content</h1>
              <p className="text-sm text-[var(--muted)]">Update the preview data that powers the public /cv route.</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/cv"
                target="_blank"
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-[var(--accent)] transition hover:border-[var(--accent)]"
              >
                Preview CV
              </Link>
              <form action={logoutAction}>
                <button className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </header>

        <div
          className={`fade-section rounded-3xl border ${
            fromSeed
              ? "border-amber-200 bg-amber-50 text-amber-900"
              : "border-emerald-200 bg-emerald-50 text-emerald-900"
          } p-4 text-sm shadow-sm`}
        >
          {fromSeed ? (
            <p>
              You are editing preview seed data. Saving any section will persist it to the database and replace the sample content visible
              on /cv.
            </p>
          ) : (
            <p>Live CV content loaded. Use the panels below to edit modules, projects, links, and images in one place.</p>
          )}
        </div>

        <AdminTabs tabs={tabs} initialTab="personal">
          <section className="fade-section space-y-6">
            <h2 className="text-xl font-semibold">Personal information</h2>
            <form action={savePersonalInfo} className="admin-card space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Full name" name="fullName" defaultValue={personalDefaults.fullName} required />
                <TextField label="Title" name="title" defaultValue={personalDefaults.title} required />
                <TextField label="Email" name="email" type="email" defaultValue={personalDefaults.email} required />
                <TextField label="City" name="city" defaultValue={personalDefaults.city} required />
                <TextField label="GitHub URL" name="githubUrl" defaultValue={personalDefaults.githubUrl} required />
                <TextField label="LinkedIn URL" name="linkedinUrl" defaultValue={personalDefaults.linkedinUrl} required />
                <TextField label="Website" name="websiteUrl" defaultValue={personalDefaults.websiteUrl ?? ""} />
                <TextField label="Photo URL" name="photoUrl" defaultValue={personalDefaults.photoUrl} required />
                <TextareaField label="Short bio" name="shortBio" defaultValue={personalDefaults.shortBio} wrapperClassName="md:col-span-2" rows={4} required />
              </div>
              <div>
                <button className="pressable w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                  Save personal info
                </button>
              </div>
            </form>
          </section>

          <section className="fade-section space-y-6">
            <h2 className="text-xl font-semibold">Education</h2>
            <div className="space-y-5">
              {data.education.map((entry) => (
                <form key={entry.id} action={saveEducation} className="admin-card rounded-3xl border border-slate-200 bg-white p-5">
                  <input type="hidden" name="id" value={entry?.id} />
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextField label="School" name="school" defaultValue={entry.school} required />
                    <TextField label="Degree" name="degree" defaultValue={entry.degree} required />
                    <TextField label="Field" name="field" defaultValue={entry.field} required />
                    <TextField label="Order" name="order" type="number" defaultValue={String(entry.order)} required />
                    <TextField label="Start" name="startDate" type="month" defaultValue={toInputMonthValue(entry.startDate)} required />
                    <TextField label="End" name="endDate" type="month" defaultValue={toInputMonthValue(entry.endDate)} />
                  <TextareaField label="Description" name="description" defaultValue={entry.description} wrapperClassName="md:col-span-2" rows={3} required />
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button className="pressable rounded-2xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white">Save</button>
                  {entry.id ? (
                    <ConfirmDeleteButton action={deleteEducation} name="id" value={entry.id} />
                  ) : null}
                </div>
              </form>
            ))}

              <div className="admin-card rounded-3xl border border-dashed border-slate-300 bg-white p-5">
                <p className="text-sm font-semibold">Add education</p>
                <form action={saveEducation} className="mt-3 grid gap-4 md:grid-cols-2">
                  <TextField label="School" name="school" required />
                  <TextField label="Degree" name="degree" required />
                  <TextField label="Field" name="field" required />
                  <TextField label="Order" name="order" type="number" defaultValue="0" />
                  <TextField label="Start" name="startDate" type="month" required />
                  <TextField label="End" name="endDate" type="month" />
                  <TextareaField label="Description" name="description" wrapperClassName="md:col-span-2" rows={3} required />
                  <div className="md:col-span-2">
                    <button className="pressable w-full rounded-2xl border border-[var(--accent)] px-4 py-2 text-sm text-[var(--accent)]">
                      Add entry
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>

          <section className="fade-section space-y-6">
            <h2 className="text-xl font-semibold">Skills</h2>
            <div className="space-y-5">
              {data.skillCategories.map((category) => (
                <div key={category.id ?? category.name} className="admin-card rounded-3xl border border-slate-200 bg-white p-5">
                  <form action={saveSkillCategory} className="grid gap-3 md:grid-cols-[2fr,1fr,auto] md:items-end">
                    <input type="hidden" name="id" value={category.id ?? ""} />
                    <TextField label="Category" name="name" defaultValue={category.name} required />
                    <TextField label="Order" name="order" type="number" defaultValue={String(category.order)} required />
                    <div className="flex gap-2">
                      <button className="pressable flex-1 rounded-2xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white">Save</button>
                      {category.id ? (
                        <ConfirmDeleteButton action={deleteSkillCategory} name="id" value={category.id} />
                      ) : null}
                    </div>
                  </form>

                  <div className="mt-4 space-y-3">
                    {category.skills.map((skill) => (
                      <form key={skill.id ?? skill.name} action={saveSkill} className="grid gap-3 md:grid-cols-[2fr,1fr,1fr,auto] md:items-end">
                        <input type="hidden" name="id" value={skill.id ?? ""} />
                        <input type="hidden" name="categoryId" value={category.id ?? ""} />
                        <TextField label="Skill" name="name" defaultValue={skill.name} required />
                        <TextField label="Level" name="level" defaultValue={skill.level ?? ""} />
                        <TextField label="Order" name="order" type="number" defaultValue={String(skill.order)} />
                        <div className="flex gap-2">
                          <button className="pressable flex-1 rounded-2xl border border-[var(--accent)] px-4 py-2 text-sm text-[var(--accent)]">Update</button>
                          {skill.id ? (
                            <ConfirmDeleteButton action={deleteSkill} name="id" value={skill.id} label="Remove" confirmLabel="Remove" />
                          ) : null}
                        </div>
                      </form>
                    ))}
                  </div>

                  {category.id ? (
                    <form action={saveSkill} className="mt-4 grid gap-3 md:grid-cols-[2fr,1fr,1fr,auto] md:items-end">
                      <input type="hidden" name="categoryId" value={category.id} />
                      <TextField label="Skill" name="name" placeholder="Terraform" required />
                      <TextField label="Level" name="level" placeholder="Advanced" />
                      <TextField label="Order" name="order" type="number" defaultValue="0" />
                      <button className="pressable rounded-2xl border border-[var(--accent)] px-4 py-2 text-sm text-[var(--accent)]">Add skill</button>
                    </form>
                  ) : null}
                </div>
              ))}

              <div className="admin-card rounded-3xl border border-dashed border-slate-300 bg-white p-5">
                <p className="text-sm font-semibold">Add category</p>
                <form action={saveSkillCategory} className="mt-3 grid gap-4 md:grid-cols-2">
                  <TextField label="Name" name="name" required />
                  <TextField label="Order" name="order" type="number" defaultValue="0" />
                  <div className="md:col-span-2">
                    <button className="pressable w-full rounded-2xl border border-[var(--accent)] px-4 py-2 text-sm text-[var(--accent)]">
                      Add category
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>

          <section className="fade-section space-y-6">
            <h2 className="text-xl font-semibold">Experience</h2>
            <div className="space-y-5">
              {data.experiences.map((exp) => (
                <form key={exp.id} action={saveExperience} className="admin-card rounded-3xl border border-slate-200 bg-white p-5">
                  <input type="hidden" name="id" value={exp?.id ?? ""} />
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextField label="Company" name="company" defaultValue={exp.company} required />
                    <TextField label="Role" name="role" defaultValue={exp.role} required />
                    <TextField label="Location" name="location" defaultValue={exp.location ?? ""} />
                    <TextField label="Order" name="order" type="number" defaultValue={String(exp.order)} />
                    <TextField label="Start" name="startDate" type="month" defaultValue={toInputMonthValue(exp.startDate)} required />
                    <TextField label="End" name="endDate" type="month" defaultValue={toInputMonthValue(exp.endDate)} />
                    <TextareaField label="Description" name="description" defaultValue={exp.description} wrapperClassName="md:col-span-2" rows={4} required />
                    <TextareaField label="Technologies (comma separated)" name="technologies" defaultValue={exp.technologies} wrapperClassName="md:col-span-2" rows={2} required />
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button className="pressable rounded-2xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white">Save experience</button>
                    {exp.id ? (
                      <ConfirmDeleteButton action={deleteExperience} name="id" value={exp.id} />
                    ) : null}
                  </div>
                </form>
              ))}

              <div className="admin-card rounded-3xl border border-dashed border-slate-300 bg-white p-5">
                <p className="text-sm font-semibold">Add experience</p>
                <form action={saveExperience} className="mt-3 grid gap-4 md:grid-cols-2">
                  <TextField label="Company" name="company" required />
                  <TextField label="Role" name="role" required />
                  <TextField label="Location" name="location" />
                  <TextField label="Order" name="order" type="number" defaultValue="0" />
                  <TextField label="Start" name="startDate" type="month" required />
                  <TextField label="End" name="endDate" type="month" />
                  <TextareaField label="Description" name="description" wrapperClassName="md:col-span-2" rows={4} required />
                  <TextareaField label="Technologies" name="technologies" wrapperClassName="md:col-span-2" rows={2} placeholder="TypeScript, GraphQL" required />
                  <div className="md:col-span-2">
                    <button className="pressable w-full rounded-2xl border border-[var(--accent)] px-4 py-2 text-sm text-[var(--accent)]">
                      Add experience
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>

          <section className="fade-section space-y-6">
            <h2 className="text-xl font-semibold">Projects</h2>
            <div className="space-y-5">
              {data.projects.map((project) => (
                <div key={project.id ?? project.slug} className="admin-card space-y-4 rounded-3xl border border-slate-200 bg-white p-5">
                  <form action={saveProject} className="grid gap-4 md:grid-cols-2">
                    <input type="hidden" name="id" value={project.id ?? ""} />
                    <TextField label="Slug" name="slug" defaultValue={project.slug} required />
                    <TextField label="Name" name="name" defaultValue={project.name} required />
                    <TextField label="Tech stack (comma separated)" name="techStack" defaultValue={project.techStack} required wrapperClassName="md:col-span-2" />
                    <TextField label="Order" name="order" type="number" defaultValue={String(project.order)} />
                    <TextareaField label="Short description" name="shortDescription" defaultValue={project.shortDescription} wrapperClassName="md:col-span-2" rows={3} required />
                  <TextareaField label="Long description" name="longDescription" defaultValue={project.longDescription} wrapperClassName="md:col-span-2" rows={4} required />
                  <div className="md:col-span-2 flex flex-wrap gap-3">
                    <button className="pressable rounded-2xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white">Save project</button>
                    {project.id ? (
                      <ConfirmDeleteButton action={deleteProject} name="id" value={project.id} />
                    ) : null}
                  </div>
                </form>

                {!project.id ? (
                  <p className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                    Save this project to unlock link and gallery editors. Current sample assets stay visible for easy copy/paste.
                  </p>
                ) : null}

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <p className="text-sm font-semibold">Links</p>
                      {project.id ? (
                        <>
                          {project.links.map((link) => (
                            <form key={link.id ?? link.label} action={saveProjectLink} className="grid gap-2 rounded-2xl border border-slate-200 p-3">
                              <input type="hidden" name="id" value={link.id ?? ""} />
                              <input type="hidden" name="projectId" value={project.id ?? ""} />
                              <TextField label="Label" name="label" defaultValue={link.label} required />
                              <TextField label="URL" name="url" defaultValue={link.url} required />
                              <TextField label="Order" name="order" type="number" defaultValue={String(link.order)} />
                              <div className="flex gap-2">
                                <button className="pressable flex-1 rounded-2xl border border-[var(--accent)] px-3 py-2 text-xs text-[var(--accent)]">Update</button>
                                <ConfirmDeleteButton action={deleteProjectLink} name="id" value={link.id ?? ""} label="Remove" confirmLabel="Remove" />
                              </div>
                            </form>
                          ))}
                          <form action={saveProjectLink} className="grid gap-2 rounded-2xl border border-dashed border-slate-300 p-3">
                            <input type="hidden" name="projectId" value={project.id} />
                            <TextField label="Label" name="label" placeholder="GitHub" required />
                            <TextField label="URL" name="url" placeholder="https://" required />
                            <TextField label="Order" name="order" type="number" defaultValue="0" />
                            <button className="pressable rounded-2xl border border-[var(--accent)] px-3 py-2 text-xs text-[var(--accent)]">
                              Add link
                            </button>
                          </form>
                        </>
                      ) : (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-[var(--muted)]">
                          <p className="font-semibold text-[var(--foreground)]">Sample links</p>
                          <div className="mt-2 space-y-2">
                            {project.links.map((link) => (
                              <div key={link.label} className="rounded-xl border border-slate-100 bg-white px-3 py-2">
                                <p className="text-[var(--foreground)]">{link.label}</p>
                                <p className="truncate">{link.url}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold">Images</p>
                      {project.id ? (
                        <>
                          {project.images.map((image) => (
                            <form key={image.id ?? image.imageUrl} action={saveProjectImage} className="grid gap-2 rounded-2xl border border-slate-200 p-3">
                              <input type="hidden" name="id" value={image.id ?? ""} />
                              <input type="hidden" name="projectId" value={project.id ?? ""} />
                              <TextField label="Image URL" name="imageUrl" defaultValue={image.imageUrl} required />
                              <TextField label="Alt text" name="altText" defaultValue={image.altText} required />
                              <TextField label="Order" name="order" type="number" defaultValue={String(image.order)} />
                              <div className="flex gap-2">
                                <button className="pressable flex-1 rounded-2xl border border-[var(--accent)] px-3 py-2 text-xs text-[var(--accent)]">Update</button>
                                <ConfirmDeleteButton action={deleteProjectImage} name="id" value={image.id ?? ""} label="Remove" confirmLabel="Remove" />
                              </div>
                            </form>
                          ))}
                          <form action={saveProjectImage} className="grid gap-2 rounded-2xl border border-dashed border-slate-300 p-3">
                            <input type="hidden" name="projectId" value={project.id} />
                            <TextField label="Image URL" name="imageUrl" placeholder="https://" required />
                            <TextField label="Alt text" name="altText" placeholder="Dashboard" required />
                            <TextField label="Order" name="order" type="number" defaultValue="0" />
                            <button className="pressable rounded-2xl border border-[var(--accent)] px-3 py-2 text-xs text-[var(--accent)]">
                              Add image
                            </button>
                          </form>
                        </>
                      ) : (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-[var(--muted)]">
                          <p className="font-semibold text-[var(--foreground)]">Sample gallery</p>
                          <div className="mt-2 space-y-2">
                            {project.images.map((image) => (
                              <div key={image.imageUrl} className="rounded-xl border border-slate-100 bg-white px-3 py-2">
                                <p className="text-[var(--foreground)]">{image.altText}</p>
                                <p className="truncate">{image.imageUrl}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="admin-card rounded-3xl border border-dashed border-slate-300 bg-white p-5">
                <p className="text-sm font-semibold">Add project</p>
                <form action={saveProject} className="mt-3 grid gap-4 md:grid-cols-2">
                  <TextField label="Slug" name="slug" placeholder="new-project" required />
                  <TextField label="Name" name="name" required />
                  <TextField label="Tech stack" name="techStack" placeholder="Next.js, Prisma" wrapperClassName="md:col-span-2" required />
                  <TextField label="Order" name="order" type="number" defaultValue="0" />
                  <TextareaField label="Short description" name="shortDescription" wrapperClassName="md:col-span-2" rows={3} required />
                  <TextareaField label="Long description" name="longDescription" wrapperClassName="md:col-span-2" rows={4} required />
                  <div className="md:col-span-2">
                    <button className="pressable w-full rounded-2xl border border-[var(--accent)] px-4 py-2 text-sm text-[var(--accent)]">Add project</button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </AdminTabs>
      </div>
    </div>
  );
}

type TextProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> & {
  label: string;
  wrapperClassName?: string;
};

function TextField({ label, wrapperClassName = "", ...props }: TextProps) {
  return (
    <label className={`text-sm text-[var(--muted)] ${wrapperClassName}`}>
      <span className="mb-1 block text-xs uppercase tracking-[0.2em]">{label}</span>
      <input
        {...props}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
      />
    </label>
  );
}

type TextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> & {
  label: string;
  wrapperClassName?: string;
};

function TextareaField({ label, wrapperClassName = "", ...props }: TextareaProps) {
  return (
    <label className={`text-sm text-[var(--muted)] ${wrapperClassName}`}>
      <span className="mb-1 block text-xs uppercase tracking-[0.2em]">{label}</span>
      <textarea
        {...props}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
      />
    </label>
  );
}

