/**
 * 子节点为线条样式
 */
import CenterNode from './CenterNode'
import SubNodeComponent from './SubNode.vue'
import { getTextLengthByCanvas } from '../../util';

class SubNode extends CenterNode.view {
  getVueComponent () {
    return SubNodeComponent
  }
  setHtml(rootEl) {
    if (!this.isMounted) {
      this.isMounted = true
      const node = document.createElement('div')
      node.className = 'mind-element_base-node mind-element_sub-node'
      node.addEventListener('dblclick', () => {
        this.props.model.setElementState(2)
        this.r.component.props.isEditing = true
      })
      rootEl.appendChild(node)
      this.app.mount(node)
    } else {
      const values = this.getVueProps(this.props)
      Object.keys(values).forEach((key) => {
        this.r.component.props[key] = values[key]
      })
    }
  }
}

class SubNodeModel extends CenterNode.model {
  initNodeData (data) {
    super.initNodeData(data)
    this.fontSize = 16
  }
  setAttributes() {
    if (!this.text.value) {
      this.width = 100;
      this.height = 40;
    } else {
      const { width, height } = getTextLengthByCanvas(this.text.value, this.fontSize);
      this.width = width + 60
      this.height = height + 10 + 8
    }
  }
}
 
export default {
  type: "sub-node",
  model: SubNodeModel,
  view: SubNode
}
