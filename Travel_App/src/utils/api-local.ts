// Local storage based API implementation (no backend required)

export interface Itinerary {
  id: string;
  userId: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  routes: any[];
  spots: any[];
  travelStyle: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  placeId: string;
  placeName: string;
  placeAddress: string;
  category: string;
  rating: number;
  lat: number;
  lng: number;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  placeId: string;
  placeName: string;
  rating: number;
  content: string;
  photos: string[];
  createdAt: string;
}

// ==================== ITINERARY API ====================

export async function getItineraries(accessToken: string): Promise<Itinerary[]> {
  try {
    const stored = localStorage.getItem('itineraries');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Get itineraries error:', error);
    return [];
  }
}

export async function getItinerary(accessToken: string, id: string): Promise<Itinerary | null> {
  try {
    const itineraries = await getItineraries(accessToken);
    return itineraries.find(item => item.id === id) || null;
  } catch (error) {
    console.error('Get itinerary error:', error);
    return null;
  }
}

export async function createItinerary(
  accessToken: string,
  itinerary: Omit<Itinerary, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<Itinerary> {
  try {
    const itineraries = await getItineraries(accessToken);
    const newItinerary: Itinerary = {
      ...itinerary,
      id: Date.now().toString(),
      userId: 'local-user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    itineraries.push(newItinerary);
    localStorage.setItem('itineraries', JSON.stringify(itineraries));
    return newItinerary;
  } catch (error) {
    console.error('Create itinerary error:', error);
    throw error;
  }
}

export async function deleteItinerary(accessToken: string, id: string): Promise<void> {
  try {
    const itineraries = await getItineraries(accessToken);
    const filtered = itineraries.filter(item => item.id !== id);
    localStorage.setItem('itineraries', JSON.stringify(filtered));
  } catch (error) {
    console.error('Delete itinerary error:', error);
    throw error;
  }
}

// ==================== BOOKMARK API ====================

export async function getBookmarks(accessToken: string): Promise<Bookmark[]> {
  try {
    const stored = localStorage.getItem('bookmarks');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Get bookmarks error:', error);
    return [];
  }
}

export async function addBookmark(
  accessToken: string,
  bookmark: Omit<Bookmark, 'id' | 'userId' | 'createdAt'>
): Promise<Bookmark> {
  try {
    const bookmarks = await getBookmarks(accessToken);
    const newBookmark: Bookmark = {
      ...bookmark,
      id: Date.now().toString(),
      userId: 'local-user',
      createdAt: new Date().toISOString(),
    };
    bookmarks.push(newBookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    return newBookmark;
  } catch (error) {
    console.error('Add bookmark error:', error);
    throw error;
  }
}

export async function removeBookmark(accessToken: string, id: string): Promise<void> {
  try {
    const bookmarks = await getBookmarks(accessToken);
    const filtered = bookmarks.filter(item => item.id !== id);
    localStorage.setItem('bookmarks', JSON.stringify(filtered));
  } catch (error) {
    console.error('Remove bookmark error:', error);
    throw error;
  }
}

export async function isPlaceBookmarked(accessToken: string, placeId: string): Promise<boolean> {
  try {
    const bookmarks = await getBookmarks(accessToken);
    return bookmarks.some(item => item.placeId === placeId);
  } catch (error) {
    console.error('Check bookmark error:', error);
    return false;
  }
}

// ==================== REVIEW API ====================

export async function getReviews(accessToken: string): Promise<Review[]> {
  try {
    const stored = localStorage.getItem('reviews');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Get reviews error:', error);
    return [];
  }
}

export async function getPlaceReviews(placeId: string): Promise<Review[]> {
  try {
    const stored = localStorage.getItem('reviews');
    const allReviews = stored ? JSON.parse(stored) : [];
    return allReviews.filter((review: Review) => review.placeId === placeId);
  } catch (error) {
    console.error('Get place reviews error:', error);
    return [];
  }
}

export async function createReview(
  accessToken: string,
  review: Omit<Review, 'id' | 'userId' | 'userEmail' | 'userName' | 'createdAt'>
): Promise<Review> {
  try {
    const reviews = await getReviews(accessToken);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const newReview: Review = {
      ...review,
      id: Date.now().toString(),
      userId: 'local-user',
      userEmail: user.email || 'user@example.com',
      userName: user.name || '익명',
      createdAt: new Date().toISOString(),
    };
    reviews.push(newReview);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    return newReview;
  } catch (error) {
    console.error('Create review error:', error);
    throw error;
  }
}

export async function deleteReview(accessToken: string, id: string): Promise<void> {
  try {
    const reviews = await getReviews(accessToken);
    const filtered = reviews.filter(item => item.id !== id);
    localStorage.setItem('reviews', JSON.stringify(filtered));
  } catch (error) {
    console.error('Delete review error:', error);
    throw error;
  }
}
