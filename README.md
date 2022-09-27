

# 背景

随着项目中流程图被运营同学画的越来越复杂，出现了一个流程图上存在几百个节点的情况，流程图带来的**业务逻辑可视化效果越来越不明显**。虽然我们提供了分组、注释、记号等修饰性功能去支持标识流程中重要的业务关键点，但是效果仍然不明显。这个时候想再去通过人为调整去让混乱的流程图变得清晰，**比我们代码重构还难**。所以为了解决这个问题，我们增加了自动布局和一键美化功能，通过实践发现这两种方案效果都不错，有自己独特的应用场景。

# 自动布局

自动布局大家最常见到的效果应该是脑图。画图的人不需要手动调整节点的位置，由系统自动计算出节点合适的位置。

![autolayout.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d5d9d05ebd54eb5b1e47aa86d2c2434~tplv-k3u1fbpfcp-watermark.image?)

## 自动布局的优缺点

**在实际项目中，并不是所有的流程图都可以用自动布局，需要基于具体的产品来结合自动布局的优缺点来权衡。**

自动布局优点：
1.  操作便捷，省去了传统绘制流程图的位置调整的操作成本。
1.  流程图风格统一，整个流程图美观度下限更高。

自动布局的不足：
1.  首先能用的业务场景有限，一般用于树型结构（如脑图）或者布局有规律的场景。
1.  画布空间利用率不高，系统引导的节点位置在很多情况下不是最优的，但是因为自动布局不允许调整节点位置，所以在节点较多的情况下，整个画布空白的地方比较多。

## 实现自动布局

对于布局目前社区有很多方案，在很多数据可视化库中都有使用。我们在流程图这边最常用一般都是结构化布局**hierarchy**。在结构化布局里面，又有基于不同的情况，使用不同的布局方案，例如**tree、dagre、elk**等。关于图布局的详细介绍，大家可以看这篇文章：<https://blog.js.cytoscape.org/2020/05/11/layouts/>, 这里就不详细介绍了。

在我们需要用到**自动布局的业务场景**中，比较适合的是**树布局**。我们就直接使用了<https://github.com/antvis/hierarchy> 。用它的原因主要是API使用起来比较方便(API上比<https://github.com/d3/d3-hierarchy>会更友好一点)，还能比较好的处理我们各节点大小不一致等情况，也能很好的和我们项目中的流程图框架[LogicFlow](https://github.com/didi/LogicFlow)结合起来。使用步骤如下：

**步骤1：将LogicFlow的图数据转换为树结构**


```js
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
const graphData = lf.getGraphData()
const tree = graphToTree(graphData
```

**步骤二：调用Hierarchy对树进行布局，重新计算出所有节点的坐标**


```js
import Hierarchy from '@antv/hierarchy';

const rootNode = Hierarchy.compactBox(tree, {
  direction: 'LR', // 从左到右布局
  getHeight(d) { // 可以细粒度处理节点高度
    if (d.type === ROOT_NODE) {
      return NODE_SIZE * 4;
    }
    return NODE_SIZE;
  },
  getWidth() { // 可以细粒度处理节点宽度
    return 200 + PEM * 1.6;
  },
  ...
});
// 保证中心点位置不变，避免抖动
const moveX = tree.x - rootNode.x;
const moveY = tree.y - rootNode.y;
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
return newTre
```
**步骤三：将得到的新的树数据转回LogicFlow需要的图数据**

```js
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
```

最后，把图数据交给LogicFlow重新渲染就行。

# 一键美化

一键美化在产品上是一个非常理想的功能，不论流程图多混乱，只需要我们点击一下一键美化就自动变成整齐美观的流程图。

![QQ20220920-165532-HD.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f29adb03ca441319b9d34342f3ea755~tplv-k3u1fbpfcp-watermark.image?)

## 实现一键美化

和上面的自动布局不同的是，在我们业务场景中，流程图会存在环这种结构。这个时候直接用树布局是不合适的，所以我们使用dagre布局。在网上找了一圈后，发现<https://github.com/antvis/layout>提供的dagre布局最好用（G6里面的dagre布局也是用的这个）。一键美化的实现思路和自动布局类似，都是把LogicFlow中的图数据传给布局库，然后再把得到的新的图数据重新使用LogicFlow渲染。这里为了方便，我把一键美化给封装成了一个LogicFlow插件，然后在里面做了一些符合LogicFlow特殊的处理。

```js
import { DagreLayout, DagreLayoutOptions } from '@antv/layout';
export default class Dagre {
  static pluginName = 'dagre';
  render(lf) {
    this.lf = lf;
  }
  layout(option = {}) {
    const { nodes, edges, gridSize } = this.lf.graphModel
    const layoutInstance = new DagreLayout(option);
    const layoutData = layoutInstance.layout({
      nodes: nodes.map((node) => ({
        id: node.id,
        size: {
          width: node.width,
          height: node.height,
        },
        model: node,
      })),
      edges: edges.map((edge) => ({
        source: edge.sourceNodeId,
        target: edge.targetNodeId,
        model: edge,
      })),
    });
    const newGraphData = {
      nodes: [],
      edges: [],
    };
    layoutData.nodes.forEach(node => {
      const { model } = node;
      const data = model.getData();
      data.x = node.x;
      data.y = node.y;
      newGraphData.nodes.push(data);
    });
    layoutData.edges.forEach(edge => {
      const { model } = edge;
      const data = model.getData();
      data.pointsList = this.calcPointsList(model, newGraphData.nodes);
      newGraphData.edges.push(data);
    });
    this.lf.render(newGraphData);
  }
}
```

## 一键美化的不足

在我们做出第一版一键美化后，发现最大的问题就是**一键美化后整个流程图布局全变了。** 例如当我们在一个比较规整的流程图上新增了一个节点，如果这个节点刚好把它所属的某条路径变成最长路径，就会触发布局算法中**最长路径作为主要路径的思路**，导致很多节点位置改变。但是因为画流程图的人基本上都会**选择将业务上有关联或者类似的节点放到同一块区域**，我们的美化会破坏这个逻辑，导致使用**体验十分不好**。

## 选区美化

由于一键美化这种纯系统布局的不够人性化，我们增加了一种**半系统半人工**的布局方式，也就是选区美化。选区美化就是整个流程图的整体布局仍然由画图的人来控制，我们提供一个工具，让画流程图的人选中部分区域内的节点，对这部分节点布局进行美化。这样虽然没有一键美化那样便捷，但是在实际体验发现更加**实用**。

# 总结

不论任何对流程图的布局的美化效果，在研发的角度来说都是**对流程上的点、线坐标进行调整，** 但是最大的问题可能是也不知道**基于什么规则去调整**。如果产品已经给出来清晰的规则，事情往往比较简单，我们只需要按照这个规则实现自己的布局算法即可。可大多数情况下还是需要我们研发自己去调研，从已开源的项目里面找到**合适的布局算法，** 然后结合我们当前项目的流程图框架来实现 。

目前上有部分流程图框架已经自带了一些布局算法，但是在实际项目中，还有比较多的细节需要处理，例如让布局后的连线排布更加合理、某些节点位置保证相对不变等。我把在我们项目中实际用到的两种方式提取出布局部分的逻辑放到了github上，赶兴趣的同学可以拉下来看看。

github地址：<https://github.com/hsole/layoutFlow>

demo在线地址：https://hsole.github.io/layoutFlow

主要依赖开源项目：

<https://github.com/antvis/layout>

<https://github.com/antvis/hierarchy>

<https://github.com/didi/LogicFlow>