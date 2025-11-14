import EditForm from "@/components/admin/experience/edit-form";

interface EditPageProps {
  params: {
    id: string;
  };
}

export default async function EditExperiencePage({ params }: EditPageProps) {
  const { id } = params;
  return <EditForm id={id} />;
}
