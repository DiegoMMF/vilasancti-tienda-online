import OpengraphImage from "components/opengraph-image";
import { getCollection } from "lib/api/products-drizzle";

export default async function Image({
  params,
}: {
  params: { handle: string };
}) {
  const collection = await getCollection(params.handle);
  const title = collection?.seo?.title || collection?.title;
  return await OpengraphImage({ title });
}
