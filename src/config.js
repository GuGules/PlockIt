let config = {
  port: process.env.PORT || 3000,
  security_token: process.env.SECURITY_TOKEN ? process.env.SECURITY_TOKEN : 'insecure-token',
  host: process.env.HOST || "0.0.0.0",
  environment: process.env.ENVIRONMENT,
  initIPs(){
    if (this.security.secured_mode && process.env.INITIAL_IP && !this.security.authorized_ips.includes(process.env.INITIAL_IP)){
      this.security.authorized_ips.push(process.env.INITIAL_IP);
    }
    if (this.security.secured_mode && process.env.INITIAL_IPS){
      process.env.INITIAL_IPS.split(',').forEach((item)=>{
        if (!this.security.authorized_ips.includes(item)){
          this.security.authorized_ips.push(item);
        }
      })
    }
  },
  emailServer:{
    host: process.env.SMTP_HOST || null,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE || false,
    auth:{
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || ''
    }
  },
  security: {
    secured_mode: process.env.SECURED_MODE ? process.env.SECURED_MODE : false,
    authorize_temporary_ip: process.env.TEMPORARY_IP_ALLOWED? process.env.TEMPORARY_IP_ALLOWED : false,
    temporary_authorized_ip: [], // IP Structure {ip: 'x.x.x.x', expires_at: Date, message: string}
    authorized_ips: ["127.0.0.1","::1"], // localhost par défaut
  }
}

module.exports = config