<template>
  <div></div>
</template>
<script setup>
import { watch, ref,reactive } from 'vue'
/*
watch 需要侦听特定的数据源，并在单独的回调函数中执行副作用

watch第一个参数监听源

watch第二个参数回调函数cb（newVal,oldVal）

watch第三个参数一个options配置项是一个对象{

immediate:true //是否立即调用一次

deep:true //是否开启深度监听

}
*/

let message = ref({
  nav: {
    bar: {
      name: '',
    },
  },
})

watch(
  message,
  (newVal, oldVal) => {
    console.log('新的值----', newVal)
    console.log('旧的值----', oldVal)
  },
  {
    immediate: true,
    deep: true,
  }
)

// 监听多个ref 注意变成数组啦
let messages = ref('')
let message2 = ref('')

watch([messages, message2], (newVal, oldVal) => {
  console.log('新的值----', newVal)
  console.log('旧的值----', oldVal)
})

/*
监听Reactive
使用reactive监听深层对象开启和不开启deep 效果一样
*/
let messager = reactive({
  nav: {
    bar: {
      name: '',
    },
  },
})

watch(messager, (newVal, oldVal) => {
  console.log('新的值----', newVal)
  console.log('旧的值----', oldVal)
})

// 监听reactive 单一值

let messagee = reactive({
  name: '',
  name2: '',
})

watch(
  () => messagee.name,
  (newVal, oldVal) => {
    console.log('新的值----', newVal)
    console.log('旧的值----', oldVal)
  }
)
</script>

<style scoped></style>
