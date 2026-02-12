import { MapPin, Phone, Star, ExternalLink, Heart } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PlaceCardProps {
  title: string;
  address: string;
  phone?: string;
  rating?: number;
  category: string;
  imageUrl: string;
  isFeatured?: boolean;
  onClick?: () => void;
}

export function PlaceCard({
  title,
  address,
  phone,
  rating,
  category,
  imageUrl,
  isFeatured = false,
  onClick
}: PlaceCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
        {/* Image Section */}
        <div className="relative h-56 overflow-hidden">
          <ImageWithFallback
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm border-0 px-3 py-1.5">
              {category}
            </Badge>
          </div>

          {/* Featured Badge */}
          {isFeatured && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-purple-600 text-white border-0 px-3 py-1.5">
                ✨ 숨은 명소
              </Badge>
            </div>
          )}

          {/* Like Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all"
          >
            <Heart 
              className={`w-5 h-5 transition-colors ${
                isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </button>

          {/* Title on Image */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white text-xl font-semibold drop-shadow-lg line-clamp-2">
              {title}
            </h3>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-3">
          {/* Rating */}
          {rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-gray-500">
                ({Math.floor(Math.random() * 100 + 30)})
              </span>
            </div>
          )}

          {/* Address */}
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600 line-clamp-2">{address}</p>
          </div>

          {/* Phone */}
          {phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <p className="text-sm text-gray-600">{phone}</p>
            </div>
          )}

          {/* Action Button */}
          <Button
            variant="outline"
            className="w-full mt-2 group-hover:bg-blue-50 group-hover:border-blue-500 group-hover:text-blue-600 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              if (onClick) onClick();
            }}
          >
            <span>자세히 보기</span>
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
