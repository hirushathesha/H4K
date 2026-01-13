// ===== Email Service Configuration =====
const EMAIL_CONFIG = {
    // Gmail SMTP Configuration
    SMTP_HOST: 'smtp.gmail.com',
    SMTP_PORT: 587,
    SMTP_SECURE: false, // true for 465, false for other ports
    
    // Email Templates
    TEMPLATES: {
        verification: {
            subject: 'H4K HEX - Email Verification Code',
            html: `
                <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0f1a; color: #ffffff; padding: 40px; border-radius: 10px; border: 1px solid rgba(0, 191, 255, 0.3);">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="font-size: 2rem; background: linear-gradient(135deg, #00bfff, #7f00ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-family: 'JetBrains Mono', monospace;">H4K HEX</h1>
                        <h2 style="color: #00bfff; margin-top: 10px;">Email Verification</h2>
                    </div>
                    
                    <div style="background: rgba(26, 31, 46, 0.6); padding: 30px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
                        <p style="font-size: 1.1rem; margin-bottom: 20px;">Hello <strong>{{name}}</strong>,</p>
                        
                        <p style="margin-bottom: 20px; line-height: 1.6;">Thank you for registering with H4K HEX! To complete your registration, please use the verification code below:</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <div style="display: inline-block; background: linear-gradient(135deg, #00bfff, #7f00ff); padding: 20px 40px; border-radius: 10px; font-size: 2rem; font-weight: bold; letter-spacing: 0.5rem; font-family: 'JetBrains Mono', monospace; color: white; box-shadow: 0 10px 30px rgba(0, 191, 255, 0.3);">
                                {{code}}
                            </div>
                        </div>
                        
                        <p style="margin-bottom: 20px; line-height: 1.6;">This code will expire in <strong>10 minutes</strong>. Please enter it in the registration form to verify your email address.</p>
                        
                        <div style="background: rgba(255, 170, 0, 0.1); border-left: 4px solid #ffaa00; padding: 15px; margin: 20px 0; border-radius: 5px;">
                            <p style="margin: 0; color: #ffaa00; font-size: 0.9rem;"><strong>Security Tip:</strong> Never share this code with anyone. H4K HEX will never ask for your verification code.</p>
                        </div>
                        
                        <p style="margin-top: 30px; line-height: 1.6;">If you didn't request this verification, please ignore this email.</p>
                        
                        <hr style="border: none; height: 1px; background: rgba(255, 255, 255, 0.1); margin: 30px 0;">
                        
                        <p style="text-align: center; color: #b8c5d1; font-size: 0.8rem; margin: 0;">
                            This is an automated message from H4K HEX. Please do not reply to this email.
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                        <p style="color: #b8c5d1; font-size: 0.8rem; margin: 0;">© 2026 H4K HEX. All rights reserved.</p>
                        <p style="color: #b8c5d1; font-size: 0.8rem; margin: 5px 0 0 0;">Powered by H4K HEX Technology</p>
                    </div>
                </div>
            `,
            text: `
                H4K HEX - Email Verification
                
                Hello {{name}},
                
                Thank you for registering with H4K HEX! 
                
                Your verification code is: {{code}}
                
                This code will expire in 10 minutes.
                
                If you didn't request this verification, please ignore this email.
                
                © 2026 H4K HEX. All rights reserved.
            `
        }
    }
};

// ===== EmailJS Integration (Recommended for Frontend) =====
class EmailService {
    constructor() {
        this.initializeEmailJS();
    }
    
    initializeEmailJS() {
        // Initialize EmailJS with your public key
        if (typeof emailjs !== 'undefined') {
            emailjs.init("c_T0fruEXmCHb0s0L"); // Replace with your EmailJS public key
        }
    }
    
    // Send verification code using EmailJS
    async sendVerificationCodeEmailJS(email, name, code) {
        try {
            const templateParams = {
                to_email: email,
                to_name: name,
                verification_code: code,
                from_name: 'H4K HEX',
                reply_to: 'noreply@h4khex.com'
            };
            
            const response = await emailjs.send('service_rkib446', 'template_c8ieadj', templateParams);
            
            console.log('Email sent successfully:', response);
            return { success: true, message: 'Verification code sent successfully' };
            
        } catch (error) {
            console.error('Email sending failed:', error);
            return { success: false, message: 'Failed to send verification code' };
        }
    }
    
    // Send verification code using Gmail SMTP (Backend required)
    async sendVerificationCodeSMTP(email, name, code) {
        try {
            // This would typically be done on your backend server
            const response = await fetch('/api/send-verification-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    name: name,
                    code: code
                })
            });
            
            const result = await response.json();
            return result;
            
        } catch (error) {
            console.error('SMTP email sending failed:', error);
            return { success: false, message: 'Failed to send verification code' };
        }
    }
    
    // Send verification code using Gmail API (Backend required)
    async sendVerificationCodeGmailAPI(email, name, code) {
        try {
            const response = await fetch('/api/send-gmail-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    name: name,
                    code: code,
                    subject: EMAIL_CONFIG.TEMPLATES.verification.subject,
                    html: this.generateEmailHTML('verification', { name, code })
                })
            });
            
            const result = await response.json();
            return result;
            
        } catch (error) {
            console.error('Gmail API email sending failed:', error);
            return { success: false, message: 'Failed to send verification code' };
        }
    }
    
    // Generate email HTML from template
    generateEmailHTML(templateName, data) {
        let template = EMAIL_CONFIG.TEMPLATES[templateName].html;
        
        // Replace placeholders with actual data
        Object.keys(data).forEach(key => {
            template = template.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
        });
        
        return template;
    }
    
    // Generate email text from template
    generateEmailText(templateName, data) {
        let template = EMAIL_CONFIG.TEMPLATES[templateName].text;
        
        // Replace placeholders with actual data
        Object.keys(data).forEach(key => {
            template = template.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
        });
        
        return template;
    }
    
    // Validate email address
    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // Rate limiting check
    checkRateLimit(email) {
        const rateLimitKey = `email_rate_${email}`;
        const currentTime = Date.now();
        const rateLimitData = localStorage.getItem(rateLimitKey);
        
        if (rateLimitData) {
            const { count, resetTime } = JSON.parse(rateLimitData);
            
            if (currentTime > resetTime) {
                // Reset rate limit
                localStorage.setItem(rateLimitKey, JSON.stringify({
                    count: 1,
                    resetTime: currentTime + (15 * 60 * 1000) // 15 minutes
                }));
                return true;
            }
            
            if (count >= 5) { // Max 5 emails per 15 minutes
                return false;
            }
            
            // Increment count
            localStorage.setItem(rateLimitKey, JSON.stringify({
                count: count + 1,
                resetTime: resetTime
            }));
            
            return true;
        } else {
            // First email
            localStorage.setItem(rateLimitKey, JSON.stringify({
                count: 1,
                resetTime: currentTime + (15 * 60 * 1000) // 15 minutes
            }));
            return true;
        }
    }
    
    // Clear rate limit
    clearRateLimit(email) {
        const rateLimitKey = `email_rate_${email}`;
        localStorage.removeItem(rateLimitKey);
    }
}

// ===== Backend API Examples =====

// Node.js Express Backend Example
/*
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Gmail SMTP configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password' // Use App Password, not regular password
    }
});

// Send verification email endpoint
app.post('/api/send-verification-email', async (req, res) => {
    try {
        const { email, name, code } = req.body;
        
        // Validate email
        if (!email || !name || !code) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }
        
        // Email options
        const mailOptions = {
            from: 'H4K HEX <your-email@gmail.com>',
            to: email,
            subject: 'H4K HEX - Email Verification Code',
            html: generateEmailHTML('verification', { name, code }),
            text: generateEmailText('verification', { name, code })
        };
        
        // Send email
        const info = await transporter.sendMail(mailOptions);
        
        res.json({ 
            success: true, 
            message: 'Verification email sent successfully',
            messageId: info.messageId 
        });
        
    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send verification email' 
        });
    }
});

// Gmail API endpoint (alternative)
app.post('/api/send-gmail-verification', async (req, res) => {
    try {
        const { email, name, code, subject, html } = req.body;
        
        // Here you would use Google's Gmail API
        // This requires OAuth2 setup and Gmail API credentials
        // Implementation depends on your Google Cloud setup
        
        res.json({ 
            success: true, 
            message: 'Email sent via Gmail API' 
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send email via Gmail API' 
        });
    }
});

app.listen(3000, () => {
    console.log('Email service running on port 3000');
});
*/

// ===== PHP Backend Example =====
/*
<?php
// PHP mail function example
function sendVerificationEmail($email, $name, $code) {
    $to = $email;
    $subject = 'H4K HEX - Email Verification Code';
    
    $message = generateEmailHTML('verification', ['name' => $name, 'code' => $code]);
    
    $headers = "From: H4K HEX <noreply@h4khex.com>\r\n";
    $headers .= "Reply-To: noreply@h4khex.com\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    
    return mail($to, $subject, $message, $headers);
}

// PHPMailer example (recommended)
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

function sendVerificationEmailPHPMailer($email, $name, $code) {
    $mail = new PHPMailer(true);
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'your-email@gmail.com';
        $mail->Password = 'your-app-password';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        
        // Recipients
        $mail->setFrom('your-email@gmail.com', 'H4K HEX');
        $mail->addAddress($email, $name);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = 'H4K HEX - Email Verification Code';
        $mail->Body = generateEmailHTML('verification', ['name' => $name, 'code' => $code]);
        $mail->AltBody = generateEmailText('verification', ['name' => $name, 'code' => $code]);
        
        $mail->send();
        return ['success' => true, 'message' => 'Verification email sent successfully'];
        
    } catch (Exception $e) {
        return ['success' => false, 'message' => "Failed to send email: {$mail->ErrorInfo}"];
    }
}
*/

emailjs.init("YOUR_PUBLIC_KEY"); // Your EmailJS public key
const response = await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);

// ===== Initialize Email Service =====
const emailService = new EmailService();

// ===== Export for use in other files =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EmailService, emailService };
}