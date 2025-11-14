import EditForm from "@/components/admin/blog/edit-form";

interface EditPageProps {
  params: {
    id: string;
  };
}

export default async function EditBlogPage({ params }: EditPageProps) {
  const { id } = params;
  return <EditForm id={id} />;
}
