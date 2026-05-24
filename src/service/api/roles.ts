import { api } from "@/lib/axios";

export interface Role {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export const rolesService = {
  /**
   * Get all available roles
   * GET /roles
   */
  getRoles: async (): Promise<Role[]> => {
    try {
      const response = await api.get<Role[]>("/role");
      return response.data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  },
};
