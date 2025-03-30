import { Router } from "express";
import { db, schemas } from "../../db";
import { and, count, eq } from "drizzle-orm";

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
  res.status(200).json({ data: project });
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

  res.status(200).json({
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
  res.status(200).json({ data: files });
});

projectRouter.get("/:id/entrypoints", async (req, res) => {
  const { id } = req.params;
  const entrypoints = await db
    .select()
    .from(schemas.file)
    .where(
      and(eq(schemas.file.projectId, id), eq(schemas.file.isEntrypoint, true))
    );
  res.status(200).json({ data: entrypoints });
});

projectRouter.get("/:id/node-packages", async (req, res) => {
  const { id } = req.params;
  const nodePackages = await db
    .select()
    .from(schemas.nodePackage)
    .where(eq(schemas.nodePackage.projectId, id));
  res.status(200).json({ data: nodePackages });
});

projectRouter.get("/:id/file-imports", async (req, res) => {
  const { id } = req.params;
  const fileImports = await db
    .select({
      importedFileId: schemas.fileImport.importedFileId,
      importingFileId: schemas.fileImport.importingFileId,
      id: schemas.fileImport.id,
    })
    .from(schemas.fileImport)
    .where(eq(schemas.fileImport.projectId, id));
  res.status(200).json({ data: fileImports });
});

export { projectRouter };
