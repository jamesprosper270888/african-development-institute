"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AdminGuardClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isPending && session) {
      fetch("/api/auth/check-admin")
        .then((res) => res.json())
        .then((data) => {
          if (!data.isAdmin) {
            router.replace("/app/dashboard");
          } else {
            setIsAdmin(true);
          }
        })
        .catch(() => {
          router.replace("/app/dashboard");
        });
    }
  }, [session, isPending, router]);

  if (isPending || isAdmin === null) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
