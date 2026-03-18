"use client"

export function NewsletterForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Your email"
        className="flex-1 px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#F0C040]"
      />
      <button type="submit" className="px-3 py-2 bg-[#F0C040] text-[#111111] text-sm font-semibold rounded-sm hover:bg-yellow-400 transition-colors">
        Go
      </button>
    </form>
  )
}
