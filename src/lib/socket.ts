import envConfig from '@/config'
import { io } from 'socket.io-client'
import { getAccessTokenFromLS } from './utils'

const socket = io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
    auth: {
        Authorization: `Bearer ${getAccessTokenFromLS}`
    }
})

export default socket