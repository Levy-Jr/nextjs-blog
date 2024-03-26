import Navbar from "@/components/navbar";

export default async function Dashboard({
  children
}: {
  children: React.ReactNode;
  params: { storeId: string }
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}