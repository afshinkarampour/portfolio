import EditForm from "@/components/admin/experience/edit-form";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <EditForm id={id} />;
}
