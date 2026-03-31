const API_URL = "http://localhost:5036/api"; 

export const API = {
  async get(endpoint) {
    try {
      const res = await fetch(`${API_URL}/${endpoint}`);
      if (!res.ok) throw new Error(`Error al obtener ${endpoint}`);
      return await res.json();
    } catch (e) { console.error(e); return []; }
  },
  
  async post(endpoint, data) {
    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Error en la operación`);
    }
    return await res.json();
  }
};