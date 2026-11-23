import DeepLinkRedirect from "@/components/DeepLinkRedirect";
export default async function ReelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DeepLinkRedirect path={`/reel/${id}`} />;
}
