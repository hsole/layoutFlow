/**
 * 将树这种数据格式转换为图
 */
import Hierarchy from '@antv/hierarchy';
const FAKER_NODE = 'faker-node';
const ROOT_NODE = 'center-node';
const FIRST_ROOT_X = 10;
const FIRST_ROOT_Y = 10;

export const treeToGraph = (rootNode) => {
  const nodes = [];
  const edges = [];
  function getNode(current, parent = null) {
    const node = {
      ...current
    };
    nodes.push(node);
    if (current.children) {
      current.children.forEach(subNode => {
        getNode(subNode, node);
      });
    }
    if (parent) {
      const edge = {
        sourceNodeId: parent.id,
        targetNodeId: node.id,
        type: 'mindmap-edge',
      };
      edges.push(edge);
    }
  }
  getNode(rootNode);
  return {
    nodes,
    edges,
  };
}
/**
 * 由于树这种数据格式本身是没有坐标的
 * 需要使用一些算法来将树转换为有坐标的树
 */
export const layoutTree = (tree) => {
  if (!tree || !tree.children || tree.children.length === 0) return tree;
  const NODE_SIZE = 40;
  const PEM = 20;
  tree.isRoot = true;
  const rootNode = Hierarchy.compactBox(tree, {
    direction: 'LR',
    getId(d) {
      return d.id;
    },
    getHeight(d) {
      if (d.type === ROOT_NODE) {
        return NODE_SIZE * 4;
      }
      return NODE_SIZE;
    },
    getWidth() {
      return 200 + PEM * 1.6;
    },
    getHGap() {
      return PEM;
    },
    getVGap() {
      return PEM;
    },
    getSubTreeSep(d) {
      if (!d.children || !d.children.length) {
        return 0;
      }
      return PEM;
    },
  });
  const x = tree.x || FIRST_ROOT_X;
  const y = tree.y || FIRST_ROOT_Y;
  const x1 = rootNode.x;
  const y1 = rootNode.y;
  const moveX = x - x1;
  const moveY = y - y1;
  const newTree = dfsTree(rootNode, currentNode => {
    return {
      id: currentNode.id,
      text: currentNode.data.text.value,
      properties: currentNode.data.properties,
      type: currentNode.data.type,
      x: currentNode.x + moveX,
      y: currentNode.y + moveY,
    }
  });
  return newTree;
}
/**
 * 遍历树的每一项，已传入的回调方法重新构建一个新的树
 */
export const dfsTree = (tree, callback) => {
  const newTree = callback(tree);
  if (tree.children && tree.children.length > 0) {
    newTree.children = tree.children.map(treeNode => dfsTree(treeNode, callback));
  }
  return newTree;
}

export const graphToTree = (graphData) => {
  let tree = null;
  const nodesMap = new Map();
  graphData.nodes.forEach(node => {
    const treeNode = {
      ...node,
      children: [],
    };
    nodesMap.set(node.id, treeNode);
    if (node.type === ROOT_NODE) {
      tree = treeNode;
    }
  });
  graphData.edges.forEach(edge => {
    const node = nodesMap.get(edge.sourceNodeId);
    node.children.push(nodesMap.get(edge.targetNodeId));
  });
  return tree;
}

export const layoutGraphData = (graphData) => {
  const tree = graphToTree(graphData);
  const newTree = layoutTree(tree);
  return treeToGraph(newTree);
}
