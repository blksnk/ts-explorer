import { Router } from "express";
import { db, schemas } from "../../db";
import { eq } from "drizzle-orm";
import { highlightCode } from "../utils/hightlight.utils";

const fileRouter = Router();

fileRouter.get("/", async (_req, res) => {
  const files = await db.select().from(schemas.file);
  res.status(200).json({ data: files });
});

fileRouter.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid file id" });
    return;
  }
  const files = await db
    .select()
    .from(schemas.file)
    .where(eq(schemas.file.id, id));
  const file = files[0];
  if (!file) {
    res.status(404).json({ error: "File not found" });
    return;
  }
  res.status(200).json({ data: file });
});

fileRouter.get("/:id/imports", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid file id" });
    return;
  }
  const importedFiles = await db
    .select({
      id: schemas.file.id,
      name: schemas.file.name,
      path: schemas.file.path,
      isEntrypoint: schemas.file.isEntrypoint,
      projectId: schemas.file.projectId,
    })
    .from(schemas.fileImport)
    .where(eq(schemas.fileImport.importingFileId, id))
    .innerJoin(
      schemas.file,
      eq(schemas.fileImport.importedFileId, schemas.file.id)
    );

  res.status(200).json({ data: importedFiles });
});

fileRouter.get("/:id/imported-by", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid file id" });
    return;
  }
  const importingFiles = await db
    .select({
      id: schemas.file.id,
      name: schemas.file.name,
      path: schemas.file.path,
      isEntrypoint: schemas.file.isEntrypoint,
      projectId: schemas.file.projectId,
    })
    .from(schemas.fileImport)
    .where(eq(schemas.fileImport.importedFileId, id))
    .innerJoin(
      schemas.file,
      eq(schemas.fileImport.importingFileId, schemas.file.id)
    );

  res.status(200).json({ data: importingFiles });
});

fileRouter.get("/:id/nodes", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid file id" });
    return;
  }
  const fileNodes = await db
    .select()
    .from(schemas.node)
    .where(eq(schemas.node.fileId, id));

  res.status(200).json({ data: fileNodes });
});

fileRouter.get("/:id/imported-packages", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid file id" });
    return;
  }
  const packageImports = await db
    .select({
      name: schemas.nodePackage.name,
      version: schemas.nodePackage.version,
      id: schemas.nodePackage.id,
    })
    .from(schemas.packageImport)
    .where(eq(schemas.packageImport.fileId, id))
    .innerJoin(
      schemas.nodePackage,
      eq(schemas.packageImport.nodePackageId, schemas.nodePackage.id)
    );

  res.status(200).json({ data: packageImports });
});

fileRouter.get("/:id/content", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid file id" });
    return;
  }
  const contents = await db
    .select()
    .from(schemas.fileContent)
    .where(eq(schemas.fileContent.fileId, id));

  const content = contents[0]?.content;
  if (!content) {
    res.status(404).json({ error: "File content not found" });
    return;
  }

  const highlighted = await highlightCode(content);

  res.status(200).json({ data: { content, highlighted } });
});

export { fileRouter };
