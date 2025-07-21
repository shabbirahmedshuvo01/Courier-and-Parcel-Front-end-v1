/* eslint-disable @typescript-eslint/no-explicit-any */
import { createQueryParams } from "@/utils/paramsFuntion";
import { baseApi } from "../../api/baseApi";

const AdminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllParcels: builder.query({
            query: ({ queryData }) => {
                const queryParams = createQueryParams(queryData);
                return {
                    url: `/parcels${queryParams}`,
                    method: "GET",
                };
            },
            providesTags: ["admin"],
        }),
        assignAgentToParcel: builder.mutation({
            query: ({ parcelId, agentId }) => ({
                url: `/parcels/${parcelId}/assign-agent`,
                method: "PATCH",
                body: { agentId },
            }),
            invalidatesTags: ["admin"],
        }),
        updateParcelStatus: builder.mutation({
            query: ({ parcelId, status }) => ({
                url: `/parcels/${parcelId}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["admin"],
        }),
        deleteParcel: builder.mutation({
            query: (parcelId) => ({
                url: `/parcels/${parcelId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["admin"],
        }),
        getAllUsers: builder.query({
            query: ({ queryData }) => {
                const queryParams = createQueryParams(queryData);
                return {
                    url: `/users${queryParams}`,
                    method: "GET",
                };
            },
            providesTags: ["admin"],
        }),
    }),
});

export const {
    useGetAllParcelsQuery,
    useAssignAgentToParcelMutation,
    useUpdateParcelStatusMutation,
    useDeleteParcelMutation,
    useGetAllUsersQuery,
} = AdminApi;