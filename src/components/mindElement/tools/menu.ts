import type { LogicFlow } from '@logicflow/core'
import { createApp, ref, h } from 'vue';
import VueMenu from './menu.vue';
const COMMON_TYPE_KEY = "menu-common";
const NEXT_X_DISTANCE = 200;
const NEXT_Y_DISTANCE = 100;

class ContextPad {
  static pluginName = 'contextPad'
  lf: LogicFlow;
  menuTypeMap: Record<string, any>;
  container: HTMLElement;
  isShow: any;
  private _activeData: any;
  private menuComponent: any;
  app: any;
  constructor({ lf }) {
    this.menuTypeMap = new Map();
    this.lf = lf;
    this.menuTypeMap.set(COMMON_TYPE_KEY, []);
    // this.menuComponent = h(VueMenu, {
    //   on: {
    //     addNode: (node) => {
    //       console.log('addNode', node);
    //     },
    //     hideContextMenu: () => {
    //       this.hideContextMenu();
    //     }
    //   }
    // })
    // this.app = createApp({
    //   render: () => this.menuComponent
    // })
  }
  render(lf, container) {
    this.container = container;
    lf.on("node:contextmenu", ({ data }) => {
      this._activeData = data;
      this.createContextMenu();
    });
    lf.on("blank:click", () => {
      this.hideContextMenu();
    });
  }
  setContextMenuByType = (type, menus) => {
    this.menuTypeMap.set(type, menus);
  };
  /**
   * 隐藏菜单
   */
  hideContextMenu() {
    this.lf.off(
      "node:delete,edge:delete,node:drag,graph:transform",
      this.listenDelete
    );
    this.isShow = false;
  }
  
  setContextMenuItems(menus) {
    this.menuTypeMap.set(COMMON_TYPE_KEY, menus);
  }
  /**
   * 获取新菜单位置
   */
  getContextMenuPosition() {
    const data = this._activeData;
    const Model = this.lf.graphModel.getElement(data.id);
    if (!Model) {
      console.warn(`找不到元素${data.id}`);
      return;
    }
    let x;
    let y;
    if (Model.BaseType === "edge") {
      x = Number.MIN_SAFE_INTEGER;
      y = Number.MAX_SAFE_INTEGER;
      const edgeData = Model.getData();
      x = Math.max(edgeData.startPoint.x, x);
      y = Math.min(edgeData.startPoint.y, y);
      x = Math.max(edgeData.endPoint.x, x);
      y = Math.min(edgeData.endPoint.y, y);
      if (edgeData.pointsList) {
        edgeData.pointsList.forEach((point) => {
          x = Math.max(point.x, x);
          y = Math.min(point.y, y);
        });
      }
    }
    if (Model.BaseType === "node") {
      x = data.x + Model.width / 2;
      y = data.y - Model.height / 2;
    }
    return this.lf.graphModel.transformModel.CanvasPointToHtmlPoint([x, y]);
  }
  createContextMenu() {
    const { isSilentMode } = this.lf.options;
    // 静默模式不显示菜单
    if (isSilentMode) {
      return;
    }
    // if (!this.isShow) {
    //   this.isShow = true
    //   const node = document.createElement('div')
    //   this.container.appendChild(node)
    //   this.app.mount(node)
    // } else {
      
    // }
    // this.showMenu();
  }

  addNode(node, y?: number) {
    const isDeep = y !== undefined;
    if (y === undefined) {
      y = node.y;
    }
    const nodeModel = this.lf.getNodeModelById(node.sourceId);
    const leftTopX = node.x - 100 + NEXT_X_DISTANCE;
    const leftTopY = y - node.y / 2 - 20;
    const rightBottomX = node.x + 100 + NEXT_X_DISTANCE;
    const rightBottomY = y + node.y / 2 + 20;
    const existElements = this.lf.getAreaElement(
      [leftTopX, leftTopY],
      [rightBottomX, rightBottomY]
    );
    console.log(existElements);
    if (existElements.length) {
      y = y + NEXT_Y_DISTANCE;
      this.addNode(node, y);
      return;
    }
    const newNode = this.lf.addNode({
      type: node.type,
      x: node.x + 200,
      y,
      properties: node.properties
    });
    let startPoint;
    let endPoint;
    if (isDeep) {
      startPoint = {
        x: node.x,
        y: node.y + nodeModel.height / 2
      };
      endPoint = {
        x: newNode.x - newNode.width / 2,
        y: newNode.y
      };
    }
    this.lf.addEdge({
      sourceNodeId: node.sourceId,
      targetNodeId: newNode.id,
      startPoint,
      endPoint
    });
  }

  showMenu() {
    // const [x, y] = this.getContextMenuPosition();
    // 菜单显示的时候，监听删除，同时隐藏
    !this.isShow &&
      this.lf.on(
        "node:delete,edge:delete,node:drag,graph:transform",
        this.listenDelete
      );
    this.isShow = true;
  }

  listenDelete = () => {
    this.hideContextMenu();
  };
}

export { ContextPad };
