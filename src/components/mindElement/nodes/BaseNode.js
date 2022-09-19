import { HtmlNode, HtmlNodeModel } from "@logicflow/core";
import { createApp, ref, h } from 'vue';
import VueBaseNode from './BaseNode.vue';
import { getTextLengthByCanvas } from '../util';

class BaseNode extends HtmlNode {
  constructor (props) {
    super(props)
    this.isMounted = false
    this.r = h(VueBaseNode, {
      properties: props.model.getProperties(),
      text: props.model.text.value,
      isSelected: props.model.isSelected,
      isEditing: props.model.state === 2,
    })
    this.app = createApp({
      render: () => this.r
    })
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
      this.r.component.props.properties = this.props.model.getProperties()
      this.r.component.props.isSelected = this.props.model.isSelected
      this.r.component.props.isEditing = this.props.model.state === 2
      this.r.component.props.text = this.props.model.text.value
    }
  }
  getText () {
    return null
  }
}

class BaseNodeModel extends HtmlNodeModel {
  initNodeData (data) {
    super.initNodeData(data)
    this.isEditing = false
  }
  setAttributes() {
    this.fontSize = 24
    if (!this.text.value) {
      this.width = 100;
      this.height = 80;
    } else {
      const { width, height } = getTextLengthByCanvas(this.text.value, this.fontSize);
      this.width = width + 90
      this.height = height + 32
    }
    this.text.editable = false;
  }

  getOutlineStyle() {
    const style = super.getOutlineStyle();
    style.stroke = 'none';
    style.hover.stroke = 'none';
    return style;
  }
  getDefaultAnchor() {
    return []
  }
  updateText(value) {
    super.updateText(value)
    this.setAttributes()
  }
  getData () {
    const data = super.getData()
    data.text.value = this.inputData
    return data
  }
}

export default {
  type: 'base-node',
  model: BaseNodeModel,
  view: BaseNode
}