'use client'
import { useAppContext } from '@/components/app-provider'
import { Role } from '@/constants/type'
import { cn, handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { RoleType } from '@/types/jwt.types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const menuItems: { title: string; href: string;  hiddenWhenLogin?: boolean; role?: RoleType[] }[] = [
  {
    title: 'Trang chủ',
    href: '/'
  },
  {
    title: 'Menu',
    href: '/guest/menu',
    role: [Role.Guest]
  },
  {
    title: 'Đơn hàng',
    href: '/guest/orders',
    role: [Role.Guest]
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    hiddenWhenLogin: true
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    role: [Role.Owner, Role.Employee]
  }
]

export default function NavItems({ className }: { className?: string }) {
  const { role, setRole } = useAppContext()
  const logoutMutation = useLogoutMutation()
  const router = useRouter()

  const logout = () => {
    if (logoutMutation.isPending) return
    try {
      logoutMutation.mutateAsync()
      setRole()
      router.push('/')
    } catch (error: any) {
      handleErrorApi({
        error
      })
    }
  }
  return (
    <>
      {
        menuItems.map((item) => {
          //Trường hợp đăng nhập thì chỉ hiểm thị menu đăng nhập
          const isAuth = item.role && role && item.role.includes(role)
          //TH menu item có thể hiểm thị dù cho đã đăng nhập hay chưa
          const canShow = (item.role === undefined && !item.hiddenWhenLogin) || (!role && item.hiddenWhenLogin)
          if (isAuth || canShow) {
            return (
              <Link href={item.href} key={item.href} className={className}>
                {item.title}
              </Link>
            )
          } 
          return null
        })
      }
      {role && <div className={cn(className, 'cursor-pointer')} onClick={logout}>
        Đăng xuất
      </div>}
    </>
  )
}
