'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { useAuthStore } from '@/store/authStore'
import { createArticle } from '@/lib/articles'
import { Save, X } from 'lucide-react'

export default function CreateArticlePage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [source, setSource] = useState('')
  const [sentiment, setSentiment] = useState<'positive' | 'negative' | 'neutral'>('neutral')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const categories = [
    'Technology',
    'Finance',
    'Environment',
    'Healthcare',
    'Science',
    'Education',
    'Politics',
    'Sports',
    'Entertainment',
    'Business',
  ]

  const sources = [
    'TechDaily',
    'Finance Weekly',
    'Green News',
    'Health Today',
    'Space News',
    'EduTech',
    'Global Times',
    'Sports Central',
  ]

  const sentiments = [
    { value: 'positive', label: 'Positive' },
    { value: 'negative', label: 'Negative' },
    { value: 'neutral', label: 'Neutral' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!title.trim() || !content.trim() || !category || !source || !sentiment) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (!user) {
      setError('You must be logged in to create an article')
      setLoading(false)
      return
    }

    try {
      // Create summary from content (first 150 characters)
      const summary = content.length > 150 
        ? content.substring(0, 150) + '...'
        : content

      // Save article to Supabase
      await createArticle({
        title: title.trim(),
        summary: summary,
        content: content.trim(),
        author: user.email || 'Anonymous',
        source: source,
        category: category,
        image_url: imageUrl.trim() || undefined,
        sentiment: sentiment,
        sentiment_explanation: 'User-generated content'
      })
      router.push('/')
    } catch (err) {
      console.error('Error creating article:', err)
      setError('Failed to create article. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Create New Article</h1>
              <button
                onClick={() => router.back()}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter article title..."
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="source" className="block text-sm font-medium text-gray-700">
                Source
              </label>
              <select
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                <option value="">Select a source</option>
                {sources.map((src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sentiment
              </label>
              <div className="flex gap-6">
                {sentiments.map((s) => (
                  <label key={s.value} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="sentiment"
                      value={s.value}
                      checked={sentiment === s.value}
                      onChange={() => setSentiment(s.value as 'positive' | 'negative' | 'neutral')}
                      className="form-radio text-blue-600"
                      required
                    />
                    <span className="ml-2 text-gray-700">{s.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                Image URL (Optional)
              </label>
              <input
                type="url"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="https://example.com/image.jpg"
              />
              <p className="mt-1 text-sm text-gray-500">
                Add an image URL to make your article more engaging. You can use services like Unsplash, Pexels, or any public image URL.
              </p>
              
              {/* Image Preview */}
              {imageUrl && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                  <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const errorDiv = target.nextElementSibling as HTMLDivElement;
                        if (errorDiv) {
                          errorDiv.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="hidden absolute inset-0 items-center justify-center bg-gray-100 text-gray-500">
                      <p className="text-sm">Invalid image URL</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Quick Image Suggestions */}
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Quick Image Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop'
                  ].map((url, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setImageUrl(url)}
                      className="w-16 h-12 rounded border-2 border-gray-200 hover:border-blue-500 overflow-hidden"
                    >
                      <img
                        src={url}
                        alt={`Option ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                id="content"
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Write your article content here..."
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Article
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
} 