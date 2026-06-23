import StoreLayout from "@/components/store/StoreLayout"
import { getNavCategories } from "@/lib/queries"

export default async function StoreGroupLayout({ children }: { children: React.ReactNode }) {
  // Busca o menu no servidor para que os links de categoria entrem no HTML inicial.
  const navCategories = await getNavCategories()
  return <StoreLayout navCategories={navCategories}>{children}</StoreLayout>
}
