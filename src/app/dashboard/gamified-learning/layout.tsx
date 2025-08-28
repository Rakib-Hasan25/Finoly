import RewardToastProvider from "@/components/gamifiedComp/toaster";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RewardToastProvider />
      {children}
    </>
  );
}
