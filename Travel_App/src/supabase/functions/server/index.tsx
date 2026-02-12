import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { signUp, signIn, verifyToken } from "./auth.tsx";
import { searchPlaces, getPlaceDetails, nearbyPlaces, textSearch } from "./google_places.tsx";

// Check critical environment variables on startup
console.log('='.repeat(60));
console.log('[Server] Starting Make Server...');
console.log('[Server] Environment Variables Check:');
console.log('[Server] SUPABASE_URL:', Deno.env.get('SUPABASE_URL') ? 'SET ✓' : 'MISSING ✗');
console.log('[Server] SUPABASE_SERVICE_ROLE_KEY:', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ? 'SET ✓' : 'MISSING ✗');
console.log('[Server] SUPABASE_ANON_KEY:', Deno.env.get('SUPABASE_ANON_KEY') ? 'SET ✓' : 'MISSING ✗');
console.log('[Server] OPENWEATHER_API_KEY:', Deno.env.get('OPENWEATHER_API_KEY') ? 'SET ✓' : 'MISSING ✗');
console.log('[Server] GOOGLE_PLACES_API_KEY:', Deno.env.get('GOOGLE_PLACES_API_KEY') ? 'SET ✓' : 'MISSING ✗');
console.log('[Server] KAKAO_REST_API_KEY:', Deno.env.get('KAKAO_REST_API_KEY') ? 'SET ✓' : 'MISSING ✗');
console.log('[Server] OPENAI_API_KEY:', Deno.env.get('OPENAI_API_KEY') ? 'SET ✓' : 'MISSING ✗');
console.log('='.repeat(60));

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes
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

// ==================== HEALTH CHECK ====================
app.get("/make-server-a8dd3f70/health", (c) => {
  return c.json({ status: "ok", version: "v3-minimal" });
});

// Debug endpoint to check environment variables (security: only show if they're SET, not the values)
app.get("/make-server-a8dd3f70/debug/env", (c) => {
  return c.json({
    SUPABASE_URL: Deno.env.get('SUPABASE_URL') ? 'SET' : 'MISSING',
    SUPABASE_SERVICE_ROLE_KEY: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ? 'SET' : 'MISSING',
    SUPABASE_ANON_KEY: Deno.env.get('SUPABASE_ANON_KEY') ? 'SET' : 'MISSING',
    OPENWEATHER_API_KEY: Deno.env.get('OPENWEATHER_API_KEY') ? 'SET' : 'MISSING',
    GOOGLE_PLACES_API_KEY: Deno.env.get('GOOGLE_PLACES_API_KEY') ? 'SET' : 'MISSING',
    KAKAO_REST_API_KEY: Deno.env.get('KAKAO_REST_API_KEY') ? 'SET' : 'MISSING',
    OPENAI_API_KEY: Deno.env.get('OPENAI_API_KEY') ? 'SET' : 'MISSING',
  });
});

// ==================== GOOGLE PLACES ROUTES ====================

// Search places
app.post("/make-server-a8dd3f70/google-places/search", searchPlaces);

// Get place details
app.get("/make-server-a8dd3f70/google-places/details/:placeId", getPlaceDetails);

// Get nearby places (lat/lng query parameters)
app.get("/make-server-a8dd3f70/places/nearby", nearbyPlaces);

// Text search
app.get("/make-server-a8dd3f70/places/search", textSearch);

// ==================== AUTH ROUTES ====================

// Sign up
app.post("/make-server-a8dd3f70/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    console.log('[Auth] Sign up request:', { email, name });
    
    if (!email || !password) {
      console.error('[Auth] Missing email or password');
      return c.json({ success: false, error: 'Email and password are required' }, 400);
    }
    
    const result = await signUp(email, password, name || '');
    console.log('[Auth] Sign up result:', { success: result.success, error: result.error });
    
    if (result.success) {
      return c.json({ success: true, user: result.user, accessToken: result.accessToken });
    } else {
      console.error('[Auth] Sign up failed with error:', result.error);
      return c.json({ success: false, error: result.error || 'Sign up failed' }, 400);
    }
  } catch (error) {
    console.error('[Auth] Sign up exception:', error);
    const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
    return c.json({ success: false, error: errorMessage }, 500);
  }
});

// Sign in
app.post("/make-server-a8dd3f70/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();
    console.log('[Auth] Sign in request:', { email });
    
    if (!email || !password) {
      console.error('[Auth] Missing email or password');
      return c.json({ success: false, error: 'Email and password are required' }, 400);
    }
    
    const result = await signIn(email, password);
    console.log('[Auth] Sign in result:', { success: result.success, error: result.error });
    
    if (result.success) {
      return c.json({ success: true, user: result.user, accessToken: result.accessToken });
    } else {
      console.error('[Auth] Sign in failed with error:', result.error);
      return c.json({ success: false, error: result.error || 'Sign in failed' }, 401);
    }
  } catch (error) {
    console.error('[Auth] Sign in exception:', error);
    const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
    return c.json({ success: false, error: errorMessage }, 500);
  }
});

// Get current user
app.get("/make-server-a8dd3f70/auth/me", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    
    if (!accessToken) {
      return c.json({ success: false, error: 'No token provided' }, 401);
    }
    
    const result = await verifyToken(accessToken);
    
    if (result.valid && result.user) {
      return c.json({ success: true, user: result.user });
    } else {
      return c.json({ success: false, error: 'Invalid token' }, 401);
    }
  } catch (error) {
    console.error('[Auth] Get user error:', error);
    return c.json({ success: false, error: 'Failed to get user' }, 500);
  }
});

// ==================== ITINERARY ROUTES ====================

// Get all itineraries for a user
app.get("/make-server-a8dd3f70/itineraries", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    
    if (!accessToken) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    const authResult = await verifyToken(accessToken);
    if (!authResult.valid || !authResult.user) {
      return c.json({ success: false, error: 'Invalid token' }, 401);
    }
    
    const userId = authResult.user.id;
    const itineraries = await kv.getByPrefix(`itinerary:${userId}:`);
    
    return c.json({ success: true, itineraries });
  } catch (error) {
    console.error('[Itinerary] Get itineraries error:', error);
    return c.json({ success: false, error: 'Failed to get itineraries' }, 500);
  }
});

// Get single itinerary
app.get("/make-server-a8dd3f70/itineraries/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    
    if (!accessToken) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    const authResult = await verifyToken(accessToken);
    if (!authResult.valid || !authResult.user) {
      return c.json({ success: false, error: 'Invalid token' }, 401);
    }
    
    const id = c.req.param('id');
    const userId = authResult.user.id;
    const itinerary = await kv.get(`itinerary:${userId}:${id}`);
    
    if (!itinerary) {
      return c.json({ success: false, error: 'Itinerary not found' }, 404);
    }
    
    return c.json({ success: true, itinerary });
  } catch (error) {
    console.error('[Itinerary] Get itinerary error:', error);
    return c.json({ success: false, error: 'Failed to get itinerary' }, 500);
  }
});

// Create itinerary
app.post("/make-server-a8dd3f70/itineraries", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    
    if (!accessToken) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    const authResult = await verifyToken(accessToken);
    if (!authResult.valid || !authResult.user) {
      return c.json({ success: false, error: 'Invalid token' }, 401);
    }
    
    const userId = authResult.user.id;
    const data = await c.req.json();
    
    const id = Date.now().toString();
    const itinerary = {
      ...data,
      id,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`itinerary:${userId}:${id}`, itinerary);
    
    return c.json({ success: true, itinerary });
  } catch (error) {
    console.error('[Itinerary] Create itinerary error:', error);
    return c.json({ success: false, error: 'Failed to create itinerary' }, 500);
  }
});

// Delete itinerary
app.delete("/make-server-a8dd3f70/itineraries/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    
    if (!accessToken) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    const authResult = await verifyToken(accessToken);
    if (!authResult.valid || !authResult.user) {
      return c.json({ success: false, error: 'Invalid token' }, 401);
    }
    
    const id = c.req.param('id');
    const userId = authResult.user.id;
    
    await kv.del(`itinerary:${userId}:${id}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('[Itinerary] Delete itinerary error:', error);
    return c.json({ success: false, error: 'Failed to delete itinerary' }, 500);
  }
});

// ==================== BOOKMARK ROUTES ====================

// Get all bookmarks for a user
app.get("/make-server-a8dd3f70/bookmarks", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    
    if (!accessToken) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    const authResult = await verifyToken(accessToken);
    if (!authResult.valid || !authResult.user) {
      return c.json({ success: false, error: 'Invalid token' }, 401);
    }
    
    const userId = authResult.user.id;
    const bookmarks = await kv.getByPrefix(`bookmark:${userId}:`);
    
    return c.json({ success: true, bookmarks });
  } catch (error) {
    console.error('[Bookmark] Get bookmarks error:', error);
    return c.json({ success: false, error: 'Failed to get bookmarks' }, 500);
  }
});

// Add bookmark
app.post("/make-server-a8dd3f70/bookmarks", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    
    if (!accessToken) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    const authResult = await verifyToken(accessToken);
    if (!authResult.valid || !authResult.user) {
      return c.json({ success: false, error: 'Invalid token' }, 401);
    }
    
    const userId = authResult.user.id;
    const data = await c.req.json();
    
    const id = Date.now().toString();
    const bookmark = {
      ...data,
      id,
      userId,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`bookmark:${userId}:${id}`, bookmark);
    
    return c.json({ success: true, bookmark });
  } catch (error) {
    console.error('[Bookmark] Add bookmark error:', error);
    return c.json({ success: false, error: 'Failed to add bookmark' }, 500);
  }
});

// Remove bookmark
app.delete("/make-server-a8dd3f70/bookmarks/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    
    if (!accessToken) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    const authResult = await verifyToken(accessToken);
    if (!authResult.valid || !authResult.user) {
      return c.json({ success: false, error: 'Invalid token' }, 401);
    }
    
    const id = c.req.param('id');
    const userId = authResult.user.id;
    
    await kv.del(`bookmark:${userId}:${id}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('[Bookmark] Remove bookmark error:', error);
    return c.json({ success: false, error: 'Failed to remove bookmark' }, 500);
  }
});

// Check if place is bookmarked
app.get("/make-server-a8dd3f70/bookmarks/check/:placeId", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    
    if (!accessToken) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    const authResult = await verifyToken(accessToken);
    if (!authResult.valid || !authResult.user) {
      return c.json({ success: false, error: 'Invalid token' }, 401);
    }
    
    const userId = authResult.user.id;
    const placeId = c.req.param('placeId');
    const bookmarks = await kv.getByPrefix(`bookmark:${userId}:`);
    
    const isBookmarked = bookmarks.some((b: any) => b.placeId === placeId);
    
    return c.json({ success: true, isBookmarked });
  } catch (error) {
    console.error('[Bookmark] Check bookmark error:', error);
    return c.json({ success: false, error: 'Failed to check bookmark' }, 500);
  }
});

// ==================== REVIEW ROUTES ====================

// Get all reviews
app.get("/make-server-a8dd3f70/reviews", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    
    if (!accessToken) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    const authResult = await verifyToken(accessToken);
    if (!authResult.valid || !authResult.user) {
      return c.json({ success: false, error: 'Invalid token' }, 401);
    }
    
    const userId = authResult.user.id;
    const reviews = await kv.getByPrefix(`review:${userId}:`);
    
    return c.json({ success: true, reviews });
  } catch (error) {
    console.error('[Review] Get reviews error:', error);
    return c.json({ success: false, error: 'Failed to get reviews' }, 500);
  }
});

// Get reviews for a place
app.get("/make-server-a8dd3f70/reviews/place/:placeId", async (c) => {
  try {
    const placeId = c.req.param('placeId');
    const allReviews = await kv.getByPrefix('review:');
    
    const placeReviews = allReviews.filter((r: any) => r.placeId === placeId);
    
    return c.json({ success: true, reviews: placeReviews });
  } catch (error) {
    console.error('[Review] Get place reviews error:', error);
    return c.json({ success: false, error: 'Failed to get place reviews' }, 500);
  }
});

// Create review
app.post("/make-server-a8dd3f70/reviews", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    
    if (!accessToken) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    const authResult = await verifyToken(accessToken);
    if (!authResult.valid || !authResult.user) {
      return c.json({ success: false, error: 'Invalid token' }, 401);
    }
    
    const userId = authResult.user.id;
    const user = authResult.user;
    const data = await c.req.json();
    
    const id = Date.now().toString();
    const review = {
      ...data,
      id,
      userId,
      userEmail: user.email,
      userName: user.name,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`review:${userId}:${id}`, review);
    
    return c.json({ success: true, review });
  } catch (error) {
    console.error('[Review] Create review error:', error);
    return c.json({ success: false, error: 'Failed to create review' }, 500);
  }
});

// Delete review
app.delete("/make-server-a8dd3f70/reviews/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    
    if (!accessToken) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    const authResult = await verifyToken(accessToken);
    if (!authResult.valid || !authResult.user) {
      return c.json({ success: false, error: 'Invalid token' }, 401);
    }
    
    const id = c.req.param('id');
    const userId = authResult.user.id;
    
    await kv.del(`review:${userId}:${id}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('[Review] Delete review error:', error);
    return c.json({ success: false, error: 'Failed to delete review' }, 500);
  }
});

// ==================== WEATHER ROUTES ====================

// Get weather by city name
app.get("/make-server-a8dd3f70/weather/:city", async (c) => {
  try {
    const city = c.req.param('city');
    
    if (!city) {
      return c.json({ success: false, error: 'City required' }, 400);
    }
    
    const apiKey = Deno.env.get('OPENWEATHER_API_KEY');
    if (!apiKey) {
      console.error('[Weather] OpenWeather API key not found');
      return c.json({ 
        success: true, 
        weather: {
          temperature: 20,
          description: '맑음',
          icon: '01d',
          humidity: 60,
          windSpeed: 2.5,
          isMock: true
        }
      });
    }
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},KR&appid=${apiKey}&units=metric&lang=kr`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn(`[Weather] OpenWeather API returned ${response.status} for city: ${city}`);
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    return c.json({ 
      success: true, 
      weather: {
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        isMock: false
      }
    });
  } catch (error) {
    console.warn('[Weather] Using mock weather data. Error:', error instanceof Error ? error.message : error);
    return c.json({ 
      success: true, 
      weather: {
        temperature: 20,
        description: '맑음',
        icon: '01d',
        humidity: 60,
        windSpeed: 2.5,
        isMock: true
      }
    });
  }
});

// ==================== ANALYZE PLACES ROUTES ====================

// Analyze places to find popular and hidden gems
app.post("/make-server-a8dd3f70/analyze-places", async (c) => {
  try {
    const { location, category } = await c.req.json();
    
    console.log(`[AnalyzePlaces] Analyzing ${location} for category: ${category || 'all'}`);
    
    const kakaoApiKey = Deno.env.get('KAKAO_REST_API_KEY');
    const googleApiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    
    // If APIs are not configured, return mock data
    if (!kakaoApiKey || !googleApiKey) {
      console.log('[AnalyzePlaces] API keys not configured, returning mock data');
      return c.json({
        popularPlaces: generateMockPlaces('popular', location, category),
        hiddenGems: generateMockPlaces('hidden', location, category),
        isMock: true
      });
    }
    
    try {
      // Search using Kakao API
      const kakaoQuery = category ? `${location} ${category}` : location;
      const kakaoUrl = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(kakaoQuery)}&size=15`;
      
      const kakaoResponse = await fetch(kakaoUrl, {
        headers: {
          'Authorization': `KakaoAK ${kakaoApiKey}`
        }
      });
      
      if (!kakaoResponse.ok) {
        throw new Error(`Kakao API error: ${kakaoResponse.status}`);
      }
      
      const kakaoData = await kakaoResponse.json();
      const kakaoPlaces = kakaoData.documents || [];
      
      // Search using Google Places API
      const googleQuery = category ? `${category} in ${location}, South Korea` : `${location}, South Korea`;
      const googleUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(googleQuery)}&language=ko&region=kr&key=${googleApiKey}`;
      
      const googleResponse = await fetch(googleUrl);
      const googleData = await googleResponse.json();
      const googlePlaces = googleData.results || [];
      
      // Combine and process places
      const allPlaces = [];
      
      // Process Kakao places - 각 장소에 대해 Google Places API로 이미지 검색
      for (const place of kakaoPlaces) {
        let imageUrl = null;
        
        // Try to get image from Google Places
        try {
          const googleSearchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(place.place_name + ' ' + location)}&inputtype=textquery&fields=place_id,photos&language=ko&key=${googleApiKey}`;
          const googleSearchResponse = await fetch(googleSearchUrl);
          const googleSearchData = await googleSearchResponse.json();
          
          if (googleSearchData.candidates && googleSearchData.candidates[0] && googleSearchData.candidates[0].photos) {
            const photoRef = googleSearchData.candidates[0].photos[0].photo_reference;
            imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${googleApiKey}`;
          }
        } catch (photoError) {
          console.warn(`[AnalyzePlaces] Failed to get image for ${place.place_name}:`, photoError);
        }
        
        allPlaces.push({
          id: place.id,
          name: place.place_name,
          category: place.category_name?.split('>').pop()?.trim() || category || '관광지',
          address: place.address_name || '',
          roadAddress: place.road_address_name || '',
          phone: place.phone || '',
          rating: 4.0 + Math.random() * 0.5, // Kakao doesn't provide ratings
          reviewCount: Math.floor(Math.random() * 100) + 10,
          x: parseFloat(place.x),
          y: parseFloat(place.y),
          placeUrl: place.place_url,
          imageUrl: imageUrl,
          source: 'kakao'
        });
      }
      
      // Process Google places
      for (const place of googlePlaces) {
        allPlaces.push({
          id: place.place_id,
          name: place.name,
          category: place.types?.[0]?.replace(/_/g, ' ') || category || '관광지',
          address: place.formatted_address || '',
          roadAddress: place.formatted_address || '',
          phone: '',
          rating: place.rating || 4.0,
          reviewCount: place.user_ratings_total || 0,
          x: place.geometry?.location?.lng,
          y: place.geometry?.location?.lat,
          imageUrl: place.photos?.[0] ? 
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${place.photos[0].photo_reference}&key=${googleApiKey}` : 
            null,
          source: 'google'
        });
      }
      
      // Remove duplicates (same name and similar location)
      const uniquePlaces = [];
      for (const place of allPlaces) {
        const isDuplicate = uniquePlaces.some(p => 
          p.name === place.name && 
          Math.abs(p.y - place.y) < 0.001 && 
          Math.abs(p.x - place.x) < 0.001
        );
        if (!isDuplicate) {
          uniquePlaces.push(place);
        }
      }
      
      // Calculate popularity score
      const placesWithScore = uniquePlaces.map(place => ({
        ...place,
        popularityScore: (place.rating * 20) + Math.log10(place.reviewCount + 1) * 10
      }));
      
      // Sort by popularity score
      placesWithScore.sort((a, b) => b.popularityScore - a.popularityScore);
      
      // Top 30% are popular places
      const popularCount = Math.max(5, Math.floor(placesWithScore.length * 0.3));
      const popularPlaces = placesWithScore.slice(0, popularCount);
      
      // Bottom 30% with good ratings (>=3.5) are hidden gems
      const hiddenCandidates = placesWithScore
        .slice(popularCount)
        .filter(p => p.rating >= 3.5 && p.reviewCount < 100);
      const hiddenGems = hiddenCandidates.slice(0, Math.min(10, hiddenCandidates.length));
      
      console.log(`[AnalyzePlaces] Found ${popularPlaces.length} popular and ${hiddenGems.length} hidden gems`);
      
      return c.json({
        popularPlaces,
        hiddenGems,
        isMock: false
      });
      
    } catch (apiError) {
      console.error('[AnalyzePlaces] API error:', apiError);
      // Return mock data on API error
      return c.json({
        popularPlaces: generateMockPlaces('popular', location, category),
        hiddenGems: generateMockPlaces('hidden', location, category),
        isMock: true
      });
    }
    
  } catch (error) {
    console.error('[AnalyzePlaces] Error:', error);
    return c.json({ success: false, error: 'Failed to analyze places' }, 500);
  }
});

// Helper function to generate mock places
function generateMockPlaces(type: 'popular' | 'hidden', location: string, category: string) {
  const mockPlaces = [];
  const count = type === 'popular' ? 10 : 5;
  const baseRating = type === 'popular' ? 4.5 : 4.0;
  const baseReviewCount = type === 'popular' ? 500 : 50;
  
  const placeNames = [
    '맛집', '카페', '전망대', '공원', '박물관', '갤러리', 
    '레스토랑', '관광지', '체험관', '정원'
  ];
  
  for (let i = 0; i < count; i++) {
    const placeName = category || placeNames[i % placeNames.length];
    mockPlaces.push({
      id: `mock_${type}_${i}`,
      name: `${location} ${placeName} ${i + 1}`,
      category: category || '관광지',
      address: `${location} 모의 주소 ${i + 1}`,
      roadAddress: `${location} 모의 도로명 주소 ${i + 1}`,
      phone: '02-1234-5678',
      rating: baseRating + Math.random() * 0.5,
      reviewCount: baseReviewCount + Math.floor(Math.random() * 200),
      x: 127.0 + Math.random() * 0.1,
      y: 37.5 + Math.random() * 0.1,
      popularityScore: type === 'popular' ? 90 + Math.random() * 10 : 50 + Math.random() * 20,
      source: 'mock'
    });
  }
  
  return mockPlaces;
}

// ==================== ROUTE CALCULATION ====================

// 카카오 API를 사용한 경로 계산
app.post("/make-server-a8dd3f70/calculate-route", async (c) => {
  try {
    const { places, transportMode, travelStyle } = await c.req.json();
    console.log('[Calculate Route] Request:', { placesCount: places?.length, transportMode, travelStyle });

    if (!places || places.length === 0) {
      return c.json({ error: 'No places provided' }, 400);
    }

    const kakaoApiKey = Deno.env.get('KAKAO_REST_API_KEY');
    if (!kakaoApiKey) {
      console.error('[Calculate Route] Kakao API key not found');
      return c.json({ error: 'Kakao API key not configured' }, 500);
    }

    // 교통수단 매핑
    const modeMap: { [key: string]: string } = {
      '도보': 'FOOT',
      '자동차': 'CAR',
      '대중교통': 'TRANSIT'
    };
    const kakaoMode = modeMap[transportMode] || 'CAR';

    let totalDistance = 0;
    let totalDuration = 0;
    const routes: any[] = [];

    // 각 구간별 경로 계산
    for (let i = 0; i < places.length - 1; i++) {
      const origin = places[i];
      const destination = places[i + 1];

      try {
        let distance = 0;
        let duration = 0;

        if (kakaoMode === 'CAR') {
          // 자동차 경로
          const url = `https://apis-navi.kakaomobility.com/v1/directions`;
          const params = new URLSearchParams({
            origin: `${origin.lng},${origin.lat}`,
            destination: `${destination.lng},${destination.lat}`,
            waypoints: '',
            priority: 'RECOMMEND',
            car_fuel: 'GASOLINE',
            car_hipass: 'false',
            alternatives: 'false',
            road_details: 'false'
          });

          const response = await fetch(`${url}?${params}`, {
            headers: {
              'Authorization': `KakaoAK ${kakaoApiKey}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            console.log(`[Calculate Route] Kakao API response for segment ${i}:`, JSON.stringify(data));
            if (data.routes && data.routes.length > 0 && data.routes[0].summary) {
              distance = data.routes[0].summary.distance || 0;
              duration = data.routes[0].summary.duration || 0;
            }
            // Fallback if no valid data
            if (distance === 0) {
              distance = calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng) * 1000;
              duration = (distance / 40) * 60; // 40km/h average speed
            }
          } else {
            console.error(`[Calculate Route] Kakao API error for segment ${i}:`, await response.text());
            // Fallback to distance calculation
            distance = calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng) * 1000;
            duration = (distance / 40) * 60; // 40km/h average speed
          }
        } else if (kakaoMode === 'FOOT') {
          // 도보 경로
          const url = `https://apis-navi.kakaomobility.com/v1/waypoints/directions`;
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': `KakaoAK ${kakaoApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              origin: { x: origin.lng, y: origin.lat },
              destination: { x: destination.lng, y: destination.lat },
              waypoints: [],
              priority: 'DISTANCE',
              car_fuel: 'GASOLINE',
              car_hipass: false,
              alternatives: false,
              road_details: false
            })
          });

          if (response.ok) {
            const data = await response.json();
            console.log(`[Calculate Route] Walking API response for segment ${i}:`, JSON.stringify(data));
            if (data.routes && data.routes.length > 0 && data.routes[0].summary) {
              distance = data.routes[0].summary.distance || 0;
              duration = data.routes[0].summary.duration || 0;
            }
            // Fallback if no valid data
            if (distance === 0) {
              distance = calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng) * 1000;
              duration = (distance / 5) * 60; // 5km/h walking speed
            }
          } else {
            console.error(`[Calculate Route] Walking API error for segment ${i}:`, await response.text());
            // Fallback
            distance = calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng) * 1000;
            duration = (distance / 5) * 60; // 5km/h walking speed
          }
        } else {
          // 대중교통 - 직선 거리 기반 추정
          distance = calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng) * 1000;
          duration = (distance / 20) * 60; // 20km/h average speed
        }

        totalDistance += distance;
        totalDuration += duration;

        routes.push({
          from: origin.name,
          to: destination.name,
          distance,
          duration
        });

      } catch (error) {
        console.error(`[Calculate Route] Error calculating segment ${i}:`, error);
        // Fallback calculation
        const distance = calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng) * 1000;
        const duration = (distance / 30) * 60; // 30km/h average speed
        totalDistance += distance;
        totalDuration += duration;

        routes.push({
          from: origin.name,
          to: destination.name,
          distance,
          duration
        });
      }
    }

    // 예상 비용 계산
    let estimatedCost = 0;
    if (transportMode === '자동차') {
      estimatedCost = Math.round((totalDistance / 1000) * 150); // 150원/km
    } else if (transportMode === '대중교통') {
      estimatedCost = places.length * 1500; // 1500원 per transfer
    } else {
      estimatedCost = 0; // 도보는 무료
    }

    // 거리와 시간을 텍스트로 변환
    const totalDistanceText = totalDistance >= 1000 
      ? `${(totalDistance / 1000).toFixed(1)}km` 
      : `${Math.round(totalDistance)}m`;
    
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.round((totalDuration % 3600) / 60);
    const totalTimeText = hours > 0 
      ? `${hours}시간 ${minutes}분` 
      : `${minutes}분`;
    
    // 권장 일정 시간 계산 (이동 시간 + 각 장소당 1시간)
    const recommendedDuration = totalDuration + (places.length * 3600); // seconds

    console.log('[Calculate Route] Success:', {
      totalDistance,
      totalDistanceText,
      totalDuration,
      totalTimeText,
      recommendedDuration,
      estimatedCost,
      routesCount: routes.length
    });

    return c.json({
      totalDistance,
      totalDistanceText,
      totalDuration,
      totalTimeText,
      recommendedDuration,
      estimatedCost,
      routes,
      transportMode
    });

  } catch (error) {
    console.error('[Calculate Route] Error:', error);
    return c.json({ error: 'Failed to calculate route' }, 500);
  }
});

// 두 좌표 간 거리 계산 (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // 지구 반지름 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 경로 최적화 (TSP - Traveling Salesman Problem)
app.post("/make-server-a8dd3f70/optimize-route", async (c) => {
  try {
    const { places, startIndex } = await c.req.json();
    console.log('[Optimize Route] Request:', { placesCount: places?.length, startIndex });

    if (!places || places.length < 2) {
      return c.json({ success: false, error: 'Need at least 2 places' }, 400);
    }

    // 시작점 확정
    const start = places[startIndex || 0];
    const remaining = places.filter((_: any, idx: number) => idx !== (startIndex || 0));

    // Greedy nearest neighbor algorithm
    const optimized = [start];
    let current = start;

    while (remaining.length > 0) {
      let nearestIndex = 0;
      let minDistance = Infinity;

      // 현재 위치에서 가장 가까운 장소 찾기
      remaining.forEach((place: any, index: number) => {
        const distance = calculateDistance(
          current.lat,
          current.lng,
          place.lat,
          place.lng
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearestIndex = index;
        }
      });

      // 가장 가까운 장소를 경로에 추가
      const nearest = remaining.splice(nearestIndex, 1)[0];
      optimized.push(nearest);
      current = nearest;
    }

    console.log('[Optimize Route] Success:', {
      originalOrder: places.map((p: any) => p.name),
      optimizedOrder: optimized.map((p: any) => p.name)
    });

    return c.json({
      success: true,
      optimizedPlaces: optimized
    });

  } catch (error) {
    console.error('[Optimize Route] Error:', error);
    return c.json({ success: false, error: 'Failed to optimize route' }, 500);
  }
});

// ==================== GPT RECOMMENDATION ROUTES ====================

// GPT 기반 맞춤형 여행지 추천 (날씨 반영)
app.post("/make-server-a8dd3f70/recommend", async (c) => {
  try {
    const { preferences, location, weather } = await c.req.json();
    console.log('[GPT Recommend] Request:', { preferences, location, weather });
    
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      console.error('[GPT Recommend] OpenAI API key not found');
      return c.json({ success: false, error: 'OpenAI API key not configured' }, 500);
    }

    // 날씨에 따른 추천 전략 결정
    const isGoodWeather = weather?.temperature > 10 && 
      !weather?.description?.includes('비') && 
      !weather?.description?.includes('눈') &&
      !weather?.description?.includes('rain') &&
      !weather?.description?.includes('snow');
    
    const weatherContext = isGoodWeather 
      ? `현재 날씨가 좋습니다 (${weather?.temperature}°C, ${weather?.description}). 야외 활동이 적합합니다.`
      : `현재 날씨가 좋지 않습니다 (${weather?.temperature}°C, ${weather?.description}). 실내 활동을 우선 추천해주세요.`;

    // GPT 프롬프트 생성
    const prompt = `당신은 한국 여행 전문가입니다. 다음 정보를 바탕으로 ${location}에서의 맞춤형 여행지를 추천해주세요.

여행 선호도:
- 여행 스타일: ${preferences.travelStyle}
- 동행인: ${preferences.companion}
- 예산: ${preferences.budget}
- 선호 활동: ${preferences.activities.join(', ')}

날씨 정보:
${weatherContext}

요구사항:
1. 날씨에 적합한 장소를 추천해주세요 (날씨가 나쁘면 실내 위주, 좋으면 실외 위주)
2. 정확한 장소 이름과 간단한 설명을 제공해주세요
3. 각 장소는 실제 존재하는 유명한 관광지여야 합니다
4. **정확히 5개의 장소만 추천해주세요**
5. **첫 4개는 여행지(관광명소/맛집/카페/문화시설/자연)를 추천하고, 5번째는 반드시 숙소(호텔/게스트하우스/션/리조트 등)를 추천해주세요**
6. 5번째 숙소의 category는 반드시 "숙소"로 설정해주세요
7. JSON 형식으로만 응답해주세요

응답 형식:
{
  "summary": "추천 요약 (2-3문장)",
  "recommendations": [
    {
      "title": "장소 이름",
      "description": "장소 설명 (2-3문장)",
      "category": "카테고리 (1-4번째: 관광명소/맛집/카페/문화시설/자연 중 하나, 5번째: 숙소)",
      "address": "대략적인 주소나 위치",
      "isIndoor": true 또는 false,
      "tags": ["태그1", "태그2", "태그3"],
      "estimatedCost": "예상 비용 (무료/저렴/보통/비쌈)",
      "recommendedDuration": "권장 소요시간 (예: 1-2시간)"
    }
  ]
}

예시:
recommendations 배열은 정확히 5개의 항목을 포함해야 합니다.
- recommendations[0-3]: 여행지
- recommendations[4]: 숙소 (category: "숙소")`;

    // OpenAI API 호출
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: '당신은 한국 여행 전문가이며, 날씨와 사용자 선호도를 고려하여 최적의 여행지를 추천합니다. 항상 JSON 형식으로만 응답합니다.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text();
      console.error('[GPT Recommend] OpenAI API error:', error);
      return c.json({ success: false, error: 'Failed to get recommendations from GPT' }, 500);
    }

    const openaiData = await openaiResponse.json();
    const gptResponse = openaiData.choices[0].message.content;
    
    console.log('[GPT Recommend] Raw GPT response:', gptResponse);

    // JSON 파싱
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(gptResponse);
    } catch (parseError) {
      console.error('[GPT Recommend] JSON parse error:', parseError);
      const jsonMatch = gptResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        return c.json({ success: false, error: 'Failed to parse GPT response' }, 500);
      }
    }

    // Google Places API로 사진과 정확한 정보 보완
    const googleApiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    const recommendationsWithPhotos = [];

    if (googleApiKey && parsedResponse.recommendations) {
      for (const rec of parsedResponse.recommendations) {
        try {
          const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?` +
            `input=${encodeURIComponent(rec.title + ' ' + location)}&` +
            `inputtype=textquery&` +
            `fields=place_id,name,formatted_address,photos,rating,user_ratings_total,geometry&` +
            `language=ko&` +
            `key=${googleApiKey}`;
          
          const searchResponse = await fetch(searchUrl);
          const searchData = await searchResponse.json();

          let photoUrl = null;
          let lat = 37.5665;  // Default Seoul coordinates
          let lng = 126.9780;
          let rating = 4.0;
          let reviewCount = 0;
          
          if (searchData.candidates && searchData.candidates[0]) {
            const place = searchData.candidates[0];
            
            // Get photo
            if (place.photos && place.photos[0]) {
              const photoReference = place.photos[0].photo_reference;
              photoUrl = `https://maps.googleapis.com/maps/api/place/photo?` +
                `maxwidth=800&` +
                `photo_reference=${photoReference}&` +
                `key=${googleApiKey}`;
            }
            
            // Get coordinates
            if (place.geometry && place.geometry.location) {
              lat = place.geometry.location.lat;
              lng = place.geometry.location.lng;
            }
            
            // Get rating and review count
            rating = place.rating || 4.0;
            reviewCount = place.user_ratings_total || 0;
          }

          recommendationsWithPhotos.push({
            contentid: `gpt_${Date.now()}_${Math.random()}`,
            title: rec.title,
            name: rec.title,  // Add name field for frontend compatibility
            description: rec.description,
            gptCategory: rec.category,
            category: rec.category,
            googlePhoto: photoUrl,
            imageUrl: photoUrl,  // Add imageUrl field
            googlePlaceId: searchData.candidates?.[0]?.place_id,
            address: searchData.candidates?.[0]?.formatted_address || rec.address,
            addr1: searchData.candidates?.[0]?.formatted_address || rec.address,
            mapy: lat.toString(),
            mapx: lng.toString(),
            lat: lat,
            lng: lng,
            rating: rating,
            reviewCount: reviewCount,
            gptReason: rec.description,
            gptKeywords: rec.tags || [],
            isIndoor: rec.isIndoor,
            estimatedCost: rec.estimatedCost,
            recommendedDuration: rec.recommendedDuration,
          });
        } catch (error) {
          console.error(`[GPT Recommend] Error fetching photo for ${rec.title}:`, error);
          recommendationsWithPhotos.push({
            contentid: `gpt_${Date.now()}_${Math.random()}`,
            title: rec.title,
            name: rec.title,  // Add name field for frontend compatibility
            description: rec.description,
            gptCategory: rec.category,
            category: rec.category,
            googlePhoto: null,
            imageUrl: null,
            address: rec.address,
            addr1: rec.address,
            mapy: '37.5665',
            mapx: '126.9780',
            lat: 37.5665,
            lng: 126.9780,
            rating: 4.0,
            reviewCount: 0,
            gptReason: rec.description,
            gptKeywords: rec.tags || [],
            isIndoor: rec.isIndoor,
            estimatedCost: rec.estimatedCost,
            recommendedDuration: rec.recommendedDuration,
          });
        }
      }
    } else {
      if (parsedResponse.recommendations) {
        for (const rec of parsedResponse.recommendations) {
          recommendationsWithPhotos.push({
            contentid: `gpt_${Date.now()}_${Math.random()}`,
            title: rec.title,
            name: rec.title,  // Add name field for frontend compatibility
            description: rec.description,
            gptCategory: rec.category,
            category: rec.category,
            googlePhoto: null,
            imageUrl: null,
            address: rec.address,
            addr1: rec.address,
            mapy: '37.5665',
            mapx: '126.9780',
            lat: 37.5665,
            lng: 126.9780,
            rating: 4.0,
            reviewCount: 0,
            gptReason: rec.description,
            gptKeywords: rec.tags || [],
            isIndoor: rec.isIndoor,
            estimatedCost: rec.estimatedCost,
            recommendedDuration: rec.recommendedDuration,
          });
        }
      }
    }

    return c.json({
      success: true,
      gptSummary: parsedResponse.summary,
      recommendations: recommendationsWithPhotos,
      weatherBased: isGoodWeather ? 'outdoor' : 'indoor',
    });

  } catch (error) {
    console.error('[GPT Recommend] Error:', error);
    return c.json({ success: false, error: 'Failed to generate recommendations' }, 500);
  }
});

// Start server
Deno.serve(app.fetch);