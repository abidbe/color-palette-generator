import React from "react";
import { motion } from "framer-motion";
import { Shuffle, Download, Save, Trash2, RefreshCw } from "lucide-react";

interface ControlsProps {
  onGenerate: () => void;
  onExport: () => void;
  onSave: () => void;
  onClear: () => void;
  isGenerating: boolean;
  paletteCount: number;
  onCountChange: (count: number) => void;
  exportFormat: string;
  onFormatChange: (format: string) => void;
}

const Controls: React.FC<ControlsProps> = ({
  onGenerate,
  onExport,
  onSave,
  onClear,
  isGenerating,
  paletteCount,
  onCountChange,
  exportFormat,
  onFormatChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-6 mb-8">
      {/* Generate Button - Main CTA */}
      <div className="flex justify-center mb-6">
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGenerate}
          disabled={isGenerating}
          className="relative bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
          {isGenerating ? (
            <RefreshCw className="animate-spin" size={24} />
          ) : (
            <Shuffle size={24} />
          )}
          {isGenerating ? "Generating..." : "✨ Generate New Palette"}
        </motion.button>
      </div>

      {/* Controls Row */}
      <div className="flex flex-wrap gap-4 items-center justify-center">
        {/* Palette Count */}
        <div className="flex items-center gap-2 text-white bg-white/10 rounded-xl px-4 py-2 border border-white/20">
          <label className="text-sm font-medium">Colors:</label>
          <select
            value={paletteCount}
            onChange={(e) => onCountChange(Number(e.target.value))}
            className="bg-white/20 rounded-lg px-3 py-1 text-white backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300">
            {[1, 2, 3, 4, 5, 10].map((num) => (
              <option key={num} value={num} className="text-gray-800">
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* Export Format */}
        <div className="flex items-center gap-2 text-white bg-white/10 rounded-xl px-4 py-2 border border-white/20">
          <label className="text-sm font-medium">Format:</label>
          <select
            value={exportFormat}
            onChange={(e) => onFormatChange(e.target.value)}
            className="bg-white/20 rounded-lg px-3 py-1 text-white backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300">
            <option value="hex" className="text-gray-800">
              HEX
            </option>
            <option value="css" className="text-gray-800">
              CSS
            </option>
            <option value="scss" className="text-gray-800">
              SCSS
            </option>
            <option value="json" className="text-gray-800">
              JSON
            </option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSave}
            className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl transition-all shadow-md hover:shadow-lg border border-green-400/30 cursor-pointer"
            title="Save Palette">
            <Save size={20} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onExport}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl transition-all shadow-md hover:shadow-lg border border-blue-400/30 cursor-pointer"
            title="Export Palette">
            <Download size={20} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClear}
            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl transition-all shadow-md hover:shadow-lg border border-red-400/30 cursor-pointer"
            title="Clear All">
            <Trash2 size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Controls;
