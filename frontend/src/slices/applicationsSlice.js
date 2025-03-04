import {APPLICATIONS_URL} from '../constants';
import {apiSlice} from './apiSlice';

export const applicationsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getApplications: builder.query({
            query: () => ({
                url: APPLICATIONS_URL,
            }),
            keepUnusedDataFor: 5
        })
    }),
});


export const {useGetApplicationsQuery} = applicationsApiSlice;
