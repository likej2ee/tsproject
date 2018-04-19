<template>
  <div class="my-footer">
    2018 &copy;
  </div>
</template>

<script lang="tsx">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class MyComponent extends Vue {}
</script>

<style lang="scss">
.el-footer {
  background-color: #373d41;
}
.my-footer {
  line-height: 60px;

  height: 60px;
  margin: 0 -15px;
  padding: 0 15px;

  background-color: #f6f8f9;
}
</style>
