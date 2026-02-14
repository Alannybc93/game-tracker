import axios from 'axios';

export interface SteamGameSearchResult {
  appid: number;
  name: string;
  coverUrl: string | null;
}

// Lista de endpoints alternativos
const ENDPOINTS = [
  'https://api.steampowered.com/ISteamApps/GetAppList/v2/',
  'https://api.steampowered.com/ISteamApps/GetAppList/v0002/',
  'https://api.steampowered.com/ISteamApps/GetAppList/v1/'
];

export const getSteamCoverUrl = (appId: number): string => {
  return `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/library_600x900_2x.jpg`;
};

export async function searchGames(searchTerm: string): Promise<SteamGameSearchResult[]> {
  let lastError = null;

  // Tentar cada endpoint até um funcionar
  for (const endpoint of ENDPOINTS) {
    try {
      const response = await axios.get(endpoint, { timeout: 5000 });
      const allApps = response.data.applist?.apps;
      
      if (allApps && Array.isArray(allApps)) {
        const results = allApps
          .filter((app: any) => 
            app.name && app.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .slice(0, 15)
          .map((app: any) => ({
            appid: app.appid,
            name: app.name,
            coverUrl: getSteamCoverUrl(app.appid)
          }));
        
        return results;
      }
    } catch (error) {
      lastError = error;
      console.log(`❌ Endpoint ${endpoint} falhou, tentando próximo...`);
    }
  }

  console.error('❌ Todos os endpoints falharam:', lastError);
  return [];
}