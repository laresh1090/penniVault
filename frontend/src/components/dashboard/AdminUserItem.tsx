import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";
import { formatDate } from "@/lib/formatters";

interface AdminUserItemProps {
  name: string;
  email: string;
  role: "user" | "vendor";
  joinedAt: string;
}

export default function AdminUserItem({
  name,
  email,
  role,
  joinedAt,
}: AdminUserItemProps) {
  return (
    <div className="admin-user-item">
      <div className="admin-user-avatar">{getInitials(name)}</div>
      <div className="admin-user-info">
        <span className="admin-user-name">{name}</span>
        <span className="admin-user-email">{email}</span>
      </div>
      <span className={cn("admin-user-role", role)}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
      <span className="admin-user-date">Joined {formatDate(joinedAt)}</span>
    </div>
  );
}
