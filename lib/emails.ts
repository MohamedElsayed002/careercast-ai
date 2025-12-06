// Subscription Active Email
export const getSubscriptionActiveEmail = (userName: string) => {
    const subject = 'Welcome to Podcast Generator Pro! 🎙️';
    const text = `Hello ${userName},\n\nYour subscription to Podcast Generator Pro is now active! We're excited to have you on board.\n\nYou now have access to all premium features.\n\nIf you have any questions, feel free to reach out to our support team.\n\nBest regards,\nThe Podcast Generator Pro Team`;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">🎙️ Welcome Aboard!</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                                Hello <strong>${userName}</strong>,
                            </p>
                            
                            <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                                Great news! Your subscription to <strong>Podcast Generator Pro</strong> is now active. We're thrilled to have you as part of our community! 🎉
                            </p>
                            
                            <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 4px;">
                                <h3 style="margin: 0 0 15px; color: #667eea; font-size: 18px;">What's Next?</h3>
                                <ul style="margin: 0; padding-left: 20px; color: #555555; line-height: 1.8;">
                                    <li>Access all premium features</li>
                                    <li>Create unlimited podcasts</li>
                                    <li>Enjoy priority support</li>
                                    <li>Get early access to new features</li>
                                </ul>
                            </div>
                            
                            <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                                If you have any questions or need assistance getting started, our support team is here to help!
                            </p>
                            
                            <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                Best regards,<br>
                                <strong>The Podcast Generator Pro Team</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.5;">
                                You're receiving this email because you subscribed to Podcast Generator Pro.<br>
                                © ${new Date().getFullYear()} Podcast Generator Pro. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    return { subject, text, html };
};

// Subscription Cancelled Email
export const getSubscriptionCancelledEmail = (userName: string) => {
    const subject = 'We\'re Sorry to See You Go';
    const text = `Hello ${userName},\n\nYour subscription to Podcast Generator Pro has been cancelled.\n\nWe're sorry to see you go! Your feedback is valuable to us, and we'd love to know what we could have done better.\n\nIf you cancelled by mistake or change your mind, you can reactivate your subscription anytime.\n\nThank you for being part of our community.\n\nBest regards,\nThe Podcast Generator Pro Team`;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #495057; padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 600;">We're Sorry to See You Go</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                                Hello <strong>${userName}</strong>,
                            </p>
                            
                            <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                                Your subscription to <strong>Podcast Generator Pro</strong> has been successfully cancelled. We're sad to see you go, but we understand that needs change.
                            </p>
                            
                            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 30px 0; border-radius: 4px;">
                                <h3 style="margin: 0 0 10px; color: #856404; font-size: 18px;">Help Us Improve</h3>
                                <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                                    We'd love to hear your feedback! What could we have done better? Your insights help us improve for future users.
                                </p>
                            </div>
                            
                            <div style="background-color: #f8f9fa; padding: 20px; margin: 30px 0; border-radius: 4px; text-align: center;">
                                <p style="margin: 0 0 15px; color: #666666; font-size: 14px;">
                                    Changed your mind? You can reactivate your subscription anytime.
                                </p>
                                <a href="#" style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 4px; font-weight: 600; font-size: 14px;">Reactivate Subscription</a>
                            </div>
                            
                            <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                                Thank you for being part of our community. We hope to see you again in the future!
                            </p>
                            
                            <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                Best regards,<br>
                                <strong>The Podcast Generator Pro Team</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.5;">
                                This is a confirmation that your subscription has been cancelled.<br>
                                © ${new Date().getFullYear()} Podcast Generator Pro. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    return { subject, text, html };
};


export const getPodcastGeneratedEmail = (userName: string, podcastTitle: string, podcastUrl: string) => {
    const subject = '🎙️ Your Podcast is Ready!';
    const text = `Hello ${userName},\n\nGreat news! Your podcast "${podcastTitle}" has been generated and is ready to listen.\n\nYou can access it here: ${podcastUrl}\n\nEnjoy your podcast!\n\nBest regards,\nThe Podcast Generator Pro Team`;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">🎙️ Your Podcast is Ready!</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                                Hello <strong>${userName}</strong>,
                            </p>
                            
                            <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                                Great news! Your podcast has been successfully generated and is ready to listen. 🎉
                            </p>
                            
                            <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 4px;">
                                <h3 style="margin: 0 0 10px; color: #667eea; font-size: 18px;">📻 ${podcastTitle}</h3>
                                <p style="margin: 0; color: #666666; font-size: 14px;">
                                    Your AI-generated podcast is now available
                                </p>
                            </div>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${podcastUrl}" style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);">
                                    Listen Now
                                </a>
                            </div>
                            
                            <div style="background-color: #e7f3ff; padding: 20px; margin: 30px 0; border-radius: 4px;">
                                <p style="margin: 0; color: #0056b3; font-size: 14px; line-height: 1.6;">
                                    <strong>💡 Tip:</strong> Don't forget to download the accompanying PDF summary for key points, vocabulary, and exercises!
                                </p>
                            </div>
                            
                            <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                                Enjoy your podcast, and feel free to create more anytime!
                            </p>
                            
                            <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                Best regards,<br>
                                <strong>The Podcast Generator Pro Team</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.5;">
                                You're receiving this email because you generated a podcast.<br>
                                © ${new Date().getFullYear()} Podcast Generator Pro. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    return { subject, text, html };
};

// Email Verification Email
export const getEmailVerificationEmail = (userName: string, verificationUrl: string) => {
    const subject = 'Verify your CareerCast AI email address';
    const text = `Hello ${userName},\n\nWelcome to CareerCast AI! Please verify your email address by clicking the link below:\n\n${verificationUrl}\n\nThis link will expire in 24 hours for security reasons.\n\nIf you didn't create an account with us, please ignore this email.\n\nBest regards,\nThe CareerCast AI Team`;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">✉️ Verify Your Email</h1>
                            <p style="margin: 10px 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">Welcome to CareerCast AI!</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                                Hello <strong>${userName}</strong>,
                            </p>
                            
                            <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                                Thank you for signing up for <strong>CareerCast AI</strong>! To complete your registration and start using our platform, please verify your email address by clicking the button below.
                            </p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${verificationUrl}" style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3); transition: background-color 0.3s;">
                                    Verify Email Address
                                </a>
                            </div>
                            
                            <div style="background-color: #e7f3ff; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 4px;">
                                <p style="margin: 0 0 10px; color: #0056b3; font-size: 14px; font-weight: 600;">🔒 Security Note</p>
                                <p style="margin: 0; color: #0056b3; font-size: 14px; line-height: 1.6;">
                                    This verification link will expire in 24 hours for your security. If you didn't create an account with us, please ignore this email.
                                </p>
                            </div>
                            
                            <div style="background-color: #f8f9fa; padding: 20px; margin: 30px 0; border-radius: 4px;">
                                <p style="margin: 0 0 10px; color: #667eea; font-size: 16px; font-weight: 600;">Button not working?</p>
                                <p style="margin: 0 0 10px; color: #666666; font-size: 14px; line-height: 1.6;">
                                    Copy and paste this link into your browser:
                                </p>
                                <p style="margin: 0; word-break: break-all; color: #667eea; font-size: 12px; line-height: 1.6;">
                                    ${verificationUrl}
                                </p>
                            </div>
                            
                            <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                Best regards,<br>
                                <strong>The CareerCast AI Team</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.5;">
                                You're receiving this email because you signed up for CareerCast AI.<br>
                                © ${new Date().getFullYear()} CareerCast AI. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    return { subject, text, html };
};