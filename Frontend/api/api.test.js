import { API } from './api.js';

global.fetch = jest.fn();

describe('API Module', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('API.get debe retornar datos si la respuesta es exitosa', async () => {
    const mockData = [{ id: 1, nombre: 'Test' }];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });
    const data = await API.get('TestEndpoint');
    expect(data).toEqual(mockData);
  });

  it('API.get debe retornar un array vacio si hay error en la red', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    const data = await API.get('TestEndpoint');
    expect(data).toEqual([]); 
  });

  it('API.post debe enviar datos y retornar la respuesta', async () => {
    const mockResponse = { idReserva: 10 };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });
    const data = await API.post('TestEndpoint', { huesped: 1 });
    expect(data).toEqual(mockResponse);
  });

  it('API.post debe lanzar un error si la respuesta del backend falla', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Error del servidor' })
    });
    await expect(API.post('TestEndpoint', {})).rejects.toThrow('Error del servidor');
  });
});