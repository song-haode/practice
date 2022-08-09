<template>
  <div>
    <button @click="changeMsg">change</button>
    <div>{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
import { Ref, shallowRef } from 'vue'
/*
shallowRef
创建一个跟踪自身 .value 变化的 ref，但不会使其值也变成响应式的

例子

修改其属性是非响应式的这样是不会改变的
*/ 
type Obj = {
  name: string
}
let message: Ref<Obj> = shallowRef({
  name: '小满',
})

const changeMsg = () => {
  message.value.name = '大满'
}
</script>

<style></style>
