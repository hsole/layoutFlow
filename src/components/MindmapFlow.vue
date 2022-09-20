<script lang="ts">
import { ref } from 'vue'
import LogicFlow from '@logicflow/core'
import '@logicflow/core/dist/style/index.css'
import LayoutFlowExtension from './mindElement/index'
// import Setting from './node-red/tools/Setting.vue'
import FlowHeader from './FlowHeader.vue'
// import './node-red/style.css'
export default {
  setup() {
    const count = ref(0)
    const currentNode = ref(null)
    return {
      count,
      currentNode
    }
  },
  mounted() {
    this.lf = new LogicFlow({
      container: this.$refs.container,
      width: 1200,
      height: 1000,
      grid: false,
      edgeTextEdit: false,
      adjustEdge: false,
      adjustNodePosition: false,
      hoverOutline: false,
      edgeSelectedOutline: false,
      stopScrollGraph: true,
      stopZoomGraph: true,
      keyboard: {
        enabled: true
      },
      // keyboard: true,
      plugins: [
        LayoutFlowExtension
      ]
    })
    this.lf.render(
      {
        nodes: [
          {
            x: 200,
            y: 200,
            type: 'center-node',
            text: '中心主题'
          }
        ]
      }
    )
  },
  methods: {
    changeStyle (style) {
      this.lf.setProperties(this.currentNode.id, {
        style
      })
    },
    stopTab (ev) {
      if (ev.code === 'Tab') {
        ev.preventDefault()
      }
    }
  },
  components: {
    FlowHeader
  }
}
</script>

<template>
  <div class="flow-chart" @keydown="stopTab">
    <div ref="container" class="container"></div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
.flow-chart {
  position: relative;
  width: 100%;
  height: 100%;
}
.flow-chart :deep(.lf-graph) {
  background: rgb(247, 247, 247);
}
.flow-chart :deep(.lf-red-node), .flow-chart :deep(.lf-element-text) {
  cursor: move;
}
.flow-chart :deep(svg) {
  display: block;
}
.flow-chart-palette {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
}
.setting-panel {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
