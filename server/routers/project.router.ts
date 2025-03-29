import { Router } from "express";
import { db, schemas } from "../../db";
import { count, eq } from "drizzle-orm";

const projectRouter = Router();

projectRouter.get("/", async (req, res) => {
  const projects = await db.select().from(schemas.project);
  res.json({ data: projects });
});

projectRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const projects = await db
    .select()
    .from(schemas.project)
    .where(eq(schemas.project.id, id));
  const project = projects[0];
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json({ data: project });
});

projectRouter.get("/:id/details", async (req, res) => {
  const { id } = req.params;
  const fileCount = await db
    .select({ count: count() })
    .from(schemas.file)
    .where(eq(schemas.file.projectId, id));

  const nodeCount = await db
    .select({ count: count() })
    .from(schemas.file)
    .where(eq(schemas.file.projectId, id))
    .leftJoin(schemas.node, eq(schemas.file.id, schemas.node.fileId));

  const fileImportCount = await db
    .select({ count: count() })
    .from(schemas.file)
    .where(eq(schemas.file.projectId, id))
    .leftJoin(
      schemas.fileImport,
      eq(schemas.file.id, schemas.fileImport.importedFileId)
    );

  res.json({
    data: {
      id,
      fileCount: fileCount[0].count,
      nodeCount: nodeCount[0].count,
      fileImportCount: fileImportCount[0].count,
    },
  });
});

projectRouter.get("/:id/files", async (req, res) => {
  const { id } = req.params;
  const files = await db
    .select()
    .from(schemas.file)
    .where(eq(schemas.file.projectId, id));
  res.json({ data: files });
});

projectRouter.get("/:id/node-packages", async (req, res) => {
  const { id } = req.params;
  const nodePackages = await db
    .select()
    .from(schemas.nodePackage)
    .where(eq(schemas.nodePackage.projectId, id));
  res.json({ data: nodePackages });
});

export { projectRouter };
