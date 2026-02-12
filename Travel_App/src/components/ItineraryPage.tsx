import { useState, useEffect } from "react";
import { ArrowLeft, CalendarDays, MapPin, Trash2, Plus, Loader2, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useAuth } from "../utils/auth-context";
import { getItineraries, createItinerary, deleteItinerary, type Itinerary } from "../utils/api";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";

interface ItineraryPageProps {
  userId: string;
  accessToken: string;
  onBack: () => void;
}

export function ItineraryPage({ userId, accessToken, onBack }: ItineraryPageProps) {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  const { accessToken: authToken } = useAuth();
  
  // Use authToken from context, fall back to prop if not available
  const token = authToken || accessToken;

  useEffect(() => {
    if (token) {
      fetchItineraries();
    }
  }, [token]);

  const fetchItineraries = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const data = await getItineraries(token);
      setItineraries(data);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
      toast.error("여행 일정을 불러오는데 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItinerary = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("로그인이 필요합니다");
      return;
    }

    try {
      setSubmitting(true);
      await createItinerary(token, {
        title,
        description,
        location,
        startDate,
        endDate,
        routes: [],
        spots: [],
        travelStyle: "",
      });

      // Reset form
      setTitle("");
      setLocation("");
      setStartDate("");
      setEndDate("");
      setDescription("");
      setDialogOpen(false);
      
      // Refresh list
      await fetchItineraries();
      toast.success("여행 일정이 저장되었습니다");
    } catch (error) {
      console.error("Error saving itinerary:", error);
      toast.error("여행 일정 저장에 실패했습니다");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItinerary = async (id: string) => {
    if (!confirm("이 여행 일정을 삭제하시겠습니까?")) return;

    if (!token) {
      toast.error("로그인이 필요합니다");
      return;
    }

    try {
      await deleteItinerary(token, id);
      await fetchItineraries();
      toast.success("여행 일정이 삭제되었습니다");
    } catch (error) {
      console.error("Error deleting itinerary:", error);
      toast.error("여행 일정 삭제에 실패했습니다");
    }
  };

  const getDaysBetween = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-12 mb-8">
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
                  <CalendarDays className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-white">내 여행 일정</h1>
              </div>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  새 일정
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md rounded-2xl">
                <DialogHeader>
                  <DialogTitle>새 여행 일정 추가</DialogTitle>
                  <DialogDescription>
                    여행 일정을 저장하고 관리하세요
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSaveItinerary} className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="mb-2 block">여행 제목</Label>
                    <Input
                      id="title"
                      placeholder="예: 제주도 힐링 여행"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="rounded-xl border-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" className="mb-2 block">여행지</Label>
                    <Input
                      id="location"
                      placeholder="예: 제주"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      className="rounded-xl border-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="startDate" className="mb-2 block">시작일</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        className="rounded-xl border-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate" className="mb-2 block">종료일</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        className="rounded-xl border-2"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description" className="mb-2 block">메모</Label>
                    <Textarea
                      id="description"
                      placeholder="여행 계획이나 메모를 작성하세요"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="rounded-xl border-2"
                      rows={4}
                    />
                  </div>
                  <Button type="submit" className="w-full py-6 rounded-xl" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        저장 중...
                      </>
                    ) : (
                      "저장하기"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : itineraries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarDays className="w-12 h-12 text-blue-600" />
            </div>
            <p className="text-gray-600 text-lg">저장된 여행 일정이 없습니다</p>
          </motion.div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {itineraries.map((itinerary, index) => (
                <motion.div
                  key={itinerary.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="p-6 shadow-lg border-2 border-gray-200 hover:border-blue-300 transition-all h-full flex flex-col rounded-2xl">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg text-gray-800 pr-4 line-clamp-2 min-h-[3.5rem]">{itinerary.title || '제목 없음'}</h3>
                      <button
                        onClick={() => handleDeleteItinerary(itinerary.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="line-clamp-1">{itinerary.location}</span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-4 flex-grow">
                      <div className="flex items-center gap-2 text-sm bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                        <CalendarDays className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-700 text-xs whitespace-nowrap">
                          {new Date(itinerary.startDate).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })} ~ {new Date(itinerary.endDate).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <span className="text-xs bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-2 rounded-lg font-medium shadow-md">
                        {getDaysBetween(itinerary.startDate, itinerary.endDate)}일
                      </span>
                    </div>
                    
                    {itinerary.description && (
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100 mt-auto">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-blue-800">메모</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                          {itinerary.description}
                        </p>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="p-6 bg-blue-50 rounded-2xl border-2 border-blue-100">
              <p className="text-sm text-blue-800 leading-relaxed">
                총 <strong>{itineraries.length}개</strong>의 여행 일정
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
