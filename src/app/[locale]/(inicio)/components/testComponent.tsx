'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

type GitHubUser = {
  login: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
};

async function fetchGitHubUser(): Promise<GitHubUser> {
  const response = await axios.get('https://api.github.com/users/sebasmd-projects');
  return response.data;
}

export default function TestComponents() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['githubUser'],
    queryFn: fetchGitHubUser,
  });

  if (error) {
    toast.error('Error al cargar el usuario de GitHub');
    return <p className="text-red-500">Hubo un error al obtener los datos.</p>;
  }

  if (!isLoading) {
    toast.success('Datos cargados exitosamente');
  }

  return (
    <div className="mt-4 w-72 rounded-lg border p-4 shadow">
      <h3 className="text-lg font-semibold">
        {isLoading ? <span className="inline-block h-4 w-24 animate-pulse rounded bg-gray-300" /> : data?.login}
      </h3>
      <div className="my-2">
        {isLoading ? (
          <div className="size-24 animate-pulse rounded-full bg-gray-300" />
        ) : (
          <img alt={data?.login} className="size-24 rounded-full" src={data?.avatar_url} />
        )}
      </div>
      <p>
        {isLoading ? (
          <span className="inline-block h-4 w-32 animate-pulse rounded bg-gray-300" />
        ) : (
          `Repositorios públicos: ${data?.public_repos}`
        )}
      </p>
      {!isLoading ? (
        <a className="text-blue-500 hover:underline" href={data?.html_url}>
          Ver en GitHub
        </a>
      ) : (
        <span className="inline-block h-4 w-20 animate-pulse rounded bg-gray-300" />
      )}
    </div>
  );
}
