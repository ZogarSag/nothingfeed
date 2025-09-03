# 🚀 Deployment Guide für NOTHINGFEED

## **GitHub Setup**

1. **Repository erstellen:**
   ```bash
   # Auf GitHub.com ein neues Repository erstellen
   # Dann lokal verknüpfen:
   git remote add origin https://github.com/yourusername/nothingfeed.git
   git branch -M main
   git push -u origin main
   ```

## **Hetzner Server Setup**

### **1. Server vorbereiten**
```bash
# Als root einloggen
ssh root@your-server-ip

# System updaten
apt update && apt upgrade -y

# Docker installieren
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Docker Compose installieren
apt install docker-compose -y

# Node.js installieren (falls nicht Docker verwenden)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# PostgreSQL installieren
apt install postgresql postgresql-contrib -y
```

### **2. Datenbank einrichten**
```bash
# PostgreSQL starten
systemctl start postgresql
systemctl enable postgresql

# Als postgres User einloggen
sudo -u postgres psql

# Datenbank und User erstellen
CREATE DATABASE nothingfeed;
CREATE USER nothingfeed_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE nothingfeed TO nothingfeed_user;
\q
```

### **3. Anwendung deployen**

#### **Option A: Mit Docker (Empfohlen)**
```bash
# Repository klonen
git clone https://github.com/yourusername/nothingfeed.git
cd nothingfeed

# Environment-Datei erstellen
cp env.example .env
nano .env  # Datenbank-URL und Session-Secret eintragen

# Docker Container starten
docker-compose up -d
```

#### **Option B: Ohne Docker**
```bash
# Repository klonen
git clone https://github.com/yourusername/nothingfeed.git
cd nothingfeed

# Dependencies installieren
npm ci --only=production

# Environment-Datei erstellen
cp env.example .env
nano .env  # Datenbank-URL und Session-Secret eintragen

# Prisma Client generieren
npx prisma generate

# Datenbank-Schema pushen
npm run db:push

# Anwendung starten
npm start
```

### **4. Nginx Reverse Proxy (Optional)**
```bash
# Nginx installieren
apt install nginx -y

# Konfiguration erstellen
nano /etc/nginx/sites-available/nothingfeed
```

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Nginx aktivieren
ln -s /etc/nginx/sites-available/nothingfeed /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### **5. SSL mit Let's Encrypt**
```bash
# Certbot installieren
apt install certbot python3-certbot-nginx -y

# SSL-Zertifikat generieren
certbot --nginx -d yourdomain.com
```

## **Environment Variables (.env)**

```bash
# Database
DATABASE_URL="postgresql://nothingfeed_user:your_secure_password@localhost:5432/nothingfeed"

# Session
SESSION_SECRET="your-super-secret-session-key-here"

# Environment
NODE_ENV="production"

# Optional: Custom domain
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

## **Monitoring & Maintenance**

### **Logs anzeigen**
```bash
# Mit Docker
docker-compose logs -f app

# Ohne Docker
journalctl -u nothingfeed -f
```

### **Updates deployen**
```bash
# Auf dem Server
cd /path/to/nothingfeed
git pull origin main
npm ci --only=production
npx prisma generate
npm run db:push

# Mit Docker
docker-compose down
docker-compose up -d --build
```

## **Troubleshooting**

### **Port 3000 nicht erreichbar**
```bash
# Firewall prüfen
ufw status
ufw allow 3000
```

### **Datenbank-Verbindung fehlschlägt**
```bash
# PostgreSQL Status prüfen
systemctl status postgresql

# Verbindung testen
psql -h localhost -U nothingfeed_user -d nothingfeed
```

### **Upload-Verzeichnis nicht beschreibbar**
```bash
# Berechtigungen setzen
chown -R www-data:www-data public/uploads
chmod -R 755 public/uploads
```

## **Performance-Optimierungen**

- **PM2** für Process Management verwenden
- **Redis** für Session-Storage
- **CDN** für statische Assets
- **Database-Indexing** für bessere Performance

## **Backup-Strategie**

```bash
# Datenbank-Backup
pg_dump nothingfeed > backup_$(date +%Y%m%d_%H%M%S).sql

# Uploads-Backup
tar -czf uploads_backup_$(date +%Y%m%d_%H%M%S).tar.gz public/uploads/
```

