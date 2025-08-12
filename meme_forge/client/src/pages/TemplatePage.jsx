import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { ArrowLeft, Search, ChevronLeft, ChevronRight, X, Check } from "lucide-react";

// Import all meme images from the constants
import memeImages from '../constants/images.json';

export default function TemplatePage({ onBackToHome, onTemplateSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMeme, setSelectedMeme] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const itemsPerPage = 40;

  // Build templates array from imported JSON
  const templates = useMemo(() => {
    return memeImages.map((meme, index) => ({
      id: index + 1,
      src: meme.url,
      name: meme.name,
      category: "Memes" // You can add categories later if needed
    }));
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(templates.map((t) => t.category));
    return ["All", ...cats];
  }, [templates]);

  // Filtered templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
      const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [templates, selectedCategory, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTemplates = filteredTemplates.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMemeClick = (template) => {
    setSelectedMeme(template);
    setShowModal(true);
  };

  const handleSelectMeme = () => {
    if (selectedMeme) {
      onTemplateSelect(selectedMeme.src);
      setShowModal(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMeme(null);
  };

  // Reset page when search or category changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={onBackToHome} 
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors font-medium"
          >
            <ArrowLeft size={20} /> Back to Generator
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Meme Templates</h1>
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search meme templates..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === cat 
                      ? "bg-purple-600 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-4 text-gray-600">
          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredTemplates.length)} of {filteredTemplates.length} templates
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
          {currentTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => handleMemeClick(template)}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={template.src}
                  alt={template.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400";
                  }}
                />
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-600 truncate">{template.name}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mb-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            
            {/* Page Numbers */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (currentPage <= 4) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = currentPage - 3 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === pageNum
                        ? "bg-purple-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedMeme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">{selectedMeme.name}</h3>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4">
              <div className="flex justify-center mb-4">
                <img
                  src={selectedMeme.src}
                  alt={selectedMeme.name}
                  className="max-w-full max-h-96 object-contain rounded-lg shadow-md"
                  onError={(e) => {
                    e.target.src = "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400";
                  }}
                />
              </div>
              
              {/* Modal Actions */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSelectMeme}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Check size={18} />
                  Select This Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

TemplatePage.propTypes = {
  onBackToHome: PropTypes.func.isRequired,
  onTemplateSelect: PropTypes.func.isRequired,
};