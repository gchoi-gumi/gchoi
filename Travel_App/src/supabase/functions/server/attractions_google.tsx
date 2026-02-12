// New Google Places-only attractions endpoint
// This file contains the simplified attractions logic

export async function searchAttractionsByArea(areaCode: string, googleApiKey: string) {
  console.log(`[Attractions Google] Searching for area code: ${areaCode}`);
  
  // Area code to region name mapping
  const areaMap: Record<string, { name: string, lat: number, lng: number }> = {
    "1": { name: "서울", lat: 37.5665, lng: 126.9780 },
    "2": { name: "인천", lat: 37.4563, lng: 126.7052 },
    "3": { name: "대전", lat: 36.3504, lng: 127.3845 },
    "4": { name: "대구", lat: 35.8714, lng: 128.6014 },
    "5": { name: "광주", lat: 35.1595, lng: 126.8526 },
    "6": { name: "부산", lat: 35.1796, lng: 129.0756 },
    "7": { name: "울산", lat: 35.5384, lng: 129.3114 },
    "8": { name: "세종", lat: 36.4801, lng: 127.2890 },
    "31": { name: "경기도", lat: 37.4138, lng: 127.5183 },
    "32": { name: "강원도", lat: 37.8228, lng: 128.1555 },
    "33": { name: "충청북도", lat: 36.8, lng: 127.7 },
    "34": { name: "충청남도", lat: 36.5184, lng: 126.8 },
    "35": { name: "경상북도", lat: 36.4919, lng: 128.8889 },
    "36": { name: "경상남도", lat: 35.4606, lng: 128.2132 },
    "37": { name: "전라북도", lat: 35.7175, lng: 127.153 },
    "38": { name: "전라남도", lat: 34.8679, lng: 126.991 },
    "39": { name: "제주특별자치도", lat: 33.4996, lng: 126.5312 }
  };
  
  const area = areaMap[areaCode];
  if (!area) {
    throw new Error(`Invalid area code: ${areaCode}`);
  }
  
  console.log(`[Attractions Google] Region: ${area.name} at ${area.lat}, ${area.lng}`);
  
  // Search for tourist attractions using Google Places Nearby Search
  const radius = 50000; // 50km radius
  const types = "tourist_attraction|museum|park|point_of_interest|art_gallery|natural_feature";
  
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${area.lat},${area.lng}&radius=${radius}&type=tourist_attraction&key=${googleApiKey}&language=ko`;
  
  console.log(`[Attractions Google] Calling Google Places API...`);
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Google Places API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(`Google Places API status: ${data.status}`);
  }
  
  if (!data.results || data.results.length === 0) {
    console.log(`[Attractions Google] No results for ${area.name}`);
    return [];
  }
  
  console.log(`[Attractions Google] Found ${data.results.length} places`);
  
  // Process results and get photos
  const attractions = [];
  
  for (let i = 0; i < Math.min(data.results.length, 30); i++) {
    const place = data.results[i];
    
    try {
      // Get photo URL if available
      let photoUrl = null;
      if (place.photos && place.photos.length > 0) {
        const photoReference = place.photos[0].photo_reference;
        photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${googleApiKey}`;
      }
      
      // Get detailed info
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=formatted_address,formatted_phone_number,user_ratings_total,rating&key=${googleApiKey}&language=ko`;
      const detailsResponse = await fetch(detailsUrl);
      const detailsData = await detailsResponse.json();
      
      const details = detailsData.result || {};
      
      attractions.push({
        title: place.name,
        addr1: details.formatted_address || place.vicinity || "",
        contentid: place.place_id,
        tel: details.formatted_phone_number || "",
        firstimage: photoUrl || "",
        googlePhoto: photoUrl,
        mapx: place.geometry.location.lng.toString(),
        mapy: place.geometry.location.lat.toString(),
        contenttypeid: "12",
        reviewCount: details.user_ratings_total || 0,
        rating: details.rating || 0
      });
      
      // Small delay to avoid rate limiting
      if (i < Math.min(data.results.length, 30) - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error(`[Attractions Google] Error processing place ${place.name}: ${error}`);
    }
  }
  
  console.log(`[Attractions Google] Processed ${attractions.length} attractions`);
  
  // Apply filtering: 인기 장소 (리뷰 수 상위 30% + 평점 4.0 이상)
  const sorted = [...attractions].sort((a, b) => b.reviewCount - a.reviewCount);
  const top30PercentIndex = Math.ceil(sorted.length * 0.3);
  const popularPlaces = sorted.slice(0, top30PercentIndex).filter(p => p.rating >= 4.0);
  
  // 숨은 명소 (리뷰 수 하위 30% + 평점 4.5 이상)
  const bottom30PercentIndex = Math.floor(sorted.length * 0.7);
  const hiddenGems = sorted.slice(bottom30PercentIndex).filter(p => p.rating >= 4.5);
  
  console.log(`[Attractions Google] Popular places: ${popularPlaces.length}, Hidden gems: ${hiddenGems.length}`);
  
  return attractions;
}
