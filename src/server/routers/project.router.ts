import { Router } from "express";
import { db, schemas } from "../../db";
import { eq } from "drizzle-orm";

const projectRouter = Router();

projectRouter.get("/", async (req, res) => {
  const projects = await db.select().from(schemas.project);
  res.json(projects);
});

projectRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const project = await db
    .select()
    .from(schemas.project)
    .where(eq(schemas.project.id, id));
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json(project);
});

projectRouter.get("/:id/files", async (req, res) => {
  const { id } = req.params;
  const files = await db
    .select({
      id: schemas.file.id,
      name: schemas.file.name,
      path: schemas.file.path,
    })
    .from(schemas.file)
    .where(eq(schemas.file.projectId, id));
  res.json(files);
});

export { projectRouter };
