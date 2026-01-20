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
  reducerPath: 'superheroApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
  endpoints: (builder) => ({
    getSuperheroes: builder.query<SuperheroesResponse, void>({
      query: () => '/superheroes',
    }),
  }),
});

export const { useGetSuperheroesQuery } = superheroesApi;