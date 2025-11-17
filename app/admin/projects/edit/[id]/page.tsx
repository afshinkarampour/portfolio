import EditForm from "@/components/admin/project/edit-form";

export default async function EditProjectePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <EditForm id={id} />;
}
