<template>
  <div>
    <button @click="changeMsg">change</button>
    <div>{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
import { Ref, shallowRef, triggerRef } from 'vue'
/*
triggerRef 
强制更新页面DOM

这样也是可以改变值的
*/
type Obj = {
  name: string
}
let message: Ref<Obj> = shallowRef({
  name: '小满',
})

const changeMsg = () => {
  message.value.name = '大满'
  triggerRef(message)
}
</script>

<style></style>
