
import './style.css'
import BeautifyLine from './nodes/BeautifyLine'
import BeautifyNode from './nodes/BeautifyNode'

class BeautifyFlowExtension {
  static pluginName = 'BeautifyFlowExtension'
  constructor ({ lf, LogicFlow }) {
    lf.register(BeautifyLine)
    lf.register(BeautifyNode)
  }
  render(lf, domOverlay) {
  }
}

export default BeautifyFlowExtension