import { create } from 'zustand';
import api from '../api/axios';

const useCampaignStore = create((set) => ({
  campaigns: [],
  loading: false,
  error: null,
  fetchCampaigns: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/campaigns');
      set({ campaigns: res.data, loading: false });
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      set({ 
        error: err?.response?.data?.message || err.message || 'Có lỗi xảy ra', 
        loading: false 
      });
    }
  },
  addCampaignLocally: (campaign) => set((s) => ({ campaigns: [campaign, ...s.campaigns] })),
  removeCampaignLocally: (campaignId) => set((s) => ({ 
    campaigns: s.campaigns.filter(c => c._id !== campaignId) 
  })),
  deleteCampaign: async (campaignId) => {
    try {
      await api.delete(`/campaigns/${campaignId}`);
      set((s) => ({ 
        campaigns: s.campaigns.filter(c => c._id !== campaignId) 
      }));
      return { success: true };
    } catch (err) {
      console.error('Error deleting campaign:', err);
      return { 
        success: false, 
        error: err?.response?.data?.message || err.message || 'Có lỗi xảy ra' 
      };
    }
  },
}));

export default useCampaignStore;
