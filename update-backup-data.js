// 更新本地備份資料腳本
// 這個腳本可以用來定期更新 data/toilets-backup.json

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_URL = 'https://data.moenv.gov.tw/api/v2/fac_p_07?api_key=58d6040c-dca7-407f-a244-d0bfdfa8144a&limit=1000&format=JSON';
const BACKUP_FILE = path.join(__dirname, 'data', 'toilets-backup.json');

async function updateBackupData() {
    console.log('開始更新備份資料...');
    
    try {
        // 建立 data 目錄（如果不存在）
        const dataDir = path.dirname(BACKUP_FILE);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        // 從 API 取得資料
        const data = await fetchDataFromAPI();
        
        if (data && data.records) {
            // 備份現有檔案
            if (fs.existsSync(BACKUP_FILE)) {
                const backupName = `toilets-backup-${new Date().toISOString().split('T')[0]}.json`;
                fs.copyFileSync(BACKUP_FILE, path.join(dataDir, backupName));
                console.log(`已備份現有檔案為: ${backupName}`);
            }
            
            // 寫入新資料
            fs.writeFileSync(BACKUP_FILE, JSON.stringify(data, null, 2), 'utf8');
            console.log(`✅ 備份資料已更新: ${data.records.length} 筆記錄`);
            console.log(`檔案位置: ${BACKUP_FILE}`);
        } else {
            throw new Error('API 回應格式錯誤');
        }
    } catch (error) {
        console.error('❌ 更新備份資料失敗:', error.message);
        process.exit(1);
    }
}

function fetchDataFromAPI() {
    return new Promise((resolve, reject) => {
        const request = https.get(API_URL, (response) => {
            let data = '';
            
            response.on('data', (chunk) => {
                data += chunk;
            });
            
            response.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (error) {
                    reject(new Error('JSON 解析失敗: ' + error.message));
                }
            });
        });
        
        request.on('error', (error) => {
            reject(new Error('API 請求失敗: ' + error.message));
        });
        
        request.setTimeout(30000, () => {
            request.destroy();
            reject(new Error('API 請求超時'));
        });
    });
}

// 如果直接執行此腳本
if (require.main === module) {
    updateBackupData();
}

module.exports = { updateBackupData };
