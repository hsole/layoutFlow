import { HtmlNode, HtmlNodeModel } from "@logicflow/core";
import { createApp, ref, h } from 'vue';
import VueBaseNode from './CenterNode.vue';
import { getTextLengthByCanvas } from '../../util';

class CenterNode extends HtmlNode {
  isMounted: boolean;
  app: any;
  r: any;
  constructor (props) {
    super(props)
    this.isMounted = false
    this.r = h(this.getVueComponent(), this.getVueProps(props))
    this.app = createApp({
      render: () => this.r
    })
  }
  getVueComponent () {
    return VueBaseNode
  }
  getVueProps (props) {
    return {
      properties: props.model.getProperties(),
      isSelected: props.model.isSelected,
      isEditing: props.model.state === 2,
      text: props.model.text.value,
    }
  }
  shouldUpdate() {
    const data = {
      ...this.props.model.properties,
      isSelected: this.props.model.isSelected,
      text: this.props.model.text.value
    }
    if (this.preProperties && this.preProperties === JSON.stringify(data)) return;
    this.preProperties = JSON.stringify(data);
    return true;
  }
  setHtml(rootEl) {
    if (!this.isMounted) {
      this.isMounted = true
      const node = document.createElement('div')
      node.className = 'mind-element_base-node'
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
  getText () {
    return null
  }
}

class CenterNodeModel extends HtmlNodeModel {
  initNodeData (data) {
    super.initNodeData(data)
    this.isEditing = false
    this.fontSize = 24
    this.text.editable = false
  }
  setAttributes() {
    if (!this.text.value) {
      this.width = 100;
      this.height = 80;
    } else {
      const { width, height } = getTextLengthByCanvas(this.text.value, this.fontSize);
      this.width = width + 90
      this.height = height + 28 + 8
    }
  }

  getOutlineStyle() {
    const style = super.getOutlineStyle();
    style.stroke = 'none';
    style.hover.stroke = 'none';
    return style;
  }
  getAnchorStyle(anchorInfo) {
    const style = super.getAnchorStyle(anchorInfo)
    style.stroke = 'none'
    style.fill = 'none'
    return style
  }
  // getDefaultAnchor() {
  //   return []
  // }
  updateText(value) {
    super.updateText(value)
    this.setAttributes()
  }
}

export default {
  type: 'center-node',
  model: CenterNodeModel,
  view: CenterNode
}
