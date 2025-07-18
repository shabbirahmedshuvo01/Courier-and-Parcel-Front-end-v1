/* eslint-disable @typescript-eslint/no-explicit-any */
export const createQueryParams = (params: { [key: string]: any }) => {
    const queryParams = new URLSearchParams();

    // console.log(params)

    Object.entries(params).forEach(([key, value]) => {
        // console.log({ key, value })
        if (value && value != null || (typeof value === 'string' && value.length !== 0)) {
            queryParams.append(key, value);
        }
    });

    // Return the query string if there are any parameters
    return queryParams.toString() ? `?${queryParams.toString()}` : '';
};