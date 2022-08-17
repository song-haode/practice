<template>
  <div>
    <h1>首页</h1>
    <div>坐标位置: {{ x }} , {{ y }}</div>
  </div>
</template>
<script setup>
import { useMouse } from './index.js'
// 鼠标事件
const { x, y } = useMouse()
const add = [2, 4, 6, 2, 10, 5]
console.log('selectSort(add)', selectSort(add))

function selectSort(arr) {
  var len = arr.length
  // console.log('len=>', len);
  
  var minIndex, temp
  for (var i = 0; i < len - 1; i++) {
    console.log('i=>', i);
    
    minIndex = i
    for (var j = i + 1; j < len; j++) {
      // console.log('arr[j]=>',arr[j]);
      // console.log('arr[minIndex]=>',arr[minIndex]);
      
      if (arr[j] < arr[minIndex]) {
        minIndex = j
      }
    }
    temp = arr[i]
    arr[i] = arr[minIndex]
    arr[minIndex] = temp
  }
  return arr
}
</script>

<style scoped></style>
