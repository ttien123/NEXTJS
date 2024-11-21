import accountApiRequest from "@/apiRequests/account"
import dishApiRequest from "@/apiRequests/dist"
import { UpdateDishBodyType } from "@/schemaValidations/dish.schema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const usDistListQuery = () => {
    return useQuery({
        queryKey: ['dishes'],
        queryFn: dishApiRequest.list
    })
}

export const useGetDishQuery = ({id, enabled}: {id: number, enabled?: boolean}) => {
    return useQuery({
        queryKey: ['dishes', id],
        queryFn: () => dishApiRequest.getDish(id),
        enabled
    })
}

export const useAddDishMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: dishApiRequest.add,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['dishes']
            })
        }
    })
}

export const useUpdateDishMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({id, ...body}: { id: number} & UpdateDishBodyType) => dishApiRequest.updateDish(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['dishes'],
                exact: true
            })
        }
    })
}

export const useDeleteDishMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: dishApiRequest.deleteDish,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['dishes']
            })
        }
    })
}