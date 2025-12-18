import { ENV } from '../config/env.config.js';

//* Function to generate mail options for food delivery service
export default function generateMailOptions({ user, otp, type, companyName }) {
  // Food delivery themed color palette
  const colors = {
    primary: '#FF6B35',
    secondary: '#4ECDC4',
    accent: '#FFE66D',
    background: '#F8F9FA',
    dark: '#2F4858',
    success: '#38B44A',
    warning: '#FF9500',
    muted: '#6C757D',
  };

  // Base container styles
  const containerStyles = `
    font-family: 'Poppins', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: ${colors.dark};
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    border-radius: 12px;
    background: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.1);
  `;

  // Header styles with food theme
  const headerStyles = `
    color: ${colors.primary};
    font-size: 1.875rem;
    font-weight: 700;
    margin: 0 0 1.5rem 0;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid ${colors.accent};
    text-align: center;
  `;

  // OTP display styles
  const otpStyles = `
    background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.warning} 100%);
    color: white;
    padding: 1.25rem 2rem;
    font-size: 1.75rem;
    font-weight: 800;
    letter-spacing: 0.75rem;
    text-align: center;
    margin: 2.5rem auto;
    border-radius: 12px;
    display: inline-block;
    box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
    border: 2px solid ${colors.accent};
  `;

  // Button styles for food delivery actions
  const buttonStyles = `
    display: inline-block;
    padding: 1rem 2rem;
    background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.warning} 100%);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    margin: 1.5rem 0;
    border: none;
    cursor: pointer;
    text-align: center;
    box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
    transition: all 0.3s ease;
  `;

  // Footer styles
  const footerStyles = `
    margin-top: 2.5rem;
    padding-top: 1.5rem;
    border-top: 2px solid ${colors.accent};
    font-size: 0.85rem;
    color: ${colors.muted};
    text-align: center;
  `;

  // Food icon decoration
  const foodIcon = `🍔🍕🥗`;

  // Greeting component
  const greeting = `<p style="margin-bottom: 1.5rem; font-size: 1.1rem;">Hello <strong style="color: ${colors.primary};">${user.fullName}</strong>,</p>`;

  let subject, textMessage, htmlMessage;

  switch (type) {
    case 'welcome':
      subject = `🎉 Welcome to ${companyName}! Get Ready to Feast!`;
      textMessage = `Welcome to ${companyName}! Your account has been created successfully. Enjoy delicious meals delivered to your doorstep!`;
      htmlMessage = `
        <div style="${containerStyles}">
          <div style="text-align: center; margin-bottom: 1.5rem;">
            <span style="font-size: 2rem;">🍔🍕🥗</span>
          </div>
          <h1 style="${headerStyles}">Welcome to ${companyName}!</h1>
          ${greeting}
          <p style="margin-bottom: 1rem;">Get ready to embark on a culinary journey! Your account has been successfully created and you're just moments away from enjoying delicious meals delivered right to your door.</p>
          
          <p style="text-align: center; margin: 2rem 0;">
            <a href="${
              ENV.FRONTEND_URL
            }" style="${buttonStyles} onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">Start Ordering Now</a>
          </p>
          
          <div style="${footerStyles}">
            <p style="margin: 0.5rem 0;">Hungry for help? Contact us: <a href="mailto:support@${companyName
              .toLowerCase()
              .replace(/\s/g, '')}.com" style="color: ${
        colors.primary
      }; text-decoration: none;">support@${companyName.toLowerCase().replace(/\s/g, '')}.com</a></p>
            <p style="margin: 0.5rem 0;">© ${new Date().getFullYear()} ${companyName}. Good food, delivered fast. 🚀</p>
          </div>
        </div>
      `;
      break;

    case 'verifyUser':
      subject = `🔐 Your ${companyName} Verification Code - Let's Get You Fed!`;
      textMessage = `Your verification code: ${otp}. Use this to verify your account and start ordering delicious food!`;
      htmlMessage = `
        <div style="${containerStyles}">
          <div style="text-align: center; margin-bottom: 1.5rem;">
            <span style="font-size: 2rem;">🔐🍽️</span>
          </div>
          <h1 style="${headerStyles}">Verify Your Account</h1>
          ${greeting}
          <p style="margin-bottom: 1rem;">We're almost ready to serve you! Verify your email address to complete your registration and start ordering delicious meals.</p>
          <p style="text-align: center; font-weight: 600; color: ${colors.dark};">Enter this verification code in your app:</p>
          
          <div style="text-align: center;">
            <div style="${otpStyles}">${otp}</div>
          </div>
          
          <p style="text-align: center; margin-bottom: 1.5rem; font-size: 0.9rem; color: ${colors.muted};">
            ⏰ This code expires in 24 hours. Keep it secret, keep it safe!
          </p>
          
          <div style="${footerStyles}">
            <p style="margin: 0.5rem 0;">Didn't request this? Just ignore this email or contact our support team.</p>
          </div>
        </div>
      `;
      break;

    case 'forgetPassword':
      subject = `🆘 Reset Your ${companyName} Password - Get Back to Ordering!`;
      textMessage = `Password reset OTP: ${otp}. Use this to reset your password and get back to ordering your favorite meals.`;
      htmlMessage = `
        <div style="${containerStyles}">
          <div style="text-align: center; margin-bottom: 1.5rem;">
            <span style="font-size: 2rem;">🔑🍕</span>
          </div>
          <h1 style="${headerStyles}">Password Reset</h1>
          ${greeting}
          <p style="margin-bottom: 1rem;">No worries! We'll help you get back to ordering your favorite meals in no time.</p>
          <p style="text-align: center; font-weight: 600; color: ${
            colors.dark
          };">Use this OTP to reset your password:</p>
          
          <div style="text-align: center;">
            <div style="${otpStyles}">${otp}</div>
          </div>
          
          <p style="text-align: center; margin-bottom: 1.5rem; font-size: 0.9rem; color: ${
            colors.warning
          };">
            ⚡ Expires in 5 minutes - Quick, like our delivery!
          </p>
          
          <div style="background: ${
            colors.background
          }; padding: 1.25rem; border-radius: 8px; margin: 2rem 0;">
            <p style="margin: 0; font-size: 0.95rem; color: ${colors.dark};">
              <strong>🍽️ Pro Tip:</strong> Choose a strong password to keep your account and favorite orders secure!
            </p>
          </div>
          
          <div style="${footerStyles}">
            <p style="margin: 0.5rem 0;">Need help? Our support team is always hungry to help! <a href="mailto:support@${companyName
              .toLowerCase()
              .replace(/\s/g, '')}.com" style="color: ${
        colors.primary
      }; text-decoration: none;">Contact Us</a></p>
          </div>
        </div>
      `;
      break;

    case 'deliveryOTP':
      subject = `🚚 ${companyName} Delivery OTP - Your Food Has Arrived!`;
      textMessage = `Delivery OTP: ${otp}. Please provide this OTP to the delivery person to receive your order.`;
      htmlMessage = `
        <div style="${containerStyles}">
          <div style="text-align: center; margin-bottom: 1.5rem;">
            <span style="font-size: 2rem;">🚚📱</span>
          </div>
          <h1 style="${headerStyles}">Your Delivery Has Arrived!</h1>
          ${greeting}
          <p style="margin-bottom: 1rem;">Great news! Your <strong>${companyName}</strong> delivery person has arrived at your location with your delicious order.</p>
          
          <div style="background: ${
            colors.success
          }15; padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0; border: 2px dashed ${
        colors.success
      };">
            <p style="text-align: center; margin: 0; font-weight: 700; color: ${
              colors.success
            }; font-size: 1.1rem;">
              🎉 Your food is waiting! Please share this OTP with the delivery person
            </p>
          </div>
          
          <p style="text-align: center; font-weight: 600; color: ${
            colors.dark
          }; margin-bottom: 0.5rem;">
            Delivery Verification OTP:
          </p>
          
          <div style="text-align: center;">
            <div style="${otpStyles}">${otp}</div>
          </div>
          
          <p style="text-align: center; margin-bottom: 1.5rem; font-size: 0.95rem; color: ${
            colors.muted
          };">
            ⏰ This OTP expires in 10 minutes
          </p>
          
          <div style="background: ${
            colors.background
          }; padding: 1.25rem; border-radius: 8px; margin: 2rem 0;">
            <p style="margin: 0; font-size: 0.95rem; color: ${colors.dark};">
              <strong>📝 Important:</strong> 
              <ul style="margin: 0.5rem 0 0 1rem; padding-left: 0.5rem;">
                <li>Share this OTP only with the verified ${companyName} delivery person</li>
                <li>Verify the delivery person's ID and uniform before sharing OTP</li>
                <li>Check your order items before confirming delivery</li>
              </ul>
            </p>
          </div>
          
          <p style="text-align: center; font-size: 0.9rem; color: ${
            colors.warning
          }; margin: 1.5rem 0;">
            🔐 For your security, never share this OTP with anyone else
          </p>
          
          <div style="text-align: center; margin: 2rem 0;">
            <a href="tel:${
              ENV.SUPPORT_PHONE || '+1-800-123-4567'
            }" style="display: inline-block; padding: 0.75rem 1.5rem; background: ${
        colors.primary
      }; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin-right: 1rem;">
              📞 Call Support
            </a>
            <a href="${
              ENV.APP_URL || ENV.FRONTEND_URL
            }/help" style="display: inline-block; padding: 0.75rem 1.5rem; background: ${
        colors.secondary
      }; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
              ❓ Help Center
            </a>
          </div>
          
          <div style="${footerStyles}">
            <p style="margin: 0.5rem 0;">Enjoy your meal! 🍽️</p>
            <p style="margin: 0.5rem 0; font-size: 0.8rem; color: ${colors.muted};">
              Delivery ID: ${Date.now().toString().slice(-8)} • ${new Date().toLocaleTimeString(
        [],
        { hour: '2-digit', minute: '2-digit' }
      )}
            </p>
          </div>
        </div>
      `;
      break;

    default:
      throw new Error('Unsupported email type');
  }

  return {
    from: `"${companyName}" <${ENV.BREVO_SENDEREMAIL}>`,
    to: user.email,
    subject,
    text:
      textMessage ||
      `Hello ${user.fullName},\n\n${subject}\n\nBest regards,\nThe ${companyName} Team`,
    html: htmlMessage,
  };
}
