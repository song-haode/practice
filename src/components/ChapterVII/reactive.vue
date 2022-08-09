<template>
  <div>
    <div>{{ state }}</div>
    <button @click="change1">test1</button>
    <button @click="change2">test2</button>
  </div>
</template>
<script setup>
import { reactive, readonly, shallowReactive } from 'vue'
/*
readonly
拷贝一份proxy对象将其设置为只读
*/

const persons = reactive({ count: 1 })
const copy = readonly(persons)

//persons.count++

/*
用来绑定复杂的数据类型 例如 对象 数组

reactive 源码约束了我们的类型
*/
copy.count++
let person = reactive({
  name: '小满',
})
person.name = '大满'

/*
shallowReactive 
只能对浅层的数据 如果是深层的数据只会改变值 不会改变视图
*/

const obj = {
  a: 1,
  first: {
    b: 2,
    second: {
      c: 3,
    },
  },
}
const state = shallowReactive(obj)
function change1() {
  state.a = 7
}
function change2() {
  state.first.b = 8
  state.first.second.c = 9
  console.log(state)
}
</script>

<style scoped></style>
