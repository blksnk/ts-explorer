import { Router } from "express";
import { db, schemas } from "../../db";
import { eq, or } from "drizzle-orm";

const fileRouter = Router();

fileRouter.get("/", async (_req, res) => {
  const files = await db.select().from(schemas.file);
  res.json({ data: files });
});

fileRouter.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid file id" });
    return;
  }
  const file = await db
    .select()
    .from(schemas.file)
    .where(eq(schemas.file.id, id));
  if (!file) {
    res.status(404).json({ error: "File not found" });
    return;
  }
  res.json({ data: file });
});

fileRouter.get("/:id/imports", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid file id" });
    return;
  }
  const imports = await db
    .select({
      importedFileId: schemas.fileImport.importedFileId,
    })
    .from(schemas.fileImport)
    .where(eq(schemas.fileImport.importingFileId, id));
  const links = imports.map(({ importedFileId }) => ({
    from: id,
    to: importedFileId,
  }));
  res.json({ data: links });
});

fileRouter.get("/:id/imported-by", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid file id" });
    return;
  }
  const imports = await db
    .select({
      importingFileId: schemas.fileImport.importingFileId,
    })
    .from(schemas.fileImport)
    .where(eq(schemas.fileImport.importedFileId, id));
  const links = imports.map(({ importingFileId }) => ({
    from: importingFileId,
    to: id,
  }));
  res.json({ data: links });
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

  res.json({ data: fileNodes });
});

export { fileRouter };
