import { EditProfileForm } from "@/components/PersonPage/EditProfileForm";
import { User } from "@/app/lib/definitions";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/app/lib/action";

export default async function EditProfilePage() {
  const router = useRouter();
  const { data } = await getUserInfo();

  if (!data) {
    return router.push("/login");
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">编辑个人资料</h1>
      <EditProfileForm user={data} />
    </div>
  );
}
