import { useRouter } from "next/router";
import SubCategoryPageClient from "./SubCategoryPageClient";


export default function Page() {
  const router = useRouter();
  const { id, subslug } = router.query;

  if (!id || !subslug) return null; // wait for router to load params

  return (
    <SubCategoryPageClient
      categorySlug={Number(id)}
      subSlug={subslug as string}
    />
  );
}
