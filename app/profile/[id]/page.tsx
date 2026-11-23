import DeepLinkRedirect from "@/components/DeepLinkRedirect";
export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DeepLinkRedirect path={`/profile/${id}`} />;
}
