/**
 * 子节点为线条样式
 */
import CenterNode from './CenterNode'
class LineStyleNode extends CenterNode.view {
}

class LineStyleNodeModel extends CenterNode.model {
  initNodeData (data) {
    super.initNodeData(data)
    this.fontSize = 16
  }
  getNodeStyle () {
    const style = super.getNodeStyle()
    style.stroke = 'none'
    style.fill = 'none'
    return style
  }
}

export default {
  type: "line-style-node",
  model: LineStyleNodeModel,
  view: LineStyleNode
}
