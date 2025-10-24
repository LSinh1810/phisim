import { Campaign } from '../models/Campaign.js';

export const trackClick = async (req, res) => {
  const { campaignId, email } = req.params;

  try {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).send("Không tìm thấy chiến dịch");

    campaign.clicks.push({ email: decodeURIComponent(email), clickedAt: new Date() });
    await campaign.save();

    res.send("<h1>Cảm ơn bạn đã nhấp vào liên kết!</h1>");
  } catch (err) {
    console.error("Lỗi khi theo dõi nhấp chuột: ", err);
    return res.status(500).send("Lỗi hệ thống");
  }
};
