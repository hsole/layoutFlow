<template>
  <div class="layout-flow">
    <el-tabs v-model="activeName" class="layout-tabs">
      <el-tab-pane label="自动布局(树)" name="first">
        <MindmapFlow v-if="activeName === 'first'"/>
      </el-tab-pane>
      <el-tab-pane label="一键美化" name="second">
        <BeautifyFlow v-if="activeName === 'second'"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import BeautifyFlow from './BeautifyFlow.vue'
import MindmapFlow from './MindmapFlow.vue'

const activeName = ref('first')

</script>
<style scoped>
.layout-flow {
  width: 1200px;
  margin: 20px auto;

}
/* .layout-tabs {
  padding: 0 20px;
} */
</style>