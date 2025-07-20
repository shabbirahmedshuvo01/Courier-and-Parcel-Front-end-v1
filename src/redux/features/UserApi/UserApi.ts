/* eslint-disable @typescript-eslint/no-explicit-any */
import { createQueryParams } from "@/utils/paramsFuntion";
import { baseApi } from "../../api/baseApi";

const UserApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

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
        updateProfile: builder.mutation({
            query: (data) => ({
                url: "auth/profile",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["user"],
        }),
    }),
});

export const {
    useGetMyParcelsQuery,
    useCreateParcelMutation,
    useGetMyParcelsOfUserQuery,
    useGetMyParcelMainQuery,
    useUpdateProfileMutation,
} = UserApi;
