#!/bin/bash

# 無障礙廁所GO V2 資料備份腳本
# 用於定期備份 PostgreSQL 資料庫到 S3

set -e

# 設定變數
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="accessible_toilet_go_${DATE}.sql"
S3_BUCKET="${S3_BUCKET:-accessible-toilet-go-backups}"
RETENTION_DAYS=30

# 記錄函數
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "${BACKUP_DIR}/backup.log"
}

# 錯誤處理函數
error_exit() {
    log "ERROR: $1"
    exit 1
}

# 檢查必要環境變數
check_env() {
    if [ -z "$PGPASSWORD" ]; then
        error_exit "PGPASSWORD 環境變數未設定"
    fi
    
    if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
        error_exit "AWS 認證資訊未設定"
    fi
}

# 建立備份目錄
create_backup_dir() {
    mkdir -p "$BACKUP_DIR"
    log "備份目錄已建立: $BACKUP_DIR"
}

# 執行資料庫備份
backup_database() {
    log "開始執行資料庫備份..."
    
    # 使用 pg_dump 備份資料庫
    pg_dump \
        -h postgres-master \
        -U postgres \
        -d accessible_toilet_go \
        --verbose \
        --clean \
        --create \
        --if-exists \
        --format=plain \
        --no-password \
        > "${BACKUP_DIR}/${BACKUP_FILE}" \
        2>> "${BACKUP_DIR}/backup.log"
    
    if [ $? -eq 0 ]; then
        log "資料庫備份完成: ${BACKUP_FILE}"
        
        # 壓縮備份檔案
        gzip "${BACKUP_DIR}/${BACKUP_FILE}"
        BACKUP_FILE="${BACKUP_FILE}.gz"
        log "備份檔案已壓縮: ${BACKUP_FILE}"
    else
        error_exit "資料庫備份失敗"
    fi
}

# 上傳到 S3
upload_to_s3() {
    log "開始上傳備份到 S3..."
    
    # 使用 AWS CLI 上傳到 S3
    aws s3 cp \
        "${BACKUP_DIR}/${BACKUP_FILE}" \
        "s3://${S3_BUCKET}/database-backups/${BACKUP_FILE}" \
        --storage-class STANDARD_IA \
        --metadata "backup-date=${DATE},database=accessible_toilet_go"
    
    if [ $? -eq 0 ]; then
        log "備份已成功上傳到 S3: s3://${S3_BUCKET}/database-backups/${BACKUP_FILE}"
    else
        error_exit "上傳到 S3 失敗"
    fi
}

# 驗證備份檔案
verify_backup() {
    log "驗證備份檔案..."
    
    # 檢查檔案大小
    BACKUP_SIZE=$(stat -c%s "${BACKUP_DIR}/${BACKUP_FILE}")
    if [ "$BACKUP_SIZE" -lt 1000 ]; then
        error_exit "備份檔案過小，可能備份失敗"
    fi
    
    # 檢查檔案完整性
    if [[ "$BACKUP_FILE" == *.gz ]]; then
        if ! gzip -t "${BACKUP_DIR}/${BACKUP_FILE}"; then
            error_exit "備份檔案損壞"
        fi
    fi
    
    log "備份檔案驗證通過，大小: $(numfmt --to=iec $BACKUP_SIZE)"
}

# 清理舊備份
cleanup_old_backups() {
    log "清理 $RETENTION_DAYS 天前的本地備份檔案..."
    
    find "$BACKUP_DIR" -name "accessible_toilet_go_*.sql*" -type f -mtime +$RETENTION_DAYS -delete
    
    # 清理 S3 上的舊備份
    log "清理 S3 上的舊備份..."
    aws s3 ls "s3://${S3_BUCKET}/database-backups/" | \
    awk '$1 < "'$(date -d "$RETENTION_DAYS days ago" '+%Y-%m-%d')'" {print $4}' | \
    while read file; do
        if [ -n "$file" ]; then
            aws s3 rm "s3://${S3_BUCKET}/database-backups/$file"
            log "已刪除舊備份: $file"
        fi
    done
}

# 發送通知
send_notification() {
    local status=$1
    local message=$2
    
    # 這裡可以整合 Slack、Email 或其他通知方式
    log "通知: $message"
    
    # 範例: 發送到 Slack
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"資料庫備份 $status: $message\"}" \
            "$SLACK_WEBHOOK_URL" 2>/dev/null || true
    fi
}

# 主函數
main() {
    log "=== 開始執行資料庫備份 ==="
    
    check_env
    create_backup_dir
    
    if backup_database; then
        verify_backup
        upload_to_s3
        cleanup_old_backups
        send_notification "成功" "備份完成，檔案: $BACKUP_FILE"
        log "=== 備份流程完成 ==="
    else
        send_notification "失敗" "備份過程中發生錯誤"
        error_exit "備份流程失敗"
    fi
}

# 執行主函數
main "$@"
