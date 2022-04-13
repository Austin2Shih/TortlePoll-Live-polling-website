import useSWR from "swr";

async function fetcher(route) {
    /* our token cookie gets sent with this request */
    return fetch(route)
        .then((r) => r.ok && r.json())
        .then((user) => user || null);
}

export default function useAuth() {
    
    const { data: user, error, mutate } = useSWR("/api/user", fetcher);
    const loading = user === undefined;

    return {
        user,
        loading,
        error,
    };
}