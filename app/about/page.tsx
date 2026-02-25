import { getAbout } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import AboutEditor from "./AboutEditor";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [data, admin] = await Promise.all([
    Promise.resolve(getAbout()),
    isAdmin(),
  ]);

  return <AboutEditor data={data} isAdmin={admin} />;
}
