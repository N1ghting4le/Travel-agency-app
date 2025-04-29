import Header from "@/components/header/Header";

export default function AdminOrEmployeeLayout({ children }) {
  return (
    <>
    <Header/>
    {children}
    </>
  );
}