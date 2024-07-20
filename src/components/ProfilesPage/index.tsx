import { User } from "@/app/lib/definitions";
import { userInfo } from "../UserContext";

const ProfilePage: React.FC<User> = (user) => {
  user = userInfo();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{user.name}'s Profile</h1>
      <div className="space-y-2">
        <p>
          <strong>User ID:</strong> {user.id}
        </p>
        <p>
          <strong>Login Account:</strong> {user.loginAct}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        {/* 添加其他可用的用户信息字段 */}
      </div>
    </div>
  );
};

export default ProfilePage;
