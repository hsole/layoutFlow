import { RectNode, RectNodeModel, h } from "@logicflow/core"
import { getTextLengthByCanvas } from "../../util";


class BeautifyNodeModel extends RectNodeModel {
  /**
   * 初始化
   */
  initNodeData(data) {
    super.initNodeData(data)
    this.width = 120;
    this.height = 40;
    this.radius = 5;
    this.text.x = this.x + 10;
    this.text.y = this.y;
    this.iconPosition = '';
    this.defaultFill = '#a6bbcf';
  }
  getData () {
    const data = super.getData()
    data.properties.ui = 'node-red'
    return data
  }
  /**
   * 动态设置初始化数据
   */
  setAttributes() {
    if (this.text.value) {
      let width = 30 + getTextLengthByCanvas(this.text.value, 12).width;
      width = Math.ceil(width / 20) * 20;
      if (width < 100) {
        width = 100;
      }
      this.width = width;
    }
  }
  updateText(val) {
    super.updateText(val)
    this.setAttributes();
  }
  /**
   * 重写节点样式
   */
  getNodeStyle() {
    const style = super.getNodeStyle();
    const dataStyle = this.properties.style || {};
    if (this.isSelected) {
      style.strokeWidth = Number(dataStyle.borderWidth) || 2;
      style.stroke = dataStyle.borderColor || '#ff7f0e';
    } else {
      style.strokeWidth = Number(dataStyle.borderWidth) || 1;
      style.stroke = dataStyle.borderColor || '#999';
    }
    style.fill = dataStyle.backgroundColor || this.defaultFill;
    return style;
  }
  /**
   * 重写定义锚点
   */
  getDefaultAnchor() {
    const { x, y, id, width, height } = this;
    const anchors = [
      {
        x: x + width / 2,
        y: y,
        id: `${id}_right`,
        type: "right"
      },
      {
        x: x - width / 2,
        y: y,
        id: `${id}_left`,
        type: "left"
      }
    ];
    return anchors;
  }
  /**
   * 
   */
  getOutlineStyle() {
    const style = super.getOutlineStyle();
    style.stroke = 'transparent';
    style.hover.stroke = 'transparent';
    return style;
  }
}
class BeautifyNode extends RectNode {
  getAnchorShape(anchorData) {
    const { x, y, type } = anchorData;
    return h("rect", {
      x: x - 5,
      y: y - 5,
      width: 10,
      height: 10,
      className: 'custom-anchor'
    });
  }
  getIcon () {
    const {
      width,
      height,
    } = this.props.model;
    return h('image', {
      width: 30,
      height: 40,
      x: - width / 2,
      y: - height / 2,
      href: './images/delay.svg'
    })
  }
  getShape() {
    const {
      text,
      x,
      y,
      width,
      height,
      radius
    } = this.props.model;
    const style = this.props.model.getNodeStyle()
    return h(
      'g',
      {
        className: 'lf-red-node'
      },
      [
        h('rect', {
          ...style,
          x: x - width / 2,
          y: y - height / 2,
          width,
          height,
          rx: radius,
          ry: radius
        }),
        h('g', {
          style: 'pointer-events: none;',
          transform: `translate(${x}, ${y})`
        }, [
          h('rect', {
            x: - width / 2,
            y: - height / 2,
            width: 30,
            height: 40,
            fill: '#000',
            fillOpacity: 0.05,
            stroke: 'none',
          }),
          this.getIcon(),
          h('path', {
            d: `M ${30 - width / 2} ${1 -height / 2 } l 0 38`,
            stroke: '#000',
            strokeOpacity: 0.1,
            strokeWidth: 1
          })
        ])
      ]
    )
  }
}


export default {
  type: 'beautify-node',
  model: BeautifyNodeModel,
  view: BeautifyNode
}
