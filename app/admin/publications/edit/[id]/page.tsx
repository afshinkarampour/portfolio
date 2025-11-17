import EditForm from "@/components/admin/publication/edit-form";

export default async function EditPublicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <EditForm id={id} />;
}
