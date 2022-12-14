import type { LogicFlow } from '@logicflow/core'
import { createApp, ref, h } from 'vue'
import { layoutGraphData } from './layout'
import VueMenu from './menu.vue'
const COMMON_TYPE_KEY = "menu-common"
const NEXT_X_DISTANCE = 200
const NEXT_Y_DISTANCE = 100

class ContextPad {
  static pluginName = 'contextPad'
  lf: LogicFlow
  menuTypeMap: Record<string, any>
  container: HTMLElement
  isShow: any
  private _activeData: any
  private menuComponent: any
  app: any
  menuWrapper: any
  constructor({ lf }) {
    this.menuTypeMap = new Map()
    this.lf = lf
    this.menuTypeMap.set(COMMON_TYPE_KEY, [])
    this.menuComponent = h(VueMenu, {
      onAddSubNode: () => {
        this.addSubNode()
      },
    })
    this.app = createApp({
      render: () => this.menuComponent
    })
    this.lf.keyboard.on('tab', () => {
      const { nodes } = this.lf.getSelectElements()
      if (nodes.length > 0) {
        this._activeData = nodes[0]
      }
      if (this._activeData) {
        this.addSubNode()
      }
    })
    this.lf.keyboard.on('enter', () => {
      const { nodes } = this.lf.getSelectElements()
      if (nodes.length > 0) {
        const { edges } = this.lf.graphModel
        const edge = edges.find(edge => edge.targetNodeId === nodes[0].id)
        if (edge) {
          this._activeData = this.lf.getNodeDataById(edge.sourceNodeId)
        }
      }
      if (this._activeData) {
        this.addSubNode()
      }
    })
  }
  render(lf, container) {
    this.container = container
    lf.on("node:contextmenu", ({ data }) => {
      this._activeData = data
      this.showMenu()
    })
  }
  setContextMenuByType = (type, menus) => {
    this.menuTypeMap.set(type, menus)
  }
  
  /**
   * 获取新菜单位置
   */
  getContextMenuPosition() {
    const data = this._activeData
    const Model = this.lf.graphModel.getElement(data.id)
    if (!Model) {
      console.warn(`找不到元素${data.id}`)
      return
    }
    let x
    let y
    if (Model.BaseType === "edge") {
      x = Number.MIN_SAFE_INTEGER
      y = Number.MAX_SAFE_INTEGER
      const edgeData = Model.getData()
      x = Math.max(edgeData.startPoint.x, x)
      y = Math.min(edgeData.startPoint.y, y)
      x = Math.max(edgeData.endPoint.x, x)
      y = Math.min(edgeData.endPoint.y, y)
      if (edgeData.pointsList) {
        edgeData.pointsList.forEach((point) => {
          x = Math.max(point.x, x)
          y = Math.min(point.y, y)
        })
      }
    }
    if (Model.BaseType === "node") {
      x = data.x + Model.width / 2
      y = data.y - Model.height / 2
    }
    return this.lf.graphModel.transformModel.CanvasPointToHtmlPoint([x, y])
  }
  showMenu() {
    const { isSilentMode } = this.lf.options
    // 静默模式不显示菜单
    if (isSilentMode) {
      return
    }
    if (!this.menuWrapper) {
      this.isShow = true
      const node = document.createElement('div')
      node.className = 'menu-wrapper'
      this.container.appendChild(node)
      this.app.mount(node)
      this.menuWrapper = node
    }
    const [x, y] = this.getContextMenuPosition()
    this.menuWrapper.style.display = 'block'
    this.menuWrapper.style.left = `${x}px`
    this.menuWrapper.style.top = `${y}px`
    this.lf.on(
      "node:delete,blank:click,edge:delete,node:drag,graph:transform",
      this.listenDelete
    )
  }
  /**
   * 隐藏菜单
   */
  hideContextMenu() {
    this.lf.off(
      "node:delete,blank:click,edge:delete,node:drag,graph:transform",
      this.listenDelete
    )
    if (this.menuWrapper) {
      this.menuWrapper.style.display = 'none'
    }
  }
  addSubNode() {
    this.hideContextMenu()
    const node = this.lf.addNode({
      type: 'sub-node',
      x: this._activeData.x + NEXT_X_DISTANCE,
      y: this._activeData.y,
      text: '子主题',
    })
    this.lf.addEdge({
      type: 'bezier',
      sourceNodeId: this._activeData.id,
      targetNodeId: node.id,
    })
    const graphData = this.lf.getGraphData()
    const { nodes, edges } = layoutGraphData(graphData)
    const nodeIdMap =  nodes.reduce((acc, cur) => {
      acc[cur.id] = cur
      return acc
    }, {})
    // 处理edge弧线，保持其美观
    edges.map((edge) => {
      const {
        sourceNodeId,
        targetNodeId
      } = edge
      // const sModel = this.lf.getNodeModelById(sourceNodeId)
      const tModel = this.lf.getNodeModelById(targetNodeId)
      const startPoint = {
        x: nodeIdMap[sourceNodeId].x,
        y: nodeIdMap[sourceNodeId].y
      }
      const sJustPoint = {
        x: nodeIdMap[targetNodeId].x - tModel.width / 2 - 100,
        y: nodeIdMap[targetNodeId].y
      }
      const tJustPoint = {
        x: nodeIdMap[targetNodeId].x - tModel.width / 2 - 100,
        y: nodeIdMap[targetNodeId].y
      }
      const endPoint = {
        x: nodeIdMap[targetNodeId].x - tModel.width / 2,
        y: nodeIdMap[targetNodeId].y
      }
      edge.startPoint = startPoint
      edge.endPoint = endPoint
      edge.pointsList = [
        startPoint,
        sJustPoint,
        tJustPoint,
        endPoint
      ]
    })
    this.lf.render({
      nodes,
      edges,
    })
    this.lf.selectElementById(node.id)
    // this.lf.getNodeModelById(node.id).setElementState(2)
  }
  listenDelete = () => {
    this.hideContextMenu()
  }
}

export { ContextPad }
