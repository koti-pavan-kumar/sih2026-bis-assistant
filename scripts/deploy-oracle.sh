#!/bin/bash
# ============================================================
# ManakMitra — Oracle Cloud Always Free Deployment Script
# Run this on a fresh Ubuntu 22.04/24.04 ARM instance
# ============================================================
set -e

echo "🇮🇳 ManakMitra Backend — Oracle Cloud Deployment"
echo "================================================="

# 1. System update
echo "[1/8] Updating system..."
sudo apt update && sudo apt upgrade -y

# 2. Install dependencies
echo "[2/8] Installing system dependencies..."
sudo apt install -y python3.11 python3.11-venv python3-pip git curl build-essential

# 3. Clone repo
echo "[3/8] Cloning repository..."
cd /opt
sudo git clone https://github.com/koti-pavan-kumar/sih2026-bis-assistant.git manakmitra
sudo chown -R $USER:$USER /opt/manakmitra
cd /opt/manakmitra

# 4. Create virtual environment
echo "[4/8] Creating virtual environment..."
python3.11 -m venv venv
source venv/bin/activate

# 5. Install Python dependencies
echo "[5/8] Installing Python packages (this takes 3-5 minutes)..."
pip install --upgrade pip
pip install -r requirements.txt

# 6. Set up environment variables
echo "[6/8] Setting up environment..."
read -p "Enter your GEMINI_API_KEY: " GEMINI_KEY
cat > .env << EOF
GEMINI_API_KEY=$GEMINI_KEY
OLLAMA_HOST=
EOF
echo "Environment file created."

# 7. Create systemd service
echo "[7/8] Creating systemd service..."
sudo cat > /etc/systemd/system/manakmitra.service << 'SERVICEEOF'
[Unit]
Description=ManakMitra BIS Standards AI Assistant
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/manakmitra
ExecStart=/opt/manakmitra/venv/bin/python main.py
Restart=always
RestartSec=5
Environment=PORT=8000
Environment=PYTHONUNBUFFERED=1

[Install]
WantedBy=multi-user.target
SERVICEEOF

sudo systemctl daemon-reload
sudo systemctl enable manakmitra
sudo systemctl start manakmitra

# 8. Open firewall port
echo "[8/8] Configuring firewall..."
sudo ufw allow 8000/tcp 2>/dev/null || true

echo ""
echo "✅ Deployment complete!"
echo "========================"
echo "Backend URL: http://$(curl -s ifconfig.me):8000"
echo "Health check: http://$(curl -s ifconfig.me):8000/api/health"
echo ""
echo "Service commands:"
echo "  sudo systemctl status manakmitra    # Check status"
echo "  sudo systemctl restart manakmitra   # Restart"
echo "  sudo journalctl -u manakmitra -f    # View logs"
echo ""
echo "📊 First startup takes ~30s (loads ML model + builds FAISS index)"
