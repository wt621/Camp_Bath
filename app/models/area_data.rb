class AreaData
  REGIONS = {
    hokkaido_tohoku: {
      name: "北海道・東北地方",
      prefectures: {
        hokkaido: {
          name: "北海道",
          areas: [
            { name: "札幌エリア", latitude: 43.0642, longitude: 141.3469 },
            { name: "函館エリア", latitude: 41.7688, longitude: 140.7289 },
            { name: "旭川エリア", latitude: 43.7706, longitude: 142.3650 },
            { name: "釧路エリア", latitude: 42.9849, longitude: 144.3820 },
            { name: "帯広エリア", latitude: 42.9236, longitude: 143.1945 }
          ]
        },
        aomori: {
          name: "青森県",
          areas: [
            { name: "青森市エリア", latitude: 40.8244, longitude: 140.7400 },
            { name: "八戸エリア", latitude: 40.5126, longitude: 141.4882 },
            { name: "弘前エリア", latitude: 40.6032, longitude: 140.4636 }
          ]
        },
        iwate: {
          name: "岩手県",
          areas: [
            { name: "盛岡エリア", latitude: 39.7036, longitude: 141.1527 },
            { name: "花巻エリア", latitude: 39.3889, longitude: 141.1138 }
          ]
        },
        miyagi: {
          name: "宮城県",
          areas: [
            { name: "仙台エリア", latitude: 38.2682, longitude: 140.8694 },
            { name: "石巻エリア", latitude: 38.4344, longitude: 141.3028 }
          ]
        },
        akita: {
          name: "秋田県",
          areas: [
            { name: "秋田市エリア", latitude: 39.7186, longitude: 140.1024 },
            { name: "大館エリア", latitude: 40.2724, longitude: 140.5661 }
          ]
        },
        yamagata: {
          name: "山形県",
          areas: [
            { name: "山形市エリア", latitude: 38.2404, longitude: 140.3633 },
            { name: "米沢エリア", latitude: 37.9223, longitude: 140.1172 }
          ]
        },
        fukushima: {
          name: "福島県",
          areas: [
            { name: "福島市エリア", latitude: 37.7608, longitude: 140.4747 },
            { name: "郡山エリア", latitude: 37.4000, longitude: 140.3500 },
            { name: "会津若松エリア", latitude: 37.4950, longitude: 139.9297 }
          ]
        }
      }
    },
    kanto: {
      name: "関東地方",
      prefectures: {
        ibaraki: {
          name: "茨城県",
          areas: [
            { name: "水戸エリア", latitude: 36.3418, longitude: 140.4468 },
            { name: "つくばエリア", latitude: 36.0839, longitude: 140.0764 }
          ]
        },
        tochigi: {
          name: "栃木県",
          areas: [
            { name: "宇都宮エリア", latitude: 36.5658, longitude: 139.8836 },
            { name: "日光エリア", latitude: 36.7199, longitude: 139.6982 }
          ]
        },
        gunma: {
          name: "群馬県",
          areas: [
            { name: "前橋エリア", latitude: 36.3911, longitude: 139.0608 },
            { name: "高崎エリア", latitude: 36.3228, longitude: 139.0036 }
          ]
        },
        saitama: {
          name: "埼玉県",
          areas: [
            { name: "さいたま市エリア", latitude: 35.8617, longitude: 139.6455 },
            { name: "川越エリア", latitude: 35.9083, longitude: 139.4856 },
            { name: "秩父エリア", latitude: 35.9914, longitude: 139.0858 }
          ]
        },
        chiba: {
          name: "千葉県",
          areas: [
            { name: "千葉市エリア", latitude: 35.6074, longitude: 140.1065 },
            { name: "房総エリア", latitude: 35.1147, longitude: 140.0989 }
          ]
        },
        tokyo: {
          name: "東京都",
          areas: [
            { name: "23区エリア", latitude: 35.6895, longitude: 139.6917 },
            { name: "多摩エリア", latitude: 35.6544, longitude: 139.3815 },
            { name: "奥多摩エリア", latitude: 35.8094, longitude: 139.0956 }
          ]
        },
        kanagawa: {
          name: "神奈川県",
          areas: [
            { name: "横浜エリア", latitude: 35.4437, longitude: 139.6380 },
            { name: "湘南エリア", latitude: 35.3362, longitude: 139.4802 },
            { name: "箱根エリア", latitude: 35.2321, longitude: 139.1070 }
          ]
        }
      }
    },
    chubu: {
      name: "中部地方",
      prefectures: {
        niigata: {
          name: "新潟県",
          areas: [
            { name: "新潟市エリア", latitude: 37.9161, longitude: 139.0364 },
            { name: "長岡エリア", latitude: 37.4461, longitude: 138.8512 }
          ]
        },
        toyama: {
          name: "富山県",
          areas: [
            { name: "富山市エリア", latitude: 36.6953, longitude: 137.2113 },
            { name: "高岡エリア", latitude: 36.7525, longitude: 137.0242 }
          ]
        },
        ishikawa: {
          name: "石川県",
          areas: [
            { name: "金沢エリア", latitude: 36.5946, longitude: 136.6256 },
            { name: "能登エリア", latitude: 37.2294, longitude: 136.9617 }
          ]
        },
        fukui: {
          name: "福井県",
          areas: [
            { name: "福井市エリア", latitude: 36.0652, longitude: 136.2217 },
            { name: "敦賀エリア", latitude: 35.6453, longitude: 136.0563 }
          ]
        },
        yamanashi: {
          name: "山梨県",
          areas: [
            { name: "甲府エリア", latitude: 35.6638, longitude: 138.5683 },
            { name: "富士五湖エリア", latitude: 35.5022, longitude: 138.7636 }
          ]
        },
        nagano: {
          name: "長野県",
          areas: [
            { name: "長野市エリア", latitude: 36.6513, longitude: 138.1810 },
            { name: "松本エリア", latitude: 36.2380, longitude: 137.9720 },
            { name: "軽井沢エリア", latitude: 36.3567, longitude: 138.6328 }
          ]
        },
        gifu: {
          name: "岐阜県",
          areas: [
            { name: "岐阜市エリア", latitude: 35.4233, longitude: 136.7606 },
            { name: "高山エリア", latitude: 36.1460, longitude: 137.2520 }
          ]
        },
        shizuoka: {
          name: "静岡県",
          areas: [
            { name: "静岡市エリア", latitude: 34.9769, longitude: 138.3830 },
            { name: "浜松エリア", latitude: 34.7108, longitude: 137.7261 },
            { name: "伊豆エリア", latitude: 34.9756, longitude: 138.9469 }
          ]
        },
        aichi: {
          name: "愛知県",
          areas: [
            { name: "名古屋エリア", latitude: 35.1815, longitude: 136.9066 },
            { name: "豊田エリア", latitude: 35.0828, longitude: 137.1560 }
          ]
        }
      }
    },
    kinki: {
      name: "近畿地方",
      prefectures: {
        mie: {
          name: "三重県",
          areas: [
            { name: "津エリア", latitude: 34.7303, longitude: 136.5086 },
            { name: "伊勢エリア", latitude: 34.4869, longitude: 136.7101 }
          ]
        },
        shiga: {
          name: "滋賀県",
          areas: [
            { name: "大津エリア", latitude: 35.0045, longitude: 135.8686 },
            { name: "彦根エリア", latitude: 35.2745, longitude: 136.2593 }
          ]
        },
        kyoto: {
          name: "京都府",
          areas: [
            { name: "京都市エリア", latitude: 35.0116, longitude: 135.7681 },
            { name: "宇治エリア", latitude: 34.8844, longitude: 135.7999 }
          ]
        },
        osaka: {
          name: "大阪府",
          areas: [
            { name: "大阪市エリア", latitude: 34.6937, longitude: 135.5023 },
            { name: "堺エリア", latitude: 34.5733, longitude: 135.4830 }
          ]
        },
        hyogo: {
          name: "兵庫県",
          areas: [
            { name: "神戸エリア", latitude: 34.6901, longitude: 135.1955 },
            { name: "姫路エリア", latitude: 34.8522, longitude: 134.6850 }
          ]
        },
        nara: {
          name: "奈良県",
          areas: [
            { name: "奈良市エリア", latitude: 34.6851, longitude: 135.8050 },
            { name: "橿原エリア", latitude: 34.5078, longitude: 135.7925 }
          ]
        },
        wakayama: {
          name: "和歌山県",
          areas: [
            { name: "和歌山市エリア", latitude: 34.2261, longitude: 135.1675 },
            { name: "白浜エリア", latitude: 33.6833, longitude: 135.3500 }
          ]
        }
      }
    },
    chugoku: {
      name: "中国地方",
      prefectures: {
        tottori: {
          name: "鳥取県",
          areas: [
            { name: "鳥取市エリア", latitude: 35.5014, longitude: 134.2383 },
            { name: "米子エリア", latitude: 35.4286, longitude: 133.3303 }
          ]
        },
        shimane: {
          name: "島根県",
          areas: [
            { name: "松江エリア", latitude: 35.4722, longitude: 133.0506 },
            { name: "出雲エリア", latitude: 35.3667, longitude: 132.7556 }
          ]
        },
        okayama: {
          name: "岡山県",
          areas: [
            { name: "岡山市エリア", latitude: 34.6617, longitude: 133.9350 },
            { name: "倉敷エリア", latitude: 34.5847, longitude: 133.7722 }
          ]
        },
        hiroshima: {
          name: "広島県",
          areas: [
            { name: "広島市エリア", latitude: 34.3853, longitude: 132.4553 },
            { name: "福山エリア", latitude: 34.4858, longitude: 133.3622 }
          ]
        },
        yamaguchi: {
          name: "山口県",
          areas: [
            { name: "山口市エリア", latitude: 34.1858, longitude: 131.4706 },
            { name: "下関エリア", latitude: 33.9578, longitude: 130.9408 }
          ]
        }
      }
    },
    shikoku: {
      name: "四国地方",
      prefectures: {
        tokushima: {
          name: "徳島県",
          areas: [
            { name: "徳島市エリア", latitude: 34.0658, longitude: 134.5594 },
            { name: "鳴門エリア", latitude: 34.1775, longitude: 134.6097 }
          ]
        },
        kagawa: {
          name: "香川県",
          areas: [
            { name: "高松エリア", latitude: 34.3428, longitude: 134.0436 },
            { name: "丸亀エリア", latitude: 34.2897, longitude: 133.7986 }
          ]
        },
        ehime: {
          name: "愛媛県",
          areas: [
            { name: "松山エリア", latitude: 33.8416, longitude: 132.7657 },
            { name: "今治エリア", latitude: 34.0667, longitude: 132.9978 }
          ]
        },
        kochi: {
          name: "高知県",
          areas: [
            { name: "高知市エリア", latitude: 33.5597, longitude: 133.5311 },
            { name: "四万十エリア", latitude: 33.0089, longitude: 132.9342 }
          ]
        }
      }
    },
    kyushu_okinawa: {
      name: "九州・沖縄地方",
      prefectures: {
        fukuoka: {
          name: "福岡県",
          areas: [
            { name: "福岡市エリア", latitude: 33.5904, longitude: 130.4017 },
            { name: "北九州エリア", latitude: 33.8834, longitude: 130.8751 }
          ]
        },
        saga: {
          name: "佐賀県",
          areas: [
            { name: "佐賀市エリア", latitude: 33.2494, longitude: 130.2989 },
            { name: "唐津エリア", latitude: 33.4497, longitude: 129.9689 }
          ]
        },
        nagasaki: {
          name: "長崎県",
          areas: [
            { name: "長崎市エリア", latitude: 32.7503, longitude: 129.8777 },
            { name: "佐世保エリア", latitude: 33.1806, longitude: 129.7147 }
          ]
        },
        kumamoto: {
          name: "熊本県",
          areas: [
            { name: "熊本市エリア", latitude: 32.8031, longitude: 130.7079 },
            { name: "阿蘇エリア", latitude: 32.8842, longitude: 131.1264 }
          ]
        },
        oita: {
          name: "大分県",
          areas: [
            { name: "大分市エリア", latitude: 33.2382, longitude: 131.6126 },
            { name: "別府エリア", latitude: 33.2845, longitude: 131.4912 }
          ]
        },
        miyazaki: {
          name: "宮崎県",
          areas: [
            { name: "宮崎市エリア", latitude: 31.9077, longitude: 131.4202 },
            { name: "日南エリア", latitude: 31.5989, longitude: 131.3778 }
          ]
        },
        kagoshima: {
          name: "鹿児島県",
          areas: [
            { name: "鹿児島市エリア", latitude: 31.5969, longitude: 130.5571 },
            { name: "霧島エリア", latitude: 31.7444, longitude: 130.7622 }
          ]
        },
        okinawa: {
          name: "沖縄県",
          areas: [
            { name: "那覇エリア", latitude: 26.2124, longitude: 127.6809 },
            { name: "石垣島エリア", latitude: 24.3397, longitude: 124.1561 }
          ]
        }
      }
    }
  }

  def self.all_regions
    REGIONS
  end

  def self.prefectures_by_region(region_key)
    REGIONS.dig(region_key.to_sym, :prefectures) || {}
  end

  def self.areas_by_prefecture(region_key, prefecture_key)
    REGIONS.dig(region_key.to_sym, :prefectures, prefecture_key.to_sym, :areas) || []
  end
end
