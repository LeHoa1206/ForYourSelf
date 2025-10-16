// API Configuration for VIP English Learning
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// API Endpoints
export const API_ENDPOINTS = {
  // Articles
  ARTICLES: `${API_BASE_URL}/simple_articles.php`,
  
  // News Admin
  NEWS_ARTICLES: `${API_BASE_URL}/news_admin_api.php/api/news/articles`,
  NEWS_SOURCES: `${API_BASE_URL}/news_admin_api.php/api/news/sources`,
  NEWS_LANGUAGES: `${API_BASE_URL}/news_admin_api.php/api/news/languages`,
  
  // Admin Panel
  LANGUAGES: `${API_BASE_URL}/complete_api.php/api/languages`,
  TOPICS: `${API_BASE_URL}/complete_api.php/api/topics`,
  VOCABULARY: `${API_BASE_URL}/complete_api.php/api/vocabulary`,
  
  // Translation
  TRANSLATE: `${API_BASE_URL}/google_translate_api.php`,
  TEXT_PROCESSOR: `${API_BASE_URL}/chinese_text_processor.php`,
  
  // Templates
  TOPICS_TEMPLATE: `${API_BASE_URL}/templates/topics_template_excel.csv`,
  VOCABULARY_TEMPLATE: `${API_BASE_URL}/templates/vocabulary_template_excel.csv`
}

// Environment check
export const isProduction = import.meta.env.PROD
export const isDevelopment = import.meta.env.DEV

// Debug logging
if (isDevelopment) {
  console.log('🔧 Development mode')
  console.log('📡 API Base URL:', API_BASE_URL)
  console.log('🌍 Environment:', import.meta.env.MODE)
}
