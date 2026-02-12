import { useState, useEffect } from "react";
import { ArrowLeft, Star, Plus, Trash2, Edit2, Loader2, FileText, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { getReviews, createReview, deleteReview, type Review } from "../utils/api";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";

interface ReviewsPageProps {
  userId: string;
  accessToken: string;
  onBack: () => void;
}

export function ReviewsPage({ userId, accessToken, onBack }: ReviewsPageProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [placeName, setPlaceName] = useState("");
  const [placeId, setPlaceId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [visitDate, setVisitDate] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getReviews(accessToken);
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("후기를 불러오는데 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      
      await createReview(accessToken, {
        placeId: placeId || `place_${Date.now()}`,
        placeName,
        rating,
        title,
        content,
        images: [],
        visitDate: visitDate || new Date().toISOString().split('T')[0],
      });

      // Reset form
      setPlaceName("");
      setPlaceId("");
      setTitle("");
      setContent("");
      setRating(5);
      setVisitDate("");
      setDialogOpen(false);
      
      // Refresh list
      await fetchReviews();
      toast.success("후기가 작성되었습니다!");
    } catch (error) {
      console.error("Error creating review:", error);
      toast.error("후기 작성에 실패했습니다");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("이 후기를 삭제하시겠습니까?")) return;

    try {
      await deleteReview(accessToken, id);
      await fetchReviews();
      toast.success("후기가 삭제되었습니다");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("후기 삭제에 실패했습니다");
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 py-12 mb-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
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
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-white">내 여행 후기</h1>
              </div>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-orange-600 hover:bg-orange-50 shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  후기 작성
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>여행 후기 작성</DialogTitle>
                  <DialogDescription>
                    방문한 장소에 대한 후기를 남겨보세요
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="placeName">장소명 *</Label>
                    <Input
                      id="placeName"
                      value={placeName}
                      onChange={(e) => setPlaceName(e.target.value)}
                      placeholder="예: 한라산 백록담"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">후기 제목 *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="예: 최고의 힐링 장소!"
                      required
                    />
                  </div>
                  <div>
                    <Label>평점 *</Label>
                    <div className="flex gap-2 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="visitDate">방문일</Label>
                    <Input
                      id="visitDate"
                      type="date"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">후기 내용 *</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="방문 경험을 자세히 적어주세요"
                      rows={5}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setDialogOpen(false)}
                    >
                      취소
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-orange-600 hover:bg-orange-700"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          작성 중...
                        </>
                      ) : (
                        "작성"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        ) : reviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-orange-600" />
            </div>
            <p className="text-gray-600 mb-2 text-lg">작성한 후기가 없습니다</p>
            <p className="text-gray-400">여행 후기를 작성해보세요!</p>
          </motion.div>
        ) : (
          <>
            <div className="space-y-6 mb-8">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 shadow-lg border-2 border-gray-200 hover:border-orange-300 transition-all rounded-2xl">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-gray-800">{review.title}</h3>
                          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                            {renderStars(review.rating)}
                            <span className="text-sm font-medium text-gray-800 ml-1">{review.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4 text-orange-600" />
                          <p className="text-sm text-gray-600">{review.placeName}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl mb-4 border border-orange-100">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {review.content}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
                      <Badge variant="secondary" className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 shadow-md">
                        방문일: {formatDate(review.visitDate)}
                      </Badge>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-400">작성: {formatDate(review.createdAt)}</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="p-6 bg-orange-50 rounded-2xl border-2 border-orange-100">
              <p className="text-sm text-orange-800 leading-relaxed">
                총 <strong>{reviews.length}개</strong>의 후기
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
