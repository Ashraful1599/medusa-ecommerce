import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Container } from "@/components/layout/Container"
import { Badge } from "@/components/ui/Badge"
import { blogPosts, getBlogPost, categoryVariant } from "@/lib/blog"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="py-12">
      <Container>
        {/* Back link */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#111111] transition-colors"
          >
            &larr; Back to Blog
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Post header */}
          <header className="mb-8 pb-8 border-b border-[#E5E5E5]">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant={categoryVariant(post.category)}>{post.category}</Badge>
              <span className="text-xs text-gray-400">{post.readTime}</span>
            </div>

            <h1 className="text-3xl font-bold text-[#111111] leading-tight tracking-tight mb-4">
              {post.title}
            </h1>

            <p className="text-base text-gray-600 leading-relaxed mb-6">{post.excerpt}</p>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-medium text-[#111111]">{post.author}</span>
              <span>&middot;</span>
              <time dateTime={post.date}>{formattedDate}</time>
            </div>
          </header>

          {/* Post content */}
          <div
            className="text-gray-700 text-base leading-relaxed space-y-4 [&_p]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Footer link */}
          <div className="mt-12 pt-8 border-t border-[#E5E5E5]">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#111111] hover:text-[#F0C040] transition-colors"
            >
              &larr; Back to Blog
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}
