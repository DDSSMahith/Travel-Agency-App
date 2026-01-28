
import { VisaAlert, AlertStatus, VisaType, BackendResponse } from './types';

/**
 * FILE STORAGE SIMULATION
 * In a real Node.js environment, this would use fs.readFileSync and fs.writeFileSync.
 * We use localStorage to persist 'alerts.json' content across sessions.
 */
const FILE_NAME = 'alerts.json';

const readFromFile = async (): Promise<VisaAlert[]> => {
  // Simulate network/disk latency
  await new Promise(resolve => setTimeout(resolve, 300));
  const content = localStorage.getItem(FILE_NAME);
  return content ? JSON.parse(content) : [];
};

const writeToFile = async (data: VisaAlert[]): Promise<void> => {
  // Simulate disk write latency
  await new Promise(resolve => setTimeout(resolve, 200));
  localStorage.setItem(FILE_NAME, JSON.stringify(data));
};

/**
 * CENTRALIZED ERROR HANDLING & MIDDLEWARE
 */
const logger = (method: string, url: string, status: number) => {
  const timestamp = new Date().toISOString();
  console.log(`%c[${timestamp}] ${method} ${url} - ${status}`, 'color: #10b981; font-weight: bold');
};

const validateAlert = (data: any): string | null => {
  if (!data.country || data.country.trim().length < 2) return "Country name too short";
  if (!data.city || data.city.trim().length < 2) return "City name too short";
  if (!Object.values(VisaType).includes(data.visaType)) return "Invalid visa type";
  return null;
};

/**
 * ROUTE HANDLERS (Simulated Express Routes)
 */
export const backend = {
  // GET /alerts
  getAlerts: async (filters: { country?: string; status?: string } = {}): Promise<BackendResponse<VisaAlert[]>> => {
    try {
      let alerts = await readFromFile();
      
      if (filters.country) {
        alerts = alerts.filter(a => a.country.toLowerCase().includes(filters.country!.toLowerCase()));
      }
      if (filters.status) {
        alerts = alerts.filter(a => a.status === filters.status);
      }
      
      const sorted = alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      logger('GET', '/alerts', 200);
      return { data: sorted };
    } catch (err) {
      logger('GET', '/alerts', 500);
      return { error: 'Internal Server Error: Could not read alerts file.' };
    }
  },

  // POST /alerts
  createAlert: async (payload: Omit<VisaAlert, 'id' | 'createdAt' | 'status'>): Promise<BackendResponse<VisaAlert>> => {
    const validationError = validateAlert(payload);
    if (validationError) {
      logger('POST', '/alerts', 400);
      return { error: validationError };
    }

    try {
      const alerts = await readFromFile();
      const newAlert: VisaAlert = {
        ...payload,
        id: `visa-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        status: AlertStatus.ACTIVE
      };
      
      alerts.push(newAlert);
      await writeToFile(alerts);
      logger('POST', '/alerts', 201);
      return { data: newAlert, message: 'Alert created successfully' };
    } catch (err) {
      logger('POST', '/alerts', 500);
      return { error: 'Failed to write to alerts file.' };
    }
  },

  // PUT /alerts/:id
  updateStatus: async (id: string, status: AlertStatus): Promise<BackendResponse<VisaAlert>> => {
    try {
      const alerts = await readFromFile();
      const index = alerts.findIndex(a => a.id === id);
      
      if (index === -1) {
        logger('PUT', `/alerts/${id}`, 404);
        return { error: 'Alert not found' };
      }
      
      alerts[index].status = status;
      await writeToFile(alerts);
      logger('PUT', `/alerts/${id}`, 200);
      return { data: alerts[index] };
    } catch (err) {
      logger('PUT', `/alerts/${id}`, 500);
      return { error: 'Failed to update alerts file.' };
    }
  },

  // DELETE /alerts/:id
  deleteAlert: async (id: string): Promise<BackendResponse<null>> => {
    try {
      const alerts = await readFromFile();
      const initialLength = alerts.length;
      const filtered = alerts.filter(a => a.id !== id);
      
      if (initialLength === filtered.length) {
        logger('DELETE', `/alerts/${id}`, 404);
        return { error: 'Alert not found' };
      }
      
      await writeToFile(filtered);
      logger('DELETE', `/alerts/${id}`, 200);
      return { message: 'Alert deleted successfully' };
    } catch (err) {
      logger('DELETE', `/alerts/${id}`, 500);
      return { error: 'Failed to delete from alerts file.' };
    }
  }
};
