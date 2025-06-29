'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { BookOpen, User, Heart, MessageCircle } from 'lucide-react'
import { format } from 'date-fns'

interface Article {
  id: string
  title: string
  content: string
  author: string
  created_at: string
  likes: number
  comments: number
  category: string
}

export default function Dashboard() {
  const { user, loading } = useAuthStore()
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [loadingArticles, setLoadingArticles] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    // Simulate fetching articles
    const fetchArticles = async () => {
      // In a real app, you'd fetch from your API
      const mockArticles: Article[] = [
        {
          id: '1',
          title: 'The Future of Web Development',
          content: 'Web development is evolving rapidly with new frameworks and technologies...',
          author: 'John Doe',
          created_at: new Date().toISOString(),
          likes: 42,
          comments: 12,
          category: 'Technology'
        },
        {
          id: '2',
          title: 'Getting Started with Next.js 14',
          content: 'Next.js 14 introduces new features that make building React applications easier...',
          author: 'Jane Smith',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          likes: 28,
          comments: 8,
          category: 'Programming'
        },
        {
          id: '3',
          title: 'The Rise of AI in Software Development',
          content: 'Artificial Intelligence is transforming how we write and maintain code...',
          author: 'Mike Johnson',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          likes: 65,
          comments: 23,
          category: 'AI'
        }
      ]
      
      setArticles(mockArticles)
      setLoadingArticles(false)
    }

    if (user) {
      fetchArticles()
    }
  }, [user])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.email}!</h1>
          <p className="text-gray-600 mt-2">Here are the latest articles from your feed.</p>
        </div>

        {/* Articles Grid */}
        {loadingArticles ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {article.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(article.created_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
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
                  
                  <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200">
                    Read More
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loadingArticles && articles.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No articles yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first article.
            </p>
            <div className="mt-6">
              <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Create Article
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
