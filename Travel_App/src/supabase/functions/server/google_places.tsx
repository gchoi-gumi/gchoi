// Google Places API 프록시 핸들러
import { Context } from "npm:hono@4.3.11";

const GOOGLE_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY');

interface GooglePlace {
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
}

/**
 * Google Places Photo URL 생성
 */
function getPhotoUrl(photoReference: string, maxWidth: number = 800): string {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_API_KEY}`;
}

/**
 * 장소 검색 핸들러
 */
export async function searchPlaces(c: Context) {
  try {
    console.log('[Google Places] Search request received');

    if (!GOOGLE_API_KEY) {
      console.error('[Google Places] API key not found');
      return c.json({ 
        success: false, 
        error: 'Google Places API key not configured' 
      }, 500);
    }

    const body = await c.req.json();
    const { location, category } = body;

    console.log('[Google Places] Searching for:', { location, category });

    // 1. Geocoding으로 좌표 가져오기
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&language=ko&key=${GOOGLE_API_KEY}`;
    console.log('[Google Places] Geocoding URL:', geocodeUrl.replace(GOOGLE_API_KEY, 'HIDDEN'));

    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();

    if (geocodeData.status !== 'OK' || !geocodeData.results[0]) {
      console.error('[Google Places] Geocoding failed:', geocodeData.status);
      return c.json({ 
        success: false, 
        error: `Geocoding failed: ${geocodeData.status}` 
      }, 400);
    }

    const { lat, lng } = geocodeData.results[0].geometry.location;
    console.log('[Google Places] Location coordinates:', { lat, lng });

    // 2. 카테고리 매핑
    const typeMap: Record<string, string> = {
      '카페': 'cafe',
      '레스토랑': 'restaurant',
      '관광명소': 'tourist_attraction',
      '공원': 'park',
      '박물관': 'museum',
      '미술관': 'art_gallery',
    };

    const searchType = category && category !== '전체' ? typeMap[category] : '';
    const radius = 5000; // 5km

    // 3. Nearby Search
    let searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&language=ko&key=${GOOGLE_API_KEY}`;
    
    if (searchType) {
      searchUrl += `&type=${searchType}`;
    }

    console.log('[Google Places] Search URL:', searchUrl.replace(GOOGLE_API_KEY, 'HIDDEN'));

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.status !== 'OK') {
      console.error('[Google Places] Search failed:', searchData.status);
      return c.json({ 
        success: false, 
        error: `Search failed: ${searchData.status}` 
      }, 400);
    }

    console.log('[Google Places] Found places:', searchData.results?.length || 0);

    // 4. 결과 변환
    const places = searchData.results.map((place: GooglePlace, index: number) => {
      const photoUrl = place.photos && place.photos[0]
        ? getPhotoUrl(place.photos[0].photo_reference, 800)
        : null;

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

    return c.json({ 
      success: true, 
      places,
      count: places.length
    });

  } catch (error) {
    console.error('[Google Places] Error:', error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, 500);
  }
}

/**
 * 장소 상세 정보 핸들러
 */
export async function getPlaceDetails(c: Context) {
  try {
    const placeId = c.req.param('placeId');

    if (!GOOGLE_API_KEY) {
      return c.json({ 
        success: false, 
        error: 'Google Places API key not configured' 
      }, 500);
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&language=ko&key=${GOOGLE_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      return c.json({ 
        success: false, 
        error: `Details failed: ${data.status}` 
      }, 400);
    }

    return c.json({ 
      success: true, 
      place: data.result 
    });

  } catch (error) {
    console.error('[Google Places] Details error:', error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, 500);
  }
}

/**
 * 주변 장소 검색 핸들러 (lat, lng 기반)
 */
export async function nearbyPlaces(c: Context) {
  try {
    console.log('[Google Places] Nearby search request received');

    if (!GOOGLE_API_KEY) {
      console.error('[Google Places] API key not found');
      return c.json({ 
        success: false, 
        error: 'Google Places API key not configured' 
      }, 500);
    }

    const lat = c.req.query('lat');
    const lng = c.req.query('lng');
    const type = c.req.query('type') || 'tourist_attraction';
    const radius = c.req.query('radius') || '10000';

    if (!lat || !lng) {
      return c.json({ 
        success: false, 
        error: 'Latitude and longitude are required' 
      }, 400);
    }

    console.log('[Google Places] Nearby search:', { lat, lng, type, radius });

    // Nearby Search
    const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&language=ko&key=${GOOGLE_API_KEY}`;
    
    console.log('[Google Places] Search URL:', searchUrl.replace(GOOGLE_API_KEY, 'HIDDEN'));

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') {
      console.error('[Google Places] Search failed:', searchData.status);
      return c.json({ 
        success: false, 
        error: `Search failed: ${searchData.status}` 
      }, 400);
    }

    console.log('[Google Places] Found places:', searchData.results?.length || 0);

    // 결과 변환
    const places = (searchData.results || []).map((place: GooglePlace, index: number) => {
      const photoUrl = place.photos && place.photos[0]
        ? getPhotoUrl(place.photos[0].photo_reference, 800)
        : null;

      return {
        place_id: place.place_id,
        name: place.name,
        vicinity: place.formatted_address || '',
        rating: place.rating,
        user_ratings_total: place.user_ratings_total,
        geometry: place.geometry,
        photos: place.photos,
        types: place.types,
        photoUrl,
      };
    });

    return c.json({ 
      success: true, 
      places,
      count: places.length
    });

  } catch (error) {
    console.error('[Google Places] Nearby search error:', error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, 500);
  }
}

/**
 * 텍스트 검색 핸들러
 */
export async function textSearch(c: Context) {
  try {
    console.log('[Google Places] Text search request received');

    if (!GOOGLE_API_KEY) {
      console.error('[Google Places] API key not found');
      return c.json({ 
        success: false, 
        error: 'Google Places API key not configured' 
      }, 500);
    }

    const query = c.req.query('query');

    if (!query) {
      return c.json({ 
        success: false, 
        error: 'Query parameter is required' 
      }, 400);
    }

    console.log('[Google Places] Text search for:', query);

    // Text Search
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&language=ko&key=${GOOGLE_API_KEY}`;
    
    console.log('[Google Places] Search URL:', searchUrl.replace(GOOGLE_API_KEY, 'HIDDEN'));

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') {
      console.error('[Google Places] Search failed:', searchData.status);
      return c.json({ 
        success: false, 
        error: `Search failed: ${searchData.status}` 
      }, 400);
    }

    console.log('[Google Places] Found places:', searchData.results?.length || 0);

    // 결과 변환
    const places = (searchData.results || []).map((place: GooglePlace) => {
      const photoUrl = place.photos && place.photos[0]
        ? getPhotoUrl(place.photos[0].photo_reference, 800)
        : null;

      return {
        place_id: place.place_id,
        name: place.name,
        vicinity: place.formatted_address || '',
        rating: place.rating,
        user_ratings_total: place.user_ratings_total,
        geometry: place.geometry,
        photos: place.photos,
        types: place.types,
        photoUrl,
      };
    });

    return c.json({ 
      success: true, 
      places,
      count: places.length
    });

  } catch (error) {
    console.error('[Google Places] Text search error:', error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, 500);
  }
}