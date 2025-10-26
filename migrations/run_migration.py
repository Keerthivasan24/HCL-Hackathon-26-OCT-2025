"""
Database Migration Script
Run this to update your database schema
"""

import pymysql
from app.config import settings

def run_migration():
    try:
        # Parse database URL
        # Format: mysql+pymysql://user:password@host:port/database
        db_url = settings.DATABASE_URL.replace('mysql+pymysql://', '')
        
        # Extract connection details
        if '@' in db_url:
            user_pass, host_db = db_url.split('@')
            user, password = user_pass.split(':')
        else:
            user = 'root'
            password = ''
            host_db = db_url
        
        if ':' in host_db:
            host, port_db = host_db.split(':')
        else:
            host = host_db
            port_db = '3306'
        
        if '/' in port_db:
            port, database = port_db.split('/')
        else:
            port = '3306'
            database = 'banking_db'
        
        # Connect to database
        connection = pymysql.connect(
            host=host,
            port=int(port),
            user=user,
            password=password,
            database=database
        )
        
        print("Connected to database successfully")
        
        with connection.cursor() as cursor:
            # Check if ifsc_code column exists
            cursor.execute("SHOW COLUMNS FROM bank_accounts LIKE 'ifsc_code'")
            result = cursor.fetchone()
            
            if not result:
                print("Adding ifsc_code column to bank_accounts table...")
                cursor.execute("""
                    ALTER TABLE bank_accounts 
                    ADD COLUMN ifsc_code VARCHAR(20) DEFAULT 'SBIN0001234' NOT NULL 
                    AFTER created_at
                """)
                connection.commit()
                print("✓ ifsc_code column added successfully")
            else:
                print("✓ ifsc_code column already exists")
            
            # Verify the table structure
            cursor.execute("DESCRIBE bank_accounts")
            columns = cursor.fetchall()
            print("\nCurrent bank_accounts table structure:")
            for col in columns:
                print(f"  {col[0]} - {col[1]}")
        
        connection.close()
        print("\nMigration completed successfully!")
        
    except Exception as e:
        print(f"Error running migration: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    run_migration()
