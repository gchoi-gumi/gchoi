import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-a8dd3f70`;

// ==================== ITINERARY API ====================

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

export async function getItineraries(accessToken: string): Promise<Itinerary[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/itineraries`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (data.success) {
      return data.itineraries;
    }
    throw new Error(data.error || 'Failed to get itineraries');
  } catch (error) {
    console.error('Get itineraries error:', error);
    throw error;
  }
}

export async function getItinerary(accessToken: string, id: string): Promise<Itinerary> {
  try {
    const response = await fetch(`${API_BASE_URL}/itineraries/${id}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (data.success) {
      return data.itinerary;
    }
    throw new Error(data.error || 'Failed to get itinerary');
  } catch (error) {
    console.error('Get itinerary error:', error);
    throw error;
  }
}

export async function createItinerary(
  accessToken: string,
  itinerary: Omit<Itinerary, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<Itinerary> {
  try {
    const response = await fetch(`${API_BASE_URL}/itineraries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(itinerary),
    });

    const data = await response.json();
    if (data.success) {
      return data.itinerary;
    }
    throw new Error(data.error || 'Failed to create itinerary');
  } catch (error) {
    console.error('Create itinerary error:', error);
    throw error;
  }
}

export async function deleteItinerary(accessToken: string, id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/itineraries/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to delete itinerary');
    }
  } catch (error) {
    console.error('Delete itinerary error:', error);
    throw error;
  }
}

// ==================== BOOKMARK API ====================

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

export async function getBookmarks(accessToken: string): Promise<Bookmark[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/bookmarks`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (data.success) {
      return data.bookmarks;
    }
    throw new Error(data.error || 'Failed to get bookmarks');
  } catch (error) {
    console.error('Get bookmarks error:', error);
    throw error;
  }
}

export async function addBookmark(
  accessToken: string,
  bookmark: Omit<Bookmark, 'id' | 'userId' | 'createdAt'>
): Promise<Bookmark> {
  try {
    const response = await fetch(`${API_BASE_URL}/bookmarks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(bookmark),
    });

    const data = await response.json();
    if (data.success) {
      return data.bookmark;
    }
    throw new Error(data.error || 'Failed to add bookmark');
  } catch (error) {
    console.error('Add bookmark error:', error);
    throw error;
  }
}

export async function removeBookmark(accessToken: string, id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/bookmarks/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to remove bookmark');
    }
  } catch (error) {
    console.error('Remove bookmark error:', error);
    throw error;
  }
}

// Alias for backward compatibility
export const deleteBookmark = removeBookmark;

export async function isPlaceBookmarked(accessToken: string, placeId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/bookmarks/check/${placeId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (data.success) {
      return data.isBookmarked;
    }
    return false;
  } catch (error) {
    console.error('Check bookmark error:', error);
    return false;
  }
}

// ==================== REVIEW API ====================

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

export async function getReviews(accessToken: string): Promise<Review[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (data.success) {
      return data.reviews;
    }
    throw new Error(data.error || 'Failed to get reviews');
  } catch (error) {
    console.error('Get reviews error:', error);
    throw error;
  }
}

export async function getPlaceReviews(placeId: string): Promise<Review[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/place/${placeId}`);

    const data = await response.json();
    if (data.success) {
      return data.reviews;
    }
    throw new Error(data.error || 'Failed to get place reviews');
  } catch (error) {
    console.error('Get place reviews error:', error);
    throw error;
  }
}

export async function createReview(
  accessToken: string,
  review: Omit<Review, 'id' | 'userId' | 'userEmail' | 'userName' | 'createdAt'>
): Promise<Review> {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(review),
    });

    const data = await response.json();
    if (data.success) {
      return data.review;
    }
    throw new Error(data.error || 'Failed to create review');
  } catch (error) {
    console.error('Create review error:', error);
    throw error;
  }
}

export async function deleteReview(accessToken: string, id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to delete review');
    }
  } catch (error) {
    console.error('Delete review error:', error);
    throw error;
  }
}
