# MERN App Setup with VPC Peering Architecture

This document explains the new architecture where the MERN app and MongoDB are separated across two VPCs using peering.

## Architecture Overview

```
┌─────────────────────────────────────────┐
│          MAIN VPC (10.0.0.0/16)        │
│  ┌───────────────────────────────────┐  │
│  │      App Server (EC2)             │  │
│  │  - MERN App (Docker Compose)      │  │
│  │  - Nginx (ports 80/443)           │  │
│  │  - Express Backend (port 5000)    │  │
│  │  - React Frontend (port 3000)     │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
         │                │
         │ VPC Peering    │
         │ Connection     │
         │                │
┌─────────────────────────────────────────┐
│        PEER VPC (10.1.0.0/16)           │
│  ┌───────────────────────────────────┐  │
│  │   Database Server (EC2)           │  │
│  │  - MongoDB (port 27017)           │  │
│  │  - Accessible only from Main VPC  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Changes Made

### 1. docker-compose.yml
- **Removed**: MongoDB container service
- **Reason**: MongoDB now runs on a separate EC2 instance in the peer VPC
- **Impact**: The backend must connect to the peer VPC database via peering

### 2. server/.env
- **Updated**: MONGO_URI now expects the database server's private IP
- **Format**: `mongodb://DATABASE_PRIVATE_IP:27017/mern_crud`
- **Action Required**: You must fill in the IP after running `terraform apply`

## Deployment Steps

### Step 1: Deploy Infrastructure
```bash
cd /home/usman/Desktop/learn-terraform-get-started-aws
terraform plan
terraform apply
```

### Step 2: Get Database Private IP
After `terraform apply` completes, note the output:
```
database_private_ip = 10.1.1.X
```

### Step 3: Update Environment Variable
Update `/home/usman/Desktop/mern-crud-app/server/.env`:
```bash
# Replace 10.1.1.XX with the actual private IP from Step 2
MONGO_URI=mongodb://10.1.1.X:27017/mern_crud
```

### Step 4: Deploy App (Manual or via EC2 user_data)
The app server will automatically:
1. Clone this repository
2. Run `docker compose up -d`
3. Start backend and frontend containers

The containers will use the MONGO_URI from `.env` to connect to MongoDB in the peer VPC.

## Communication Flow

1. **Browser** → Nginx (port 80) on App Server
2. **Nginx** → Frontend (localhost:3000)
3. **Frontend** → Backend API (localhost:5000)
4. **Backend** → MongoDB (private IP via VPC peering)
5. **MongoDB** → Returns data over peering connection

## Network Security

- **App Server** (Main VPC):
  - Public IP: Accessible from internet
  - Security Groups: Allow 80, 443, 3000, 5000 (can be restricted)
  - Can reach Peer VPC via peering on all ports

- **Database Server** (Peer VPC):
  - Private IP only: No direct internet access (only via app server)
  - Security Groups: Only allows port 27017 from Main VPC CIDR
  - SSH access available from anywhere for management
  - Protected from direct external attacks

## Troubleshooting

### MongoDB Connection Failed
**Symptom**: `Backend cannot connect to MongoDB`

**Solution**:
1. Verify `.env` file has correct IP: `MONGO_URI=mongodb://10.1.1.X:27017/mern_crud`
2. SSH to database server and check MongoDB status:
   ```bash
   sudo systemctl status mongod
   ```
3. Verify peering connection is active in AWS console
4. Check security groups allow MongoDB traffic

### Cannot SSH to Database Server
**Symptom**: `Connection refused to database server`

**Solution**:
1. Get database server's public IP from Terraform outputs
2. Ensure your key pair (Alpha) has correct permissions: `chmod 600 Alpha.pem`
3. SSH command: `ssh -i Alpha.pem ec2-user@DATABASE_PUBLIC_IP` (for Amazon Linux)

### App Cannot Reach Database
**Symptom**: `Backend logs show "MongoDB connection failed"`

**Solution**:
1. From app server, test connectivity:
   ```bash
   curl -v telnet://10.1.1.X:27017
   ```
2. Check database server IP is correct and running
3. Verify VPC route tables have peering routes
4. Check security group rules on database SG

## Files Modified

- `docker-compose.yml` - Removed MongoDB container
- `server/.env` - Updated MONGO_URI to peer VPC IP
- `server/server.js` - No changes (works with remote MongoDB)
- `README.md` - Original docs still apply

## Converting Back to Local MongoDB (Optional)

If you want to revert to local MongoDB in docker-compose:

1. Add mongo service back to `docker-compose.yml`
2. Update `.env`: `MONGO_URI=mongodb://mongo:27017/mern_crud`
3. Re-run: `docker compose up -d`

## Environment Variables Reference

```bash
PORT=5000                                      # Backend port
MONGO_URI=mongodb://10.1.1.X:27017/mern_crud  # Database connection string
```

Replace `10.1.1.X` with your actual database server private IP.
