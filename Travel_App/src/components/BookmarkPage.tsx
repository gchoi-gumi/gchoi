import { useState, useEffect } from "react";
import { ArrowLeft, Bookmark, Trash2, Loader2, MapPin, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { getBookmarks, deleteBookmark, type Bookmark as BookmarkType } from "../utils/api";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";

interface BookmarkPageProps {
  userId: string;
  accessToken: string;
  onBack: () => void;
}

export function BookmarkPage({ userId, accessToken, onBack }: BookmarkPageProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const data = await getBookmarks(accessToken);
      setBookmarks(data);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      toast.error("북마크를 불러오는데 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBookmark = async (id: string) => {
    if (!confirm("이 북마크를 삭제하시겠습니까?")) return;

    try {
      await deleteBookmark(accessToken, id);
      setBookmarks(bookmarks.filter((b) => b.id !== id));
      toast.success("북마크가 삭제되었습니다");
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      toast.error("북마크 삭제에 실패했습니다");
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const getCategoryImage = (category: string): string => {
    const images: Record<string, string> = {
      "카페": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
      "레스토랑": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
      "관광명소": "https://images.unsplash.com/photo-1513407030348-c983a97b98d8",
      "박물관": "https://images.unsplash.com/photo-1670915564082-9258f2c326c4",
      "공원": "https://images.unsplash.com/photo-1519331379826-f10be5486c6f",
      "쇼핑": "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    };
    return images[category] || images["관광명소"];
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-12 mb-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-4">
            <motion.button 
              onClick={onBack} 
              whileTap={{ scale: 0.9 }}
              className="p-2.5 hover:bg-white/20 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </motion.button>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                <Bookmark className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-white">북마크</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : bookmarks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bookmark className="w-12 h-12 text-purple-600" />
            </div>
            <p className="text-gray-600 text-lg">저장된 북마크가 없습니다</p>
          </motion.div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {bookmarks.map((bookmark, index) => (
                <motion.div
                  key={bookmark.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="overflow-hidden shadow-xl border-0 hover:shadow-2xl transition-all h-full flex flex-col rounded-2xl">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <ImageWithFallback
                        src={bookmark.imageUrl || getCategoryImage(bookmark.category)}
                        alt={bookmark.placeName}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteBookmark(bookmark.id)}
                        className="absolute top-3 right-3 bg-white/90 hover:bg-white text-red-500 hover:text-red-700 p-2 h-auto rounded-full shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="mb-3 text-gray-800 line-clamp-2 min-h-[3.5rem]">{bookmark.placeName}</h3>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-purple-600 flex-shrink-0" />
                        <span className="text-sm text-gray-600 line-clamp-1">{bookmark.address}</span>
                      </div>
                      
                      {/* Rating */}
                      {bookmark.rating > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium text-gray-800">{bookmark.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-xs text-gray-400">리뷰 {bookmark.reviewCount}개</span>
                        </div>
                      )}
                      
                      {/* Notes */}
                      {bookmark.notes && (
                        <div className="bg-purple-50 p-3 rounded-lg mb-3 flex-grow">
                          <p className="text-sm text-gray-700 line-clamp-2">{bookmark.notes}</p>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-2 mt-auto pt-3 border-t border-gray-100">
                        <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-md">
                          {bookmark.category}
                        </Badge>
                        <span className="text-xs text-gray-400 ml-auto">
                          {formatDate(bookmark.createdAt)}
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="p-6 bg-purple-50 rounded-2xl border-2 border-purple-100">
              <p className="text-sm text-purple-800 leading-relaxed">
                총 <strong>{bookmarks.length}개</strong>의 북마크
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
