import Sidebar from "../components/Sidebar";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <div className="flex h-screen bg-[#020617] text-white">
      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTEÚDO */}
      <main className="flex-1 overflow-auto p-6 bg-[#020617]">
        {children}
      </main>
    </div>
  );
}