import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Superhero {
  _id: string;
  nickname: string;
  real_name: string;
  origin_description: string;
  superpowers: string;
  catch_phrase: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

interface SuperheroesResponse {
  data: Superhero[];
  total: number;
  page: number;
  lastPage: number;
}

export const superheroesApi = createApi({
  reducerPath: 'superheroesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
  tagTypes: ['Superhero'],
  endpoints: (builder) => ({
    getSuperheroes: builder.query<SuperheroesResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => `/superheroes?page=${page}&limit=${limit}`,
      providesTags: ['Superhero'],
    }),
    getSuperheroById: builder.query<Superhero, string>({
      query: (id) => `/superheroes/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Superhero', id }],
    }),
    createSuperhero: builder.mutation<Superhero, Partial<Superhero>>({
      query: (body) => ({
        url: '/superheroes',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Superhero'],
    }),
    updateSuperhero: builder.mutation<Superhero, { id: string; body: Partial<Superhero> }>({
      query: ({ id, body }) => ({
        url: `/superheroes/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => ['Superhero', { type: 'Superhero', id }],
    }),
    deleteSuperhero: builder.mutation<{ deleted: boolean }, string>({
      query: (id) => ({
        url: `/superheroes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Superhero'],
    }),
  }),
});

export const { 
  useGetSuperheroesQuery, 
  useGetSuperheroByIdQuery,
  useCreateSuperheroMutation, 
  useUpdateSuperheroMutation, 
  useDeleteSuperheroMutation 
} = superheroesApi;