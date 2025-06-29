'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { Bookmark, User, Heart, MessageCircle, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

interface SavedArticle {
  id: string
  title: string
  content: string
  author: string
  created_at: string
  likes: number
  comments: number
  category: string
}

export default function SavedArticlesPage() {
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching saved articles
    const fetchSavedArticles = async () => {
      const mockSavedArticles: SavedArticle[] = [
        {
          id: '1',
          title: 'Advanced TypeScript Patterns',
          content: 'TypeScript offers powerful features that can help you write more maintainable and type-safe code...',
          author: 'Sarah Wilson',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          likes: 89,
          comments: 15,
          category: 'Programming'
        },
        {
          id: '2',
          title: 'Building Scalable React Applications',
          content: 'Learn how to structure your React applications for scalability and maintainability...',
          author: 'Mike Chen',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          likes: 156,
          comments: 32,
          category: 'Web Development'
        },
        {
          id: '3',
          title: 'The Future of AI in Web Development',
          content: 'Artificial Intelligence is revolutionizing how we build and maintain web applications...',
          author: 'Alex Johnson',
          created_at: new Date(Date.now() - 259200000).toISOString(),
          likes: 203,
          comments: 45,
          category: 'AI'
        }
      ]
      
      setSavedArticles(mockSavedArticles)
      setLoading(false)
    }

    fetchSavedArticles()
  }, [])

  const handleRemoveFromSaved = (articleId: string) => {
    setSavedArticles(prev => prev.filter(article => article.id !== articleId))
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Saved Articles</h1>
              <p className="text-gray-600 mt-2">
                Your collection of saved articles ({savedArticles.length})
              </p>
            </div>
            <div className="flex items-center">
              <Bookmark className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Articles List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : savedArticles.length > 0 ? (
          <div className="space-y-4">
            {savedArticles.map((article) => (
              <article
                key={article.id}
                className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {article.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {format(new Date(article.created_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {article.content}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="w-4 h-4 mr-1" />
                          {article.author}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {article.likes}
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {article.comments}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex flex-col space-y-2">
                      <button
                        onClick={() => handleRemoveFromSaved(article.id)}
                        className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200">
                      Read Full Article
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bookmark className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No saved articles</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start saving articles to read them later.
            </p>
            <div className="mt-6">
              <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Browse Articles
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
} 