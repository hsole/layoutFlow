<template>
  <div class="layout-flow">
    <el-tabs v-model="activeName" class="layout-tabs" @tab-click="handleClick">
      <el-tab-pane label="自动布局(树)" name="first">
        <FlowChart v-if="activeName === 'first'"/>
      </el-tab-pane>
      <el-tab-pane label="一键美化" name="second">Config</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import FlowChart from './FlowChart.vue'

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

</script>
<style scoped>
.layout-flow {
  width: 1200px;
  margin: 20px auto;

}
.layout-tabs {
  padding: 0 20px;
}
</style>