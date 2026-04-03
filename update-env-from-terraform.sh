#!/bin/bash

# Helper script to update MERN app's MongoDB connection string after Terraform deployment
# Usage: ./update-env-from-terraform.sh

set -e

TERRAFORM_DIR="/home/usman/Desktop/learn-terraform-get-started-aws"
MERN_ENV_FILE="/home/usman/Desktop/mern-crud-app/server/.env"

echo "=== MERN App Environment Update Helper ==="
echo ""

# Check if terraform.tfstate exists
if [ ! -f "$TERRAFORM_DIR/terraform.tfstate" ]; then
    echo "❌ Error: Terraform state file not found at $TERRAFORM_DIR/terraform.tfstate"
    echo "Please run 'terraform apply' first in $TERRAFORM_DIR"
    exit 1
fi

# Extract database private IP from terraform outputs
echo "Extracting database private IP from Terraform outputs..."
DB_PRIVATE_IP=$(cd "$TERRAFORM_DIR" && terraform output -raw database_private_ip 2>/dev/null || echo "")

if [ -z "$DB_PRIVATE_IP" ]; then
    echo "❌ Error: Could not extract database_private_ip from Terraform outputs"
    echo "Make sure 'terraform apply' completed successfully"
    exit 1
fi

echo "✓ Found database private IP: $DB_PRIVATE_IP"
echo ""

# Update the .env file
echo "Updating $MERN_ENV_FILE..."
sed -i.bak "s|mongodb://10.1.1.XX:27017|mongodb://$DB_PRIVATE_IP:27017|g" "$MERN_ENV_FILE"

echo "✓ Environment file updated successfully!"
echo ""
echo "=== Summary ==="
echo "Updated MONGO_URI in: $MERN_ENV_FILE"
echo "New connection string:"
grep "MONGO_URI" "$MERN_ENV_FILE"
echo ""
echo "Next steps:"
echo "1. Verify the connection string is correct:"
echo "   cat $MERN_ENV_FILE"
echo ""
echo "2. Redeploy the app:"
echo "   cd /home/usman/Desktop/mern-crud-app"
echo "   docker compose down  # if running"
echo "   docker compose up -d"
echo ""
echo "3. Check backend logs:"
echo "   docker logs -f mern-backend"
echo ""
