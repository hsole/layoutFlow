import CenterNode from './nodes/CenterNode';
import SubNode from './nodes/SubNode';
import mindmapEdge from './nodes/mindmapEdge';
import { ContextPad } from './tools/menu'
import './style.css'

class LayoutFlowExtension {
  static pluginName = 'LayoutFlowExtension'
  constructor ({ lf, LogicFlow }) {
    lf.register(CenterNode)
    lf.register(SubNode)
    lf.register(mindmapEdge)
    lf.extension.contextPad = new ContextPad({ lf, LogicFlow })
  }
  render(lf, domOverlay) {
    lf.extension.contextPad.render(lf, domOverlay)
  }
}

export default LayoutFlowExtension