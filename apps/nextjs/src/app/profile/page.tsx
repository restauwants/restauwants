import { Suspense, useEffect, useState } from "react";
import { auth } from "@restauwants/auth";
import { AuthShowcase } from "../_components/auth-showcase";
import { api } from "~/trpc/server";
import { PostList } from "../_components/posts";

export async function getUserID() {
  try {
    const session = await auth();

    if (session && session.user) {
      const userId = session.user.name;
      return userId;
    } else {
      throw new Error("User not authenticated");
    }
  } catch (error) {
    const userId = " ";
    return userId;
  }
}


export default function Profile() {
  const [userId, setUserId] = useState("");
  const posts = api.post.all();

  useEffect(() => {
    const fetchUserID = async () => {
      try {
        // Check if window is defined to ensure it's executed on the client side
        if (typeof window !== 'undefined') {
          const session = await auth();

          if (session && session.user) {
            const userId = session.user.name;
            setUserId(userId ?? "");
          } else {
            throw new Error("User not authenticated");
          }
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
        setUserId(" ");
      }
    };

    void fetchUserID();
  }, []); // empty dependency array means this effect runs once on mount

  return (
    <div className="flex h-screen flex-col">
      <div className="relative h-1/4 flex-none bg-gray-100 p-4">
        <div className="absolute bottom-4 left-4">
          <p className="text-xl text-black ">{userId}</p>
        </div>

        <div className="absolute right-4 top-4 p-4">
          <AuthShowcase />
        </div>
      </div>
      <div className="flex-grow bg-white p-4">
        <Suspense fallback={<h4>Loading...</h4>}>
          <PostList posts={posts} />
        </Suspense>
      </div>
    </div>
  );
}
