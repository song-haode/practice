<template>
    <div>
    
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const { ctx, proxy } = getCurrentInstance()
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  propData: {
   type: String,
   default: '',
  },
})
const {data} = toRefs(reactive({
  //定义数组和对象
  data:''
 }))
const data2 = ref('')//定义普通类型
// onMounted(() => {})
// watch(propData,(newVal,oldVal)=>{})
</script>

<style scoped>
    
</style>