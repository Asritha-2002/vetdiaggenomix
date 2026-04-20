const API_URL = import.meta.env.VITE_BASE_URL_ADMIN;

export const adminApi = {
    getUsers: async () => {
        const res = await fetch(`${API_URL}/users`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
    },
     getAppointments: async () => {
    const res = await fetch(`${API_URL}/appointments`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch appointments");
    return res.json();
  },
};