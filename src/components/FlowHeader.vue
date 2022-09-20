<script lang="ts">
export default {
  props: {
    flowName: {
      type: String,
      default: "未命名",
    },
  },
  setup() {
    return {};
  },
};
</script>
<template>
  <header class="header">
    <div class="header-item">
      <input class="title" type="text" v-model="flowName" />
    </div>
    <div class="header-item">
      <div class="header-icon">
        <svg viewBox="0 0 1024 1024" version="1.1" width="24" height="24">
          <path d="M456.96 375.893A432.213 432.213 0 0 1 870.4 807.68a34.133 34.133 0 0 1-68.267 0A363.947 363.947 0 0 0 456.96 444.16v192.853L153.6 409.6l303.36-227.413z" p-id="2268">
          </path>
        </svg>
      </div>
    </div>
    <div class="header-item">
      <div class="header-icon">
        <svg viewBox="0 0 1024 1024" version="1.1" width="24" height="24">
          <path d="M567.04 375.893A432.213 432.213 0 0 0 153.6 807.68a34.133 34.133 0 1 0 68.267 0A363.947 363.947 0 0 1 567.04 444.16v192.853L870.4 409.6 567.04 182.187z" p-id="1248">
          </path>
        </svg>
      </div>
    </div>
  </header>
</template>
<style scoped>
.header {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  height: 45px;
  border-bottom: 1px solid #e5e5e5;
  box-shadow: 0 3px 2px -2px rgb(200 200 200 / 15%);
  background: rgba(255, 255, 255, 0.9);
  z-index: 1;
  display: flex;
}
.header .title {
  font-size: 16px;
  background: transparent;
  line-height: 24px;
  max-width: 250px;
  width: auto;
  overflow: hidden;
  white-space: nowrap;
  border: 0px;
  outline: none;
  margin-left: 20px;
  margin-top: 10px;
  -webkit-user-modify: read-write-plaintext-only;
  border-bottom: 1px solid transparent;
}
.header .title:hover {
  border-bottom-color: #eaeaea;
}
.header-icon {
  color: currentColor;
  padding: 3px;
  margin: 8px;
}
.header-icon:hover {
  background: #eaeaea;
  border-radius: 5px;
  cursor: pointer;
}
.header-icon.disabled {
  opacity: .36;
  filter: alpha(Opacity=36);
  cursor: default !important;
}
</style>