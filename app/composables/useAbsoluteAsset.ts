export function useAbsoluteAsset() {
  const config = useRuntimeConfig()
  const assetPath = useAssetPath()
  return (path: string) => new URL(assetPath(path), config.public.siteOrigin as string).href
}
