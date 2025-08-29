"use client";

import { useAuth } from "@/hooks/useAuth";
import { getUserByEmail } from "@/lib/actions/users";
import { useEffect, useState } from "react";

export default function MyComponent() {
 const { user } = useAuth();
 const [userId, setUserId] = useState<number | null>(null);

 useEffect(() => {
  const fetchUserId = async () => {
   if (user?.email) {
    const userData = await getUserByEmail(user.email);
    setUserId(userData?.id ?? null);
   }
  };
  fetchUserId();
 }, [user]);

 return <div>User: {userId}</div>;
}
