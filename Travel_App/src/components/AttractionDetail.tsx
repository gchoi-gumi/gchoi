import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Phone, Globe, Loader2, ExternalLink, Info } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface AttractionDetailProps {
  contentId: string;
  onBack: () => void;
}

interface DetailInfo {
  title: string;
  addr1: string;
  tel?: string;
  homepage?: string;
  overview?: string;
  firstimage?: string;
  mapx?: string;
  mapy?: string;
  contentid: string;
  contenttypeid?: string;
  zipcode?: string;
}

interface ImageInfo {
  originimgurl: string;
  smallimageurl: string;
}

export function AttractionDetail({ contentId, onBack }: AttractionDetailProps) {
  const [detail, setDetail] = useState<DetailInfo | null>(null);
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchDetail();
    fetchImages();
  }, [contentId]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8dd3f70/attraction/detail/${contentId}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDetail(data.detail);
      }
    } catch (error) {
      console.error("Error fetching attraction detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8dd3f70/attraction/images/${contentId}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const openInKakaoMap = () => {
    if (detail?.mapx && detail?.mapy) {
      window.open(
        `https://map.kakao.com/link/map/${encodeURIComponent(detail.title)},${detail.mapy},${detail.mapx}`,
        "_blank"
      );
    }
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-gray-500 mb-4">관광지 정보를 불러올 수 없습니다</p>
            <Button onClick={onBack}>돌아가기</Button>
          </div>
        </div>
      </div>
    );
  }

  const displayImages = images.length > 0 ? images : detail.firstimage ? [{ originimgurl: detail.firstimage, smallimageurl: detail.firstimage }] : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-700 py-12 mb-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={onBack}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 hover:bg-white/20 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </motion.button>
            <div>
              <h1 className="text-white mb-1">{detail.title}</h1>
              <Badge className="bg-white text-teal-700">관광명소</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-12">
        {/* Image Gallery */}
        {displayImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="relative h-[500px] bg-gray-100 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={displayImages[selectedImageIndex].originimgurl}
                alt={detail.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1548013146-72479768bada?w=800";
                }}
              />
              {displayImages.length > 1 && (
                <div className="absolute bottom-6 right-6 bg-black/60 text-white px-4 py-2 rounded-full">
                  {selectedImageIndex + 1} / {displayImages.length}
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {displayImages.length > 1 && (
              <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
                {displayImages.map((img, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className={`flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden border-4 transition-all ${
                      selectedImageIndex === idx ? "border-teal-500 shadow-lg" : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img.smallimageurl}
                      alt={`${detail.title} ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1548013146-72479768bada?w=200";
                      }}
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Information Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-200">
              <h3 className="mb-6 text-gray-800 flex items-center gap-2">
                <Info className="w-5 h-5 text-teal-600" />
                기본 정보
              </h3>
              
              <div className="space-y-5">
                {detail.addr1 && (
                  <div className="flex gap-4">
                    <MapPin className="w-6 h-6 text-gray-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-2">주소</p>
                      <p className="text-gray-800 leading-relaxed">{detail.addr1}</p>
                      {detail.zipcode && (
                        <p className="text-sm text-gray-500 mt-2">우편번호: {detail.zipcode}</p>
                      )}
                    </div>
                  </div>
                )}

                {detail.tel && (
                  <div className="flex gap-4">
                    <Phone className="w-6 h-6 text-gray-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-2">전화번호</p>
                      <a href={`tel:${detail.tel}`} className="text-teal-600 hover:underline">
                        {detail.tel}
                      </a>
                    </div>
                  </div>
                )}

                {detail.homepage && (
                  <div className="flex gap-4">
                    <Globe className="w-6 h-6 text-gray-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-2">홈페이지</p>
                      <div
                        className="text-teal-600 hover:underline cursor-pointer line-clamp-2"
                        onClick={() => {
                          const urlMatch = detail.homepage?.match(/href="([^"]*)"/);
                          if (urlMatch) {
                            window.open(urlMatch[1], "_blank");
                          }
                        }}
                        dangerouslySetInnerHTML={{ __html: detail.homepage }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                {detail.mapx && detail.mapy && (
                  <Button
                    onClick={openInKakaoMap}
                    className="w-full py-7 rounded-xl bg-teal-600 hover:bg-teal-700"
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    카카오맵에서 보기
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Overview Card */}
          {detail.overview && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-200"
            >
              <h3 className="mb-6 text-gray-800">소개</h3>
              <div className="p-6 bg-gray-50 rounded-xl">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {stripHtml(detail.overview)}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Info Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-teal-50 rounded-2xl border-2 border-teal-100"
        >
          <p className="text-sm text-teal-800 leading-relaxed">
            💡 한국관광공사에서 제공하는 정보입니다. 
            방문 전 운영시간 및 휴무일을 확인하시기 바랍니다.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
