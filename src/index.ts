import { BlockController } from './block';
module.exports = function loader(content) {
    let blockLevels = BlockController.ConvertToBlocks(content);
    let contentModified = BlockController.mergeBlocks(blockLevels);
    return contentModified;
}