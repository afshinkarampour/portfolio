import EditForm from "@/components/admin/publication/edit-form";

interface EditPageProps {
  params: {
    id: string;
  };
}

export default async function EditPublicationPage({ params }: EditPageProps) {
  const { id } = params;
  return <EditForm id={id} />;
}
