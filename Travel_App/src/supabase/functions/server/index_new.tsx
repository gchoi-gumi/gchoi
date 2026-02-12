import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { signUp, signIn, signOut, verifyToken } from "./auth.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-a8dd3f70/health", (c) => {
  return c.json({ status: "ok" });
});

// Area code to region mapping
const AREA_MAP: Record<string, { name: string, lat: number, lng: number, searchQuery: string }> = {
  "1": { name: "서울", lat: 37.5665, lng: 126.9780, searchQuery: "서울 관광지" },
  "2": { name: "인천", lat: 37.4563, lng: 126.7052, searchQuery: "인천 관광지" },
  "3": { name: "대전", lat: 36.3504, lng: 127.3845, searchQuery: "대전 관광지" },
  "4": { name: "대구", lat: 35.8714, lng: 128.6014, searchQuery: "대구 관광지" },
  "5": { name: "광주", lat: 35.1595, lng: 126.8526, searchQuery: "광주 관광지" },
  "6": { name: "부산", lat: 35.1796, lng: 129.0756, searchQuery: "부산 관광지" },
  "7": { name: "울산", lat: 35.5384, lng: 129.3114, searchQuery: "울산 관광지" },
  "8": { name: "세종", lat: 36.4801, lng: 127.2890, searchQuery: "세종 관광지" },
  "31": { name: "경기도", lat: 37.4138, lng: 127.5183, searchQuery: "경기도 관광지" },
  "32": { name: "강원도", lat: 37.8228, lng: 128.1555, searchQuery: "강원도 관광지" },
  "33": { name: "충청북도", lat: 36.8, lng: 127.7, searchQuery: "충청북도 관광지" },
  "34": { name: "충청남도", lat: 36.5184, lng: 126.8, searchQuery: "충청남도 관광지" },
  "35": { name: "경상북도", lat: 36.4919, lng: 128.8889, searchQuery: "경상북도 관광지" },
  "36": { name: "경상남도", lat: 35.4606, lng: 128.2132, searchQuery: "경상남도 관광지" },
  "37": { name: "전라북도", lat: 35.7175, lng: 127.153, searchQuery: "전라북도 관광지" },
  "38": { name: "전라남도", lat: 34.8679, lng: 126.991, searchQuery: "전라남도 관광지" },
  "39": { name: "제주특별자치도", lat: 33.4996, lng: 126.5312, searchQuery: "제주도 관광지" }
};

// Get tourist attractions using ONLY Google Places API
app.get("/make-server-a8dd3f70/attractions/:areaCode", async (c) => {
  try {
    const areaCode = c.req.param("areaCode");
    const googleApiKey = Deno.env.get("GOOGLE_PLACES_API_KEY");
    
    console.log(`[Attractions] ===== FETCHING ATTRACTIONS FOR AREA ${areaCode} =====`);
    console.log(`[Attractions] Google API Key: ${googleApiKey ? 'SET' : 'NOT SET'}`);
    
    if (!googleApiKey) {
      console.log(`[Attractions] ❌ Google Places API key not set`);
      return c.json({ 
        attractions: [],
        totalCount: 0,
        error: "API key not configured"
      });
    }
    
    const area = AREA_MAP[areaCode];
    if (!area) {
      console.log(`[Attractions] ❌ Invalid area code: ${areaCode}`);
      return c.json({ 
        attractions: [],
        totalCount: 0,
        error: "Invalid area code"
      });
    }
    
    console.log(`[Attractions] Region: ${area.name} (${area.lat}, ${area.lng})`);
    
    // Method 1: Nearby Search for tourist attractions
    const radius = 50000; // 50km
    const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${area.lat},${area.lng}&radius=${radius}&type=tourist_attraction&key=${googleApiKey}&language=ko`;
    
    console.log(`[Attractions] Calling Google Places Nearby Search...`);
    const nearbyResponse = await fetch(nearbyUrl);
    
    if (!nearbyResponse.ok) {
      console.error(`[Attractions] ❌ Google Places API error: ${nearbyResponse.status}`);
      return c.json({ 
        attractions: [],
        totalCount: 0,
        error: "API error"
      });
    }
    
    const nearbyData = await nearbyResponse.json();
    console.log(`[Attractions] API response status: ${nearbyData.status}`);
    
    if (nearbyData.status !== "OK" && nearbyData.status !== "ZERO_RESULTS") {
      console.error(`[Attractions] ❌ Google Places API status: ${nearbyData.status}`);
      if (nearbyData.error_message) {
        console.error(`[Attractions] Error message: ${nearbyData.error_message}`);
      }
      return c.json({ 
        attractions: [],
        totalCount: 0,
        error: nearbyData.status
      });
    }
    
    const places = nearbyData.results || [];
    console.log(`[Attractions] Found ${places.length} places from Nearby Search`);
    
    // Process results
    const attractions = [];
    const processLimit = Math.min(places.length, 30);
    
    for (let i = 0; i < processLimit; i++) {
      const place = places[i];
      
      try {
        // Get photo URL
        let photoUrl = null;
        if (place.photos && place.photos.length > 0) {
          const photoReference = place.photos[0].photo_reference;
          photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${googleApiKey}`;
        }
        
        // Get detailed info (including phone number)
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=formatted_address,formatted_phone_number,user_ratings_total,rating,types&key=${googleApiKey}&language=ko`;
        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();
        
        const details = detailsData.result || {};
        const reviewCount = details.user_ratings_total || 0;
        const rating = details.rating || 0;
        
        console.log(`[Attractions] ${place.name}: ${reviewCount} reviews, ${rating}★, Photo: ${photoUrl ? '✓' : '✗'}`);
        
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
          reviewCount: reviewCount,
          rating: rating,
          types: details.types || []
        });
        
        // Rate limiting delay
        if (i < processLimit - 1) {
          await new Promise(resolve => setTimeout(resolve, 150));
        }
      } catch (error) {
        console.error(`[Attractions] Error processing place ${place.name}: ${error}`);
      }
    }
    
    console.log(`[Attractions] ✅ Processed ${attractions.length} attractions`);
    
    // Apply filtering
    if (attractions.length > 0) {
      const sorted = [...attractions].sort((a, b) => b.reviewCount - a.reviewCount);
      
      // 인기 장소: 리뷰 수 상위 30% + 평점 4.0 이상
      const top30Index = Math.ceil(sorted.length * 0.3);
      const popular = sorted.slice(0, top30Index).filter(p => p.rating >= 4.0);
      
      // 숨은 명소: 리뷰 수 하위 30% + 평점 4.5 이상
      const bottom30Index = Math.floor(sorted.length * 0.7);
      const hidden = sorted.slice(bottom30Index).filter(p => p.rating >= 4.5);
      
      console.log(`[Attractions] 📊 Popular places: ${popular.length}, Hidden gems: ${hidden.length}`);
    }
    
    return c.json({ 
      attractions: attractions,
      totalCount: attractions.length,
      isMock: false
    });
    
  } catch (error) {
    console.error(`[Attractions] ❌ Unexpected error: ${error}`);
    return c.json({ 
      attractions: [],
      totalCount: 0,
      error: "Server error"
    });
  }
});

// Get festivals using ONLY Google Places API
app.get("/make-server-a8dd3f70/festivals/:areaCode", async (c) => {
  try {
    const areaCode = c.req.param("areaCode");
    const googleApiKey = Deno.env.get("GOOGLE_PLACES_API_KEY");
    
    console.log(`[Festivals] ===== FETCHING FESTIVALS FOR AREA ${areaCode} =====`);
    
    if (!googleApiKey) {
      return c.json({ 
        festivals: [],
        totalCount: 0,
        error: "API key not configured"
      });
    }
    
    const area = AREA_MAP[areaCode];
    if (!area) {
      return c.json({ 
        festivals: [],
        totalCount: 0,
        error: "Invalid area code"
      });
    }
    
    // Search for events and festivals
    const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(area.searchQuery + " 축제 행사")}&location=${area.lat},${area.lng}&radius=50000&key=${googleApiKey}&language=ko`;
    
    console.log(`[Festivals] Searching festivals in ${area.name}...`);
    const response = await fetch(textSearchUrl);
    const data = await response.json();
    
    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      return c.json({ 
        festivals: [],
        totalCount: 0,
        error: data.status
      });
    }
    
    const places = data.results || [];
    console.log(`[Festivals] Found ${places.length} potential festivals`);
    
    const festivals = [];
    const processLimit = Math.min(places.length, 20);
    
    for (let i = 0; i < processLimit; i++) {
      const place = places[i];
      
      try {
        let photoUrl = null;
        if (place.photos && place.photos.length > 0) {
          const photoReference = place.photos[0].photo_reference;
          photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${googleApiKey}`;
        }
        
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=formatted_address,formatted_phone_number,user_ratings_total,rating&key=${googleApiKey}&language=ko`;
        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();
        const details = detailsData.result || {};
        
        festivals.push({
          title: place.name,
          addr1: details.formatted_address || place.vicinity || "",
          contentid: place.place_id,
          tel: details.formatted_phone_number || "",
          firstimage: photoUrl || "",
          googlePhoto: photoUrl,
          mapx: place.geometry.location.lng.toString(),
          mapy: place.geometry.location.lat.toString(),
          contenttypeid: "15",
          reviewCount: details.user_ratings_total || 0,
          rating: details.rating || 0
        });
        
        if (i < processLimit - 1) {
          await new Promise(resolve => setTimeout(resolve, 150));
        }
      } catch (error) {
        console.error(`[Festivals] Error processing ${place.name}: ${error}`);
      }
    }
    
    console.log(`[Festivals] ✅ Processed ${festivals.length} festivals`);
    
    return c.json({ 
      festivals: festivals,
      totalCount: festivals.length,
      isMock: false
    });
    
  } catch (error) {
    console.error(`[Festivals] ❌ Error: ${error}`);
    return c.json({ 
      festivals: [],
      totalCount: 0,
      error: "Server error"
    });
  }
});

// ... (keep other endpoints from original file)

Deno.serve(app.fetch);
