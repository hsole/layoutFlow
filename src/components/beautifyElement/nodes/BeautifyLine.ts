// const { PolylineEdge, PolylineEdgeModel, h} = window;
import { PolylineEdge, PolylineEdgeModel, h } from "@logicflow/core";
import { pointFilter } from '../../util';

const DISTANCE = 12;
const ICON_HEIGHT = 16;
const ICON_WIDTH = 16;
const WORD_HEIGHT = 16;
const NODE_HEIGHT = 200;
class BeautifyLine extends PolylineEdge {
  getText() {
    // todo: 几种情况的处理：1.一个节点连出多条边 2.一个节点的入口连入多条边 3.线的回连
    const { pointsList, text, id } = this.props.model;
    if (!pointsList || pointsList.length === 0) return null;
    const lastPoint = pointsList[pointsList.length - 1];
    const lastPrePoint = pointsList[pointsList.length - 2];
    const positionData: {
      x?: number,
      y?: number,
    } = {}
    // let maxWidth = Math.max(Math.abs(lastPoint.x - lastPrePoint.x), Math.abs(lastPoint.y - lastPrePoint.y));
    let width = Math.abs(lastPoint.x - lastPrePoint.x);
    let height = Math.abs(lastPoint.y - lastPrePoint.y);
    let direction = ''
    if (lastPoint.x < lastPrePoint.x) { // 箭头向左 
      direction = 'row'
      positionData.x = lastPoint.x + DISTANCE;
      positionData.y = lastPoint.y - ICON_HEIGHT / 2;
    } else if (lastPoint.y < lastPrePoint.y) { // 箭头向上
      direction = 'column'
      positionData.x = lastPoint.x - ICON_WIDTH / 2;
      positionData.y = lastPoint.y + DISTANCE + ICON_HEIGHT / 2;
    } else if (lastPoint.y > lastPrePoint.y) { // 箭头向下
      direction = 'column-reverse'
      positionData.x = lastPoint.x - ICON_WIDTH / 2;
      positionData.y = lastPoint.y - DISTANCE - ICON_HEIGHT / 2 - WORD_HEIGHT;
    } else { // 箭头向右
      direction = 'row-reverse'
      positionData.x = lastPoint.x - DISTANCE - width;
      positionData.y = lastPoint.y - ICON_HEIGHT / 2;
    }

    const { model } = this.props;
    return h("foreignObject", { ...positionData, id: 'line_' + id, style: `z-index: 20; width: ${width ? width : height}px`}, [
      h("div", {
        style: `display:flex;width: 100%;flex-direction: ${direction};`
      }, [
        h("div", {
          className: "add-wrapper",
        }),
      ])
    ])
  }
}

class BeautifyLineModel extends PolylineEdgeModel {
  initEdgeData(data) {
    super.initEdgeData(data)
    this.offset=10
  }
  setAttributes () {
    if (this.properties.executeStatus === 'executed') {
      this.setZIndex(999);
    } else {
      this.setZIndex(0)
    }
  }
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    style.stroke = '#BAC1D0';
    style.strokeDasharray = '3 2';
    style.strokeWidth = 1;
    if (this.isHovered || this.isSelected) {
      style.stroke = '#33DD89'
    }
    return style;
  }
  getEdgeAnimationStyle() {
    const style = super.getEdgeAnimationStyle();
    style.animationDuration = "20s";
    const { executeStatus } = this.properties;
    if (executeStatus) {
      style.strokeDasharray = "8 3";
      style.stroke = executeStatus === 'executed' ? 'rgb(79 235 151 / 80%)' : 'red'
      if (executeStatus === 'execute-failed') {
        style.strokeDasharray = null;
      }
    } else {
      style.strokeDasharray = "3 2";
      style.stroke = '#33DD89'
    }
    return style;
  }
  setHovered(flag) {
    super.setHovered(flag);
    this.setZIndex(flag ? 999 : 0);
  }
  setSelected(flag) {
    super.setSelected(flag);
    this.setZIndex(flag ? 999 : 0);
  }
  setZIndex (index) {
    if (this.isHovered || this.isSelected || this.properties.executeStatus) {
      super.setZIndex(999);
      this.openEdgeAnimation();
    } else {
      this.closeEdgeAnimation();
      super.setZIndex(index);
    }
  }
  initPoints() {
    if (this.pointsList && this.pointsList.length > 0) {
      this.points = this.pointsList.map(point => `${point.x},${point.y}`).join(' ');
      return
    }
    const { startPoint, endPoint } = this
    const { x: x1, y: y1 } = startPoint
    const { x: x2, y: y2 } = endPoint
    const betterDistance = this.offset * 2
    // 1. 起点在终点左边
    if (x1 - x2 < -betterDistance) {
      this.pointsList = pointFilter([
        {
          x: x1,
          y: y1
        },
        {
          x: x1 + this.offset,
          y: y1
        },
        {
          x: x1 + this.offset,
          y: y2
        },
        {
          x: x2,
          y: y2
        }
      ])
      this.points = this.pointsList.map(point => `${point.x},${point.y}`).join(' ');
    } else if (x1 - x2 > betterDistance) { // 起点在右边，终点在左边
      this.pointsList = pointFilter([
        {
          x: x1,
          y: y1
        },
        {
          x: x1 + this.offset,
          y: y1
        },
        {
          x: x1 + this.offset,
          y: y2 + NODE_HEIGHT
        },
        {
          x: x2 - NODE_HEIGHT / 2,
          y: y2 + NODE_HEIGHT
        },
        {
          x: x2 - NODE_HEIGHT / 2,
          y: y2
        },
        {
          x: x2,
          y: y2
        }
      ])
      this.points = this.pointsList.map(point => `${point.x},${point.y}`).join(' ');
    } else {
      super.initPoints()
    }
  }
}

export default {
  type: 'beautify-line',
  model: BeautifyLineModel,
  view: BeautifyLine
}
