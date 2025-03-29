import { Router } from "express";
import { db, schemas } from "../../db";
import { eq } from "drizzle-orm";

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
  const file = await db
    .select()
    .from(schemas.file)
    .where(eq(schemas.file.id, id));
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
  res.status(200).json({ data: links });
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
  res.status(200).json({ data: links });
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
  res.status(200).json({ data: content });
});

export { fileRouter };
