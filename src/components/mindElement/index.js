import CenterNode from './nodes/CenterNode';
import BaseNode from './nodes/BaseNode';
import { ContextPad } from './tools/menu'
import './style.css'

class LayoutFlowExtension {
  static pluginName = 'LayoutFlowExtension'
  constructor ({ lf, LogicFlow }) {
    lf.register(CenterNode)
    lf.register(BaseNode)
    // lf.extension.contextPad = new ContextPad({ lf, LogicFlow })
  }
  render(lf, domOverlay) {
    // lf.extension.contextPad.render(lf, domOverlay)
  }
}

export default LayoutFlowExtension