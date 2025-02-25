import { useLogoutMutation } from "@/queries/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppStore } from "./app-provider";
import { handleErrorApi } from "@/lib/utils";
const UNAUTHENTICATED_PATH = ['/login', '/logout', '/refresh-token'];

const ListenLogoutSocket = () => {
    const pathname = usePathname();
    const router  = useRouter();
    const logoutMutation = useLogoutMutation()
    const setRole = useAppStore(state => state.setRole)
    const disconnectSocket = useAppStore(state => state.disconnectSocket)
    const socket = useAppStore(state => state.socket)
    
    useEffect(() => { 
        if (UNAUTHENTICATED_PATH.includes(pathname)) {
            return
        }

        async function onLogout() {
            if (logoutMutation.isPending) return
                try {
                  logoutMutation.mutateAsync()
                  setRole()
                  disconnectSocket()
                  router.push('/')
                } catch (error: any) {
                  handleErrorApi({
                    error
                  })
                }
        }

        socket?.on('logout', onLogout);

        return () => {
            socket?.off('logout', onLogout);
        }
    }, [socket, pathname, setRole, disconnectSocket, router, logoutMutation])
  return (
    <div>
      
    </div>
  )
}

export default ListenLogoutSocket
