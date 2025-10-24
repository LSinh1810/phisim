import { Campaign } from '../models/Campaign.js';
import nodemailer from 'nodemailer';

export const createCampaign = async (req, res) => {
  const { name, subject, message, recipients } = req.body;

  // Validation
  if (!name || !subject || !message || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
  }

  try {
    const campaign = await Campaign.create({
      name,
      subject,
      message,
      recipients,
      sentAt: new Date(),
    });

    // cấu hình gửi mail với Mailtrap
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.mailtrap.io",
      port: process.env.SMTP_PORT || 2525,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // gửi mail tới từng người nhận
    const emailResults = [];
    for (let email of recipients) {
      try {
        const trackUrl = `${process.env.BASE_URL}/api/track/${campaign._id}/${encodeURIComponent(email)}`;
        
        // Tạo nội dung email với tracking link
        const htmlMessage = message.replace(
          'href="#"',
          `href="${trackUrl}"`
        );

        // Cấu hình trường From
        const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@phishsim.com';
        const fromName = process.env.SMTP_FROM_NAME || 'PhishSim';
        
        const mailOptions = {
          from: `"${fromName}" <${fromEmail}>`,
          to: email,
          subject,
          html: htmlMessage,
        };

        const result = await transporter.sendMail(mailOptions);
        emailResults.push({ email, status: 'success', messageId: result.messageId });
        console.log(`Email sent successfully to ${email}:`, result.messageId);
        setTimeout(() => {}, 5000); // Thêm độ trễ nhỏ để tránh gửi quá nhanh
      } catch (emailError) {
        console.error(`Failed to send email to ${email}:`, emailError);
        emailResults.push({ email, status: 'failed', error: emailError.message });
      }
    }

    // Đếm số email gửi thành công và thất bại
    const successCount = emailResults.filter(r => r.status === 'success').length;
    const failedCount = emailResults.filter(r => r.status === 'failed').length;

    return res.json({ 
      message: `Đã gửi ${successCount}/${recipients.length} email thành công`, 
      campaign,
      emailResults: {
        total: recipients.length,
        success: successCount,
        failed: failedCount,
        details: emailResults
      }
    });
  } catch (error) {
    console.error("Lỗi khi tạo chiến dịch: ", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ sentAt: -1 });
    res.json(campaigns);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách chiến dịch: ", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findById(id);
    
    if (!campaign) {
      return res.status(404).json({ message: "Không tìm thấy chiến dịch" });
    }
    
    res.json(campaign);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết chiến dịch: ", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findByIdAndDelete(id);
    
    if (!campaign) {
      return res.status(404).json({ message: "Không tìm thấy chiến dịch" });
    }
    
    res.json({ message: "Đã xóa chiến dịch thành công", campaign });
  } catch (error) {
    console.error("Lỗi khi xóa chiến dịch: ", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const testEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Vui lòng cung cấp địa chỉ email" });
    }

    // Log cấu hình email để debug
    console.log('Email Configuration:');
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_FROM:', process.env.SMTP_FROM);
    console.log('SMTP_FROM_NAME:', process.env.SMTP_FROM_NAME);

    // Cấu hình transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.mailtrap.io",
      port: process.env.SMTP_PORT || 2525,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Cấu hình trường From cho test email
    const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@phishsim.com';
    const fromName = process.env.SMTP_FROM_NAME || 'PhishSim Test';
    
    // Test email
    const testMessage = {
      from: `"${fromName}" <${fromEmail}>`,
      to: email,
      subject: "Test Email - PhishSim",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #3b82f6;">✅ Test Email thành công!</h2>
          <p>Email này được gửi từ hệ thống PhishSim để kiểm tra cấu hình email.</p>
          <p><strong>Thời gian:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>SMTP Host:</strong> ${process.env.SMTP_HOST || "smtp.mailtrap.io"}</p>
          <p><strong>SMTP Port:</strong> ${process.env.SMTP_PORT || 2525}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Nếu bạn nhận được email này, cấu hình email đã hoạt động chính xác.
          </p>
        </div>
      `
    };

    const result = await transporter.sendMail(testMessage);
    
    res.json({ 
      message: "Test email đã được gửi thành công", 
      messageId: result.messageId,
      email: email
    });
  } catch (error) {
    console.error("Lỗi khi gửi test email: ", error);
    res.status(500).json({ 
      message: "Lỗi khi gửi test email", 
      error: error.message 
    });
  }
};
