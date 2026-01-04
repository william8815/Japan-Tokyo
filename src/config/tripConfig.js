/**
 * 旅遊配置中心 (Trip Configuration Center)
 * 所有的旅程基本資訊、地點、座標與行程內容皆定義於此
 * 未來更換行程只需修改此檔案即可
 */
export const TRIP_CONFIG = {
  // 1. 旅程基本資訊
  info: {
    title: "東京旅遊 | 你的行程小助手",
    subTitle: "冬日雪白限定版",
    description: "專為東京之旅打造的個人化 PWA，支援行程追蹤、即時記帳、天氣預報與數位憑證存放。",
    startDate: "2026-01-07",
    endDate: "2026-01-11",
    rangeDisplay: "1/7 - 1/11",
    location: {
      name: "Tokyo, Japan",
      lat: "35.6895",
      lon: "139.6917"
    }
  },

  // 2. 完整行程資料
  itinerary: [
    {
      id: 1,
      title: 'Day 1: 抵達與酒酒井 Outlet',
      items: [
        { 
          id: 101, time: '08:25', location: '桃園機場 1 航廈', desc: '搭乘飛機前往成田', type: 'transport',
          details: { line: 'CX522', note: '記得帶護照' } 
        },
        { 
          id: 102, time: '12:35', location: '成田機場 2 航廈', desc: '抵達、領行李、寄放行李', type: 'transport',
          details: { note: 'B1 找置物櫃' }
        },
        { 
          id: 103, time: '14:33', location: '酒酒井 Outlet 巴士', desc: '搭乘巴士前往 Outlet', type: 'transport',
          details: { platform: '30 號', price: '¥500' }
        },
        { 
          id: 104, time: '14:53', location: '酒酒井 Outlet', desc: '逛街、吃飯', type: 'attraction',
          details: { mustSee: ['Adidas', 'Coach'] }
        },
        { 
          id: 105, time: '19:00', location: 'SkyLiner', desc: '經由日暮里回池袋', type: 'transport',
          details: { platform: '1/2', note: '指定席車票' }
        }
      ]
    },
    {
      id: 2,
      title: 'Day 2: 淺草與晴空塔水族館',
      items: [
        { 
          id: 201, time: '10:30', location: '敘敘苑 燒肉', desc: '【 午餐 】美味燒肉預定', type: 'food',
          details: { mustTry: ['上等牛舌', '泡菜組合'], reservation: '10:30' }
        },
        { 
          id: 202, time: '12:30', location: '墨田水族館', desc: '欣賞水母與企鵝', type: 'attraction',
          details: { note: '在晴空塔 5-6 樓' }
        },
        { 
          id: 203, time: '14:20', location: '淺草寺', desc: '絲綢布丁、三麗鷗', type: 'attraction',
          details: { mustEat: ['絲綢布丁', '炸肉餅'] }
        },
        { 
          id: 204, time: '16:40', location: '丸七豬排飯', desc: '【 晚餐 】現場排隊', type: 'food',
          details: { note: '池袋店, 不可預約' }
        }
      ]
    },
    {
      id: 3,
      title: 'Day 3: 原宿、澀谷與新宿',
      items: [
        { 
          id: 301, time: '09:15', location: '明治神宮', desc: '森林參拜', type: 'attraction',
          details: { note: '原宿站下車' }
        },
        { 
          id: 302, time: '13:45', location: 'I’m donut ?', desc: '超人氣甜甜圈', type: 'food',
          details: { mustTry: ['原味', '巧克力'] }
        },
        { 
          id: 303, time: '17:15', location: '牛舌的檸檬', desc: '新宿人氣晚餐', type: 'food',
          details: { reservation: '17:15' }
        }
      ]
    },
    {
      id: 4,
      title: 'Day 4: 箱根一日遊',
      items: [
        { 
          id: 401, time: '08:30', location: '浪漫特快', desc: '新宿前往箱根湯本', type: 'transport',
          details: { platform: '小田急線', note: '展望席先搶' }
        },
        { 
          id: 402, time: '10:00', location: '平和鳥居', desc: '打卡拍照', type: 'attraction',
          details: { note: '箱根神社內' }
        },
        { 
          id: 403, time: '14:30', location: '箱根湯療', desc: '泡湯體驗', type: 'attraction',
          details: { type: '大眾池/個人湯屋' }
        }
      ]
    },
    {
      id: 5,
      title: 'Day 5: 返程桃園',
      items: [
        { 
          id: 501, time: '08:30', location: '利木津巴士', desc: '前往成田機場', type: 'transport',
          details: { note: '池袋站搭乘' }
        }
      ]
    }
  ]
}
