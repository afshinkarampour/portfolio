import EditForm from "@/components/admin/project/edit-form";

interface EditPageProps {
  params: {
    id: string;
  };
}

export default async function EditProjectePage({ params }: EditPageProps) {
  const { id } = params;
  return <EditForm id={id} />;
}
