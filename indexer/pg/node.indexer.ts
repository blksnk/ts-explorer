import { eq } from "drizzle-orm";
import { db, schemas, type NodeInput, type NodeOutput } from "../../db";
import type { SourceNode } from "../../parser/types";
import type { Nullable } from "@ubloimmo/front-util";
import { MAX_BATCH_SIZE } from "../indexer.constants";
import { Logger } from "@ubloimmo/front-util";
import { batchOperation } from "../indexer.utils";

const logger = Logger();

/**
 * Deletes a node from the database by its ID
 * @param {number} nodeId - The ID of the node to delete
 * @returns {Promise<boolean>} True if deletion was successful, false if an error occurred
 */
export const deleteNode = async (nodeId: number): Promise<boolean> => {
  try {
    await db.delete(schemas.node).where(eq(schemas.node.id, nodeId));
    logger.log(`Deleted node ${nodeId}`, "deleteNode");
    return true;
  } catch (e) {
    logger.error(e, "deleteNode");
    return false;
  }
};

/**
 * Deletes all nodes associated with a file from the database
 * @param {number} fileId - The ID of the file whose nodes should be deleted
 * @returns {Promise<boolean>} True if deletion was successful, false if an error occurred
 */
export const deleteFileNodes = async (fileId: number): Promise<boolean> => {
  try {
    await db.delete(schemas.node).where(eq(schemas.node.fileId, fileId));
    logger.log(`Deleted nodes for file ${fileId}`, "deleteFileNodes");
    return true;
  } catch (e) {
    logger.error(e, "deleteFileNodes");
    return false;
  }
};

/**
 * Formats a source node into a database node input object
 * @param {SourceNode} sourceNode - The source node to format containing hash, position, text and kind
 * @param {number} fileId - The ID of the file this node belongs to
 * @returns {NodeInput} A node input object ready for database insertion
 */
export const formatNodeInput = (
  sourceNode: SourceNode,
  fileId: number
): NodeInput => {
  return {
    hash: sourceNode.hash,
    fileId,
    start: sourceNode.start,
    end: sourceNode.end,
    text: sourceNode.text,
    kind: sourceNode.kind,
  };
};

/**
 * Indexes a source node by inserting it into the database
 * @param {SourceNode} sourceNode - The source node to index containing hash, position, text and kind
 * @param {number} fileId - The ID of the file this node belongs to
 * @returns {Promise<Nullable<NodeOutput>>} The indexed node if successful, null if failed
 */
export const indexNode = async (
  sourceNode: SourceNode,
  fileId: number
): Promise<Nullable<NodeOutput>> => {
  try {
    const nodeInput = formatNodeInput(sourceNode, fileId);
    const nodes = await db.insert(schemas.node).values(nodeInput).returning();
    const node = nodes[0];
    if (!node) {
      logger.warn(`Failed to index node ${nodeInput.hash}`, "indexNode");
      return null;
    }
    logger.log(`Indexed node ${nodeInput.hash}`, "indexNode");
    return node;
  } catch (e) {
    logger.error(e, "indexNode");
    return null;
  }
};

/**
 * Indexes multiple source nodes by inserting them into the database
 * @param {SourceNode[]} sourceNodes - Array of source nodes to index containing hash, position, text and kind
 * @param {number} fileId - The ID of the file these nodes belong to
 * @returns {Promise<Nullable<NodeOutput[]>>} Array of indexed nodes if successful, null if failed
 */
export const indexNodes = async (
  nodeInputs: NodeInput[]
): Promise<Nullable<NodeOutput[]>> => {
  try {
    const nodes = await batchOperation(nodeInputs, async (inputs) => {
      const contents = await db.insert(schemas.node).values(inputs).returning();
      logger.log(`Indexed batch of ${contents.length} nodes`, "indexNodes");
      return contents;
    });
    logger.log(`Indexed total of ${nodes.length} nodes`, "indexNodes");
    return nodes;
  } catch (e) {
    logger.error(e, "indexNodes");
    return null;
  }
};

/**
 * Updates a node's parent ID in the database
 * @param {number} nodeId - The ID of the node to update
 * @param {number} parentId - The ID of the parent node to set
 * @returns {Promise<Nullable<NodeOutput>>} The updated node if successful, null if failed
 */
export const indexNodeParent = async (
  nodeId: number,
  parentId: number
): Promise<Nullable<NodeOutput>> => {
  try {
    logger.log(
      `Indexing parent ${parentId} for node ${nodeId}`,
      "indexNodeParent"
    );
    const nodes = await db
      .update(schemas.node)
      .set({ parentId })
      .where(eq(schemas.node.id, nodeId))
      .returning();
    const node = nodes[0];
    if (!node) {
      logger.warn(
        `Failed to index parent ${parentId} for node ${nodeId}`,
        "indexNodeParent"
      );
      return null;
    }
    logger.log(
      `Indexed parent ${parentId} for node ${nodeId}`,
      "indexNodeParent"
    );
    return node;
  } catch (e) {
    logger.error(e, "indexNodeParent");
    return null;
  }
};
