import tableApiRequest from "@/apiRequests/table"
import { UpdateTableBodyType } from "@/schemaValidations/table.schema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const usTableListQuery = () => {
    return useQuery({
        queryKey: ['tables'],
        queryFn: tableApiRequest.list
    })
}

export const useGetTableQuery = ({id, enabled}: {id: number, enabled?: boolean}) => {
    return useQuery({
        queryKey: ['tables', id],
        queryFn: () => tableApiRequest.getTable(id),
        enabled
    })
}

export const useAddTableMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: tableApiRequest.add,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['tables']
            })
        }
    })
}

export const useUpdateTableMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({id, ...body}: { id: number} & UpdateTableBodyType) => tableApiRequest.updateTable(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['tables'],
                exact: true
            })
        }
    })
}

export const useDeleteTableMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: tableApiRequest.deleteTable,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['tables']
            })
        }
    })
}