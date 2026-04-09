import { redirect } from "next/navigation";
import { BASE_URL } from "@/constants/queryPaths";

export const getData = async (url) => {
  const modifiedUrl = url.replace(BASE_URL, process.env.BASE_URL);
  const res = await fetch(modifiedUrl, { cache: "no-store" });

  if (!res.ok) {
    return redirect("/");
  }

  return await res.json();
};
