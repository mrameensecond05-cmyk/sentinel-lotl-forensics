import os
import json
import socket
import time
import requests
import psutil

# --- Configuration ---
# Update this to your deployed server IP for production
SERVER_API = "http://127.0.0.1:5001/api" 
CONFIG_FILE = "agent_config.json"        
SHARED_SECRET = "MySecureProjectPassword2026!"

def register_with_server():
    """Performs the first-time handshake with the server."""
    hostname = socket.gethostname()
    print(f"🔵 Attempting to register {hostname}...")

    payload = {
        "hostname": hostname,
        "password": SHARED_SECRET,
        "os_info": "Linux/Test" # Updated generic default
    }

    try:
        # POST request to your Linux Server
        response = requests.post(f"{SERVER_API}/enroll", json=payload, timeout=5)
        
        if response.status_code == 200:
            creds = response.json()
            # Save the received ID and Key locally
            with open(CONFIG_FILE, "w") as f:
                json.dump(creds, f)
            print(f"✅ Registration Success! Assigned ID: {creds['agent_id']}")
            return creds
        else:
            print(f"❌ Registration Failed: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return None

def collect_logs():
    """Simulates collecting process events"""
    logs = []
    # Get a few running processes
    for proc in psutil.process_iter(['pid', 'name', 'username', 'cmdline']):
        try:
            # Simulate "new" events by randomly picking diverse processes or just sending snapshots
            # For this demo, we'll send a small batch of "interesting" looking processes
            # In real life, we'd hook specific events. Here we just grab generic noise + simulate malicious behavior occasionally
            
            pinfo = proc.info
            cmd = " ".join(pinfo['cmdline']) if pinfo['cmdline'] else ""
            
            logs.append({
                "process_name": pinfo['name'],
                "command_line": cmd,
                "user": pinfo['username']
            })
            
            if len(logs) >= 5: break # Send in batches of 5
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
            
    return logs

def start_monitoring():
    # 1. Check if we are already registered
    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, "r") as f:
            config = json.load(f)
    else:
        # If not, try to register
        config = register_with_server()
        if not config:
            return # Stop if registration failed

    # 2. Main Loop
    print("🚀 Agent started monitoring...")
    while True:
        # Gather Telemetry
        telemetry = {
            "agent_id": config['agent_id'],
            "cpu": psutil.cpu_percent(),
            "ram": psutil.virtual_memory().percent,
            "disk": psutil.disk_usage('/').percent
        }
        
        # Gather Logs
        logs = collect_logs()

        # Send Data to Server
        try:
            # Send Telemetry
            requests.post(f"{SERVER_API}/telemetry", json=telemetry)
            print(f"📡 Sent Telemetry: CPU {telemetry['cpu']}%")

            # Send Logs
            if logs:
                requests.post(f"{SERVER_API}/logs", json={"agent_id": config['agent_id'], "logs": logs})
                print(f"📝 Sent {len(logs)} log events")

        except Exception as e:
             print(f"❌ Network Error: {e}")

        time.sleep(10)

if __name__ == "__main__":
    start_monitoring()
