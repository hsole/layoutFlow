<template>
  <div class="tool-menu">
    <ul>
      <li @click="$emit('addSubNode')">
        <span>新增子主题</span>
        <span class="shortcut-keys">Tab</span>
      </li>
      <li>
        <span>新增同级主题</span>
        <span class="shortcut-keys">Enter</span>
      </li>
      <li class="disabled">
        <span>新增父主题</span>
      </li>
      <li class="split-line"></li>
      <li class="disabled">
        <span>收起主题</span>
      </li>
      <li class="disabled">
        <span>展开子主题</span>
      </li>
      <li class="split-line"></li>
      <li class="disabled">
        <span>复制</span>
      </li>
      <li class="disabled">
        <span>粘贴</span>
      </li>
      <li>
        <span>删除</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
export default {
  emits: ['addSubNode'],
}
</script>
<style scoped>
.tool-menu {
  background: #fff;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 20%);
  min-width: 190px;
  min-height: 200px;
  display: block;
  opacity: 1;
  transition: all 200ms ease-in-out;
  border-radius: 5px;
  /* transition: all .3s; */
  font-family: "PingFang SC","Helvetica Neue", Helvetica, Microsoft Yahei, Hiragino Sans GB, WenQuanYi Micro Hei, sans-serif;
}
.tool-menu ul {
  list-style: none;
  padding: 7px 0px;
  margin: 0;
}
.tool-menu li {
  list-style: none;
  padding: 3px 15px;
  font-size: 12px;
  line-height: 18px;
  cursor: pointer;
  transition: all 120ms ease-in-out;
  position: relative;
}
.tool-menu li:hover {
  background: #f5f5f5;
}
.tool-menu li.split-line {
  height: 1px;
  background: #eee;
  margin: 3px 0px;
  padding: 0px !important;
}
.tool-menu li.disabled {
  opacity: .8;
  cursor: default;
  color: #aaa;
  pointer-events: inherit;
}
.tool-menu li.disabled:hover {
  background: #fff;
}
.tool-menu li .shortcut-keys {
  float: right;
  color: #a1a1a1;
}
</style>