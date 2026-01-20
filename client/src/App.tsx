import { useGetSuperheroesQuery } from './features/superheroesApi';

function App() {
  const { data, error, isLoading } = useGetSuperheroesQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: Something went wrong</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Superheroes List</h1>
      <ul>
        {data?.data?.map((hero) => (
          <li key={hero._id}>
            <strong>{hero.nickname}</strong> — {hero.real_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;