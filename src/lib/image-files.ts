import { readdir } from "node:fs/promises";
import path from "node:path";

import { IMAGE_EXTENSIONS } from "@/lib/image-paths";

export async function listPublicImages() {
  try {
    const imagesDir = path.join(process.cwd(), "public", "images");
    const entries = await readdir(imagesDir, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
      .map((name) => `/images/${name}`)
      .sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.warn("Unable to list images from /public/images", error);
    return [];
  }
}
