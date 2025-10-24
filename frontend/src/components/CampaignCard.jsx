import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Users, MousePointer, Calendar, Mail, Eye, Trash2 } from 'lucide-react';
import useCampaignStore from '../store/useCampaignStore';
import { toast } from 'sonner';

export default function CampaignCard({ campaign }) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteCampaign } = useCampaignStore();
  
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

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa chiến dịch này?')) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteCampaign(campaign._id);
    
    if (result.success) {
      toast.success('Đã xóa chiến dịch thành công');
    } else {
      toast.error(result.error || 'Có lỗi xảy ra khi xóa chiến dịch');
    }
    
    setIsDeleting(false);
  };

  const handleView = () => {
    navigate(`/campaign/${campaign._id}`);
  };

  return (
    <div className="card group hover:scale-105 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
            {campaign.name}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2">{campaign.subject}</p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <div className="text-xs text-gray-500">
            {new Date(campaign.sentAt).toLocaleDateString()}
          </div>
          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Người nhận</p>
            <p className="text-sm font-semibold text-white">{campaign.recipients?.length || 0}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <MousePointer className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Lượt nhấp</p>
            <p className="text-sm font-semibold text-white">{campaign.clicks?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Click Rate & Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          <span className="text-xs text-gray-400">
            {clickRate}% tỷ lệ nhấp
          </span>
        </div>
        <div className={`text-xs font-medium ${getStatusColor(clickRate)}`}>
          {getStatusText(clickRate)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(clickRate, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Recent Activity */}
      {campaign.clicks?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Lần nhấp gần nhất</span>
            <span>
              {new Date(campaign.clicks[campaign.clicks.length - 1].clickedAt).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
        <button
          onClick={handleView}
          className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
        >
          <Eye className="w-4 h-4" />
          <span>Xem chi tiết</span>
        </button>
        
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
              <span>Đang xóa...</span>
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              <span>Xóa</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
