// Google Places API 유틸리티

const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || '';

export interface GooglePlace {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  types?: string[];
  formatted_phone_number?: string;
  opening_hours?: {
    open_now: boolean;
  };
}

export interface PlaceSearchResult {
  id: string;
  title: string;
  address: string;
  phone?: string;
  rating?: number;
  reviewCount?: number;
  category: string;
  imageUrl: string;
  isFeatured: boolean;
  lat: number;
  lng: number;
}

/**
 * Google Places API로 장소 검색
 */
export async function searchPlaces(
  location: string,
  category?: string,
  radius: number = 5000
): Promise<PlaceSearchResult[]> {
  try {
    // 먼저 지역 좌표 가져오기
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${GOOGLE_PLACES_API_KEY}`;
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();

    if (geocodeData.status !== 'OK' || !geocodeData.results[0]) {
      console.error('Geocoding failed:', geocodeData.status);
      return [];
    }

    const { lat, lng } = geocodeData.results[0].geometry.location;

    // 카테고리에 따른 검색 타입 매핑
    const typeMap: Record<string, string> = {
      '카페': 'cafe',
      '레스토랑': 'restaurant',
      '관광명소': 'tourist_attraction',
      '공원': 'park',
      '박물관': 'museum',
      '미술관': 'art_gallery',
    };

    const searchType = category && category !== '전체' ? typeMap[category] : '';

    // Nearby Search API 호출
    let searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&language=ko&key=${GOOGLE_PLACES_API_KEY}`;
    
    if (searchType) {
      searchUrl += `&type=${searchType}`;
    }

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.status !== 'OK') {
      console.error('Places search failed:', searchData.status);
      return [];
    }

    // 결과 변환
    const places: PlaceSearchResult[] = searchData.results.map((place: GooglePlace, index: number) => {
      const photoUrl = place.photos && place.photos[0]
        ? getPhotoUrl(place.photos[0].photo_reference, 800)
        : `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800`;

      // 카테고리 결정
      let categoryName = '기타';
      if (place.types) {
        if (place.types.includes('cafe')) categoryName = '카페';
        else if (place.types.includes('restaurant')) categoryName = '레스토랑';
        else if (place.types.includes('tourist_attraction')) categoryName = '관광명소';
        else if (place.types.includes('park')) categoryName = '공원';
        else if (place.types.includes('museum')) categoryName = '박물관';
        else if (place.types.includes('art_gallery')) categoryName = '미술관';
      }

      return {
        id: place.place_id,
        title: place.name,
        address: place.formatted_address || '',
        rating: place.rating,
        reviewCount: place.user_ratings_total,
        category: categoryName,
        imageUrl: photoUrl,
        isFeatured: index < 3, // 상위 3개를 추천 장소로 표시
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      };
    });

    return places;
  } catch (error) {
    console.error('Error searching places:', error);
    return [];
  }
}

/**
 * Google Places Photo URL 생성
 */
export function getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;
}

/**
 * Place Details API로 상세 정보 가져오기
 */
export async function getPlaceDetails(placeId: string): Promise<GooglePlace | null> {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&language=ko&key=${GOOGLE_PLACES_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      return data.result;
    }

    console.error('Place details failed:', data.status);
    return null;
  } catch (error) {
    console.error('Error getting place details:', error);
    return null;
  }
}

/**
 * 서버 프록시를 통한 검색 (CORS 우회)
 */
export async function searchPlacesViaProxy(
  location: string,
  category?: string
): Promise<PlaceSearchResult[]> {
  try {
    const response = await fetch(`/api/google-places/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location, category }),
    });

    if (!response.ok) {
      throw new Error('Failed to search places via proxy');
    }

    const data = await response.json();
    return data.places || [];
  } catch (error) {
    console.error('Error searching places via proxy:', error);
    // Fallback to direct API call
    return searchPlaces(location, category);
  }
}
