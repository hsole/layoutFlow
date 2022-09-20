import CenterNode from './nodes/CenterNode';
import SubNode from './nodes/SubNode';
import MindmapEdge from './nodes/MindmapEdge';
import { ContextPad } from './tools/menu'
import './style.css'

class LayoutFlowExtension {
  static pluginName = 'LayoutFlowExtension'
  constructor ({ lf }) {
    lf.register(CenterNode)
    lf.register(SubNode)
    lf.register(MindmapEdge)
    lf.extension.contextPad = new ContextPad({ lf })
  }
  render(lf, domOverlay) {
    lf.extension.contextPad.render(lf, domOverlay)
  }
}

export default LayoutFlowExtension