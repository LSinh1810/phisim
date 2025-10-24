import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, MousePointer, Calendar, Mail, ExternalLink, Trash2 } from 'lucide-react';
import api from '../api/axios';
import useCampaignStore from '../store/useCampaignStore';
import { toast } from 'sonner';

export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteCampaign } = useCampaignStore();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const res = await api.get(`/campaigns/${id}`);
      setCampaign(res.data);
    } catch (err) {
      console.error('Error fetching campaign:', err);
      toast.error('Không thể tải chi tiết chiến dịch');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa chiến dịch này?')) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteCampaign(campaign._id);
    
    if (result.success) {
      toast.success('Đã xóa chiến dịch thành công');
      navigate('/');
    } else {
      toast.error(result.error || 'Có lỗi xảy ra khi xóa chiến dịch');
    }
    
    setIsDeleting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-gray-400">Đang tải chi tiết chiến dịch...</span>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-white mb-2">Không tìm thấy chiến dịch</h2>
        <p className="text-gray-400 mb-4">Chiến dịch này có thể đã bị xóa hoặc không tồn tại.</p>
        <button
          onClick={() => navigate('/')}
          className="btn btn-primary"
        >
          Quay về trang chủ
        </button>
      </div>
    );
  }

  const clickRate = campaign.recipients?.length > 0 
    ? ((campaign.clicks?.length || 0) / campaign.recipients.length * 100).toFixed(1)
    : 0;

  const getStatusColor = (rate) => {
    if (rate >= 50) return 'text-red-400';
    if (rate >= 25) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getStatusText = (rate) => {
    if (rate >= 50) return 'Rủi ro cao';
    if (rate >= 25) return 'Rủi ro trung bình';
    return 'Rủi ro thấp';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{campaign.name}</h1>
            <p className="text-gray-400">{campaign.subject}</p>
          </div>
        </div>
        
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
              <span>Đang xóa...</span>
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              <span>Xóa chiến dịch</span>
            </>
          )}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Người nhận</p>
              <p className="text-xl font-bold text-white">{campaign.recipients?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <MousePointer className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Lượt nhấp</p>
              <p className="text-xl font-bold text-white">{campaign.clicks?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <ExternalLink className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Tỷ lệ nhấp</p>
              <p className="text-xl font-bold text-white">{clickRate}%</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Ngày tạo</p>
              <p className="text-sm font-semibold text-white">
                {new Date(campaign.sentAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Đánh giá rủi ro</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(clickRate).replace('text-', 'bg-')}`}></div>
            <span className={`font-medium ${getStatusColor(clickRate)}`}>
              {getStatusText(clickRate)}
            </span>
          </div>
          <div className="text-sm text-gray-400">
            {clickRate}% người nhận đã nhấp vào liên kết
          </div>
        </div>
        
        <div className="mt-4">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(clickRate, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Email Content Preview */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Nội dung email</h3>
        <div className="bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
          <div dangerouslySetInnerHTML={{ __html: campaign.message }} />
        </div>
      </div>

      {/* Recipients List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Danh sách người nhận</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {campaign.recipients?.map((email, index) => {
            const hasClicked = campaign.clicks?.some(click => click.email === email);
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-white">{email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {hasClicked ? (
                    <span className="text-green-400 text-sm">✓ Đã nhấp</span>
                  ) : (
                    <span className="text-gray-400 text-sm">Chưa nhấp</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Click History */}
      {campaign.clicks?.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Lịch sử nhấp chuột</h3>
          <div className="space-y-3">
            {campaign.clicks.map((click, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <MousePointer className="w-4 h-4 text-purple-400" />
                  <span className="text-white">{click.email}</span>
                </div>
                <span className="text-gray-400 text-sm">
                  {new Date(click.clickedAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
