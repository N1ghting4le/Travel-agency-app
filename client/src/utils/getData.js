import { redirect } from "next/navigation";

export const getData = async (url) => {
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    return redirect("/");
  }

  return await res.json();
};
