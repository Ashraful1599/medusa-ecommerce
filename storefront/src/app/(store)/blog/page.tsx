import type { Metadata } from "next"
import Link from "next/link"
import { Container } from "@/components/layout/Container"
import { Badge } from "@/components/ui/Badge"
import { blogPosts, categoryVariant } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Blog",
  description: "Tips, guides, and inspiration from the Nexly team.",
}

export default function BlogPage() {
  return (
    <div className="py-12">
      <Container>
        {/* Page header */}
        <div className="mb-10 border-b border-[#E5E5E5] pb-8">
          <h1 className="text-3xl font-bold text-[#111111] tracking-tight">Blog</h1>
          <p className="mt-2 text-gray-500 text-sm">
            Tips, guides, and inspiration from the Nexly team.
          </p>
        </div>

        {/* Post grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col border border-[#E5E5E5] rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Card body */}
              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={categoryVariant(post.category)}>{post.category}</Badge>
                  <span className="text-xs text-gray-400">{post.readTime}</span>
                </div>

                <h2 className="text-lg font-semibold text-[#111111] leading-snug mb-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-[#F0C040] transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>

                <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-4">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#E5E5E5]">
                  <div className="text-xs text-gray-500">
                    <span className="font-medium text-[#111111]">{post.author}</span>
                    <span className="mx-1">&middot;</span>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs font-semibold text-[#111111] hover:text-[#F0C040] transition-colors"
                  >
                    Read More &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </div>
  )
}
