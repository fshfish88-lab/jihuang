export function useQueryValue(key: string, resetPage = true) {
  const route = useRoute()
  const router = useRouter()
  const value = ref('')
  const readQuery = () => typeof route.query[key] === 'string' ? route.query[key] as string : ''
  onMounted(() => { value.value = readQuery() })
  watch(() => route.query[key], () => { value.value = readQuery() })
  return computed({
    get: () => value.value,
    set: (next: string) => {
      value.value = next
      const query = { ...route.query, [key]: next || undefined }
      if (resetPage) delete query.page
      void router.replace({ query, hash: route.hash })
    }
  })
}
