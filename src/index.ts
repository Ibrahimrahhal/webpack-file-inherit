import { BlockController } from './block';
const loader = function (content) {
    const blockLevels = BlockController.ConvertToBlocks(content);
    const contentModified = BlockController.mergeBlocks(blockLevels);
    return contentModified;
}
export default loader;
module.exports = loader;