"use client";
import { Role } from "@/constants/type";
import { cn, handleErrorApi } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { RoleType } from "@/types/jwt.types";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAppStore } from "@/components/app-provider";
import { Link } from "@/i18n/routing";
const menuItems: {
  title: string;
  href: string;
  hiddenWhenLogin?: boolean;
  role?: RoleType[];
}[] = [
  {
    title: "Trang chủ",
    href: "/",
  },
  {
    title: "Menu",
    href: "/guest/menu",
    role: [Role.Guest],
  },
  {
    title: "Đơn hàng",
    href: "/guest/orders",
    role: [Role.Guest],
  },
  {
    title: "Đăng nhập",
    href: "/login",
    hiddenWhenLogin: true,
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    role: [Role.Owner, Role.Employee],
  },
];

export default function NavItems({ className }: { className?: string }) {
  const role = useAppStore(state => state.role);
  const setRole = useAppStore(state => state.setRole);
  const disconnectSocket = useAppStore(state => state.disconnectSocket);
  const logoutMutation = useLogoutMutation();
  const router = useRouter();

  const logout = () => {
    if (logoutMutation.isPending) return;
    try {
      logoutMutation.mutateAsync();
      setRole();
      disconnectSocket();
      router.push("/");
    } catch (error: any) {
      handleErrorApi({
        error,
      });
    }
  };
  return (
    <>
      {menuItems.map((item) => {
        //Trường hợp đăng nhập thì chỉ hiểm thị menu đăng nhập
        const isAuth = item.role && role && item.role.includes(role);
        //TH menu item có thể hiểm thị dù cho đã đăng nhập hay chưa
        const canShow =
          (item.role === undefined && !item.hiddenWhenLogin) ||
          (!role && item.hiddenWhenLogin);
        if (isAuth || canShow) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {item.title}
            </Link>
          );
        }
        return null;
      })}
      {role && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className={cn(className, "cursor-pointer")}>
              Đăng xuất
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có muốn đăng xuất không</AlertDialogTitle>
              <AlertDialogDescription>
                Việc đăng xuất có thể làm mất đi hóa đơn của bạn
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Thoát</AlertDialogCancel>
              <AlertDialogAction onClick={logout}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
