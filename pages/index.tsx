import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMockAuth } from "@/contexts/MockAuthContext";
import Login from "@/components/Login";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useMockAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/drive/my-drive");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return null;
}
