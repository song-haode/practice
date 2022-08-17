import { ref, onMounted, onUnmounted } from 'vue'
export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function update(e) {
    x.value = e.pageX
    y.value = e.pageY
  }

  onMounted(() => {
    window.addEventListener('mousemove', update)
  })
  onUnmounted(() => {
    window.removeEventListener('mousemove', update)
  })

  function selectSort(arr){
    var len = arr.length;
    var minIndex,temp;
    for(var i = 0;i<len-1;i++){
        minIndex = i;
        for(var j=i+1;j<len;j++){
            if(arr[j]<arr[minIndex]){
                minIndex = j;
            }
        }
        temp= arr[i];
        arr[i] = arr[minIndex]
        arr[minIndex] = temp
    }
    return arr
}

  return {
    x,
    y,
  }
}
