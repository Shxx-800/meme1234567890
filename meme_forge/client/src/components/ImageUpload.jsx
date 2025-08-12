import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Upload, Image as ImageIcon, Sparkles, Grid3X3 } from "lucide-react";
import AIMemeGenerator from './AIMemeGenerator';

// Import meme images from constants
import memeImages from '../constants/images.json';

export default function ImageUpload({ onImageSelect, onAIMemeGenerated, onViewMoreTemplates }) {
  const [activeTab, setActiveTab] = useState("templates");
  const [dragActive, setDragActive] = useState(false);

  // Show only first 12 templates
  const limitedTemplates = memeImages.slice(0, 12);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageSelect(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTemplateSelect = (template) => {
    onImageSelect(template.url);
  };

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("templates")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === "templates"
              ? "bg-white text-purple-600 shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <Grid3X3 className="h-4 w-4" />
          Templates
        </button>
        <button
          onClick={() => setActiveTab("upload")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === "upload"
              ? "bg-white text-purple-600 shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <Upload className="h-4 w-4" />
          Upload
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === "ai"
              ? "bg-white text-purple-600 shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          AI Generate
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "templates" && (
          <div className="space-y-4">
            {/* Templates Grid */}
            <div className="grid grid-cols-2 gap-3">
              {limitedTemplates.map((template, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer group hover:shadow-md transition-all duration-200"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <img
                    src={template.url}
                    alt={template.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      e.target.src = "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400";
                    }}
                  />
                </div>
              ))}
            </div>
            
            {/* View More Button */}
            <button
              onClick={onViewMoreTemplates}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Grid3X3 className="h-4 w-4" />
              View More Templates ({memeImages.length - 12} more)
            </button>
          </div>
        )}

        {activeTab === "upload" && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-purple-500 bg-purple-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload Your Image
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Drag and drop an image here, or click to select
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
            >
              <Upload className="h-4 w-4" />
              Choose File
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Supports: JPG, PNG, GIF (Max 10MB)
            </p>
          </div>
        )}

        {activeTab === "ai" && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
            <AIMemeGenerator onMemeGenerated={onAIMemeGenerated} />
          </div>
        )}
      </div>
    </div>
  );
}

ImageUpload.propTypes = {
  onImageSelect: PropTypes.func.isRequired,
  onAIMemeGenerated: PropTypes.func,
  onViewMoreTemplates: PropTypes.func.isRequired,
};