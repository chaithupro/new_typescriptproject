import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import Link from 'next/link'

type Props = {
  params: { id: string }
}

export default async function ArticlePage({ params }: Props) {
  const { id } = params
  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !article) {
    return notFound()
  }

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">&larr; Back to Dashboard</Link>
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{article.title}</h1>
      <div className="flex items-center text-gray-500 text-sm mb-6">
        <span className="mr-4">By {article.author}</span>
        <span>{format(new Date(article.published_at), 'MMM d, yyyy')}</span>
      </div>
      {article.image_url && (
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-80 object-cover rounded-lg mb-8 shadow"
        />
      )}
      <div className="prose dark:prose-invert max-w-none text-lg mb-8">
        <p>{article.content}</p>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs">{article.category}</span>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">{article.source}</span>
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">{article.sentiment}</span>
      </div>
    </main>
  )
} 