
import { createApp } from 'vue';
import './style.css'
import BeautifyLine from './nodes/BeautifyLine'
import BeautifyNode from './nodes/BeautifyNode'
import Palette from './tools/Palette.vue';

class BeautifyFlowExtension {
  static pluginName = 'BeautifyFlowExtension'
  app: any;
  constructor ({ lf, LogicFlow }) {
    lf.register(BeautifyLine)
    lf.register(BeautifyNode)
    this.app = createApp(Palette, {
      lf
    })
    lf.setDefaultEdgeType(BeautifyLine.type)
    
  }
  render(lf, domOverlay) {
    const node = document.createElement('div')
    node.className = 'node-red-palette'
    domOverlay.appendChild(node)
    this.app.mount(node)
  }
}

export default BeautifyFlowExtension