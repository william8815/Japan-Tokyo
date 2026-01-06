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
    description: "專為東京之旅打造的個人化平台，支援行程追蹤、即時記帳、天氣預報與數位憑證存放。",
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
      title: 'Day 1: 酒酒井 Outlet',
      items: [
        { 
          id: 101, time: '08:25', location: '桃園機場 1 航廈', desc: '報到、過海關', type: 'transport',
          address : {url : "https://maps.app.goo.gl/9r4fdYbCSETm4x1x9"}
        },
        { 
          id: 102, time: '12:35', location: '成田機場 2 航廈', desc: '出境、領行李、寄放行李', type: 'transport',address: {url : "https://maps.app.goo.gl/zv26HGxhmbADYKUt5"}
        },
        { 
          id: 103, time: '14:33', location: 'outlet 接駁車', desc: '第 2 航廈 (1樓, 3號站牌)，搭乘巴士前往 outlet，成人500日圓', type: 'transport', address: {url : "https://maps.app.goo.gl/By2anvjj39yjYHeM9"}
        },
        { 
          id: 104, time: '14:53', location: '酒酒井 Outlet', desc: '麵包店、服飾店', type: 'attraction',
          address: {url: "https://maps.app.goo.gl/XVkkK1PETBSso6DGA"}
        },
        { 
          id: 105, time: '18:20', location: 'outlet 接駁車', desc: '18:40 的車 (最後一班)，成人500日圓', type: 'attraction', address: {url : "https://maps.app.goo.gl/By2anvjj39yjYHeM9"}
        },
        { 
          id: 106, time: '19:00', location: '成田機場 2 航廈', desc: '領回寄放行李', type: 'transport',
          address: {url : "https://maps.app.goo.gl/By2anvjj39yjYHeM9"}
        },
        { 
          id: 107, time: '19:00', location: 'Skyliner + 山手線 | 利木津巴士', desc: '前往飯店', type: 'transport'
        },
        { 
          id: 108, time: '21:00', location: '池袋大都會飯店', desc: '飯店 checkin', type: 'attraction',address: {url: "https://maps.app.goo.gl/dYJD8FRBUY2ZWnG2A"}
        },
        { 
          id: 109, time: '21:30', location: '唐吉訶德(池袋東口站前店)', desc: '買零食、猩猩之握(按摩器)', type: 'food',address: {url: "https://maps.app.goo.gl/FRpB8KTCkj3rLAcJ7"}
        },
        { 
          id: 110, time: '23:00', location: '池袋大都會飯店', desc: '飯店休息', type: 'attraction',address: {url: "https://maps.app.goo.gl/dYJD8FRBUY2ZWnG2A"}
        }
      ]
    },
    {
      id: 2,
      title: 'Day 2: 晴空塔水族館與淺草寺',
      items: [
        { 
          id: 201, time: '9:00', location: '池袋 => 晴空塔', desc: '搭乘【JR 山手線】前往上野、搭乘【G 銀座線】前往淺草、搭乘【TS 東武晴空塔線】前往晴空塔', type: 'transport'
        },
        { 
          id: 202, time: '10:30', location: '敘敘苑 燒肉', desc: '【 午餐 】美味燒肉預定', type: 'food',
          address: {url : "https://maps.app.goo.gl/bieRDMSYoAqWQyuLA"}
        },
        { 
          id: 203, time: '12:30', location: '墨田水族館', desc: '欣賞水母與企鵝', type: 'attraction',
          address: {url : "https://maps.app.goo.gl/VL3Cor9LmpAzh6WP9"}
        },
        { 
          id: 204, time: '14:10', location: '晴空塔 => 浅草', desc: '搭乘【TS 東武晴空塔線】前往淺草', type: 'transport'
        },
        { 
          id: 205, time: '14:30', location: '淺草寺', desc: '絲綢布丁、三麗鷗、水果攤(壢木線草莓)', type: 'attraction',
          address : {url : "https://maps.app.goo.gl/bhsAqMJxsvWCVeSt5"}
        },
        { 
          id: 206, time: '17:00', location: '浅草 => 池袋', desc: '搭乘【G 銀座線】前往上野、搭乘【JR 山手線】前往池袋', type: 'transport'
        },
        { 
          id: 207, time: '17:30', location: '丸七豬排飯', desc: '【 晚餐 】現場排隊', type: 'food',
          address: {url : "https://maps.app.goo.gl/cx1NcrpPWzB3a6gWA"}
        }
      ]
    },
    {
      id: 3,
      title: 'Day 3: 明治神宮、澀谷與新宿',
      items: [
        { 
          id: 301, time: '8:30', location: '池袋 => 原宿', desc: '搭乘【JR 山手線】前往原宿', type: 'transport'
        },
        { 
          id: 302, time: '09:15', location: '明治神宮', desc: '森林參拜、原宿門口有 I’m donut ?', type: 'attraction',
          address: {url : "https://maps.app.goo.gl/Pgn34gCVACb2fdvj7"}
        },
        { 
          id: 303, time: '12:15', location: 'I’m donut ?', desc: '超人氣甜甜圈', type: 'food',
          address: {url : "https://maps.app.goo.gl/UcG8sWtExjjeE5Nb9"}
        },
        { 
          id: 304, time: '12:45', location: '原宿 => 澀谷', desc: '搭乘【JR 山手線】前往澀谷', type: 'transport'
        },
        { 
          id: 305, time: '13:00', location: '澀谷', desc: '逛逛、買點零食', type: 'attraction',
          address: {url : "https://maps.app.goo.gl/rq93cYE6rSyWV9MD9"}
        },
        { 
          id: 306, time: '16:15', location: '澀谷 => 新宿', desc: '搭乘【JR 山手線】前往新宿', type: 'transport'
        },
        { 
          id: 307, time: '17:15', location: '牛舌的檸檬(新宿)', desc: '【晚餐】厚切牛舌', type: 'food',
          address: {url : "https://maps.app.goo.gl/c7BJQgPuJwRKr6Ei9"}
        },
        { 
          id: 308, time: '18:30', location: '新宿', desc: '逛街', type: 'attraction'
        },
        { 
          id: 309, time: '21:30', location: '池袋大都會飯店', desc: '飯店休息', type: 'attraction',address: {url: "https://maps.app.goo.gl/dYJD8FRBUY2ZWnG2A"}
        }
      ]
    },
    {
      id: 4,
      title: 'Day 4: 箱根一日遊',
      items: [
        { 
          id: 401, time: '8:00', location: '池袋 => 箱根湯本', desc: '搭乘【JR 山手線】前往新宿、搭乘【浪漫特快】前往箱根湯本', type: 'transport'
        },
        { 
          id: 402, time: '10:30', location: '箱根神社-平和鳥居', desc: '打卡拍照', type: 'attraction',
          address: {url : "https://maps.app.goo.gl/PCEuVHXHaqw9sqsv8"}
        },
        { 
          id: 403, time: '11:30', location: '乘坐 蘆之湖海盜船', desc: '從元箱根港 => 桃園台港，沿途看風景', type: 'attraction',
          address: {url : "https://maps.app.goo.gl/v8BGdbf71bC3B7Nm6"}
        },
        { 
          id: 404, time: '12:30', location: '大涌谷', desc: '搭乘纜車前往，買黑蛋 & 吃中餐', type: 'attraction',
          address: {url : "https://maps.app.goo.gl/ayygcEemSnykVSGeA"}
        },
        { 
          id: 405, time: '14:30', location: '箱根湯療', desc: '搭乘公車前往，泡湯體驗', type: 'attraction',
          address: {url : "https://maps.app.goo.gl/qsvTxZXgKayPbtjV7"}
        },
        { 
          id: 406, time: '16:30', location: '商店街', desc: '買伴手禮、北条三福だんご(糰子)', type: 'attraction',
          address: {url : "https://maps.app.goo.gl/1T2FHSkbpRH6pSF17"}
        },
        { 
          id: 407, time: '17:30', location: '箱根湯本 => 池袋', desc: '搭乘【浪漫特快】前往新宿、搭乘【JR 山手線】前往池袋', type: 'transport'
        },
        { 
          id: 408, time: '19:30', location: '池袋大都會飯店', desc: '飯店休息', type: 'attraction',address: {url: "https://maps.app.goo.gl/dYJD8FRBUY2ZWnG2A"}
        }
      ]
    },
    {
      id: 5,
      title: 'Day 5: 搭飛機回國',
      items: [
        { 
          id: 501, time: '08:30', location: '池袋 => 成田機場', desc: '搭乘 利木津巴士 or JR 山手線 + Skyliner', type: 'transport',
          address : {url : "https://maps.app.goo.gl/zv26HGxhmbADYKUt5"}
        },
        { 
          id: 502, time: '10:00', location: '成田機場 1 航廈', desc: '報到、過海關', type: 'transport',
          address : {url : "https://maps.app.goo.gl/zv26HGxhmbADYKUt5"}
        },
        { 
          id: 503, time: '16:05', location: '桃園機場 2 航廈', desc: '出境、領行李、寄放行李', type: 'transport',
          address : {url : "https://maps.app.goo.gl/9r4fdYbCSETm4x1x9"}
        },
      ]
    }
  ]
}
