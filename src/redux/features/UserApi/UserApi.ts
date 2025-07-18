/* eslint-disable @typescript-eslint/no-explicit-any */
import { createQueryParams } from "@/utils/paramsFuntion";
import { baseApi } from "../../api/baseApi";

const UserApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // getAllExample: builder.query({
        //     query: (data) => {
        //         const params = new URLSearchParams();
        //         if (data?.queryObj) {
        //             data?.queryObj.forEach((item: any) => {
        //                 params.append(item.name, item.value as string);
        //             });
        //         }
        //         return {
        //             url: `example`,
        //             method: "GET",
        //             params: params,
        //         };
        //     },
        //     providesTags: ["example"],
        // }),
        // getSingleExample: builder.query({
        //     query: (id) => ({
        //         url: `example/${id}`,
        //         method: "GET",
        //     }),
        //     providesTags: ["example"],
        // }),

        // createExample: builder.mutation({
        //     query: (data) => {
        //         return {
        //             url: "example",
        //             method: "POST",
        //             body: data,
        //         };
        //     },
        //     invalidatesTags: ["example"],
        // }),

        // updateExample: builder.mutation({
        //     query: (data) => {
        //         return {
        //             url: `example/${data?.id}`,
        //             method: "POST",
        //             body: data?.formData,
        //         };
        //     },
        //     invalidatesTags: ["example"],
        // }),
        // deleteExample: builder.mutation({
        //     query: (id) => {
        //         return {
        //             url: `example/${id}`,
        //             method: "DELETE",
        //         };
        //     },
        //     invalidatesTags: ["example"],
        // }),

        getMyParcels: builder.query({
            query: ({ queryData }) => {
                const queryParams = createQueryParams(queryData);
                return {
                    url: `parcels/my-parcels${queryParams}`,
                    method: "GET",
                };
            },
            providesTags: ["parcels"],
        }),
        createParcel: builder.mutation({
            query: (data) => ({
                url: "parcels",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["parcels"],
        }),
        getMyParcelsOfUser: builder.query({
            query: ({ queryData }) => {
                const queryParams = createQueryParams(queryData);
                return {
                    url: `parcels${queryParams}`,
                    method: "GET",
                };
            },
            providesTags: ["parcels"],
        }),
        getMyParcelMain: builder.query({
            query: ({ queryData }) => {
                const queryParams = createQueryParams(queryData);
                return {
                    url: `parcels/my-parcels${queryParams}`,
                    method: "GET",
                };
            },
            providesTags: ["parcels"],
        }),
    }),
});

export const {
    // useCreateExampleMutation,
    // useGetAllExampleQuery,
    // useGetSingleExampleQuery,
    // useUpdateExampleMutation,
    // useDeleteExampleMutation,
    useGetMyParcelsQuery,
    useCreateParcelMutation,
    useGetMyParcelsOfUserQuery,
    useGetMyParcelMainQuery,
} = UserApi;
