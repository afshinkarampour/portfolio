import EditForm from "@/components/admin/skill/edit-form";

export default async function EditSkillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <EditForm id={id} />;
}
