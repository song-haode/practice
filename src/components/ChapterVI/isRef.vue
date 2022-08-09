<template>
  <div>
    <button @click="changeMsg">change</button>
    <div>{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, isRef } from 'vue'
//isRef 判断是不是一个ref对象
let message: Ref<string | number> = ref('我是message')
let notRef: number = 123
const changeMsg = () => {
  message.value = 'change msg'
  console.log(isRef(message)) //true
  console.log(isRef(notRef)) //false
}
</script>

<style></style>
<!-- //--------------------------------ts两种方式
<template>
  <div>
    <button @click="changeMsg">change</button>
    <div>{{ message }}</div>
  </div>
</template>
 
 
 
<script setup lang="ts">
import { ref } from 'vue'
let message = ref<string | number>("我是message")
 
const changeMsg = () => {
  message.value = "change msg"
}
</script>
 
 
<style>
</style> -->
