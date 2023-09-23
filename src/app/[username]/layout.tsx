export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen max-w-screen-2xl flex flex-col min-w-max md:items-center">
      {children}
    </div>
  );
}
