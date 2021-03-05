import { BlockController } from './block';
module.exports = function loader(content) {
    const blockLevels = BlockController.ConvertToBlocks(content);
    const contentModified = BlockController.mergeBlocks(blockLevels);
    return contentModified;
}