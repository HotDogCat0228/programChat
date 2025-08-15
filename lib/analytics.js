// 簡單的流量追蹤系統
let analytics = {
  totalRequests: 0,
  todayRequests: 0,
  hourlyRequests: {},
  userStats: {},
  errors: 0,
  lastResetDate: new Date().toDateString()
};

// 重置每日統計
function resetDailyStats() {
  const today = new Date().toDateString();
  if (analytics.lastResetDate !== today) {
    analytics.todayRequests = 0;
    analytics.hourlyRequests = {};
    analytics.lastResetDate = today;
  }
}

// 記錄請求
function trackRequest(userIP, question) {
  resetDailyStats();
  
  const now = new Date();
  const hour = now.getHours();
  
  // 總請求數
  analytics.totalRequests++;
  analytics.todayRequests++;
  
  // 每小時統計
  if (!analytics.hourlyRequests[hour]) {
    analytics.hourlyRequests[hour] = 0;
  }
  analytics.hourlyRequests[hour]++;
  
  // 使用者統計 (匿名化IP)
  const hashedIP = userIP ? userIP.split('.').slice(0, 3).join('.') + '.xxx' : 'unknown';
  if (!analytics.userStats[hashedIP]) {
    analytics.userStats[hashedIP] = {
      count: 0,
      lastSeen: now.toISOString(),
      questionLengths: []
    };
  }
  analytics.userStats[hashedIP].count++;
  analytics.userStats[hashedIP].lastSeen = now.toISOString();
  analytics.userStats[hashedIP].questionLengths.push(question.length);
  
  console.log('📈 流量追蹤:', {
    總請求: analytics.totalRequests,
    今日請求: analytics.todayRequests,
    當前時段: `${hour}:00-${hour + 1}:00 (${analytics.hourlyRequests[hour]} 次)`,
    用戶: hashedIP,
    問題長度: question.length
  });
}

// 記錄錯誤
function trackError(error, userIP) {
  resetDailyStats();
  analytics.errors++;
  
  console.log('❌ 錯誤追蹤:', {
    錯誤總數: analytics.errors,
    用戶: userIP ? userIP.split('.').slice(0, 3).join('.') + '.xxx' : 'unknown',
    錯誤: error.message || error
  });
}

// 獲取統計資料
function getAnalytics() {
  resetDailyStats();
  
  const topHour = Object.keys(analytics.hourlyRequests).reduce((a, b) => 
    analytics.hourlyRequests[a] > analytics.hourlyRequests[b] ? a : b, '0');
  
  const activeUsers = Object.keys(analytics.userStats).length;
  
  return {
    總請求數: analytics.totalRequests,
    今日請求: analytics.todayRequests,
    活躍用戶: activeUsers,
    錯誤次數: analytics.errors,
    熱門時段: `${topHour}:00-${parseInt(topHour) + 1}:00`,
    每小時分布: analytics.hourlyRequests,
    成功率: analytics.totalRequests > 0 ? 
      ((analytics.totalRequests - analytics.errors) / analytics.totalRequests * 100).toFixed(1) + '%' : '100%'
  };
}

module.exports = {
  trackRequest,
  trackError,
  getAnalytics
};
