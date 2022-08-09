<template>
  <div>
    <button @click="change">按钮</button>
    {{ state }}
  </div>
</template>

<script setup lang="ts">
import { reactive, toRef, toRefs,toRaw } from 'vue'
/*
toRef
如果原始对象是非响应式的就不会更新视图 数据是会变的
*/
const obj = {
  foo: 1,
  bar: 1,
}
const state = toRef(obj, 'bar')
// bar 转化为响应式对象
const change = () => {
  state.value++
  console.log(obj, state)
}

/*
toRefs
可以帮我们批量创建ref对象主要是方便我们解构使用
*/

const objs = reactive({
  foo: 1,
  bar: 1,
})
let { foo, bar } = toRefs(objs)
foo.value++
console.log(foo, bar);

/*
toRaw
将响应式对象转化为普通对象
*/  

const objd = reactive({
   foo: 1,
   bar: 1
})
 
 
const states = toRaw(objd)
// 响应式对象转化为普通对象
 
const changes = () => {
 
   console.log(objd, state);
 
}
</script>
