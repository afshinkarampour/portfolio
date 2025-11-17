import EditForm from "@/components/admin/blog/edit-form";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <EditForm id={id} />;
}
