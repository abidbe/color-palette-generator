import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Heart, Palette } from "lucide-react";
import { copyToClipboard } from "../utils/colorUtils";
import type { Color } from "../utils/colorUtils";

interface ColorCardProps {
  color: Color;
  index: number;
  onLike?: (color: Color) => void;
  isLiked?: boolean;
  onCopy?: (type: string) => void; // Add callback for copy notification
}

const ColorCard: React.FC<ColorCardProps> = ({
  color,
  index,
  onLike,
  isLiked,
  onCopy,
}) => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (value: string, type: string) => {
    const success = await copyToClipboard(value);
    if (success) {
      setCopied(type);
      onCopy?.(type); // Trigger parent notification
      setTimeout(() => setCopied(null), 1500);
    }
  };

  const textColor = color.brightness > 0.5 ? "text-gray-900" : "text-white";
  const overlayBg = color.brightness > 0.5 ? "bg-white/90" : "bg-black/60";

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.1,
        duration: 0.6,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3 },
      }}
      className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all  overflow-hidden border border-gray-100">
      {/* Color Display with Gradient Overlay */}
      <div
        className="h-40 w-full relative overflow-hidden cursor-pointer"
        style={{
          background: `linear-gradient(135deg, ${color.hex}ee, ${color.hex})`,
        }}
        onClick={() => handleCopy(color.hex, "HEX")}>
        {/* Subtle Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.3'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all  flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="opacity-0 group-hover:opacity-100 transition-all  flex gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onLike?.(color);
              }}
              className={`p-3 rounded-full backdrop-blur-sm shadow-lg transition-all  ${
                isLiked
                  ? "bg-red-500 text-white shadow-red-500/25"
                  : "bg-white/90 text-gray-700 hover:bg-white"
              }`}>
              <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(color.hex, "HEX");
              }}
              className="p-3 rounded-full bg-white/90 text-gray-700 hover:bg-white backdrop-blur-sm shadow-lg transition-all ">
              <Palette size={18} />
            </motion.button>
          </motion.div>
        </div>

        {/* Color Value Badge */}
        <div
          className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold ${overlayBg} ${textColor} backdrop-blur-sm shadow-sm`}>
          {color.hex.toUpperCase()}
        </div>

        {/* Brightness Indicator */}
        <div className="absolute top-4 right-4">
          <div
            className={`w-3 h-3 rounded-full border-2 ${
              textColor === "text-white"
                ? "border-white bg-white/30"
                : "border-gray-900 bg-gray-900/30"
            }`}
          />
        </div>
      </div>

      {/* Color Info Section */}
      <div className="p-5 bg-gradient-to-b from-white to-gray-50">
        {/* Color Name */}
        <div className="text-center mb-4">
          <h3 className="font-bold text-lg text-gray-800 mb-1">{color.name}</h3>
          <div className="w-12 h-1 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full mx-auto" />
        </div>

        {/* Color Values */}
        <div className="space-y-2">
          {[
            { label: "HEX", value: color.hex, color: "#6366f1" },
            { label: "RGB", value: color.rgb, color: "#ef4444" },
            { label: "HSL", value: color.hsl, color: "#10b981" },
          ].map(({ label, value, color: labelColor }) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCopy(value, label)}
              className="w-full text-left p-3 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all  shadow-sm hover:shadow-md group/btn">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div
                    className="text-xs font-semibold mb-1 flex items-center gap-2"
                    style={{ color: labelColor }}>
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: labelColor }}
                    />
                    {label}
                  </div>
                  <div className="text-sm font-mono text-gray-700 group-hover/btn:text-gray-900 transition-colors">
                    {value}
                  </div>
                </div>
                <div className="ml-3">
                  {copied === label ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-green-500">
                      <Check size={18} />
                    </motion.div>
                  ) : (
                    <Copy
                      size={16}
                      className="text-gray-400 group-hover/btn:text-gray-600 transition-colors"
                    />
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ColorCard;
