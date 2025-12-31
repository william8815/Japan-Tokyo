import { defineStore } from 'pinia'

export const useItineraryStore = defineStore('itinerary', {
  state: () => ({
    days: [
      {
        id: 1,
        date: '2025-01-07',
        title: 'Day 1: 抵達與酒酒井 Outlet',
        items: [
          { time: '08:25', location: '桃園機場 1 航廈', desc: '搭乘飛機前往成田', type: 'transport' },
          { time: '12:35', location: '成田機場 2 航廈', desc: '抵達、領行李、寄放行李', type: 'transport' },
          { time: '14:33', location: '酒酒井 Outlet 巴士', desc: '搭乘巴士前往 Outlet', type: 'transport' },
          { time: '14:53', location: '酒酒井 Outlet', desc: '逛街、吃飯', type: 'shop' },
          { time: '18:40', location: '機場接駁巴士', desc: '返回成田機場 2 航廈', type: 'transport' },
          { time: '19:00', location: 'SkyLiner + JR 山手線', desc: '經由日暮里回池袋', type: 'transport' },
          { time: '21:00', location: '唐吉訶德', desc: '池袋店藥妝採買', type: 'shop' }
        ]
      },
      {
        id: 2,
        date: '2025-01-08',
        title: 'Day 2: 淺草與晴空塔水族館',
        items: [
          { time: '09:00', location: 'JR 山手線 + 銀座線', desc: '前往上野後轉往淺草', type: 'transport' },
          { time: '10:30', location: '敘敘苑 燒肉', desc: '【 午餐 】美味燒肉預定', type: 'food' },
          { time: '12:30', location: '墨田水族館', desc: '欣賞水母與企鵝', type: 'view' },
          { time: '14:00', location: '東武晴空塔線', desc: '前往淺草', type: 'transport' },
          { time: '14:20', location: '淺草寺 & 仲見世商店街', desc: '絲綢布丁、三麗鷗、水果串', type: 'culture' },
          { time: '16:00', location: '銀座線 + JR 山手線', desc: '返回上野並轉往池袋', type: 'transport' },
          { time: '16:40', location: '丸七豬排飯', desc: '【 晚餐 】現場排隊排爆', type: 'food' },
          { time: '18:30', location: '池袋商城', desc: '各大百貨與商圈開發', type: 'shop' }
        ]
      },
      {
        id: 3,
        date: '2025-01-09',
        title: 'Day 3: 原宿、澀谷與新宿',
        items: [
          { time: '08:30', location: 'JR 山手線', desc: '前往原宿', type: 'transport' },
          { time: '09:15', location: '明治神宮', desc: '森林參拜', type: 'culture' },
          { time: '12:00', location: 'JR 山手線', desc: '前往澀谷', type: 'transport' },
          { time: '13:30', location: '澀谷逛街', desc: '寶可夢中心、十字路口', type: 'shop' },
          { time: '13:45', location: 'I’m donut ?', desc: '【 午餐/甜點 】(原宿或澀谷店)', type: 'food' },
          { time: '16:30', location: 'JR 山手線', desc: '前往新宿', type: 'transport' },
          { time: '17:15', location: '牛舌的檸檬', desc: '【 晚餐 】招牌牛舌料理', type: 'food' },
          { time: '18:30', location: '新宿逛街', desc: '各大百貨與藥妝', type: 'shop' },
          { time: '21:00', location: 'JR 山手線', desc: '返回池袋', type: 'transport' }
        ]
      },
      {
        id: 4,
        date: '2025-01-10',
        title: 'Day 4: 箱根一日遊 - 浪漫特快',
        items: [
          { time: '08:00', location: 'JR 山手線', desc: '前往新宿', type: 'transport' },
          { time: '08:30', location: '浪漫特快', desc: '前往箱根湯本站', type: 'transport' },
          { time: '10:00', location: '平和鳥居', desc: '打卡拍照', type: 'view' },
          { time: '11:30', location: '蘆之湖海盜船', desc: '搭往桃源台', type: 'transport' },
          { time: '12:00', location: '大涌谷纜車', desc: '吃黑蛋 & 中餐', type: 'food' },
          { time: '14:30', location: '箱根湯療', desc: '頂級泡湯體驗', type: 'hotel' },
          { time: '16:30', location: '箱根商店街', desc: '購買在地伴手禮', type: 'shop' },
          { time: '17:30', location: '浪漫特快', desc: '返回新宿', type: 'transport' },
          { time: '19:00', location: '新宿區域', desc: '晚餐或最後逛街', type: 'food' },
          { time: '21:00', location: 'JR 山手線', desc: '返回池袋', type: 'transport' }
        ]
      },
      {
        id: 5,
        date: '2025-01-11',
        title: 'Day 5: 返程桃園',
        items: [
          { time: '08:30', location: '利木津巴士', desc: '前往成田機場', type: 'transport' },
          { time: '11:00', location: '成田 1 航廈', desc: '報到、候機', type: 'transport' },
          { time: '13:00', location: '成田機場 1 航廈', desc: '搭機返回桃園 2 航廈', type: 'transport' }
        ]
      }
    ]
  })
})
