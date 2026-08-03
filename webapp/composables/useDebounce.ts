import { ref, watch, onUnmounted, readonly, type Ref } from 'vue'

export function useDebounce<T>(source: Ref<T>, delay: number = 300): Readonly<Ref<T>> {
  const debounced = ref(source.value) as Ref<T>
  let timer: ReturnType<typeof setTimeout> | null = null

  watch(source, () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      debounced.value = source.value
    }, delay)
  })

  onUnmounted(() => {
    if (timer) clearTimeout(timer)
  })

  return readonly(debounced)
}
