import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Heart, X } from "lucide-react";
import Header from "./components/Header";
import Controls from "./components/Controls";
import ColorCard from "./components/ColorCard";
import { generateHarmoniousPalette, exportPalette } from "./utils/colorUtils";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { Color } from "./utils/colorUtils";
import "./App.css";

function App() {
  const [palette, setPalette] = useState<Color[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [paletteCount, setPaletteCount] = useState(5);
  const [exportFormat, setExportFormat] = useState("hex");
  const [savedPalettes, setSavedPalettes] = useLocalStorage<Color[][]>(
    "saved-palettes",
    []
  );
  const [likedColors, setLikedColors] = useLocalStorage<Color[]>(
    "liked-colors",
    []
  );
  const [showLiked, setShowLiked] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [copyNotification, setCopyNotification] = useState<string | null>(null);
  const hasInitialized = useRef(false);

  // Generate initial palette
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      generatePalette();
    }
  }, []); // Empty dependency - truly runs only once

  const generatePalette = async () => {
    setIsGenerating(true);
    // Simulate loading for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newPalette = generateHarmoniousPalette(paletteCount);
    setPalette(newPalette);
    setIsGenerating(false);
  };

  const handleSavePalette = () => {
    if (palette.length > 0) {
      setSavedPalettes((prev) => [palette, ...prev.slice(0, 9)]); // Keep last 10
      showNotification("Palette saved!");
    }
  };

  const handleExportPalette = () => {
    if (palette.length > 0) {
      const exported = exportPalette(palette, exportFormat);
      navigator.clipboard.writeText(exported);
      showNotification(`Palette exported as ${exportFormat.toUpperCase()}!`);
    }
  };

  const handleClearAll = () => {
    setPalette([]);
    showNotification("Palette cleared!");
  };

  const handleLikeColor = (color: Color) => {
    const isAlreadyLiked = likedColors.some((c) => c.hex === color.hex);

    if (isAlreadyLiked) {
      setLikedColors((prev) => prev.filter((c) => c.hex !== color.hex));
      showNotification("Color removed from favorites");
    } else {
      setLikedColors((prev) => [color, ...prev]);
      showNotification("Color added to favorites");
    }
  };

  const isColorLiked = (color: Color) => {
    return likedColors.some((c) => c.hex === color.hex);
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCopyNotification = (type: string) => {
    setCopyNotification(`${type} copied!`);
    setTimeout(() => setCopyNotification(null), 3000);
  };

  const displayColors = showLiked ? likedColors : palette;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            initial={{
              x:
                Math.random() *
                (typeof window !== "undefined" ? window.innerWidth : 1000),
              y:
                Math.random() *
                (typeof window !== "undefined" ? window.innerHeight : 1000),
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <Header />

        <Controls
          onGenerate={generatePalette}
          onExport={handleExportPalette}
          onSave={handleSavePalette}
          onClear={handleClearAll}
          isGenerating={isGenerating}
          paletteCount={paletteCount}
          onCountChange={setPaletteCount}
          exportFormat={exportFormat}
          onFormatChange={setExportFormat}
        />

        {/* Toggle Between Current and Liked */}
        <div className="flex justify-center mb-8">
          <div className="glass-effect rounded-xl p-1 flex">
            <button
              onClick={() => setShowLiked(false)}
              className={`px-6 py-2 rounded-lg transition-all ${
                !showLiked
                  ? "bg-white text-gray-800"
                  : "text-white hover:bg-white/20"
              }`}>
              Current Palette
            </button>
            <button
              onClick={() => setShowLiked(true)}
              className={`px-6 py-2 rounded-lg transition-all flex items-center gap-2 ${
                showLiked
                  ? "bg-white text-gray-800"
                  : "text-white hover:bg-white/20"
              }`}>
              <Heart size={16} />
              Favorites ({likedColors.length})
            </button>
          </div>
        </div>

        {/* Color Palette Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-8">
          <AnimatePresence>
            {displayColors.map((color, index) => (
              <ColorCard
                key={`${color.hex}-${index}`}
                color={color}
                index={index}
                onLike={handleLikeColor}
                isLiked={isColorLiked(color)}
                onCopy={handleCopyNotification}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {displayColors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12">
            <div className="glass-effect rounded-2xl p-8 max-w-md mx-auto">
              <p className="text-white text-lg">
                {showLiked
                  ? "No favorite colors yet! Like some colors to see them here."
                  : "Click 'Generate Palette' to create beautiful colors!"}
              </p>
            </div>
          </motion.div>
        )}

        {/* Saved Palettes */}
        {savedPalettes.length > 0 && !showLiked && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-xl font-semibold">
                Saved Palettes
              </h3>
              <button
                onClick={() => {
                  setSavedPalettes([]);
                  showNotification("All saved palettes cleared!");
                }}
                className="text-white/70 hover:text-red-400 text-sm px-3 py-1 rounded-lg hover:bg-white/10 transition-all duration-200">
                Clear All
              </button>
            </div>
            <div className="space-y-4">
              {savedPalettes.slice(0, 3).map((savedPalette, paletteIndex) => (
                <motion.div
                  key={paletteIndex}
                  className="flex gap-2 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors group">
                  <div
                    className="flex gap-2 flex-1 cursor-pointer"
                    onClick={() => setPalette(savedPalette)}>
                    {savedPalette.map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className="w-8 h-8 rounded-lg border-2 border-white/30"
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                    <span className="text-white/70 text-sm ml-auto self-center">
                      Click to load
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSavedPalettes((prev) =>
                        prev.filter((_, index) => index !== paletteIndex)
                      );
                      showNotification("Palette deleted!");
                    }}
                    className="opacity-0 group-hover:opacity-100 text-white/50 hover:text-red-400 p-1 rounded transition-all duration-200">
                    <X size={16} />
                  </button>
                </motion.div>
              ))}
              {savedPalettes.length > 3 && (
                <div className="text-center">
                  <span className="text-white/50 text-sm">
                    +{savedPalettes.length - 3} more palettes saved
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Copy Notification - Bottom Center */}
      <AnimatePresence>
        {copyNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-8 left-1/2 transform glass-effect rounded-xl p-4 text-black font-bold flex items-center gap-3 z-50">
            <Check size={16} />
            <span>{copyNotification}</span>
            <button
              onClick={() => setCopyNotification(null)}
              className="hover:bg-white/20 rounded-lg p-1 transition-colors">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* General Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-20 left-1/2 transform glass-effect rounded-xl p-4 text-black font-bold flex items-center gap-3 z-50">
            <span>{notification}</span>
            <button
              onClick={() => setNotification(null)}
              className="hover:bg-white/20 rounded-lg p-1 transition-colors">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default App;
