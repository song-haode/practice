<template>
  <div></div>
</template>
<script setup lang="ts">
import { Ref, shallowRef, triggerRef, customRef } from 'vue'
/*
customRef
自定义ref 

customRef 是个工厂函数要求我们返回一个对象 并且实现 get 和 set
*/  
function Myref<T>(value: T) {
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newVal: T) {
        console.log('set');
        value = newVal
        trigger()
      }
    }
  })
}
 
let message = Myref('小满')
const changeMsg = () => {
  message.value = '大满'
  // triggerRef(message)
}
</script> 
</script>

<style scoped></style>
