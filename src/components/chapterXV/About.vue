<script setup>
import { ref, reactive } from 'vue'

const arr = ['peach', 'straw', 'apple', 'spork']
console.log(arr)

const stableSorting = (s1, s2) => {
  console.log(s1, s2, 's1, s2')
  if (s1[0] < s2[0]) return -1
  return 1
}

console.log(arr.sort(stableSorting))

// ["apple", "peach", "straw", "spork"]
</script>

<template>
  <div>
    <h1>what are you 弄啥嘞？</h1>
  </div>
</template>

<style scoped></style>
