import Sidebar from "../components/Sidebar";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <div className="flex h-screen bg-[#f4f6fb]">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTEÚDO */}
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>

    </div>
  );
}