import Navbar from "@/components/navbar";

export default async function RootLayout({
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