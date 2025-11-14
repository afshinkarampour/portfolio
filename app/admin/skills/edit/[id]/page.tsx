import EditForm from "@/components/admin/skill/edit-form";

interface EditPageProps {
  params: {
    id: string;
  };
}

export default async function EditSkillPage({ params }: EditPageProps) {
  const { id } = params;
  return <EditForm id={id} />;
}
