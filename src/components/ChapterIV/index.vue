<template>
  <div>
    <div>{{ message }}</div>
    <div>{{ message == 0 ? '我是小满0' : '我不是小满other' }}</div>
    <div>{{ message + 1 }}</div>
    <div>{{ message.split('，') }}</div>
  </div>
</template>
<script setup>
const message = '我，是，小，满'
var obj = new Proxy(
  {},
  {
    get: function (target, propKey, receiver) {
      console.log(target, propKey, receiver);
      
      console.log(`getting ${propKey}!`)
      return Reflect.get(target, propKey, receiver)
    },
    set: function (target, propKey, value, receiver) {
      console.log(`setting ${propKey}!`)
      return Reflect.set(target, propKey, value, receiver)
    },
  }
)
obj.count = 1
//  setting count!
++obj.count
//  getting count!
//  setting count!
//  2
</script>

<style scoped></style>
