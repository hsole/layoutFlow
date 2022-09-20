import { BezierEdge, BezierEdgeModel } from "@logicflow/core"

class MindmapEdge extends BezierEdge {
  getArrow () {
    return null
  }
}

class MindmapEdgeModel extends BezierEdgeModel {
  getEdgeStyle () {
    const style = super.getEdgeStyle()
    style.stroke = 'rgb(67, 169, 255)'
    style.strokeWidth = 2
    return style
  }
}

export default {
  type: "mindmap-edge",
  model: MindmapEdgeModel,
  view: MindmapEdge
}
