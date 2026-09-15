export interface Brand {
  id: string;
  name: string;
  logoUrl: string;
}

export interface PhoneModel {
  id: string;
  brandId: string;
  modelName: string;
  lcdScreenCode: string;
  imageUrl?: string;
  icChipCode?: string;
  screenProtectorCode?: string;
  batteryCode?: string;
  fpcPins?: string;
  displayType?: string;
  screenSize?: string;
  alternativeNames?: string;
  repairDifficulty?: 'Easy' | 'Medium' | 'Hard' | 'سهل' | 'متوسط' | 'صعب';
  touchIcModel?: string;
}

export function getCategoryCode(model: PhoneModel, category: string): string {
  switch (category) {
    case 'LCD':
      return model.lcdScreenCode;
    case 'IC':
      return model.icChipCode || `${model.lcdScreenCode.replace('-LCD', '')}-IC`;
    case 'SCREEN_PROTECTOR':
      return model.screenProtectorCode || `${model.lcdScreenCode.replace('-LCD', '')}-GLASS`;
    case 'BATTERY':
      return model.batteryCode || `${model.lcdScreenCode.replace('-LCD', '')}-BATT`;
    default:
      return model.lcdScreenCode;
  }
}

export function formatDisplayCode(code: string, language: 'en' | 'ar'): string {
  if (!code) return '';
  const mapping: { [key: string]: string } = {
    'UNI-X6515-LCD': 'X6515 / X6517 / X663 / X669',
    'UNI-X6531-LCD': 'X6531 / X6532 / X6720 / LK 5',
    'UNI-X6816-LCD': 'X6816 / X6825 / LG 6',
    'UNI-X6525-LCD': 'X6525 / X6528',
    'UNI-X688-LCD': 'X688',
    'UNI-X650-LCD': 'X650',
    'UNI-X653-LCD': 'X653 / BB4K',
    'UNI-KE5-LCD': 'KE5',
    'UNI-X657-LCD': 'X657',
    'UNI-X668-LCD': 'X668 / BE8',
    'UNI-X682-LCD': 'X682',
    'UNI-X689-LCD': 'X689',
    'UNI-KG6K-LCD': 'KG6K / X6511',
    'UNI-X6812-LCD': 'X6812 / X6815 / X6827 / CG 7',
    'UNI-X693-LCD': 'X693 / X697',
    'UNI-LC7-LCD': 'LC7',
    'UNI-X680-LCD': 'X680',
    'UNI-X6512-LCD': 'X6512',
    'UNI-X6511-LCD': 'X6511',
    'UNI-X660-LCD': 'X660',
    'UNI-RLM-C55-LCD': 'Realme C55 / C67 / Oppo A58 / A79 / A98 / OnePlus Nord N30',
    'BN5X': 'BN5X (Redmi 14C / Poco C75 / Redmi A3 Pro)',
    'BN56-BN5F-BN5G': 'BN56-BN5F-BN5G (Redmi 9A, 9C, A1, A2, 10A, Poco C3 / C31)',
    'BN46': 'BN46 (Redmi Note 8, Note 8T, Note 6 / Pro, Redmi 7)',
    'GGL-PX9_9PRO-GLASS': 'Google Pixel 9 / Pixel 9 Pro',
    'GGL-PX9_9PRO-BATT': 'Google Pixel 9 / Pixel 9 Pro',
    'IPA-12_12PRO-OLED': 'iPhone 12 / iPhone 12 Pro (Screen)',
    'IPA-12_12PRO-GLASS': 'iPhone 12 / iPhone 12 Pro (Screen Protector)',
    'IPA-13_14-GLASS': 'iPhone 13 / 13 Pro / 14 (Screen Protector)',
    'IPA-13PM_14PLUS-GLASS': 'iPhone 13 Pro Max / 14 Plus (Screen Protector)',
    'IPA-14PRO_15-GLASS': 'iPhone 14 Pro / iPhone 15 (Screen Protector)',
    'IPA-14PROM_15PLUS-GLASS': 'iPhone 14 Pro Max / iPhone 15 Plus (Screen Protector)',
    'SAM-S25_S25P-GLASS': 'Samsung Galaxy S25 / S25+ (Screen Protector)',
    'SAM-S24_S23-GLASS': 'Samsung Galaxy S24 / S23 (Screen Protector)',
    'SAM-S24P_S23P-GLASS': 'Samsung Galaxy S24+ / S23+ (Screen Protector)',
    'XIA-N14P-GLASS': 'Redmi Note 14 Pro / Note 14 Pro+ (Screen Protector)',
    'OPP-A18-LCD': 'Oppo A18 / A38 (CPH2591, CPH2579)',
    'XIA-R13C-LCD': 'Redmi 13C / Poco C65',
    'UNI-SPK20_HOT40-LCD': 'Tecno Spark 20 / Spark 20 Pro / Infinix Hot 40 / Hot 40 Pro',
    'IPA-7_8_SE-LCD': 'iPhone 7 / iPhone 8 / iPhone SE 2020 / iPhone SE 2022',
    'IPA-7P_8P-LCD': 'iPhone 7 Plus / iPhone 8 Plus',
    'IPA-X_XS-OLED': 'iPhone X / iPhone XS',
    'IPA-XR_11-LCD': 'iPhone XR / iPhone 11',
    'IPA-11P_XSM-OLED': 'iPhone 11 Pro / iPhone XS Max',
    'IPA-16P_16PM-OLED': 'iPhone 16 Pro / iPhone 16 Pro Max',
    'OPP-A3S_RLM_C1-LCD': 'Oppo A3s / Oppo A5 / Realme C1 / Realme 2',
    'OPP-A5S_A12-LCD': 'Oppo A5s / Oppo A7 / Oppo A12 / Oppo A11k / Realme 3 / Realme C2',
    'OPP-A53_A32-LCD': 'Oppo A53 / Oppo A32 / Oppo A33 (90Hz)',
    'SAM-J7PRIME-LCD': 'Samsung Galaxy J7 Prime / On7 2016 (G610F / G610M)',
    'SAM-J5PRIME-LCD': 'Samsung Galaxy J5 Prime / On5 2016 (G570F)',
    'SAM-GRANDPRIME-LCD': 'Samsung Galaxy Grand Prime Plus (G532F / G530)',
    'SAM-A50_A30_A20-AMOLED': 'Samsung Galaxy A50 / A30s / A30 / A20 (OLED 6.4")',
    'SAM-A51_A50S-AMOLED': 'Samsung Galaxy A51 4G / A50s',
    'SAM-A54_A55-AMOLED': 'Samsung Galaxy A54 5G / Galaxy A55 5G',
    'SAM-S24U_S23U-GLASS': 'Samsung Galaxy S24 Ultra / Galaxy S23 Ultra',
    'XIA-RN8_8T-LCD': 'Xiaomi Redmi Note 8 / Redmi Note 8T',
    'XIA-RN7_7P-LCD': 'Xiaomi Redmi Note 7 / Redmi Note 7 Pro',
    'XIA-RN13_12-AMOLED': 'Xiaomi Redmi Note 13 4G / Redmi Note 12 4G',
    'HW-NOVA3I-LCD': 'Huawei Nova 3i / P Smart Plus',
    'HW-Y7_2019-LCD': 'Huawei Y7 2019 / Y7 Prime / Y7 Pro 2019',
    'HW-Y6_2019-LCD': 'Huawei Y6 2019 / Y6 Prime 2019 / Y6s / Honor 8A',
    'HON-X7B_HON90L-LCD': 'Honor X7b / Honor 90 Lite'
  };
  
  if (mapping[code]) {
    return `${language === 'ar' ? 'توافق: ' : 'Universal: '}${mapping[code]}`;
  }
  return code;
}

export interface CommunitySuggestion {
  id: string;
  brand: string;
  model: string;
  suggestedCompatibleCode: string;
  likesCount: number;
  dislikesCount: number;
  isApproved: boolean;
  imageUrl?: string;
}

export const brands: Brand[] = [
  { id: 'b1', name: 'Samsung', logoUrl: 'https://logo.clearbit.com/samsung.com' },
  { id: 'b2', name: 'Apple', logoUrl: 'https://logo.clearbit.com/apple.com' },
  { id: 'b3', name: 'Huawei', logoUrl: 'https://logo.clearbit.com/huawei.com' },
  { id: 'b4', name: 'Xiaomi', logoUrl: 'https://logo.clearbit.com/mi.com' },
  { id: 'b5', name: 'Oppo', logoUrl: 'https://logo.clearbit.com/oppo.com' },
  { id: 'b6', name: 'Vivo', logoUrl: 'https://logo.clearbit.com/vivo.com' },
  { id: 'b7', name: 'Realme', logoUrl: 'https://logo.clearbit.com/realme.com' },
  { id: 'b8', name: 'Infinix', logoUrl: 'https://logo.clearbit.com/infinixmobility.com' },
  { id: 'b9', name: 'Tecno', logoUrl: 'https://logo.clearbit.com/tecno-mobile.com' },
  { id: 'b10', name: 'Itel', logoUrl: 'https://logo.clearbit.com/itel-mobile.com' },
  { id: 'b11', name: 'HONOR', logoUrl: 'https://logo.clearbit.com/honor.com' },
  { id: 'b12', name: 'OnePlus', logoUrl: 'https://logo.clearbit.com/oneplus.com' },
  { id: 'b13', name: 'Google', logoUrl: 'https://logo.clearbit.com/google.com' },
];

export const phoneModels: PhoneModel[] = [
  // --- HONOR ---
  { id: 'h1', brandId: 'b11', modelName: 'Honor 10', lcdScreenCode: 'HON-10-LCD' },
  { id: 'h2', brandId: 'b11', modelName: 'Honor 10i', lcdScreenCode: 'HW-6.21-LCD' },
  { id: 'h3', brandId: 'b11', modelName: 'Honor 10 Lite', lcdScreenCode: 'HW-6.21-LCD' },
  { id: 'h4', brandId: 'b11', modelName: 'Honor 20i', lcdScreenCode: 'HW-6.21-LCD' },
  { id: 'h5', brandId: 'b11', modelName: 'Honor 8A', lcdScreenCode: 'HW-6.09-LCD' },
  { id: 'h6', brandId: 'b11', modelName: 'Honor 8S', lcdScreenCode: 'HW-5.71-LCD' },
  { id: 'h7', brandId: 'b11', modelName: 'Honor 8X', lcdScreenCode: 'HON-8X-LCD' },
  { id: 'h8', brandId: 'b11', modelName: 'Honor 7A 5.45', lcdScreenCode: 'HW-5.45-LCD' },
  { id: 'h9', brandId: 'b11', modelName: 'Honor 7s', lcdScreenCode: 'HW-5.45-LCD' },
  { id: 'h10', brandId: 'b11', modelName: 'Honor 9 Lite', lcdScreenCode: 'HUW-P-SMART-LCD' },
  { id: 'h11', brandId: 'b11', modelName: 'Honor X7a', lcdScreenCode: 'HON-X7A-LCD' },
  { id: 'h12', brandId: 'b11', modelName: 'Honor X8', lcdScreenCode: 'HON-X8-LCD' },
  { id: 'h13', brandId: 'b11', modelName: 'Honor 90 Lite', lcdScreenCode: 'HON-90L-LCD' },
  { id: 'h14', brandId: 'b11', modelName: 'Honor Magic 5 Lite', lcdScreenCode: 'HON-M5L-LCD' },

  // --- SAMSUNG ---
  { id: 'sa1', brandId: 'b1', modelName: 'Samsung A01 (A015F)', lcdScreenCode: 'SAM-A01-LCD' },
  { id: 'sa2', brandId: 'b1', modelName: 'Samsung A01 Core', lcdScreenCode: 'SAM-A01C-LCD' },
  { id: 'sa3', brandId: 'b1', modelName: 'Samsung A02 (A022F)', lcdScreenCode: 'SAM-A02-LCD' },
  { id: 'sa4', brandId: 'b1', modelName: 'Samsung A02s (A025F)', lcdScreenCode: 'SAM-A02S-LCD' },
  { id: 'sa5', brandId: 'b1', modelName: 'Samsung A03 (A035F)', lcdScreenCode: 'SAM-A03-LCD' },
  { id: 'sa6', brandId: 'b1', modelName: 'Samsung A03 Core (A032F)', lcdScreenCode: 'SAM-A03C-LCD' },
  { id: 'sa7', brandId: 'b1', modelName: 'Samsung A03s (A037F)', lcdScreenCode: 'SAM-A02S-LCD' },
  { id: 'sa8', brandId: 'b1', modelName: 'Samsung A04 (A045F)', lcdScreenCode: 'SAM-A04-LCD' },
  { id: 'sa9', brandId: 'b1', modelName: 'Samsung A04e (A042F)', lcdScreenCode: 'SAM-A04-LCD' },
  { id: 'sa10', brandId: 'b1', modelName: 'Samsung A04s (A047F)', lcdScreenCode: 'SAM-A12-LCD' },
  { id: 'sa11', brandId: 'b1', modelName: 'Samsung A05 (A055F)', lcdScreenCode: 'SAM-A05-LCD' },
  { id: 'sa12', brandId: 'b1', modelName: 'Samsung A05s (A057F)', lcdScreenCode: 'SAM-A05S-LCD' },
  { id: 'sa13', brandId: 'b1', modelName: 'Samsung A10 (A105F)', lcdScreenCode: 'SAM-A10-LCD' },
  { id: 'sa14', brandId: 'b1', modelName: 'Samsung A10s (A107F)', lcdScreenCode: 'SAM-A10S-LCD' },
  { id: 'sa15', brandId: 'b1', modelName: 'Samsung A11 (A115F)', lcdScreenCode: 'SAM-A11-LCD' },
  { id: 'sa16', brandId: 'b1', modelName: 'Samsung A12 (A125F)', lcdScreenCode: 'SAM-A12-LCD' },
  { id: 'sa17', brandId: 'b1', modelName: 'Samsung A12 Nacho (A127F)', lcdScreenCode: 'SAM-A12-LCD' },
  { id: 'sa18', brandId: 'b1', modelName: 'Samsung A13 4G (A135F)', lcdScreenCode: 'SAM-A13-LCD' },
  { id: 'sa19', brandId: 'b1', modelName: 'Samsung A13 5G (A136B)', lcdScreenCode: 'SAM-A13C-LCD' },
  { id: 'sa20', brandId: 'b1', modelName: 'Samsung A14 4G (A145F)', lcdScreenCode: 'SAM-A14-LCD' },
  { id: 'sa21', brandId: 'b1', modelName: 'Samsung A14 5G (A146B)', lcdScreenCode: 'SAM-A14-LCD' },
  { id: 'sa22', brandId: 'b1', modelName: 'Samsung A15 4G/5G', lcdScreenCode: 'SAM-A15-AMOLED' },
  { id: 'sa23', brandId: 'b1', modelName: 'Samsung A20 (A205F)', lcdScreenCode: 'SAM-A20-AMOLED' },
  { id: 'sa24', brandId: 'b1', modelName: 'Samsung A20e', lcdScreenCode: 'SAM-A20E-LCD' },
  { id: 'sa25', brandId: 'b1', modelName: 'Samsung A20s (A207F)', lcdScreenCode: 'SAM-A20S-LCD' },
  { id: 'sa26', brandId: 'b1', modelName: 'Samsung A21s (A217F)', lcdScreenCode: 'SAM-A21S-LCD' },
  { id: 'sa27', brandId: 'b1', modelName: 'Samsung A22 4G (A225F)', lcdScreenCode: 'SAM-A22-AMOLED' },
  { id: 'sa28', brandId: 'b1', modelName: 'Samsung A22 5G (A226B)', lcdScreenCode: 'SAM-A22-LCD' },
  { id: 'sa29', brandId: 'b1', modelName: 'Samsung A23 4G (A235F)', lcdScreenCode: 'SAM-A23-LCD' },
  { id: 'sa30', brandId: 'b1', modelName: 'Samsung A23 5G (A236B)', lcdScreenCode: 'SAM-A23-LCD' },
  { id: 'sa31', brandId: 'b1', modelName: 'Samsung A24 4G (A245F)', lcdScreenCode: 'SAM-A24-AMOLED' },
  { id: 'sa32', brandId: 'b1', modelName: 'Samsung A25 5G (A256B)', lcdScreenCode: 'SAM-A25-AMOLED' },
  { id: 'sa33', brandId: 'b1', modelName: 'Samsung A30 (A305F)', lcdScreenCode: 'SAM-A30-AMOLED' },
  { id: 'sa34', brandId: 'b1', modelName: 'Samsung A30s (A307F)', lcdScreenCode: 'SAM-A30-AMOLED' },
  { id: 'sa35', brandId: 'b1', modelName: 'Samsung A31 (A315F)', lcdScreenCode: 'SAM-A31-AMOLED' },
  { id: 'sa36', brandId: 'b1', modelName: 'Samsung A32 4G (A325F)', lcdScreenCode: 'SAM-A32-AMOLED' },
  { id: 'sa37', brandId: 'b1', modelName: 'Samsung A32 5G (A326B)', lcdScreenCode: 'SAM-A32-LCD' },
  { id: 'sa38', brandId: 'b1', modelName: 'Samsung A33 5G (A336B)', lcdScreenCode: 'SAM-A33-AMOLED' },
  { id: 'sa39', brandId: 'b1', modelName: 'Samsung A34 5G (A346B)', lcdScreenCode: 'SAM-A34-AMOLED' },
  { id: 'sa40', brandId: 'b1', modelName: 'Samsung A35 5G (A356B)', lcdScreenCode: 'SAM-A35-AMOLED' },
  { id: 'sa41', brandId: 'b1', modelName: 'Samsung A50 (A505F)', lcdScreenCode: 'SAM-A50-AMOLED' },
  { id: 'sa42', brandId: 'b1', modelName: 'Samsung A51 4G (A515F)', lcdScreenCode: 'SAM-A51-AMOLED' },
  { id: 'sa43', brandId: 'b1', modelName: 'Samsung A51 5G (A516B)', lcdScreenCode: 'SAM-A51-AMOLED' },
  { id: 'sa44', brandId: 'b1', modelName: 'Samsung A52 4G/5G', lcdScreenCode: 'SAM-A52-AMOLED' },
  { id: 'sa45', brandId: 'b1', modelName: 'Samsung A52s 5G (A528B)', lcdScreenCode: 'SAM-A52-AMOLED' },
  { id: 'sa46', brandId: 'b1', modelName: 'Samsung A53 5G (A536B)', lcdScreenCode: 'SAM-A53-AMOLED' },
  { id: 'sa47', brandId: 'b1', modelName: 'Samsung A54 5G (A546B)', lcdScreenCode: 'SAM-A54-AMOLED' },
  { id: 'sa48', brandId: 'b1', modelName: 'Samsung A55 5G (A556B)', lcdScreenCode: 'SAM-A55-AMOLED' },
  { id: 'sa49', brandId: 'b1', modelName: 'Samsung A70 (A705F)', lcdScreenCode: 'SAM-A70-AMOLED' },
  { id: 'sa50', brandId: 'b1', modelName: 'Samsung A71 4G (A715F)', lcdScreenCode: 'SAM-A71-AMOLED' },
  { id: 'sa51', brandId: 'b1', modelName: 'Samsung A72 4G/5G (A725F)', lcdScreenCode: 'SAM-A72-AMOLED' },
  { id: 'sa52', brandId: 'b1', modelName: 'Samsung A73 5G (A736B)', lcdScreenCode: 'SAM-A73-AMOLED' },
  { id: 'sa53', brandId: 'b1', modelName: 'Samsung M10 (M105F)', lcdScreenCode: 'SAM-A10-LCD' },
  { id: 'sa54', brandId: 'b1', modelName: 'Samsung M11 (M115F)', lcdScreenCode: 'SAM-A11-LCD' },
  { id: 'sa55', brandId: 'b1', modelName: 'Samsung M12 (M127F)', lcdScreenCode: 'SAM-A12-LCD' },
  { id: 'sa56', brandId: 'b1', modelName: 'Samsung M20 (M205F)', lcdScreenCode: 'SAM-M20-LCD' },
  { id: 'sa57', brandId: 'b1', modelName: 'Samsung M21 (M215F)', lcdScreenCode: 'SAM-M21-AMOLED' },
  { id: 'sa58', brandId: 'b1', modelName: 'Samsung M30 (M305F)', lcdScreenCode: 'SAM-M30-AMOLED' },
  { id: 'sa59', brandId: 'b1', modelName: 'Samsung M30s (M307F)', lcdScreenCode: 'SAM-M30-AMOLED' },
  { id: 'sa60', brandId: 'b1', modelName: 'Samsung M31 (M315F)', lcdScreenCode: 'SAM-M31-AMOLED' },
  { id: 'sa61', brandId: 'b1', modelName: 'Samsung M31s (M317F)', lcdScreenCode: 'SAM-M31S-AMOLED' },
  { id: 'sa62', brandId: 'b1', modelName: 'Samsung M51 (M515F)', lcdScreenCode: 'SAM-M51-AMOLED' },

  // --- SAMSUNG HIGH-END SERIES ---
  { id: 'sa_s23', brandId: 'b1', modelName: 'Samsung Galaxy S23', lcdScreenCode: 'SAM-S23-AMOLED', displayType: 'Dynamic AMOLED 2X (120Hz)', screenSize: '6.1 inches', alternativeNames: 'SM-S911B', screenProtectorCode: 'SAM-S24_S23-GLASS', repairDifficulty: 'متوسط' },
  { id: 'sa_s23_plus', brandId: 'b1', modelName: 'Samsung Galaxy S23+', lcdScreenCode: 'SAM-S23P-AMOLED', displayType: 'Dynamic AMOLED 2X (120Hz)', screenSize: '6.6 inches', alternativeNames: 'SM-S916B', screenProtectorCode: 'SAM-S24P_S23P-GLASS', repairDifficulty: 'متوسط' },
  { id: 'sa_s23_ultra', brandId: 'b1', modelName: 'Samsung Galaxy S23 Ultra', lcdScreenCode: 'SAM-S23U-AMOLED', displayType: 'Dynamic AMOLED 2X (120Hz)', screenSize: '6.8 inches', alternativeNames: 'SM-S918B', repairDifficulty: 'صعب' },

  { id: 'sa_s24', brandId: 'b1', modelName: 'Samsung Galaxy S24', lcdScreenCode: 'SAM-S24-AMOLED', displayType: 'Dynamic AMOLED 2X (120Hz)', screenSize: '6.2 inches', alternativeNames: 'SM-S921B', screenProtectorCode: 'SAM-S24_S23-GLASS', repairDifficulty: 'متوسط' },
  { id: 'sa_s24_plus', brandId: 'b1', modelName: 'Samsung Galaxy S24+', lcdScreenCode: 'SAM-S24P-AMOLED', displayType: 'Dynamic AMOLED 2X (120Hz)', screenSize: '6.7 inches', alternativeNames: 'SM-S926B', screenProtectorCode: 'SAM-S24P_S23P-GLASS', repairDifficulty: 'متوسط' },
  { id: 'sa_s24_ultra', brandId: 'b1', modelName: 'Samsung Galaxy S24 Ultra', lcdScreenCode: 'SAM-S24U-AMOLED', displayType: 'Dynamic AMOLED 2X (120Hz)', screenSize: '6.8 inches', alternativeNames: 'SM-S928B', repairDifficulty: 'صعب' },

  { id: 'sa_s25', brandId: 'b1', modelName: 'Samsung Galaxy S25', lcdScreenCode: 'SAM-S25-AMOLED', displayType: 'Dynamic AMOLED 2X (120Hz)', screenSize: '6.2 inches', alternativeNames: 'SM-S931B', screenProtectorCode: 'SAM-S25_S25P-GLASS', repairDifficulty: 'متوسط' },
  { id: 'sa_s25_plus', brandId: 'b1', modelName: 'Samsung Galaxy S25+', lcdScreenCode: 'SAM-S25P-AMOLED', displayType: 'Dynamic AMOLED 2X (120Hz)', screenSize: '6.7 inches', alternativeNames: 'SM-S936B', screenProtectorCode: 'SAM-S25_S25P-GLASS', repairDifficulty: 'متوسط' },
  { id: 'sa_s25_ultra', brandId: 'b1', modelName: 'Samsung Galaxy S25 Ultra', lcdScreenCode: 'SAM-S25U-AMOLED', displayType: 'Dynamic AMOLED 2X (120Hz)', screenSize: '6.9 inches', alternativeNames: 'SM-S938B', repairDifficulty: 'صعب' },

  { id: 'sa_a16_5g', brandId: 'b1', modelName: 'Samsung Galaxy A16 5G', lcdScreenCode: 'SAM-A16-AMOLED', displayType: 'Super AMOLED (90Hz)', screenSize: '6.7 inches', alternativeNames: 'SM-A166B', repairDifficulty: 'سهل' },

  // --- APPLE ---
  { id: 'ap_x', brandId: 'b2', modelName: 'iPhone X', lcdScreenCode: 'IPA-X-OLED', displayType: 'Super Retina OLED', screenSize: '5.8 inches', alternativeNames: 'A1865, A1901', repairDifficulty: 'متوسط' },
  { id: 'ap_xs', brandId: 'b2', modelName: 'iPhone XS', lcdScreenCode: 'IPA-X-OLED', displayType: 'Super Retina OLED', screenSize: '5.8 inches', alternativeNames: 'A1920, A2097', repairDifficulty: 'متوسط' },
  { id: 'ap_xr', brandId: 'b2', modelName: 'iPhone XR', lcdScreenCode: 'IPA-XR-LCD', displayType: 'Liquid Retina IPS LCD', screenSize: '6.1 inches', alternativeNames: 'A1984, A2105', repairDifficulty: 'متوسط' },
  { id: 'ap_xs_max', brandId: 'b2', modelName: 'iPhone XS Max', lcdScreenCode: 'IPA-XSMAX-OLED', displayType: 'Super Retina OLED', screenSize: '6.5 inches', alternativeNames: 'A1921, A2101', repairDifficulty: 'متوسط' },
  
  { id: 'ap_11', brandId: 'b2', modelName: 'iPhone 11', lcdScreenCode: 'IPA-11-LCD', displayType: 'Liquid Retina IPS LCD', screenSize: '6.1 inches', alternativeNames: 'A2111, A2221', repairDifficulty: 'متوسط' },
  { id: 'ap_11_pro', brandId: 'b2', modelName: 'iPhone 11 Pro', lcdScreenCode: 'IPA-11PRO-OLED', displayType: 'Super Retina XDR OLED', screenSize: '5.8 inches', alternativeNames: 'A2160, A2215', repairDifficulty: 'متوسط' },
  { id: 'ap_11_pro_max', brandId: 'b2', modelName: 'iPhone 11 Pro Max', lcdScreenCode: 'IPA-11PROM-OLED', displayType: 'Super Retina XDR OLED', screenSize: '6.5 inches', alternativeNames: 'A2161, A2218', repairDifficulty: 'متوسط' },

  { id: 'ap_12_mini', brandId: 'b2', modelName: 'iPhone 12 mini', lcdScreenCode: 'IPA-12MINI-OLED', displayType: 'Super Retina XDR OLED', screenSize: '5.4 inches', alternativeNames: 'A2176, A2399', repairDifficulty: 'صعب' },
  { id: 'ap_12', brandId: 'b2', modelName: 'iPhone 12', lcdScreenCode: 'IPA-12_12PRO-OLED', displayType: 'Super Retina XDR OLED', screenSize: '6.1 inches', alternativeNames: 'A2172, A2403', screenProtectorCode: 'IPA-12_12PRO-GLASS', repairDifficulty: 'متوسط' },
  { id: 'ap_12_pro', brandId: 'b2', modelName: 'iPhone 12 Pro', lcdScreenCode: 'IPA-12_12PRO-OLED', displayType: 'Super Retina XDR OLED', screenSize: '6.1 inches', alternativeNames: 'A2341, A2407', screenProtectorCode: 'IPA-12_12PRO-GLASS', repairDifficulty: 'متوسط' },
  { id: 'ap_12_pro_max', brandId: 'b2', modelName: 'iPhone 12 Pro Max', lcdScreenCode: 'IPA-12PROM-OLED', displayType: 'Super Retina XDR OLED', screenSize: '6.7 inches', alternativeNames: 'A2342, A2411', repairDifficulty: 'متوسط' },

  { id: 'ap_13_mini', brandId: 'b2', modelName: 'iPhone 13 mini', lcdScreenCode: 'IPA-13MINI-OLED', displayType: 'Super Retina XDR OLED', screenSize: '5.4 inches', alternativeNames: 'A2481, A2628', repairDifficulty: 'صعب' },
  { id: 'ap_13', brandId: 'b2', modelName: 'iPhone 13', lcdScreenCode: 'IPA-13_14-OLED', displayType: 'Super Retina XDR OLED', screenSize: '6.1 inches', alternativeNames: 'A2482, A2633', screenProtectorCode: 'IPA-13_14-GLASS', repairDifficulty: 'متوسط' },
  { id: 'ap_13_pro', brandId: 'b2', modelName: 'iPhone 13 Pro', lcdScreenCode: 'IPA-13PRO-LTPO', displayType: 'Super Retina XDR OLED (120Hz)', screenSize: '6.1 inches', alternativeNames: 'A2483, A2638', screenProtectorCode: 'IPA-13_14-GLASS', repairDifficulty: 'صعب' },
  { id: 'ap_13_pro_max', brandId: 'b2', modelName: 'iPhone 13 Pro Max', lcdScreenCode: 'IPA-13PROM-LTPO', displayType: 'Super Retina XDR OLED (120Hz)', screenSize: '6.7 inches', alternativeNames: 'A2484, A2643', screenProtectorCode: 'IPA-13PM_14PLUS-GLASS', repairDifficulty: 'صعب' },

  { id: 'ap_14', brandId: 'b2', modelName: 'iPhone 14', lcdScreenCode: 'IPA-13_14-OLED', displayType: 'Super Retina XDR OLED', screenSize: '6.1 inches', alternativeNames: 'A2649, A2882', screenProtectorCode: 'IPA-13_14-GLASS', repairDifficulty: 'متوسط' },
  { id: 'ap_14_plus', brandId: 'b2', modelName: 'iPhone 14 Plus', lcdScreenCode: 'IPA-14PLUS-OLED', displayType: 'Super Retina XDR OLED', screenSize: '6.7 inches', alternativeNames: 'A2632, A2886', screenProtectorCode: 'IPA-13PM_14PLUS-GLASS', repairDifficulty: 'متوسط' },
  { id: 'ap_14_pro', brandId: 'b2', modelName: 'iPhone 14 Pro', lcdScreenCode: 'IPA-14PRO-LTPO', displayType: 'LTPO Super Retina XDR OLED (120Hz)', screenSize: '6.1 inches', alternativeNames: 'A2650, A2890', screenProtectorCode: 'IPA-14PRO_15-GLASS', repairDifficulty: 'صعب' },
  { id: 'ap_14_pro_max', brandId: 'b2', modelName: 'iPhone 14 Pro Max', lcdScreenCode: 'IPA-14PROM-LTPO', displayType: 'LTPO Super Retina XDR OLED (120Hz)', screenSize: '6.7 inches', alternativeNames: 'A2651, A2894', screenProtectorCode: 'IPA-14PROM_15PLUS-GLASS', repairDifficulty: 'صعب' },

  { id: 'ap_15', brandId: 'b2', modelName: 'iPhone 15', lcdScreenCode: 'IPA-15-OLED', displayType: 'Super Retina XDR OLED', screenSize: '6.1 inches', alternativeNames: 'A2846, A3090', screenProtectorCode: 'IPA-14PRO_15-GLASS', repairDifficulty: 'متوسط' },
  { id: 'ap_15_plus', brandId: 'b2', modelName: 'iPhone 15 Plus', lcdScreenCode: 'IPA-15PLUS-OLED', displayType: 'Super Retina XDR OLED', screenSize: '6.7 inches', alternativeNames: 'A2847, A3094', screenProtectorCode: 'IPA-14PROM_15PLUS-GLASS', repairDifficulty: 'متوسط' },
  { id: 'ap_15_pro', brandId: 'b2', modelName: 'iPhone 15 Pro', lcdScreenCode: 'IPA-15PRO-LTPO', displayType: 'LTPO Super Retina XDR OLED (120Hz)', screenSize: '6.1 inches', alternativeNames: 'A2848, A3102', screenProtectorCode: 'IPA-15PRO-GLASS', repairDifficulty: 'صعب' },
  { id: 'ap_15_pro_max', brandId: 'b2', modelName: 'iPhone 15 Pro Max', lcdScreenCode: 'IPA-15PROM-LTPO', displayType: 'LTPO Super Retina XDR OLED (120Hz)', screenSize: '6.7 inches', alternativeNames: 'A2849, A3106', screenProtectorCode: 'IPA-15PROM-GLASS', repairDifficulty: 'صعب' },

  { id: 'ap_16', brandId: 'b2', modelName: 'iPhone 16', lcdScreenCode: 'IPA-16-OLED', displayType: 'Super Retina XDR OLED', screenSize: '6.1 inches', alternativeNames: 'A3081, A3287', screenProtectorCode: 'IPA-16-GLASS', repairDifficulty: 'متوسط' },
  { id: 'ap_16_plus', brandId: 'b2', modelName: 'iPhone 16 Plus', lcdScreenCode: 'IPA-16PLUS-OLED', displayType: 'Super Retina XDR OLED', screenSize: '6.7 inches', alternativeNames: 'A3082, A3290', screenProtectorCode: 'IPA-16PLUS-GLASS', repairDifficulty: 'متوسط' },
  { id: 'ap_16_pro', brandId: 'b2', modelName: 'iPhone 16 Pro', lcdScreenCode: 'IPA-16PRO-LTPO', displayType: 'LTPO Super Retina XDR OLED (120Hz)', screenSize: '6.3 inches', alternativeNames: 'A3083, A3293', screenProtectorCode: 'IPA-16PRO-GLASS', repairDifficulty: 'صعب' },
  { id: 'ap_16_pro_max', brandId: 'b2', modelName: 'iPhone 16 Pro Max', lcdScreenCode: 'IPA-16PROM-LTPO', displayType: 'LTPO Super Retina XDR OLED (120Hz)', screenSize: '6.9 inches', alternativeNames: 'A3084, A3296', screenProtectorCode: 'IPA-16PROM-GLASS', repairDifficulty: 'صعب' },

  // --- HUAWEI ---
  { id: 'hw1', brandId: 'b3', modelName: 'Huawei Enjoy 7s', lcdScreenCode: 'HUW-P-SMART-LCD' },
  { id: 'hw2', brandId: 'b3', modelName: 'Huawei P Smart (2019)', lcdScreenCode: 'HW-6.21-LCD' },
  { id: 'hw3', brandId: 'b3', modelName: 'Huawei Y6 (2019)', lcdScreenCode: 'HW-6.09-LCD' },
  { id: 'hw4', brandId: 'b3', modelName: 'Huawei Y5 (2019)', lcdScreenCode: 'HW-5.71-LCD' },
  { id: 'hw5', brandId: 'b3', modelName: 'Huawei Y5 (2018)', lcdScreenCode: 'HW-5.45-LCD' },
  { id: 'hw6', brandId: 'b3', modelName: 'Huawei Y5 Prime (2018)', lcdScreenCode: 'HW-5.45-LCD' },
  { id: 'hw7', brandId: 'b3', modelName: 'Huawei P Smart Plus', lcdScreenCode: 'HUW-PS-PLUS-LCD' },
  { id: 'hw8', brandId: 'b3', modelName: 'Huawei Nova Lite (2017)', lcdScreenCode: 'HUW-P8L-LCD' },
  { id: 'hw9', brandId: 'b3', modelName: 'Huawei P20 Lite', lcdScreenCode: 'HUW-P20L-LCD' },
  { id: 'hw10', brandId: 'b3', modelName: 'Huawei P40 Lite', lcdScreenCode: 'HUW-P40L-LCD' },
  { id: 'hw11', brandId: 'b3', modelName: 'Huawei Y70', lcdScreenCode: 'HUW-Y70-LCD' },
  { id: 'hw12', brandId: 'b3', modelName: 'Huawei Y6 Pro (2019)', lcdScreenCode: 'HW-6.09-LCD' },
  { id: 'hw13', brandId: 'b3', modelName: 'Huawei Y6p', lcdScreenCode: 'HUW-Y6P-LCD' },
  { id: 'hw14', brandId: 'b3', modelName: 'Huawei Y6s (2019)', lcdScreenCode: 'HW-6.09-LCD' },
  { id: 'hw15', brandId: 'b3', modelName: 'Huawei Y7 (2018)', lcdScreenCode: 'HUW-Y7-LCD' },
  { id: 'hw16', brandId: 'b3', modelName: 'Huawei Y7 (2019)', lcdScreenCode: 'HUW-Y7-LCD' },
  { id: 'hw17', brandId: 'b3', modelName: 'Huawei Y7 Prime (2018)', lcdScreenCode: 'HUW-Y7-LCD' },
  { id: 'hw18', brandId: 'b3', modelName: 'Huawei Y7P', lcdScreenCode: 'HUW-Y7P-LCD' },
  { id: 'hw19', brandId: 'b3', modelName: 'Huawei Y7a', lcdScreenCode: 'HUW-Y7A-LCD' },
  { id: 'hw20', brandId: 'b3', modelName: 'Huawei Y8p', lcdScreenCode: 'HUW-Y8P-OLED' },
  { id: 'hw21', brandId: 'b3', modelName: 'Huawei Y9 Prime (2019)', lcdScreenCode: 'HUW-Y9P-LCD' },
  { id: 'hw22', brandId: 'b3', modelName: 'Huawei Nova 7i', lcdScreenCode: 'HUW-P40L-LCD' },
  { id: 'hw23', brandId: 'b3', modelName: 'Huawei Nova 8i', lcdScreenCode: 'HUW-N8I-LCD' },
  { id: 'hw24', brandId: 'b3', modelName: 'Huawei Nova 9 SE', lcdScreenCode: 'HUW-N9SE-LCD' },
  { id: 'hw25', brandId: 'b3', modelName: 'Huawei Nova Y70', lcdScreenCode: 'HUW-Y70-LCD' },
  { id: 'hw26', brandId: 'b3', modelName: 'Huawei Nova Y90', lcdScreenCode: 'HUW-Y90-LCD' },
  { id: 'm7', brandId: 'b3', modelName: 'P30 Lite', lcdScreenCode: 'HUW-P30L-LCD' },
  { id: 'm8', brandId: 'b3', modelName: 'Nova 4e', lcdScreenCode: 'HUW-P30L-LCD' },

  // --- XIAOMI / REDMI ---
  { id: 'xi1', brandId: 'b4', modelName: 'Redmi 10 (2022)', lcdScreenCode: 'XIA-R10-LCD' },
  { id: 'xi2', brandId: 'b4', modelName: 'Redmi 10 5G', lcdScreenCode: 'XIA-R10-5G-LCD' },
  { id: 'xi3', brandId: 'b4', modelName: 'Redmi 10A', lcdScreenCode: 'XIA-R10A-LCD', batteryCode: 'BN56-BN5F-BN5G' },
  { id: 'xi4', brandId: 'b4', modelName: 'Redmi 10C', lcdScreenCode: 'XIA-R10C-LCD' },
  { id: 'xi5', brandId: 'b4', modelName: 'Redmi 12 4G', lcdScreenCode: 'XIA-R12-LCD' },
  { id: 'xi6', brandId: 'b4', modelName: 'Redmi 12 5G', lcdScreenCode: 'XIA-R12-LCD' },
  { id: 'xi7', brandId: 'b4', modelName: 'Redmi 12C', lcdScreenCode: 'XIA-R12C-LCD' },
  { id: 'xi8', brandId: 'b4', modelName: 'Redmi 13C', lcdScreenCode: 'XIA-R13C-LCD', displayType: 'IPS LCD (90Hz)', screenSize: '6.74 inches', alternativeNames: 'redmi 13c, 2310FPCA4G, lcd compatible redmi 13c', repairDifficulty: 'متوسط' },
  { id: 'xi_poco_c65', brandId: 'b4', modelName: 'Poco C65', lcdScreenCode: 'XIA-R13C-LCD', displayType: 'IPS LCD (90Hz)', screenSize: '6.74 inches', alternativeNames: 'poco c65, 2310FPCA4G, lcd compatible poco c65', repairDifficulty: 'متوسط' },
  { id: 'xi9', brandId: 'b4', modelName: 'Redmi Note 10 4G', lcdScreenCode: 'XIA-N10-AMOLED' },
  { id: 'xi10', brandId: 'b4', modelName: 'Redmi Note 10 5G', lcdScreenCode: 'XIA-N10-5G-LCD' },
  { id: 'xi11', brandId: 'b4', modelName: 'Redmi Note 10 Pro', lcdScreenCode: 'XIA-N10P-AMOLED' },
  { id: 'xi12', brandId: 'b4', modelName: 'Redmi Note 11 4G', lcdScreenCode: 'XIA-N11-AMOLED' },
  { id: 'xi13', brandId: 'b4', modelName: 'Redmi Note 11s', lcdScreenCode: 'XIA-N11-AMOLED' },
  { id: 'xi14', brandId: 'b4', modelName: 'Redmi Note 12 4G', lcdScreenCode: 'XIA-N12-AMOLED' },
  { id: 'xi15', brandId: 'b4', modelName: 'Redmi Note 12 Pro 5G', lcdScreenCode: 'XIA-N12P-OLED' },
  { id: 'xi16', brandId: 'b4', modelName: 'Redmi Note 12 5G', lcdScreenCode: 'XIA-N12-AMOLED' },
  { id: 'xi17', brandId: 'b4', modelName: 'Redmi Note 12 Pro 4G', lcdScreenCode: 'XIA-N12P-OLED' },
  { id: 'xi18', brandId: 'b4', modelName: 'Redmi Note 12s', lcdScreenCode: 'XIA-N12S-AMOLED' },
  { id: 'xi19', brandId: 'b4', modelName: 'Redmi Note 13 4G', lcdScreenCode: 'XIA-N13-AMOLED' },
  { id: 'xi20', brandId: 'b4', modelName: 'Redmi Note 13 5G', lcdScreenCode: 'XIA-N13-AMOLED' },
  { id: 'xi21', brandId: 'b4', modelName: 'Redmi Note 13 Pro 4G', lcdScreenCode: 'XIA-N13P-AMOLED' },
  { id: 'xi22', brandId: 'b4', modelName: 'Redmi Note 13 Pro 5G', lcdScreenCode: 'XIA-N13P-AMOLED' },
  { id: 'xi23', brandId: 'b4', modelName: 'Redmi Note 13 Pro Plus 5G', lcdScreenCode: 'XIA-N13PP-OLED' },
  { id: 'xi_n14', brandId: 'b4', modelName: 'Redmi Note 14 5G', lcdScreenCode: 'XIA-N14-OLED', displayType: 'OLED (120Hz)', screenSize: '6.67 inches', alternativeNames: 'Note 14 5G', repairDifficulty: 'متوسط' },
  { id: 'xi_n14p', brandId: 'b4', modelName: 'Redmi Note 14 Pro 5G', lcdScreenCode: 'XIA-N14P-OLED', displayType: 'OLED (120Hz, Curved)', screenSize: '6.67 inches', alternativeNames: 'Note 14 Pro', screenProtectorCode: 'XIA-N14P-GLASS', repairDifficulty: 'صعب' },
  { id: 'xi_n14pp', brandId: 'b4', modelName: 'Redmi Note 14 Pro Plus 5G', lcdScreenCode: 'XIA-N14PP-OLED', displayType: 'OLED (120Hz, Curved)', screenSize: '6.67 inches', alternativeNames: 'Note 14 Pro+', screenProtectorCode: 'XIA-N14P-GLASS', repairDifficulty: 'صعب' },
  { id: 'xi24', brandId: 'b4', modelName: 'Redmi Note 8 (2019)', lcdScreenCode: 'XIA-N8-LCD', batteryCode: 'BN46' },
  { id: 'xi25', brandId: 'b4', modelName: 'Redmi Note 8 Pro', lcdScreenCode: 'XIA-N8P-LCD' },
  { id: 'xi26', brandId: 'b4', modelName: 'Redmi Note 8T', lcdScreenCode: 'XIA-N8-LCD', batteryCode: 'BN46' },
  { id: 'xi27', brandId: 'b4', modelName: 'Redmi Note 9', lcdScreenCode: 'XIA-N9-LCD' },
  { id: 'xi28', brandId: 'b4', modelName: 'Redmi Note 9 Pro', lcdScreenCode: 'XIA-N9P-LCD' },
  { id: 'xi29', brandId: 'b4', modelName: 'Redmi Note 9s', lcdScreenCode: 'XIA-N9P-LCD' },
  { id: 'xi30', brandId: 'b4', modelName: 'Redmi Note 9T', lcdScreenCode: 'XIA-N9T-LCD' },
  { id: 'xi31', brandId: 'b4', modelName: 'Redmi Note 10s', lcdScreenCode: 'XIA-N10-AMOLED' },
  { id: 'xi32', brandId: 'b4', modelName: 'Redmi Note 11 5G', lcdScreenCode: 'XIA-N11-LCD' },
  { id: 'xi33', brandId: 'b4', modelName: 'Redmi Note 11 Pro 4G', lcdScreenCode: 'XIA-N11P-AMOLED' },
  { id: 'xi34', brandId: 'b4', modelName: 'Redmi Note 11 Pro 5G', lcdScreenCode: 'XIA-N11P-AMOLED' },
  { id: 'xi35', brandId: 'b4', modelName: 'Redmi Note 11 Pro Plus 5G', lcdScreenCode: 'XIA-N11P-AMOLED' },
  { id: 'xi36', brandId: 'b4', modelName: 'Redmi 9', lcdScreenCode: 'XIA-R9-LCD' },
  { id: 'xi37', brandId: 'b4', modelName: 'Redmi 9A', lcdScreenCode: 'XIA-R9A-LCD', batteryCode: 'BN56-BN5F-BN5G' },
  { id: 'xi38', brandId: 'b4', modelName: 'Redmi 9C', lcdScreenCode: 'XIA-R9A-LCD', batteryCode: 'BN56-BN5F-BN5G' },
  { id: 'xi39', brandId: 'b4', modelName: 'Redmi 9T', lcdScreenCode: 'XIA-R9T-LCD', displayType: 'IPS LCD', screenSize: '6.53 inches', alternativeNames: 'redmi 9t, M2010J19SG, lcd compatible redmi 9t', repairDifficulty: 'متوسط' },
  { id: 'xi40', brandId: 'b4', modelName: 'Redmi A1 / A1 Plus', lcdScreenCode: 'XIA-RA1-LCD', batteryCode: 'BN56-BN5F-BN5G' },
  { id: 'xi41', brandId: 'b4', modelName: 'Redmi A2 / A2 Plus', lcdScreenCode: 'XIA-RA1-LCD', batteryCode: 'BN56-BN5F-BN5G' },
  { id: 'xi42', brandId: 'b4', modelName: 'Redmi A3', lcdScreenCode: 'XIA-RA3-LCD', displayType: 'IPS LCD (90Hz)', screenSize: '6.71 inches', alternativeNames: 'redmi a3, 23129RN51X, lcd compatible redmi a3', repairDifficulty: 'سهل' },
  { id: 'm5', brandId: 'b4', modelName: 'Redmi Note 7', lcdScreenCode: 'XIA-N7-LCD' },
  { id: 'm6', brandId: 'b4', modelName: 'Redmi Note 7 Pro', lcdScreenCode: 'XIA-N7-LCD' },
  { id: 'm19', brandId: 'b4', modelName: 'Mi 11', lcdScreenCode: 'XIA-M11-OLED' },

  // --- NEW COMPATIBLE XIAOMI/REDMI BATTERY MODELS ---
  { id: 'xi_14c_4g', brandId: 'b4', modelName: 'Redmi 14C 4G', lcdScreenCode: 'XIA-14C-LCD', batteryCode: 'BN5X' },
  { id: 'xi_14c_5g', brandId: 'b4', modelName: 'Redmi 14C 5G', lcdScreenCode: 'XIA-14C-LCD', batteryCode: 'BN5X' },
  { id: 'xi_a3_pro', brandId: 'b4', modelName: 'Redmi A3 Pro', lcdScreenCode: 'XIA-RA3P-LCD', batteryCode: 'BN5X' },
  { id: 'xi_a4_5g', brandId: 'b4', modelName: 'Redmi A4 5G', lcdScreenCode: 'XIA-RA4-LCD', batteryCode: 'BN5X' },
  { id: 'xi_pc75_4g', brandId: 'b4', modelName: 'Poco C75 4G', lcdScreenCode: 'XIA-14C-LCD', batteryCode: 'BN5X' },
  { id: 'xi_pc75_5g', brandId: 'b4', modelName: 'Poco C75 5G', lcdScreenCode: 'XIA-14C-LCD', batteryCode: 'BN5X' },

  { id: 'xi_r9i', brandId: 'b4', modelName: 'Redmi 9i', lcdScreenCode: 'XIA-R9A-LCD', batteryCode: 'BN56-BN5F-BN5G' },
  { id: 'xi_poco_c3', brandId: 'b4', modelName: 'Poco C3', lcdScreenCode: 'XIA-R9A-LCD', batteryCode: 'BN56-BN5F-BN5G' },
  { id: 'xi_poco_c31', brandId: 'b4', modelName: 'Poco C31', lcdScreenCode: 'XIA-R9A-LCD', batteryCode: 'BN56-BN5F-BN5G' },
  { id: 'xi_poco_m2', brandId: 'b4', modelName: 'Poco M2', lcdScreenCode: 'XIA-PCO-M2-LCD', batteryCode: 'BN56-BN5F-BN5G' },
  { id: 'xi_poco_c51', brandId: 'b4', modelName: 'Poco C51', lcdScreenCode: 'XIA-RA1-LCD', batteryCode: 'BN56-BN5F-BN5G' },

  { id: 'xi_rn6', brandId: 'b4', modelName: 'Redmi Note 6', lcdScreenCode: 'XIA-N6-LCD', batteryCode: 'BN46' },
  { id: 'xi_rn6pro', brandId: 'b4', modelName: 'Redmi Note 6 Pro', lcdScreenCode: 'XIA-N6-LCD', batteryCode: 'BN46' },
  { id: 'xi_r7', brandId: 'b4', modelName: 'Redmi 7', lcdScreenCode: 'XIA-R7-LCD', batteryCode: 'BN46' },

  // --- OPPO ---
  { id: 'op1', brandId: 'b5', modelName: 'Oppo A12', lcdScreenCode: 'OPP-A12-LCD' },
  { id: 'op2', brandId: 'b5', modelName: 'Oppo A15', lcdScreenCode: 'OPP-A15-LCD', displayType: 'IPS LCD', screenSize: '6.52 inches', alternativeNames: 'oppo a15, CPH2185, lcd compatible oppo a15', repairDifficulty: 'متوسط' },
  { id: 'op3', brandId: 'b5', modelName: 'Oppo A15s', lcdScreenCode: 'OPP-A15-LCD' },
  { id: 'op4', brandId: 'b5', modelName: 'Oppo A16', lcdScreenCode: 'OPP-A15-LCD' },
  { id: 'op5', brandId: 'b5', modelName: 'Oppo A17', lcdScreenCode: 'OPP-A17-LCD' },
  { id: 'op6', brandId: 'b5', modelName: 'Oppo A18', lcdScreenCode: 'OPP-A18-LCD', displayType: 'IPS LCD (90Hz)', screenSize: '6.56 inches', alternativeNames: 'oppo a18, CPH2591, lcd compatible oppo a18', repairDifficulty: 'متوسط' },
  { id: 'op7', brandId: 'b5', modelName: 'Oppo A31', lcdScreenCode: 'OPP-A31-LCD' },
  { id: 'op8', brandId: 'b5', modelName: 'Oppo A38', lcdScreenCode: 'OPP-A18-LCD', displayType: 'IPS LCD (90Hz)', screenSize: '6.56 inches', alternativeNames: 'oppo a38, CPH2579, lcd compatible oppo a38', repairDifficulty: 'متوسط' },
  { id: 'op9', brandId: 'b5', modelName: 'Oppo A52', lcdScreenCode: 'OPP-A52-LCD' },
  { id: 'op10', brandId: 'b5', modelName: 'Oppo A53 4G', lcdScreenCode: 'OPP-A53-LCD' },
  { id: 'op11', brandId: 'b5', modelName: 'Oppo A54 4G', lcdScreenCode: 'OPP-A54-LCD' },
  { id: 'op12', brandId: 'b5', modelName: 'Oppo A55 4G', lcdScreenCode: 'OPP-A55-LCD', displayType: 'IPS LCD', screenSize: '6.51 inches', alternativeNames: 'oppo a55, CPH2325, lcd compatible oppo a55', repairDifficulty: 'متوسط' },
  { id: 'op13', brandId: 'b5', modelName: 'Oppo A57 4G', lcdScreenCode: 'OPP-A57-LCD' },
  { id: 'op14', brandId: 'b5', modelName: 'Oppo A58 4G', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'op15', brandId: 'b5', modelName: 'Oppo A73 5G', lcdScreenCode: 'OPP-A73-LCD' },
  { id: 'op16', brandId: 'b5', modelName: 'Oppo Find X2 lite', lcdScreenCode: 'OPP-X2L-OLED' },
  { id: 'op17', brandId: 'b5', modelName: 'Oppo A1 5G', lcdScreenCode: 'OPP-A1-LCD' },
  { id: 'op18', brandId: 'b5', modelName: 'Oppo A16s', lcdScreenCode: 'OPP-A15-LCD' },
  { id: 'op19', brandId: 'b5', modelName: 'Oppo A17k', lcdScreenCode: 'OPP-A17-LCD' },
  { id: 'op21', brandId: 'b5', modelName: 'Oppo A1K', lcdScreenCode: 'OPP-A1K-LCD' },
  { id: 'op22', brandId: 'b5', modelName: 'Oppo A3', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'op23', brandId: 'b5', modelName: 'Oppo A32', lcdScreenCode: 'OPP-A53-LCD' },
  { id: 'op24', brandId: 'b5', modelName: 'Oppo A33 (2020)', lcdScreenCode: 'OPP-A53-LCD' },
  { id: 'op25', brandId: 'b5', modelName: 'Oppo A35', lcdScreenCode: 'OPP-A15-LCD' },
  { id: 'op26', brandId: 'b5', modelName: 'Oppo A36', lcdScreenCode: 'OPP-A36-LCD' },
  { id: 'op27', brandId: 'b5', modelName: 'Oppo A53 5G', lcdScreenCode: 'OPP-A53-LCD' },
  { id: 'op28', brandId: 'b5', modelName: 'Oppo A53s 4G', lcdScreenCode: 'OPP-A53-LCD' },
  { id: 'op29', brandId: 'b5', modelName: 'Oppo A54 5G', lcdScreenCode: 'OPP-A54-LCD' },
  { id: 'op30', brandId: 'b5', modelName: 'Oppo A54s', lcdScreenCode: 'OPP-A54-LCD' },
  { id: 'op31', brandId: 'b5', modelName: 'Oppo A55 5G', lcdScreenCode: 'OPP-A55-LCD' },
  { id: 'op32', brandId: 'b5', modelName: 'Oppo A56 5G', lcdScreenCode: 'OPP-A56-LCD' },
  { id: 'op33', brandId: 'b5', modelName: 'Oppo A57 5G', lcdScreenCode: 'OPP-A57-LCD' },
  { id: 'op34', brandId: 'b5', modelName: 'Oppo A57S', lcdScreenCode: 'OPP-A57-LCD' },
  { id: 'op35', brandId: 'b5', modelName: 'Oppo A57e', lcdScreenCode: 'OPP-A57-LCD' },
  { id: 'op36', brandId: 'b5', modelName: 'Oppo A58 5G', lcdScreenCode: 'OPP-A58-LCD' },
  { id: 'op37', brandId: 'b5', modelName: 'Oppo A59 5G', lcdScreenCode: 'OPP-A58-LCD' },
  { id: 'op38', brandId: 'b5', modelName: 'Oppo A60', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'op39', brandId: 'b5', modelName: 'Oppo A7', lcdScreenCode: 'OPP-A7-LCD' },
  { id: 'op40', brandId: 'b5', modelName: 'Oppo A71', lcdScreenCode: 'OPP-A71-LCD' },
  { id: 'op41', brandId: 'b5', modelName: 'Oppo A72', lcdScreenCode: 'OPP-A52-LCD' },
  { id: 'op42', brandId: 'b5', modelName: 'Oppo A73 4G', lcdScreenCode: 'OPP-A73-OLED' },
  { id: 'op43', brandId: 'b5', modelName: 'Oppo A74 4G', lcdScreenCode: 'OPP-A74-OLED' },
  { id: 'op44', brandId: 'b5', modelName: 'Oppo A74 5G', lcdScreenCode: 'OPP-A74-LCD' },
  { id: 'op45', brandId: 'b5', modelName: 'Oppo A76', lcdScreenCode: 'OPP-A76-LCD' },
  { id: 'op46', brandId: 'b5', modelName: 'Oppo A77 4G', lcdScreenCode: 'OPP-A77-LCD' },
  { id: 'op47', brandId: 'b5', modelName: 'Oppo A77 5G', lcdScreenCode: 'OPP-A77-LCD' },
  { id: 'op48', brandId: 'b5', modelName: 'Oppo A77s', lcdScreenCode: 'OPP-A77-LCD' },
  { id: 'op49', brandId: 'b5', modelName: 'Oppo A78 4G', lcdScreenCode: 'OPP-A78-OLED' },
  { id: 'op50', brandId: 'b5', modelName: 'Oppo A78 5G', lcdScreenCode: 'OPP-A78-LCD' },
  { id: 'op51', brandId: 'b5', modelName: 'Oppo A79 5G', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'op52', brandId: 'b5', modelName: 'Oppo A8', lcdScreenCode: 'OPP-A31-LCD' },
  { id: 'op53', brandId: 'b5', modelName: 'Oppo A83', lcdScreenCode: 'OPP-A83-LCD' },
  { id: 'op54', brandId: 'b5', modelName: 'Oppo A91', lcdScreenCode: 'OPP-A91-OLED' },
  { id: 'op55', brandId: 'b5', modelName: 'Oppo A92', lcdScreenCode: 'OPP-A52-LCD' },
  { id: 'op56', brandId: 'b5', modelName: 'Oppo A93 4G', lcdScreenCode: 'OPP-A93-OLED' },
  { id: 'op57', brandId: 'b5', modelName: 'Oppo A94 4G', lcdScreenCode: 'OPP-A94-OLED' },
  { id: 'op58', brandId: 'b5', modelName: 'Oppo A95 4G', lcdScreenCode: 'OPP-A74-OLED' },
  { id: 'op59', brandId: 'b5', modelName: 'Oppo A96 4G', lcdScreenCode: 'OPP-A96-LCD' },
  { id: 'op60', brandId: 'b5', modelName: 'Oppo A98 5G', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'op61', brandId: 'b5', modelName: 'Oppo F11', lcdScreenCode: 'OPP-F11-LCD' },
  { id: 'op62', brandId: 'b5', modelName: 'Oppo F11 Pro', lcdScreenCode: 'OPP-F11P-LCD' },
  { id: 'op63', brandId: 'b5', modelName: 'Oppo F15', lcdScreenCode: 'OPP-A91-OLED' },
  { id: 'op64', brandId: 'b5', modelName: 'Oppo F17', lcdScreenCode: 'OPP-A73-OLED' },
  { id: 'op65', brandId: 'b5', modelName: 'Oppo F17 Pro', lcdScreenCode: 'OPP-A93-OLED' },
  { id: 'op66', brandId: 'b5', modelName: 'Oppo F19', lcdScreenCode: 'OPP-A74-OLED' },
  { id: 'op67', brandId: 'b5', modelName: 'Oppo F19 Pro', lcdScreenCode: 'OPP-A94-OLED' },
  { id: 'op68', brandId: 'b5', modelName: 'Oppo F19 Pro Plus', lcdScreenCode: 'OPP-A94-OLED' },
  { id: 'op69', brandId: 'b5', modelName: 'Oppo F19s', lcdScreenCode: 'OPP-A74-OLED' },
  { id: 'op70', brandId: 'b5', modelName: 'Oppo F1s', lcdScreenCode: 'OPP-F1S-LCD' },
  { id: 'op71', brandId: 'b5', modelName: 'Oppo F3', lcdScreenCode: 'OPP-F3-LCD' },
  { id: 'op72', brandId: 'b5', modelName: 'Oppo F5', lcdScreenCode: 'OPP-F5-LCD' },
  { id: 'op73', brandId: 'b5', modelName: 'Oppo F7', lcdScreenCode: 'OPP-F7-LCD' },
  { id: 'op74', brandId: 'b5', modelName: 'Oppo F9 / F9 Pro', lcdScreenCode: 'OPP-F9-LCD' },
  { id: 'op75', brandId: 'b5', modelName: 'Oppo Find X2', lcdScreenCode: 'OPP-X2-OLED' },
  { id: 'op76', brandId: 'b5', modelName: 'Oppo Find X2 Pro', lcdScreenCode: 'OPP-X2P-OLED' },
  { id: 'op77', brandId: 'b5', modelName: 'Oppo Find X3 Lite', lcdScreenCode: 'OPP-X3L-OLED' },
  { id: 'op78', brandId: 'b5', modelName: 'Oppo Find X3 Neo', lcdScreenCode: 'OPP-X3N-OLED' },
  { id: 'op79', brandId: 'b5', modelName: 'Oppo Find X3 Pro', lcdScreenCode: 'OPP-X3P-OLED' },
  { id: 'op80', brandId: 'b5', modelName: 'Oppo Find X5', lcdScreenCode: 'OPP-X5-OLED' },
  { id: 'op81', brandId: 'b5', modelName: 'Oppo Find X5 Lite', lcdScreenCode: 'OPP-X5L-OLED' },
  { id: 'op82', brandId: 'b5', modelName: 'Oppo Find X5 Pro', lcdScreenCode: 'OPP-X5P-OLED' },
  { id: 'm9', brandId: 'b5', modelName: 'Oppo A5 (2020)', lcdScreenCode: 'OPP-A5-2020' },
  { id: 'm10', brandId: 'b5', modelName: 'Oppo A9 (2020)', lcdScreenCode: 'OPP-A5-2020' },

  // --- NEW COMPATIBLE OPPO SCREEN MODELS (RLM C55) ---
  { id: 'op_f23', brandId: 'b5', modelName: 'Oppo F23 5G', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'op_a3x', brandId: 'b5', modelName: 'Oppo A3x', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'op_a3pro', brandId: 'b5', modelName: 'Oppo A3 Pro', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'op_a5', brandId: 'b5', modelName: 'Oppo A5', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'op_a5x', brandId: 'b5', modelName: 'Oppo A5x', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'op_a5pro', brandId: 'b5', modelName: 'Oppo A5 Pro', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'op_a40', brandId: 'b5', modelName: 'Oppo A40', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'op_a80', brandId: 'b5', modelName: 'Oppo A80', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'op_k12x', brandId: 'b5', modelName: 'Oppo k12x 5G', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'op_k13x', brandId: 'b5', modelName: 'Oppo k13x 5G', lcdScreenCode: 'UNI-RLM-C55-LCD' },

  // --- VIVO ---
  { id: 'vv1', brandId: 'b6', modelName: 'Vivo V20', lcdScreenCode: 'VIV-V20-AMOLED' },
  { id: 'vv2', brandId: 'b6', modelName: 'Vivo V20 SE', lcdScreenCode: 'VIV-V20-AMOLED' },
  { id: 'vv3', brandId: 'b6', modelName: 'Vivo V21 4G/5G', lcdScreenCode: 'VIV-V21-AMOLED' },
  { id: 'vv4', brandId: 'b6', modelName: 'Vivo V23 5G', lcdScreenCode: 'VIV-V23-AMOLED' },
  { id: 'vv5', brandId: 'b6', modelName: 'Vivo V23e', lcdScreenCode: 'VIV-V23-AMOLED' },
  { id: 'vv6', brandId: 'b6', modelName: 'Vivo Y01', lcdScreenCode: 'VIV-Y01-LCD' },
  { id: 'vv7', brandId: 'b6', modelName: 'Vivo Y02', lcdScreenCode: 'VIV-Y01-LCD' },
  { id: 'vv8', brandId: 'b6', modelName: 'Vivo Y02s', lcdScreenCode: 'VIV-Y01-LCD' },
  { id: 'vv9', brandId: 'b6', modelName: 'Vivo Y11 (2019)', lcdScreenCode: 'VIV-Y11-LCD' },
  { id: 'vv10', brandId: 'b6', modelName: 'Vivo Y12', lcdScreenCode: 'VIV-Y11-LCD' },
  { id: 'vv11', brandId: 'b6', modelName: 'Vivo Y12s', lcdScreenCode: 'VIV-Y12S-LCD' },
  { id: 'vv12', brandId: 'b6', modelName: 'Vivo Y15', lcdScreenCode: 'VIV-Y11-LCD' },
  { id: 'vv13', brandId: 'b6', modelName: 'Vivo Y17', lcdScreenCode: 'VIV-Y11-LCD' },
  { id: 'vv14', brandId: 'b6', modelName: 'Vivo Y19', lcdScreenCode: 'VIV-Y19-LCD' },
  { id: 'vv15', brandId: 'b6', modelName: 'Vivo Y20', lcdScreenCode: 'VIV-Y20-LCD' },
  { id: 'vv16', brandId: 'b6', modelName: 'Vivo Y20s', lcdScreenCode: 'VIV-Y20-LCD' },
  { id: 'vv17', brandId: 'b6', modelName: 'Vivo Y21', lcdScreenCode: 'VIV-Y21-LCD' },
  { id: 'vv18', brandId: 'b6', modelName: 'Vivo Y21s', lcdScreenCode: 'VIV-Y21-LCD' },
  { id: 'vv19', brandId: 'b6', modelName: 'Vivo Y22', lcdScreenCode: 'VIV-Y21-LCD' },
  { id: 'vv20', brandId: 'b6', modelName: 'Vivo Y22s', lcdScreenCode: 'VIV-Y21-LCD' },
  { id: 'vv21', brandId: 'b6', modelName: 'Vivo Y30', lcdScreenCode: 'VIV-Y30-LCD' },
  { id: 'vv22', brandId: 'b6', modelName: 'Vivo Y33s', lcdScreenCode: 'VIV-Y33-LCD' },
  { id: 'vv23', brandId: 'b6', modelName: 'Vivo Y35', lcdScreenCode: 'VIV-Y35-LCD' },
  { id: 'vv24', brandId: 'b6', modelName: 'Vivo Y51 (2020)', lcdScreenCode: 'VIV-Y51-LCD' },
  { id: 'vv25', brandId: 'b6', modelName: 'Vivo Y53s', lcdScreenCode: 'VIV-Y33-LCD' },
  { id: 'm17', brandId: 'b6', modelName: 'Vivo Y12', lcdScreenCode: 'VIV-Y12-LCD' },
  { id: 'm18', brandId: 'b6', modelName: 'Vivo Y15', lcdScreenCode: 'VIV-Y12-LCD' },

  // --- REALME ---
  { id: 'rl1', brandId: 'b7', modelName: 'Realme 10 4G', lcdScreenCode: 'RLM-10-AMOLED' },
  { id: 'rl2', brandId: 'b7', modelName: 'Realme 10 5G', lcdScreenCode: 'RLM-10-LCD' },
  { id: 'rl3', brandId: 'b7', modelName: 'Realme 10 Pro', lcdScreenCode: 'RLM-10P-LCD' },
  { id: 'rl4', brandId: 'b7', modelName: 'Realme 10 Pro Plus', lcdScreenCode: 'RLM-10PP-OLED' },
  { id: 'rl5', brandId: 'b7', modelName: 'Realme 11 4G', lcdScreenCode: 'RLM-11-AMOLED' },
  { id: 'rl6', brandId: 'b7', modelName: 'Realme 11 5G', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'rl7', brandId: 'b7', modelName: 'Realme 11 Pro', lcdScreenCode: 'RLM-11P-OLED' },
  { id: 'rl8', brandId: 'b7', modelName: 'Realme 11 Pro Plus', lcdScreenCode: 'RLM-11P-OLED' },
  { id: 'rl9', brandId: 'b7', modelName: 'Realme 11x 5G', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'rl10', brandId: 'b7', modelName: 'Realme 12 5G', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'rl11', brandId: 'b7', modelName: 'Realme 12 Pro', lcdScreenCode: 'RLM-12P-OLED' },
  { id: 'rl12', brandId: 'b7', modelName: 'Realme 12 Pro Plus', lcdScreenCode: 'RLM-12P-OLED' },
  { id: 'rl13', brandId: 'b7', modelName: 'Realme 12+ 5G', lcdScreenCode: 'RLM-12-AMOLED' },
  { id: 'rl14', brandId: 'b7', modelName: 'Realme 12x', lcdScreenCode: 'RLM-12X-LCD' },
  { id: 'm11', brandId: 'b7', modelName: 'Realme 5', lcdScreenCode: 'OPP-A5-2020' },
  { id: 'm20', brandId: 'b7', modelName: 'Realme C11', lcdScreenCode: 'OPP-A5-2020' },
  { id: 'nar1', brandId: 'b7', modelName: 'Narzo 30A', lcdScreenCode: 'OPP-A12-LCD' },
  { id: 'nar2', brandId: 'b7', modelName: 'Narzo 50A', lcdScreenCode: 'OPP-A12-LCD' },

  // --- NEW COMPATIBLE REALME SCREEN MODELS (RLM C55) ---
  { id: 'rl_c55', brandId: 'b7', modelName: 'Realme C55', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'rl_n55', brandId: 'b7', modelName: 'Realme N55', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'rl_c67', brandId: 'b7', modelName: 'Realme C67', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'rl_c67_5g', brandId: 'b7', modelName: 'Realme C67 5G', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'rl_n65_4g', brandId: 'b7', modelName: 'Realme N65 4G', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'rl_c63_5g', brandId: 'b7', modelName: 'Realme C63 5G', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'rl_c73_5g', brandId: 'b7', modelName: 'Realme C73 5G', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'rl_c75_5g', brandId: 'b7', modelName: 'Realme C75 5G', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'rl_c75x_4g', brandId: 'b7', modelName: 'Realme C75x 4G', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'rl_14x_5g', brandId: 'b7', modelName: 'Realme 14x 5G', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'rl_nar30lite', brandId: 'b7', modelName: 'Narzo 30 Lite', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'rl_p3lite', brandId: 'b7', modelName: 'Realme P3 Lite', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'rl_13_5g', brandId: 'b7', modelName: 'Realme 13 5G', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'rl_nar70x_5g', brandId: 'b7', modelName: 'Narzo 70x 5G', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'rl_nar80x_5g', brandId: 'b7', modelName: 'Narzo 80x 5G', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'rl_c75_4g', brandId: 'b7', modelName: 'Realme C75 4G', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'rl_px3_5g', brandId: 'b7', modelName: 'Realme Px3 5G', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'rl_c65_4g', brandId: 'b7', modelName: 'Realme C65 4G', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'rl_nar60x', brandId: 'b7', modelName: 'Narzo 60x', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'rl_12x_5g', brandId: 'b7', modelName: 'Realme 12x 5G', lcdScreenCode: 'UNI-RLM-C55-LCD' },

  // --- ONEPLUS ---
  { id: 'op_nord_n30', brandId: 'b12', modelName: 'OnePlus Nord N30 5G', lcdScreenCode: 'UNI-RLM-C55-LCD' },
  { id: 'op_nord_ce3_lite', brandId: 'b12', modelName: 'OnePlus Nord CE 3 Lite 5G', lcdScreenCode: 'UNI-RLM-C55-LCD' },

  // --- INFINIX ---
  // Box 1: UNI-X6515-LCD
  { id: 'inf_smart7', brandId: 'b8', modelName: 'Infinix Smart 7', lcdScreenCode: 'UNI-X6515-LCD', fpcPins: '40-Pin', displayType: 'IPS LCD', screenSize: '6.6 inches', alternativeNames: 'X6515, X6515D', repairDifficulty: 'متوسط', touchIcModel: 'FT8719 / GT1151' },
  { id: 'inf_smart7hd', brandId: 'b8', modelName: 'Infinix Smart 7 HD', lcdScreenCode: 'UNI-X6515-LCD', fpcPins: '40-Pin', displayType: 'IPS LCD', screenSize: '6.6 inches', alternativeNames: 'X6516', repairDifficulty: 'متوسط' },
  { id: 'inf_smart7plus', brandId: 'b8', modelName: 'Infinix Smart 7+', lcdScreenCode: 'UNI-X6515-LCD', fpcPins: '40-Pin', displayType: 'IPS LCD', screenSize: '6.6 inches', alternativeNames: 'X6517, X6517B', repairDifficulty: 'متوسط' },
  { id: 'inf_hot30i', brandId: 'b8', modelName: 'Infinix Hot 30i', lcdScreenCode: 'UNI-X6515-LCD', fpcPins: '40-Pin', displayType: 'IPS LCD (90Hz)', screenSize: '6.56 inches', alternativeNames: 'X669, X609D', repairDifficulty: 'متوسط', touchIcModel: 'FT8719' },

  // Box 2: UNI-X6531-LCD
  { id: 'inf_hot50_5g', brandId: 'b8', modelName: 'Infinix Hot 50 5G', lcdScreenCode: 'UNI-X6531-LCD', fpcPins: '40-Pin', displayType: 'IPS LCD (120Hz)', screenSize: '6.7 inches', alternativeNames: 'X6531, X6531B', repairDifficulty: 'متوسط' },
  { id: 'inf_hot50i', brandId: 'b8', modelName: 'Infinix Hot 50i', lcdScreenCode: 'UNI-X6531-LCD', fpcPins: '40-Pin', displayType: 'IPS LCD (120Hz)', screenSize: '6.7 inches', alternativeNames: 'X6531D', repairDifficulty: 'متوسط' },
  { id: 'inf_smart9', brandId: 'b8', modelName: 'Infinix Smart 9', lcdScreenCode: 'UNI-X6531-LCD', fpcPins: '40-Pin', displayType: 'IPS LCD (120Hz)', screenSize: '6.7 inches', alternativeNames: 'X6532', repairDifficulty: 'متوسط', touchIcModel: 'GT1252' },
  { id: 'inf_smart9hd', brandId: 'b8', modelName: 'Infinix Smart 9 HD', lcdScreenCode: 'UNI-X6531-LCD', fpcPins: '40-Pin', displayType: 'IPS LCD (120Hz)', screenSize: '6.7 inches', repairDifficulty: 'متوسط' },
  { id: 'inf_note50x_5g', brandId: 'b8', modelName: 'Infinix Note 50X 5G', lcdScreenCode: 'UNI-X6531-LCD', fpcPins: '40-Pin', displayType: 'IPS LCD (120Hz)', screenSize: '6.7 inches', repairDifficulty: 'متوسط' },

  // Box 3: UNI-X6816-LCD
  { id: 'inf_hot12play', brandId: 'b8', modelName: 'Infinix Hot 12 Play', lcdScreenCode: 'UNI-X6816-LCD' },
  { id: 'inf_hot12i', brandId: 'b8', modelName: 'Infinix Hot 12i', lcdScreenCode: 'UNI-X6816-LCD' },
  { id: 'inf_hot12', brandId: 'b8', modelName: 'Infinix Hot 12', lcdScreenCode: 'UNI-X6816-LCD' },
  { id: 'inf_hot20play', brandId: 'b8', modelName: 'Infinix Hot 20 Play', lcdScreenCode: 'UNI-X6816-LCD' },
  { id: 'inf_hot30play', brandId: 'b8', modelName: 'Infinix Hot 30 Play', lcdScreenCode: 'UNI-X6816-LCD' },

  // Box 4: UNI-X6525-LCD
  { id: 'inf_smart8', brandId: 'b8', modelName: 'Infinix Smart 8', lcdScreenCode: 'UNI-X6525-LCD', fpcPins: '34-Pin', displayType: 'IPS LCD (90Hz)', screenSize: '6.6 inches', alternativeNames: 'X6525', repairDifficulty: 'متوسط', touchIcModel: 'GT1151 / FT8719' },
  { id: 'inf_smart8hd', brandId: 'b8', modelName: 'Infinix Smart 8 HD', lcdScreenCode: 'UNI-X6525-LCD', fpcPins: '34-Pin', displayType: 'IPS LCD (90Hz)', screenSize: '6.6 inches', alternativeNames: 'X6525B', repairDifficulty: 'متوسط' },
  { id: 'inf_smart8plus', brandId: 'b8', modelName: 'Infinix Smart 8+', lcdScreenCode: 'UNI-X6525-LCD', fpcPins: '34-Pin', displayType: 'IPS LCD (90Hz)', screenSize: '6.6 inches', alternativeNames: 'X6525D', repairDifficulty: 'متوسط' },
  { id: 'inf_smart8pro', brandId: 'b8', modelName: 'Infinix Smart 8 Pro', lcdScreenCode: 'UNI-X6525-LCD', fpcPins: '34-Pin', displayType: 'IPS LCD (90Hz)', screenSize: '6.6 inches', alternativeNames: 'X6525F', repairDifficulty: 'متوسط' },
  { id: 'inf_hot40i', brandId: 'b8', modelName: 'Infinix Hot 40i', lcdScreenCode: 'UNI-X6525-LCD', fpcPins: '34-Pin', displayType: 'IPS LCD (90Hz)', screenSize: '6.56 inches', alternativeNames: 'X6528, X6528B', repairDifficulty: 'متوسط', touchIcModel: 'FT8719' },
  { id: 'inf_hot40', brandId: 'b8', modelName: 'Infinix Hot 40', lcdScreenCode: 'UNI-SPK20_HOT40-LCD', fpcPins: '40-Pin', displayType: 'IPS LCD (90Hz)', screenSize: '6.78 inches', alternativeNames: 'X6836, lcd compatible hot 40', repairDifficulty: 'متوسط' },
  { id: 'inf_hot40pro', brandId: 'b8', modelName: 'Infinix Hot 40 Pro', lcdScreenCode: 'UNI-SPK20_HOT40-LCD', fpcPins: '40-Pin', displayType: 'IPS LCD (120Hz)', screenSize: '6.78 inches', alternativeNames: 'X6837, lcd compatible hot 40 pro', repairDifficulty: 'متوسط' },

  // Box 5: UNI-X688-LCD
  { id: 'inf_hot10play', brandId: 'b8', modelName: 'Infinix Hot 10 Play', lcdScreenCode: 'UNI-X688-LCD' },
  { id: 'inf_hot11play', brandId: 'b8', modelName: 'Infinix Hot 11 Play', lcdScreenCode: 'UNI-X688-LCD' },

  // Box 6: UNI-X650-LCD
  { id: 'inf_hot8', brandId: 'b8', modelName: 'Infinix Hot 8', lcdScreenCode: 'UNI-X650-LCD' },
  { id: 'inf_hot8lite', brandId: 'b8', modelName: 'Infinix Hot 8 Lite', lcdScreenCode: 'UNI-X650-LCD' },

  // Box 7: UNI-X653-LCD
  { id: 'inf_smart4c', brandId: 'b8', modelName: 'Infinix Smart 4C', lcdScreenCode: 'UNI-X653-LCD' },
  { id: 'inf_smart4', brandId: 'b8', modelName: 'Infinix Smart 4', lcdScreenCode: 'UNI-X653-LCD' },

  // Box 9: UNI-X657-LCD
  { id: 'inf_smart5', brandId: 'b8', modelName: 'Infinix Smart 5', lcdScreenCode: 'UNI-X657-LCD' },
  { id: 'inf_smart5a', brandId: 'b8', modelName: 'Infinix Smart 5A', lcdScreenCode: 'UNI-X657-LCD' },

  // Box 10: UNI-X668-LCD
  { id: 'inf_hot12pro', brandId: 'b8', modelName: 'Infinix Hot 12 Pro', lcdScreenCode: 'UNI-X668-LCD' },

  // Box 11: UNI-X682-LCD
  { id: 'inf_hot10_box11', brandId: 'b8', modelName: 'Infinix Hot 10', lcdScreenCode: 'UNI-X682-LCD' },
  { id: 'inf_hot10i', brandId: 'b8', modelName: 'Infinix Hot 10i (X665)', lcdScreenCode: 'UNI-X682-LCD', displayType: 'IPS LCD', screenSize: '6.52 inches', alternativeNames: 'X665, X665B, X665C, lcd compatible x665', repairDifficulty: 'متوسط' },
  { id: 'inf_note8i', brandId: 'b8', modelName: 'Infinix Note 8i', lcdScreenCode: 'UNI-X682-LCD' },

  // Box 12: UNI-X689-LCD
  { id: 'inf_hot10s', brandId: 'b8', modelName: 'Infinix Hot 10S', lcdScreenCode: 'UNI-X689-LCD' },
  { id: 'inf_hot10t', brandId: 'b8', modelName: 'Infinix Hot 10T', lcdScreenCode: 'UNI-X689-LCD' },
  { id: 'inf_smart6plus_box12', brandId: 'b8', modelName: 'Infinix Smart 6 Plus', lcdScreenCode: 'UNI-X689-LCD' },

  // Box 13: UNI-KG6K-LCD
  { id: 'inf_smart6plus_box13', brandId: 'b8', modelName: 'Infinix Smart 6+', lcdScreenCode: 'UNI-KG6K-LCD' },

  // Box 14: UNI-X6812-LCD
  { id: 'inf_hot11s', brandId: 'b8', modelName: 'Infinix Hot 11S', lcdScreenCode: 'UNI-X6812-LCD' },
  { id: 'inf_zero5g', brandId: 'b8', modelName: 'Infinix Zero 5G', lcdScreenCode: 'UNI-X6812-LCD' },
  { id: 'inf_hot20s', brandId: 'b8', modelName: 'Infinix Hot 20S', lcdScreenCode: 'UNI-X6812-LCD' },

  // Box 15: UNI-X693-LCD
  { id: 'inf_note10', brandId: 'b8', modelName: 'Infinix Note 10', lcdScreenCode: 'UNI-X693-LCD' },
  { id: 'inf_note11s', brandId: 'b8', modelName: 'Infinix Note 11S', lcdScreenCode: 'UNI-X693-LCD' },
  { id: 'inf_note11pro', brandId: 'b8', modelName: 'Infinix Note 11 Pro', lcdScreenCode: 'UNI-X693-LCD' },

  // Box 17: UNI-X680-LCD
  { id: 'inf_smart4plus', brandId: 'b8', modelName: 'Infinix Smart 4+', lcdScreenCode: 'UNI-X680-LCD' },
  { id: 'inf_hot9play', brandId: 'b8', modelName: 'Infinix Hot 9 Play', lcdScreenCode: 'UNI-X680-LCD' },

  // Box 18: UNI-UNI_X6512-LCD
  { id: 'inf_smart6hd', brandId: 'b8', modelName: 'Infinix Smart 6HD', lcdScreenCode: 'UNI-X6512-LCD' },

  // Box 19: UNI-X6511-LCD
  { id: 'inf_smart6', brandId: 'b8', modelName: 'Infinix Smart 6', lcdScreenCode: 'UNI-X6511-LCD' },

  // Box 20: UNI-X660-LCD
  { id: 'inf_s5pro', brandId: 'b8', modelName: 'Infinix S5 Pro', lcdScreenCode: 'UNI-X660-LCD' },

  // Other Infinix Models preserved
  { id: 'inf2', brandId: 'b8', modelName: 'Infinix GT 10 Pro', lcdScreenCode: 'INF-GT10-OLED' },
  { id: 'inf20', brandId: 'b8', modelName: 'Infinix Note 10 Pro', lcdScreenCode: 'INF-N10P-LCD' },
  { id: 'inf21', brandId: 'b8', modelName: 'Infinix Note 11', lcdScreenCode: 'INF-N11-AMOLED' },
  { id: 'inf22', brandId: 'b8', modelName: 'Infinix Note 12', lcdScreenCode: 'INF-N12-AMOLED' },
  { id: 'inf23', brandId: 'b8', modelName: 'Infinix Note 30', lcdScreenCode: 'INF-N30-LCD' },
  { id: 'inf24', brandId: 'b8', modelName: 'Infinix Note 30 Pro', lcdScreenCode: 'INF-N30-LCD' },
  { id: 'inf25', brandId: 'b8', modelName: 'Infinix Note 40', lcdScreenCode: 'INF-N40-AMOLED' },
  { id: 'inf26', brandId: 'b8', modelName: 'Infinix Note 40 Pro', lcdScreenCode: 'INF-N40-AMOLED' },
  { id: 'inf34', brandId: 'b8', modelName: 'Infinix Note 7', lcdScreenCode: 'INF-N7-LCD' },
  { id: 'inf35', brandId: 'b8', modelName: 'Infinix Note 7 Lite', lcdScreenCode: 'INF-N7-LCD' },
  { id: 'inf37', brandId: 'b8', modelName: 'Infinix Smart 5 Pro', lcdScreenCode: 'INF-SM5-LCD' },
  { id: 'inf40', brandId: 'b8', modelName: 'Infinix Zero 30 4G', lcdScreenCode: 'INF-Z30-OLED' },
  { id: 'inf41', brandId: 'b8', modelName: 'Infinix Zero 30 5G', lcdScreenCode: 'INF-Z30-OLED' },
  { id: 'inf42', brandId: 'b8', modelName: 'Infinix Zero 40 4G', lcdScreenCode: 'INF-Z40-OLED' },
  { id: 'inf43', brandId: 'b8', modelName: 'Infinix Zero 40 5G', lcdScreenCode: 'INF-Z40-OLED' },
  { id: 'inf44', brandId: 'b8', modelName: 'Infinix Zero 8', lcdScreenCode: 'INF-Z8-LCD' },
  { id: 'inf45', brandId: 'b8', modelName: 'Infinix Zero 8i', lcdScreenCode: 'INF-Z8-LCD' },
  { id: 'inf46', brandId: 'b8', modelName: 'Infinix Zero X', lcdScreenCode: 'INF-ZX-AMOLED' },
  { id: 'inf47', brandId: 'b8', modelName: 'Infinix Zero X Neo', lcdScreenCode: 'INF-ZX-AMOLED' },
  { id: 'inf48', brandId: 'b8', modelName: 'Infinix Zero X Pro', lcdScreenCode: 'INF-ZX-AMOLED' },


  // --- TECNO ---
  // Box 1: UNI-X6515-LCD
  { id: 'tec_pop7', brandId: 'b9', modelName: 'Tecno Pop 7', lcdScreenCode: 'UNI-X6515-LCD' },
  { id: 'tec_pop7pro', brandId: 'b9', modelName: 'Tecno Pop 7 Pro', lcdScreenCode: 'UNI-X6515-LCD' },
  { id: 'tec_spark_go_2023', brandId: 'b9', modelName: 'Tecno Spark Go 2023', lcdScreenCode: 'UNI-X6515-LCD' },
  { id: 'tec_spark_10c', brandId: 'b9', modelName: 'Tecno Spark 10C', lcdScreenCode: 'UNI-X6515-LCD' },
  { id: 'tec_spark_10_5g', brandId: 'b9', modelName: 'Tecno Spark 10 5G', lcdScreenCode: 'UNI-X6515-LCD' },

  // Box 2: UNI-X6531-LCD
  { id: 'tec_pop9', brandId: 'b9', modelName: 'Tecno Pop 9', lcdScreenCode: 'UNI-X6531-LCD' },
  { id: 'tec_pop9_5g', brandId: 'b9', modelName: 'Tecno Pop 9 5G', lcdScreenCode: 'UNI-X6531-LCD' },
  { id: 'tec_spark_go_1s', brandId: 'b9', modelName: 'Tecno Spark Go 1S', lcdScreenCode: 'UNI-X6531-LCD' },
  { id: 'tec_spark_go_1', brandId: 'b9', modelName: 'Tecno Spark Go 1', lcdScreenCode: 'UNI-X6531-LCD', displayType: 'IPS LCD (120Hz)', screenSize: '6.67 inches', alternativeNames: 'spark go 1, KL4, KL4a, lcd compatible spark go 1', repairDifficulty: 'متوسط' },
  { id: 'tec_spark_30c_5g', brandId: 'b9', modelName: 'Tecno Spark 30C 5G', lcdScreenCode: 'UNI-X6531-LCD' },
  { id: 'tec_pova_neo_6_5g', brandId: 'b9', modelName: 'Tecno Pova Neo 6 5G', lcdScreenCode: 'UNI-X6531-LCD' },
  { id: 'tec_spark_30_5g', brandId: 'b9', modelName: 'Tecno Spark 30 5G', lcdScreenCode: 'UNI-X6531-LCD' },

  // Box 3: UNI-X6816-LCD
  { id: 'tec_pova4', brandId: 'b9', modelName: 'Tecno Pova 4', lcdScreenCode: 'UNI-X6816-LCD' },
  { id: 'tec_pova_neo2', brandId: 'b9', modelName: 'Tecno Pova Neo 2', lcdScreenCode: 'UNI-X6816-LCD' },
  { id: 'tec_pova_neo3', brandId: 'b9', modelName: 'Tecno Pova Neo 3', lcdScreenCode: 'UNI-X6816-LCD' },

  // Box 4: UNI-X6525-LCD
  { id: 'tec_spark20c', brandId: 'b9', modelName: 'Tecno Spark 20C', lcdScreenCode: 'UNI-X6525-LCD' },
  { id: 'tec_spark_go_2024', brandId: 'b9', modelName: 'Tecno Spark Go 2024', lcdScreenCode: 'UNI-X6525-LCD' },
  { id: 'tec_pop8', brandId: 'b9', modelName: 'Tecno Pop 8', lcdScreenCode: 'UNI-X6525-LCD' },

  // Box 5: UNI-X688-LCD
  { id: 'tec_pova_neo', brandId: 'b9', modelName: 'Tecno Pova Neo', lcdScreenCode: 'UNI-X688-LCD' },
  { id: 'tec_spark7_box5', brandId: 'b9', modelName: 'Tecno Spark 7', lcdScreenCode: 'UNI-X688-LCD' },

  // Box 6: UNI-X650-LCD
  { id: 'tec_spark4', brandId: 'b9', modelName: 'Tecno Spark 4', lcdScreenCode: 'UNI-X650-LCD' },
  { id: 'tec_camon12', brandId: 'b9', modelName: 'Tecno Camon 12', lcdScreenCode: 'UNI-X650-LCD' },

  // Box 7: UNI-X653-LCD
  { id: 'tec_pop3plus', brandId: 'b9', modelName: 'Tecno Pop 3+', lcdScreenCode: 'UNI-X653-LCD' },
  { id: 'tec_spark4_lite', brandId: 'b9', modelName: 'Tecno Spark 4 Lite', lcdScreenCode: 'UNI-X653-LCD' },
  { id: 'tec_spark_go_plus', brandId: 'b9', modelName: 'Tecno Spark Go+', lcdScreenCode: 'UNI-X653-LCD' },

  // Box 8: UNI-KE5-LCD
  { id: 'tec_spark_go_2020', brandId: 'b9', modelName: 'Tecno Spark Go 2020', lcdScreenCode: 'UNI-KE5-LCD' },
  { id: 'tec_spark_go_2021', brandId: 'b9', modelName: 'Tecno Spark Go 2021', lcdScreenCode: 'UNI-KE5-LCD' },
  { id: 'tec_spark6go', brandId: 'b9', modelName: 'Tecno Spark 6 Go', lcdScreenCode: 'UNI-KE5-LCD' },

  // Box 9: UNI-X657-LCD
  { id: 'tec_hot10lite', brandId: 'b9', modelName: 'Tecno Hot 10 Lite', lcdScreenCode: 'UNI-X657-LCD' },

  // Box 10: UNI-X668-LCD
  { id: 'tec_spark9t', brandId: 'b9', modelName: 'Tecno Spark 9T', lcdScreenCode: 'UNI-X668-LCD' },
  { id: 'tec_spark9', brandId: 'b9', modelName: 'Tecno Spark 9', lcdScreenCode: 'UNI-X668-LCD' },
  { id: 'tec_spark8c', brandId: 'b9', modelName: 'Tecno Spark 8C', lcdScreenCode: 'UNI-X668-LCD' },
  { id: 'tec_pop6pro', brandId: 'b9', modelName: 'Tecno Pop 6 Pro', lcdScreenCode: 'UNI-X668-LCD' },

  // Box 11: UNI-X682-LCD
  { id: 'tec_camon16_box11', brandId: 'b9', modelName: 'Tecno Camon 16', lcdScreenCode: 'UNI-X682-LCD' },
  { id: 'tec_camon16se', brandId: 'b9', modelName: 'Tecno Camon 16 SE', lcdScreenCode: 'UNI-X682-LCD' },
  { id: 'tec_pova_box11', brandId: 'b9', modelName: 'Tecno Pova', lcdScreenCode: 'UNI-X682-LCD' },
  { id: 'tec_spark6_box11', brandId: 'b9', modelName: 'Tecno Spark 6', lcdScreenCode: 'UNI-X682-LCD' },

  // Box 12: UNI-X689-LCD
  { id: 'tec_spark7p', brandId: 'b9', modelName: 'Tecno Spark 7P', lcdScreenCode: 'UNI-X689-LCD' },

  // Box 13: UNI-KG6K-LCD
  { id: 'tec_spark8_box13', brandId: 'b9', modelName: 'Tecno Spark 8', lcdScreenCode: 'UNI-KG6K-LCD' },
  { id: 'tec_spark8t', brandId: 'b9', modelName: 'Tecno Spark 8T', lcdScreenCode: 'UNI-KG6K-LCD' },

  // Box 14: UNI-X6812-LCD
  { id: 'tec_camon17p', brandId: 'b9', modelName: 'Tecno Camon 17P', lcdScreenCode: 'UNI-X6812-LCD' },

  // Box 15: UNI-X693-LCD
  { id: 'tec_pova2', brandId: 'b9', modelName: 'Tecno Pova 2', lcdScreenCode: 'UNI-X693-LCD' },
  { id: 'tec_pova3', brandId: 'b9', modelName: 'Tecno Pova 3', lcdScreenCode: 'UNI-X693-LCD' },

  // Box 16: UNI-LC7-LCD
  { id: 'tec_spark5air', brandId: 'b9', modelName: 'Tecno Spark 5 Air', lcdScreenCode: 'UNI-LC7-LCD' },
  { id: 'tec_spark6air', brandId: 'b9', modelName: 'Tecno Spark 6 Air', lcdScreenCode: 'UNI-LC7-LCD' },
  { id: 'tec_pouvoir4pro', brandId: 'b9', modelName: 'Tecno Pouvoir 4 Pro', lcdScreenCode: 'UNI-LC7-LCD' },
  { id: 'tec_pouvoir4', brandId: 'b9', modelName: 'Tecno Pouvoir 4', lcdScreenCode: 'UNI-LC7-LCD' },

  // Box 20: UNI-X660-LCD
  { id: 'tec_camon15', brandId: 'b9', modelName: 'Tecno Camon 15', lcdScreenCode: 'UNI-X660-LCD' },
  { id: 'tec_camon15premium', brandId: 'b9', modelName: 'Tecno Camon 15 Premium', lcdScreenCode: 'UNI-X660-LCD' },

  // Other Tecno Models preserved
  { id: 'tc1', brandId: 'b9', modelName: 'Tecno Camon 11 (CF7)', lcdScreenCode: 'TEC-C11-LCD' },
  { id: 'tc2', brandId: 'b9', modelName: 'Tecno Camon 11 Pro (CF8)', lcdScreenCode: 'TEC-C11-LCD' },
  { id: 'tc4', brandId: 'b9', modelName: 'Tecno Camon 12 Air (CC6)', lcdScreenCode: 'TEC-C12A-LCD' },
  { id: 'tc5', brandId: 'b9', modelName: 'Tecno Camon 12 Pro (CC9)', lcdScreenCode: 'TEC-C12-AMOLED' },
  { id: 'tc7', brandId: 'b9', modelName: 'Tecno Camon 15 Air (CD6)', lcdScreenCode: 'TEC-C15-LCD' },
  { id: 'tc8', brandId: 'b9', modelName: 'Tecno Camon 15 Pro (CD8)', lcdScreenCode: 'TEC-C15P-LCD' },
  { id: 'tc10', brandId: 'b9', modelName: 'Tecno Camon 16 Premier (CE9)', lcdScreenCode: 'TEC-C16P-LCD' },
  { id: 'tc11', brandId: 'b9', modelName: 'Tecno Camon 16 Pro (CE8)', lcdScreenCode: 'TEC-C16-LCD' },
  { id: 'tc12', brandId: 'b9', modelName: 'Tecno Camon 17 (CG6)', lcdScreenCode: 'TEC-C17-LCD' },
  { id: 'tc13', brandId: 'b9', modelName: 'Tecno Camon 17 Pro (CG8)', lcdScreenCode: 'TEC-C17-LCD' },
  { id: 'tc15', brandId: 'b9', modelName: 'Tecno Camon 18 (CH6)', lcdScreenCode: 'TEC-C18-LCD' },
  { id: 'tc16', brandId: 'b9', modelName: 'Tecno Camon 18 Premier (CH9)', lcdScreenCode: 'TEC-C18-AMOLED' },
  { id: 'tc17', brandId: 'b9', modelName: 'Tecno Camon 18i (CH6I)', lcdScreenCode: 'TEC-C18-LCD' },
  { id: 'tc18', brandId: 'b9', modelName: 'Tecno Camon 18P (CH7)', lcdScreenCode: 'TEC-C18-LCD' },
  { id: 'tc19', brandId: 'b9', modelName: 'Tecno Camon 19 (CI6)', lcdScreenCode: 'TEC-C19-LCD' },
  { id: 'tc20', brandId: 'b9', modelName: 'Tecno Camon 19 Neo (CI6N)', lcdScreenCode: 'TEC-C19-LCD' },
  { id: 'tc21', brandId: 'b9', modelName: 'Tecno Camon 19 Pro (CI8)', lcdScreenCode: 'TEC-C19-LCD' },
  { id: 'tc22', brandId: 'b9', modelName: 'Tecno Camon 19 Pro 5G (CI7n)', lcdScreenCode: 'TEC-C19-LCD' },
  { id: 'tc23', brandId: 'b9', modelName: 'Tecno Camon 20 (CH6i)', lcdScreenCode: 'TEC-C20-AMOLED' },
  { id: 'tc24', brandId: 'b9', modelName: 'Tecno Camon 20 Pro (CK6n)', lcdScreenCode: 'TEC-C20-AMOLED' },
  { id: 'tc25', brandId: 'b9', modelName: 'Tecno Camon 20 Pro 5G (CK8n)', lcdScreenCode: 'TEC-C20-AMOLED' },
  { id: 'tc26', brandId: 'b9', modelName: 'Tecno Camon 20 Premier 5G (CK9n)', lcdScreenCode: 'TEC-C20-AMOLED' },
  { id: 'tc27', brandId: 'b9', modelName: 'Tecno Pop 5 (BD2)', lcdScreenCode: 'TEC-BD2-LCD' },
  { id: 'tc28', brandId: 'b9', modelName: 'Tecno Pop 5 Go (BD1)', lcdScreenCode: 'TEC-BD2-LCD' },
  { id: 'tc29', brandId: 'b9', modelName: 'Tecno Pop 5 LTE (BD6)', lcdScreenCode: 'TEC-BD6-LCD' },
  { id: 'tc30', brandId: 'b9', modelName: 'Tecno Pop 5 Pro (BD4)', lcdScreenCode: 'TEC-BD6-LCD' },
  { id: 'tc31', brandId: 'b9', modelName: 'Tecno Pop 6 (BE6)', lcdScreenCode: 'TEC-BE6-LCD' },
  { id: 'tc38', brandId: 'b9', modelName: 'Tecno Pova 4 Pro (LG8)', lcdScreenCode: 'TEC-LG8-AMOLED' },
  { id: 'tc39', brandId: 'b9', modelName: 'Tecno Pova 5 (LH7n)', lcdScreenCode: 'TEC-LH7-LCD' },
  { id: 'tc40', brandId: 'b9', modelName: 'Tecno Pova 5 Pro 5G (LH8n)', lcdScreenCode: 'TEC-LH8-LCD' },
  { id: 'tc44', brandId: 'b9', modelName: 'Tecno Spark 10 (KI5k)', lcdScreenCode: 'TEC-KI5-LCD' },
  { id: 'tc45', brandId: 'b9', modelName: 'Tecno Spark 10 Pro (KI7)', lcdScreenCode: 'TEC-KI7-LCD' },
  { id: 'tc47', brandId: 'b9', modelName: 'Tecno Spark 20 (KJ5)', lcdScreenCode: 'UNI-SPK20_HOT40-LCD', displayType: 'IPS LCD (90Hz)', screenSize: '6.6 inches', alternativeNames: 'spark 20, KJ5, lcd compatible spark 20', repairDifficulty: 'متوسط' },
  { id: 'tc48', brandId: 'b9', modelName: 'Tecno Spark 20 Pro (KJ6)', lcdScreenCode: 'UNI-SPK20_HOT40-LCD', displayType: 'IPS LCD (120Hz)', screenSize: '6.78 inches', alternativeNames: 'spark 20 pro, KJ6, lcd compatible spark 20 pro', repairDifficulty: 'متوسط' },
  { id: 'tc49', brandId: 'b9', modelName: 'Tecno Spark 20 Pro Plus (KJ7)', lcdScreenCode: 'TEC-KJ7-AMOLED' },
  { id: 'tc52', brandId: 'b9', modelName: 'Tecno Spark 5 (KD7)', lcdScreenCode: 'TEC-KD7-LCD' },
  { id: 'tc58', brandId: 'b9', modelName: 'Tecno Spark 8 Pro (KG8)', lcdScreenCode: 'TEC-KG8-LCD' },
  { id: 'tc61', brandId: 'b9', modelName: 'Tecno Spark 9 Pro (KH7)', lcdScreenCode: 'TEC-KH7-LCD' },
  { id: 'tc64', brandId: 'b9', modelName: 'Tecno Spark Go 2022 (KG5)', lcdScreenCode: 'TEC-KG5-LCD' },


  // --- ITEL ---
  // Box 1: UNI-X6515-LCD
  { id: 'itel_p40', brandId: 'b10', modelName: 'Itel P40', lcdScreenCode: 'UNI-X6515-LCD' },
  { id: 'itel_a60', brandId: 'b10', modelName: 'Itel A60', lcdScreenCode: 'UNI-X6515-LCD' },
  { id: 'itel_a60s', brandId: 'b10', modelName: 'Itel A60s', lcdScreenCode: 'UNI-X6515-LCD' },
  { id: 'itel_a05s', brandId: 'b10', modelName: 'Itel A05s', lcdScreenCode: 'UNI-X6515-LCD' },
  { id: 'itel_power55', brandId: 'b10', modelName: 'Itel Power 55', lcdScreenCode: 'UNI-X6515-LCD' },
  { id: 'itel_p55_5g', brandId: 'b10', modelName: 'Itel P55 5G', lcdScreenCode: 'UNI-X6515-LCD' },
  { id: 'itel_a70', brandId: 'b10', modelName: 'Itel A70', lcdScreenCode: 'UNI-X6515-LCD', displayType: 'IPS LCD', screenSize: '6.6 inches', alternativeNames: 'itel a70, A665L, lcd compatible itel a70', repairDifficulty: 'متوسط' },
  { id: 'itel_s23', brandId: 'b10', modelName: 'Itel S23', lcdScreenCode: 'UNI-X6515-LCD', displayType: 'IPS LCD (90Hz)', screenSize: '6.6 inches', alternativeNames: 'itel s23, S663L, lcd compatible itel s23', repairDifficulty: 'متوسط' },

  // Box 2: UNI-X6531-LCD
  { id: 'itel_p65', brandId: 'b10', modelName: 'Itel P65', lcdScreenCode: 'UNI-X6531-LCD' },
  { id: 'itel_a80', brandId: 'b10', modelName: 'Itel A80', lcdScreenCode: 'UNI-X6531-LCD' },
  { id: 'itel_p67', brandId: 'b10', modelName: 'Itel P67', lcdScreenCode: 'UNI-X6531-LCD' },

  // Box 3: UNI-X6816-LCD
  { id: 'itel_p40_plus', brandId: 'b10', modelName: 'Itel P40+', lcdScreenCode: 'UNI-X6816-LCD' },

  // Box 4: UNI-X6525-LCD
  { id: 'itel_p55', brandId: 'b10', modelName: 'Itel P55', lcdScreenCode: 'UNI-X6525-LCD' },
  { id: 'itel_p55_plus', brandId: 'b10', modelName: 'Itel P55+', lcdScreenCode: 'UNI-X6525-LCD' },
  { id: 'itel_a70s', brandId: 'b10', modelName: 'Itel A70S', lcdScreenCode: 'UNI-X6525-LCD' },

  // Box 5: UNI-X688-LCD
  { id: 'itel_vision2_plus', brandId: 'b10', modelName: 'Itel Vision 2 +', lcdScreenCode: 'UNI-X688-LCD' },
  { id: 'itel_p37pro', brandId: 'b10', modelName: 'Itel P37 Pro', lcdScreenCode: 'UNI-X688-LCD' },

  // Box 9: UNI-X657-LCD
  { id: 'itel_p36_pro_lite', brandId: 'b10', modelName: 'Itel P36 Pro Lite', lcdScreenCode: 'UNI-X657-LCD' },
  { id: 'itel_p36', brandId: 'b10', modelName: 'Itel P36', lcdScreenCode: 'UNI-X657-LCD' },
  { id: 'itel_p37', brandId: 'b10', modelName: 'Itel P37', lcdScreenCode: 'UNI-X657-LCD' },
  { id: 'itel_vision1_plus', brandId: 'b10', modelName: 'Itel Vision 1+', lcdScreenCode: 'UNI-X657-LCD' },
  { id: 'itel_vision1_pro', brandId: 'b10', modelName: 'Itel Vision 1 Pro', lcdScreenCode: 'UNI-X657-LCD' },
  { id: 'itel_vision2s', brandId: 'b10', modelName: 'Itel Vision 2S', lcdScreenCode: 'UNI-X657-LCD' },

  // Box 10: UNI-X668-LCD
  { id: 'itel_vision5', brandId: 'b10', modelName: 'Itel Vision 5', lcdScreenCode: 'UNI-X668-LCD' },
  { id: 'itel_p38', brandId: 'b10', modelName: 'Itel P38', lcdScreenCode: 'UNI-X668-LCD' },

  // Box 12: UNI-X689-LCD
  { id: 'itel_p38_pro', brandId: 'b10', modelName: 'Itel P38 Pro', lcdScreenCode: 'UNI-X689-LCD' },
  { id: 'itel_vision3_plus', brandId: 'b10', modelName: 'Itel Vision 3 Plus', lcdScreenCode: 'UNI-X689-LCD' },

  // Box 13: UNI-KG6K-LCD
  { id: 'itel_a49', brandId: 'b10', modelName: 'Itel A49', lcdScreenCode: 'UNI-KG6K-LCD' },
  { id: 'itel_a58_pro_4g', brandId: 'b10', modelName: 'Itel A58 Pro 4G', lcdScreenCode: 'UNI-KG6K-LCD' },
  { id: 'itel_a58', brandId: 'b10', modelName: 'Itel A58', lcdScreenCode: 'UNI-KG6K-LCD' },

  // Other Itel Models preserved
  { id: 'it1', brandId: 'b10', modelName: 'Itel A56', lcdScreenCode: 'ITL-A56-LCD' },
  { id: 'it5', brandId: 'b10', modelName: 'Itel S16', lcdScreenCode: 'ITL-S16-LCD' },
  { id: 'it6', brandId: 'b10', modelName: 'Itel S17', lcdScreenCode: 'ITL-S17-LCD' },
  { id: 'it8', brandId: 'b10', modelName: 'Itel Vision 2', lcdScreenCode: 'ITL-V2-LCD' },

  // --- GOOGLE ---
  { id: 'ggl_px9_pxl', brandId: 'b13', modelName: 'Google Pixel 9 Pro XL', lcdScreenCode: 'GGL-PX9PXL-LTPO', displayType: 'LTPO OLED (120Hz)', screenSize: '6.8 inches', alternativeNames: 'Pixel 9 Pro XL', repairDifficulty: 'متوسط' },
  { id: 'ggl_px9_pro', brandId: 'b13', modelName: 'Google Pixel 9 Pro', lcdScreenCode: 'GGL-PX9PRO-LTPO', displayType: 'LTPO OLED (120Hz)', screenSize: '6.3 inches', alternativeNames: 'Pixel 9 Pro', screenProtectorCode: 'GGL-PX9_9PRO-GLASS', batteryCode: 'GGL-PX9_9PRO-BATT', repairDifficulty: 'متوسط' },
  { id: 'ggl_px9', brandId: 'b13', modelName: 'Google Pixel 9', lcdScreenCode: 'GGL-PX9-OLED', displayType: 'OLED (120Hz)', screenSize: '6.3 inches', alternativeNames: 'Pixel 9', screenProtectorCode: 'GGL-PX9_9PRO-GLASS', batteryCode: 'GGL-PX9_9PRO-BATT', repairDifficulty: 'متوسط' },
  { id: 'ggl_px9_fold', brandId: 'b13', modelName: 'Google Pixel 9 Pro Fold', lcdScreenCode: 'GGL-PX9PF-LTPO', displayType: 'Foldable LTPO OLED (120Hz)', screenSize: '8.0 inches', alternativeNames: 'Pixel 9 Pro Fold, Fold 2', repairDifficulty: 'صعب' },
  { id: 'ggl_px8a', brandId: 'b13', modelName: 'Google Pixel 8a', lcdScreenCode: 'GGL-PX8A-OLED', displayType: 'OLED (120Hz)', screenSize: '6.1 inches', alternativeNames: 'Pixel 8a', repairDifficulty: 'متوسط' },
  { id: 'ggl_px8_pro', brandId: 'b13', modelName: 'Google Pixel 8 Pro', lcdScreenCode: 'GGL-PX8P-LTPO', displayType: 'LTPO OLED (120Hz)', screenSize: '6.7 inches', alternativeNames: 'Pixel 8 Pro', repairDifficulty: 'متوسط' },
  { id: 'ggl_px8', brandId: 'b13', modelName: 'Google Pixel 8', lcdScreenCode: 'GGL-PX8-OLED', displayType: 'OLED (120Hz)', screenSize: '6.2 inches', alternativeNames: 'Pixel 8', repairDifficulty: 'متوسط' },
  { id: 'ggl_px_fold', brandId: 'b13', modelName: 'Google Pixel Fold', lcdScreenCode: 'GGL-PXFLD-OLED', displayType: 'Foldable OLED (120Hz)', screenSize: '7.6 inches', alternativeNames: 'Pixel Fold', repairDifficulty: 'صعب' },
  { id: 'ggl_px_tablet', brandId: 'b13', modelName: 'Google Pixel Tablet', lcdScreenCode: 'GGL-PXTB-LCD', displayType: 'IPS LCD', screenSize: '10.95 inches', alternativeNames: 'Pixel Tablet', repairDifficulty: 'سهل' },
  { id: 'ggl_px7a', brandId: 'b13', modelName: 'Google Pixel 7a', lcdScreenCode: 'GGL-PX7A-OLED', displayType: 'OLED (90Hz)', screenSize: '6.1 inches', alternativeNames: 'Pixel 7a', repairDifficulty: 'متوسط' },
  { id: 'ggl_px7_pro', brandId: 'b13', modelName: 'Google Pixel 7 Pro', lcdScreenCode: 'GGL-PX7P-LTPO', displayType: 'LTPO OLED (120Hz)', screenSize: '6.7 inches', alternativeNames: 'Pixel 7 Pro', repairDifficulty: 'متوسط' },
  { id: 'ggl_px7', brandId: 'b13', modelName: 'Google Pixel 7', lcdScreenCode: 'GGL-PX7-OLED', displayType: 'OLED (90Hz)', screenSize: '6.3 inches', alternativeNames: 'Pixel 7', repairDifficulty: 'متوسط' },
  { id: 'ggl_px6a', brandId: 'b13', modelName: 'Google Pixel 6a', lcdScreenCode: 'GGL-PX6A-OLED', displayType: 'OLED', screenSize: '6.1 inches', alternativeNames: 'Pixel 6a', repairDifficulty: 'متوسط' },
  { id: 'ggl_px6_pro', brandId: 'b13', modelName: 'Google Pixel 6 Pro', lcdScreenCode: 'GGL-PX6P-LTPO', displayType: 'LTPO OLED (120Hz)', screenSize: '6.7 inches', alternativeNames: 'Pixel 6 Pro', repairDifficulty: 'متوسط' },
  { id: 'ggl_px6', brandId: 'b13', modelName: 'Google Pixel 6', lcdScreenCode: 'GGL-PX6-OLED', displayType: 'OLED (90Hz)', screenSize: '6.4 inches', alternativeNames: 'Pixel 6', repairDifficulty: 'متوسط' },

  // ==========================================
  // --- ADDITIONAL SAMSUNG (LEGACY & NEW) ---
  // ==========================================
  // Legacy J Series & Grand Prime
  { id: 'sam_g532', brandId: 'b1', modelName: 'Samsung Galaxy Grand Prime Plus', lcdScreenCode: 'SAM-GRANDPRIME-LCD', displayType: 'TFT LCD', screenSize: '5.0 inches', alternativeNames: 'G532, G532F, G532M, Grand Prime+', repairDifficulty: 'سهل' },
  { id: 'sam_g530', brandId: 'b1', modelName: 'Samsung Galaxy Grand Prime', lcdScreenCode: 'SAM-GRANDPRIME-LCD', displayType: 'TFT LCD', screenSize: '5.0 inches', alternativeNames: 'G530, G530H, G530F, G531', repairDifficulty: 'سهل' },
  { id: 'sam_j7prime', brandId: 'b1', modelName: 'Samsung Galaxy J7 Prime', lcdScreenCode: 'SAM-J7PRIME-LCD', displayType: 'PLS TFT', screenSize: '5.5 inches', alternativeNames: 'G610, G610F, G610M, On7 2016', repairDifficulty: 'متوسط' },
  { id: 'sam_on7_2016', brandId: 'b1', modelName: 'Samsung Galaxy On7 (2016)', lcdScreenCode: 'SAM-J7PRIME-LCD', displayType: 'PLS TFT', screenSize: '5.5 inches', alternativeNames: 'G6100, On7 Pro', repairDifficulty: 'متوسط' },
  { id: 'sam_j5prime', brandId: 'b1', modelName: 'Samsung Galaxy J5 Prime', lcdScreenCode: 'SAM-J5PRIME-LCD', displayType: 'PLS TFT', screenSize: '5.0 inches', alternativeNames: 'G570, G570F, G570M, On5 2016', repairDifficulty: 'متوسط' },
  { id: 'sam_on5_2016', brandId: 'b1', modelName: 'Samsung Galaxy On5 (2016)', lcdScreenCode: 'SAM-J5PRIME-LCD', displayType: 'PLS TFT', screenSize: '5.0 inches', alternativeNames: 'G5700', repairDifficulty: 'متوسط' },
  { id: 'sam_j7_2016', brandId: 'b1', modelName: 'Samsung Galaxy J7 (2016)', lcdScreenCode: 'SAM-J710-AMOLED', displayType: 'Super AMOLED', screenSize: '5.5 inches', alternativeNames: 'J710, J710F, J710FN, J710M', repairDifficulty: 'سهل' },
  { id: 'sam_j5_2016', brandId: 'b1', modelName: 'Samsung Galaxy J5 (2016)', lcdScreenCode: 'SAM-J510-AMOLED', displayType: 'Super AMOLED', screenSize: '5.2 inches', alternativeNames: 'J510, J510F, J510FN', repairDifficulty: 'سهل' },
  { id: 'sam_j3_2016', brandId: 'b1', modelName: 'Samsung Galaxy J3 (2016)', lcdScreenCode: 'SAM-J320-AMOLED', displayType: 'Super AMOLED', screenSize: '5.0 inches', alternativeNames: 'J320, J320F, J320H', repairDifficulty: 'سهل' },
  { id: 'sam_j4_core', brandId: 'b1', modelName: 'Samsung Galaxy J4 Core', lcdScreenCode: 'SAM-J410-LCD', displayType: 'IPS LCD', screenSize: '6.0 inches', alternativeNames: 'J410, J410F', repairDifficulty: 'متوسط' },
  { id: 'sam_j6_plus', brandId: 'b1', modelName: 'Samsung Galaxy J6 Plus', lcdScreenCode: 'SAM-J410-LCD', displayType: 'IPS LCD', screenSize: '6.0 inches', alternativeNames: 'J610, J610F, J610G, J6+', repairDifficulty: 'متوسط' },
  { id: 'sam_j4_plus', brandId: 'b1', modelName: 'Samsung Galaxy J4 Plus', lcdScreenCode: 'SAM-J410-LCD', displayType: 'IPS LCD', screenSize: '6.0 inches', alternativeNames: 'J415, J415F, J4+', repairDifficulty: 'متوسط' },
  { id: 'sam_j8_2018', brandId: 'b1', modelName: 'Samsung Galaxy J8 (2018)', lcdScreenCode: 'SAM-J810-AMOLED', displayType: 'Super AMOLED', screenSize: '6.0 inches', alternativeNames: 'J810, J810F, J810G', repairDifficulty: 'متوسط' },
  
  // Popular A-Series Classics & Shared AMOLED screens
  { id: 'sam_a50', brandId: 'b1', modelName: 'Samsung Galaxy A50', lcdScreenCode: 'SAM-A50_A30_A20-AMOLED', displayType: 'Super AMOLED', screenSize: '6.4 inches', alternativeNames: 'A505, A505F, A505FN', repairDifficulty: 'متوسط' },
  { id: 'sam_a30s', brandId: 'b1', modelName: 'Samsung Galaxy A30s', lcdScreenCode: 'SAM-A50_A30_A20-AMOLED', displayType: 'Super AMOLED', screenSize: '6.4 inches', alternativeNames: 'A307, A307F, A307FN', repairDifficulty: 'متوسط' },
  { id: 'sam_a30', brandId: 'b1', modelName: 'Samsung Galaxy A30', lcdScreenCode: 'SAM-A50_A30_A20-AMOLED', displayType: 'Super AMOLED', screenSize: '6.4 inches', alternativeNames: 'A305, A305F, A305G', repairDifficulty: 'متوسط' },
  { id: 'sam_a51', brandId: 'b1', modelName: 'Samsung Galaxy A51 4G', lcdScreenCode: 'SAM-A51_A50S-AMOLED', displayType: 'Super AMOLED', screenSize: '6.5 inches', alternativeNames: 'A515, A515F, A515U', repairDifficulty: 'متوسط' },
  { id: 'sam_a71', brandId: 'b1', modelName: 'Samsung Galaxy A71 4G', lcdScreenCode: 'SAM-A71-AMOLED', displayType: 'Super AMOLED Plus', screenSize: '6.7 inches', alternativeNames: 'A715, A715F', repairDifficulty: 'متوسط' },
  { id: 'sam_a54_5g', brandId: 'b1', modelName: 'Samsung Galaxy A54 5G', lcdScreenCode: 'SAM-A54_A55-AMOLED', displayType: 'Super AMOLED (120Hz)', screenSize: '6.4 inches', alternativeNames: 'A546, A546B, A546E', screenProtectorCode: 'SAM-A54_A55-GLASS', repairDifficulty: 'متوسط' },
  { id: 'sam_a55_5g', brandId: 'b1', modelName: 'Samsung Galaxy A55 5G', lcdScreenCode: 'SAM-A54_A55-AMOLED', displayType: 'Super AMOLED (120Hz)', screenSize: '6.6 inches', alternativeNames: 'A556, A556B, A556E', screenProtectorCode: 'SAM-A54_A55-GLASS', repairDifficulty: 'متوسط' },
  { id: 'sam_s23_ultra', brandId: 'b1', modelName: 'Samsung Galaxy S23 Ultra', lcdScreenCode: 'SAM-S23U-DYNAMIC', displayType: 'Dynamic AMOLED 2X (120Hz)', screenSize: '6.8 inches', alternativeNames: 'S918, S918B, S918U', screenProtectorCode: 'SAM-S24U_S23U-GLASS', repairDifficulty: 'صعب' },
  { id: 'sam_s24_ultra', brandId: 'b1', modelName: 'Samsung Galaxy S24 Ultra', lcdScreenCode: 'SAM-S24U-DYNAMIC', displayType: 'Dynamic LTPO AMOLED 2X (120Hz)', screenSize: '6.8 inches', alternativeNames: 'S928, S928B, S928U', screenProtectorCode: 'SAM-S24U_S23U-GLASS', repairDifficulty: 'صعب' },
  { id: 'sam_s25_ultra', brandId: 'b1', modelName: 'Samsung Galaxy S25 Ultra', lcdScreenCode: 'SAM-S25U-DYNAMIC', displayType: 'Dynamic LTPO AMOLED 2X (120Hz)', screenSize: '6.86 inches', alternativeNames: 'S938, S938B, S938U, S25 Ultra', repairDifficulty: 'صعب' },

  // ==========================================
  // --- ADDITIONAL APPLE (LEGACY & NEW) ---
  // ==========================================
  // iPhone 7 / 8 / SE 2020 / SE 2022 (Universal Touch Screen)
  { id: 'ap_ip7', brandId: 'b2', modelName: 'iPhone 7', lcdScreenCode: 'IPA-7_8_SE-LCD', displayType: 'Retina IPS LCD', screenSize: '4.7 inches', alternativeNames: 'A1660, A1778, iPhone 7', screenProtectorCode: 'IPA-7_8_SE-GLASS', repairDifficulty: 'سهل' },
  { id: 'ap_ip8', brandId: 'b2', modelName: 'iPhone 8', lcdScreenCode: 'IPA-7_8_SE-LCD', displayType: 'Retina IPS LCD (TrueTone)', screenSize: '4.7 inches', alternativeNames: 'A1863, A1905, iPhone 8', screenProtectorCode: 'IPA-7_8_SE-GLASS', repairDifficulty: 'سهل' },
  { id: 'ap_ipse2020', brandId: 'b2', modelName: 'iPhone SE (2020)', lcdScreenCode: 'IPA-7_8_SE-LCD', displayType: 'Retina IPS LCD', screenSize: '4.7 inches', alternativeNames: 'A2275, A2296, SE 2', screenProtectorCode: 'IPA-7_8_SE-GLASS', repairDifficulty: 'سهل' },
  { id: 'ap_ipse2022', brandId: 'b2', modelName: 'iPhone SE (2022)', lcdScreenCode: 'IPA-7_8_SE-LCD', displayType: 'Retina IPS LCD', screenSize: '4.7 inches', alternativeNames: 'A2595, A2783, SE 3', screenProtectorCode: 'IPA-7_8_SE-GLASS', repairDifficulty: 'سهل' },
  { id: 'ap_ip7plus', brandId: 'b2', modelName: 'iPhone 7 Plus', lcdScreenCode: 'IPA-7P_8P-LCD', displayType: 'Retina IPS LCD', screenSize: '5.5 inches', alternativeNames: 'A1661, A1784, 7+', screenProtectorCode: 'IPA-7P_8P-GLASS', repairDifficulty: 'سهل' },
  { id: 'ap_ip8plus', brandId: 'b2', modelName: 'iPhone 8 Plus', lcdScreenCode: 'IPA-7P_8P-LCD', displayType: 'Retina IPS LCD', screenSize: '5.5 inches', alternativeNames: 'A1864, A1897, 8+', screenProtectorCode: 'IPA-7P_8P-GLASS', repairDifficulty: 'سهل' },
  { id: 'ap_ipx', brandId: 'b2', modelName: 'iPhone X', lcdScreenCode: 'IPA-X_XS-OLED', displayType: 'Super Retina OLED', screenSize: '5.8 inches', alternativeNames: 'A1865, A1901, iPhone 10', screenProtectorCode: 'IPA-X_XS-GLASS', repairDifficulty: 'متوسط' },
  { id: 'ap_ipxs', brandId: 'b2', modelName: 'iPhone XS', lcdScreenCode: 'IPA-X_XS-OLED', displayType: 'Super Retina OLED', screenSize: '5.8 inches', alternativeNames: 'A1920, A2097', screenProtectorCode: 'IPA-X_XS-GLASS', repairDifficulty: 'متوسط' },
  { id: 'ap_ipxr', brandId: 'b2', modelName: 'iPhone XR', lcdScreenCode: 'IPA-XR_11-LCD', displayType: 'Liquid Retina IPS LCD', screenSize: '6.1 inches', alternativeNames: 'A1984, A2105', screenProtectorCode: 'IPA-XR_11-GLASS', repairDifficulty: 'متوسط' },
  { id: 'ap_ip11', brandId: 'b2', modelName: 'iPhone 11', lcdScreenCode: 'IPA-XR_11-LCD', displayType: 'Liquid Retina IPS LCD', screenSize: '6.1 inches', alternativeNames: 'A2111, A2221', screenProtectorCode: 'IPA-XR_11-GLASS', repairDifficulty: 'متوسط' },
  { id: 'ap_ip16', brandId: 'b2', modelName: 'iPhone 16', lcdScreenCode: 'IPA-16-OLED', displayType: 'Super Retina XDR OLED', screenSize: '6.1 inches', alternativeNames: 'A3287, iPhone 16', screenProtectorCode: 'IPA-16-GLASS', repairDifficulty: 'متوسط' },
  { id: 'ap_ip16plus', brandId: 'b2', modelName: 'iPhone 16 Plus', lcdScreenCode: 'IPA-16PLUS-OLED', displayType: 'Super Retina XDR OLED', screenSize: '6.7 inches', alternativeNames: 'A3290, iPhone 16+', screenProtectorCode: 'IPA-16PLUS-GLASS', repairDifficulty: 'متوسط' },
  { id: 'ap_ip16pro', brandId: 'b2', modelName: 'iPhone 16 Pro', lcdScreenCode: 'IPA-16P_16PM-OLED', displayType: 'LTPO Super Retina XDR OLED (120Hz)', screenSize: '6.3 inches', alternativeNames: 'A3293, iPhone 16 Pro', screenProtectorCode: 'IPA-16P-GLASS', repairDifficulty: 'متوسط' },
  { id: 'ap_ip16promax', brandId: 'b2', modelName: 'iPhone 16 Pro Max', lcdScreenCode: 'IPA-16P_16PM-OLED', displayType: 'LTPO Super Retina XDR OLED (120Hz)', screenSize: '6.9 inches', alternativeNames: 'A3296, 16 Pro Max', screenProtectorCode: 'IPA-16PM-GLASS', repairDifficulty: 'متوسط' },

  // ==========================================
  // --- ADDITIONAL XIAOMI / REDMI / POCO ---
  // ==========================================
  { id: 'xi_rn8', brandId: 'b4', modelName: 'Redmi Note 8', lcdScreenCode: 'XIA-RN8_8T-LCD', displayType: 'IPS LCD', screenSize: '6.3 inches', alternativeNames: 'M1908C3JH, M1908C3JG, ginkgo', batteryCode: 'BN46', repairDifficulty: 'متوسط' },
  { id: 'xi_rn8t', brandId: 'b4', modelName: 'Redmi Note 8T', lcdScreenCode: 'XIA-RN8_8T-LCD', displayType: 'IPS LCD', screenSize: '6.3 inches', alternativeNames: 'M1908C3XG, willow', batteryCode: 'BN46', repairDifficulty: 'متوسط' },
  { id: 'xi_rn7', brandId: 'b4', modelName: 'Redmi Note 7', lcdScreenCode: 'XIA-RN7_7P-LCD', displayType: 'IPS LCD', screenSize: '6.3 inches', alternativeNames: 'M1901F7G, lavender', batteryCode: 'BN4A', repairDifficulty: 'متوسط' },
  { id: 'xi_rn7pro', brandId: 'b4', modelName: 'Redmi Note 7 Pro', lcdScreenCode: 'XIA-RN7_7P-LCD', displayType: 'IPS LCD', screenSize: '6.3 inches', alternativeNames: 'M1901F7S, violet', batteryCode: 'BN4A', repairDifficulty: 'متوسط' },
  { id: 'xi_rn12_4g', brandId: 'b4', modelName: 'Redmi Note 12 4G', lcdScreenCode: 'XIA-RN13_12-AMOLED', displayType: 'AMOLED (120Hz)', screenSize: '6.67 inches', alternativeNames: '23021RAAEG, tapas', repairDifficulty: 'متوسط' },
  { id: 'xi_rn13_4g', brandId: 'b4', modelName: 'Redmi Note 13 4G', lcdScreenCode: 'XIA-RN13_12-AMOLED', displayType: 'AMOLED (120Hz)', screenSize: '6.67 inches', alternativeNames: '23129RAA4G, sapphire', repairDifficulty: 'متوسط' },
  { id: 'xi_rn14_5g', brandId: 'b4', modelName: 'Redmi Note 14 5G', lcdScreenCode: 'XIA-RN14-OLED', displayType: 'OLED (120Hz)', screenSize: '6.67 inches', alternativeNames: '24090RA29G, Note 14', repairDifficulty: 'متوسط' },
  { id: 'xi_rn14pro', brandId: 'b4', modelName: 'Redmi Note 14 Pro 5G', lcdScreenCode: 'XIA-RN14P-AMOLED', displayType: 'Curved AMOLED (120Hz)', screenSize: '6.67 inches', alternativeNames: '24094RAD4G', screenProtectorCode: 'XIA-N14P-GLASS', repairDifficulty: 'صعب' },
  { id: 'xi_rn14pro_plus', brandId: 'b4', modelName: 'Redmi Note 14 Pro+ 5G', lcdScreenCode: 'XIA-RN14P-AMOLED', displayType: 'Curved AMOLED (120Hz)', screenSize: '6.67 inches', alternativeNames: '24115RA8EG', screenProtectorCode: 'XIA-N14P-GLASS', repairDifficulty: 'صعب' },
  { id: 'xi_poco_x3pro', brandId: 'b4', modelName: 'Poco X3 Pro', lcdScreenCode: 'XIA-PX3-LCD', displayType: 'IPS LCD (120Hz)', screenSize: '6.67 inches', alternativeNames: 'M2102J20SG, vayu, Poco X3 NFC', repairDifficulty: 'متوسط' },
  { id: 'xi_poco_x6pro', brandId: 'b4', modelName: 'Poco X6 Pro', lcdScreenCode: 'XIA-PX6P-AMOLED', displayType: 'AMOLED (120Hz 1.5K)', screenSize: '6.67 inches', alternativeNames: '2311DRK48G, duchamp', repairDifficulty: 'متوسط' },

  // ==========================================
  // --- ADDITIONAL OPPO / REALME ---
  // ==========================================
  // Oppo A3s / A5 / Realme C1 (Classic universal screen)
  { id: 'op_a3s', brandId: 'b5', modelName: 'Oppo A3s', lcdScreenCode: 'OPP-A3S_RLM_C1-LCD', displayType: 'IPS LCD', screenSize: '6.2 inches', alternativeNames: 'CPH1803, CPH1853, A3s', repairDifficulty: 'سهل' },
  { id: 'op_a5_2018', brandId: 'b5', modelName: 'Oppo A5 (2018)', lcdScreenCode: 'OPP-A3S_RLM_C1-LCD', displayType: 'IPS LCD', screenSize: '6.2 inches', alternativeNames: 'CPH1809, PBAM00', repairDifficulty: 'سهل' },
  { id: 'rlm_c1', brandId: 'b7', modelName: 'Realme C1', lcdScreenCode: 'OPP-A3S_RLM_C1-LCD', displayType: 'IPS LCD', screenSize: '6.2 inches', alternativeNames: 'RMX1811, Realme C1 2019', repairDifficulty: 'سهل' },
  { id: 'rlm_2', brandId: 'b7', modelName: 'Realme 2', lcdScreenCode: 'OPP-A3S_RLM_C1-LCD', displayType: 'IPS LCD', screenSize: '6.2 inches', alternativeNames: 'RMX1805, RMX1809', repairDifficulty: 'سهل' },

  // Oppo A5s / A7 / A12 / Realme 3 / C2
  { id: 'op_a5s', brandId: 'b5', modelName: 'Oppo A5s', lcdScreenCode: 'OPP-A5S_A12-LCD', displayType: 'IPS LCD', screenSize: '6.2 inches', alternativeNames: 'CPH1909, CPH1920, AX5s', repairDifficulty: 'سهل' },
  { id: 'op_a7', brandId: 'b5', modelName: 'Oppo A7', lcdScreenCode: 'OPP-A5S_A12-LCD', displayType: 'IPS LCD', screenSize: '6.2 inches', alternativeNames: 'CPH1901, CPH1903', repairDifficulty: 'سهل' },
  { id: 'op_a12', brandId: 'b5', modelName: 'Oppo A12', lcdScreenCode: 'OPP-A5S_A12-LCD', displayType: 'IPS LCD', screenSize: '6.22 inches', alternativeNames: 'CPH2083, CPH2077', repairDifficulty: 'سهل' },
  { id: 'op_a11k', brandId: 'b5', modelName: 'Oppo A11k', lcdScreenCode: 'OPP-A5S_A12-LCD', displayType: 'IPS LCD', screenSize: '6.22 inches', alternativeNames: 'CPH2071', repairDifficulty: 'سهل' },
  { id: 'rlm_3', brandId: 'b7', modelName: 'Realme 3', lcdScreenCode: 'OPP-A5S_A12-LCD', displayType: 'IPS LCD', screenSize: '6.22 inches', alternativeNames: 'RMX1825, RMX1821', repairDifficulty: 'سهل' },
  { id: 'rlm_c2', brandId: 'b7', modelName: 'Realme C2', lcdScreenCode: 'OPP-A5S_A12-LCD', displayType: 'IPS LCD', screenSize: '6.1 inches', alternativeNames: 'RMX1941, RMX1945', repairDifficulty: 'سهل' },

  // Oppo A53 / A32 / A33 (90Hz shared LCD)
  { id: 'op_a53', brandId: 'b5', modelName: 'Oppo A53 (2020)', lcdScreenCode: 'OPP-A53_A32-LCD', displayType: 'IPS LCD (90Hz)', screenSize: '6.5 inches', alternativeNames: 'CPH2127, CPH2131', repairDifficulty: 'متوسط' },
  { id: 'op_a32', brandId: 'b5', modelName: 'Oppo A32', lcdScreenCode: 'OPP-A53_A32-LCD', displayType: 'IPS LCD (90Hz)', screenSize: '6.5 inches', alternativeNames: 'PDVM00', repairDifficulty: 'متوسط' },
  { id: 'op_a33_2020', brandId: 'b5', modelName: 'Oppo A33 (2020)', lcdScreenCode: 'OPP-A53_A32-LCD', displayType: 'IPS LCD (90Hz)', screenSize: '6.5 inches', alternativeNames: 'CPH2137', repairDifficulty: 'متوسط' },

  // ==========================================
  // --- ADDITIONAL HUAWEI & HONOR ---
  // ==========================================
  { id: 'hw_nova3i', brandId: 'b3', modelName: 'Huawei Nova 3i', lcdScreenCode: 'HW-NOVA3I-LCD', displayType: 'IPS LCD', screenSize: '6.3 inches', alternativeNames: 'INE-LX1, INE-LX2, P Smart+', repairDifficulty: 'متوسط' },
  { id: 'hw_p_smart_plus', brandId: 'b3', modelName: 'Huawei P Smart Plus', lcdScreenCode: 'HW-NOVA3I-LCD', displayType: 'IPS LCD', screenSize: '6.3 inches', alternativeNames: 'Nova 3i global', repairDifficulty: 'متوسط' },
  { id: 'hw_y7_2019', brandId: 'b3', modelName: 'Huawei Y7 (2019)', lcdScreenCode: 'HW-Y7_2019-LCD', displayType: 'IPS LCD', screenSize: '6.26 inches', alternativeNames: 'DUB-LX1, DUB-LX2, Y7 Prime 2019', repairDifficulty: 'متوسط' },
  { id: 'hw_y7_prime_2019', brandId: 'b3', modelName: 'Huawei Y7 Prime (2019)', lcdScreenCode: 'HW-Y7_2019-LCD', displayType: 'IPS LCD', screenSize: '6.26 inches', alternativeNames: 'DUB-LX3, Y7 Pro 2019', repairDifficulty: 'متوسط' },
  { id: 'hw_y6_2019', brandId: 'b3', modelName: 'Huawei Y6 (2019)', lcdScreenCode: 'HW-Y6_2019-LCD', displayType: 'IPS LCD', screenSize: '6.09 inches', alternativeNames: 'MRD-LX1, MRD-LX2, Y6 Prime 2019', repairDifficulty: 'متوسط' },
  { id: 'hw_y6s', brandId: 'b3', modelName: 'Huawei Y6s', lcdScreenCode: 'HW-Y6_2019-LCD', displayType: 'IPS LCD', screenSize: '6.09 inches', alternativeNames: 'JAT-LX1, JAT-LX3', repairDifficulty: 'متوسط' },
  { id: 'hon_x7b', brandId: 'b11', modelName: 'Honor X7b', lcdScreenCode: 'HON-X7B_HON90L-LCD', displayType: 'IPS LCD (90Hz)', screenSize: '6.8 inches', alternativeNames: 'CLK-LX1, CLK-LX2, Honor X7b', repairDifficulty: 'متوسط' },
  { id: 'hon_90_lite', brandId: 'b11', modelName: 'Honor 90 Lite', lcdScreenCode: 'HON-X7B_HON90L-LCD', displayType: 'IPS LCD (90Hz)', screenSize: '6.7 inches', alternativeNames: 'CRT-LX1, CRT-LX2, CRT-LX3', repairDifficulty: 'متوسط' },
  { id: 'hon_200_lite', brandId: 'b11', modelName: 'Honor 200 Lite', lcdScreenCode: 'HON-200L-AMOLED', displayType: 'AMOLED', screenSize: '6.7 inches', alternativeNames: 'LLY-NX1, Honor 200 Lite', repairDifficulty: 'متوسط' },
  { id: 'hon_200', brandId: 'b11', modelName: 'Honor 200 (5G)', lcdScreenCode: 'HON-200-OLED', displayType: 'OLED (120Hz)', screenSize: '6.7 inches', alternativeNames: 'ELI-NX9, Honor 200 5G', repairDifficulty: 'صعب' }
];

