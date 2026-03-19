export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  category: string
  readTime: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: "summer-fashion-trends",
    title: "Summer Fashion Trends 2025",
    excerpt:
      "Discover the hottest styles and must-have pieces for the summer season. From bold prints to breezy silhouettes, we break down what's trending this year.",
    content: `<p>Summer 2025 is all about embracing vibrant colors and lightweight fabrics that keep you cool without sacrificing style. The season's defining palette includes warm terracotta, ocean-inspired blues, and cheerful citrus tones — each lending themselves beautifully to both casual daywear and elevated evening looks.</p>
<p>Oversized linen blazers have emerged as the breakout piece of the year, easily dressed up over a slip dress or layered casually with tailored shorts. Pair them with strappy sandals and minimal gold jewelry for an effortless sophisticated look that transitions from beach to brunch seamlessly.</p>
<p>Printed co-ords remain a dominant trend this summer. Matching sets featuring floral, abstract, or geometric patterns offer a put-together appearance with minimal effort. When shopping for co-ords, look for breathable materials like cotton or linen blends that hold their shape while allowing airflow throughout the day.</p>
<p>Footwear is leaning into comfort-forward styles with platform sandals and chunky mules taking center stage. Neutral tones like cream, tan, and cognac work as versatile anchors for any summer outfit, while metallic finishes add instant glamour to even the simplest ensemble. Invest in a quality pair that carries you comfortably from morning errands to evening events.</p>`,
    author: "Nexly Team",
    date: "2025-06-01",
    category: "Fashion",
    readTime: "4 min read",
  },
  {
    slug: "home-office-essentials",
    title: "10 Home Office Essentials",
    excerpt:
      "Building a productive home office doesn't require a complete renovation. These ten essentials will transform any spare corner into a workspace you genuinely enjoy spending time in.",
    content: `<p>The shift toward remote and hybrid work has made the home office a permanent fixture in modern living. Getting the setup right from the start saves both time and money, while significantly improving your daily focus and comfort. The foundation of any great home office is an ergonomic chair — your back will thank you after the first long session, and a good chair is the single highest-impact investment you can make for your work-from-home health.</p>
<p>Lighting is the second most critical factor, yet it is often overlooked. Natural light reduces eye strain and supports your circadian rhythm, so positioning your desk near a window is ideal whenever possible. Supplement with a high-quality LED desk lamp that offers adjustable color temperature — warm light for creative work, cool white light for detailed analytical tasks. Avoid placing your monitor directly in front of a bright window to prevent glare-induced headaches.</p>
<p>Cable management may not be glamorous, but it dramatically reduces visual clutter and the mental load that comes with a messy workspace. A simple cable organizer, a few velcro ties, and a monitor stand with a built-in cable channel can transform a chaotic desk into a clean, calm environment. Add a wireless keyboard and mouse to eliminate even more cord clutter and give yourself more freedom of movement.</p>
<p>Finally, personalize your space in a way that motivates and inspires you. A small potted plant, a favorite piece of art, or a dedicated coffee station nearby can turn a sterile workspace into an environment that genuinely energizes you each morning. The goal is a space that feels intentional — where every object earns its place by serving your productivity or your wellbeing.</p>`,
    author: "Nexly Team",
    date: "2025-05-15",
    category: "Home & Living",
    readTime: "6 min read",
  },
  {
    slug: "fitness-gear-guide",
    title: "Complete Fitness Gear Guide",
    excerpt:
      "Whether you are setting up a home gym or upgrading your existing equipment, this guide covers the essential gear you need to train effectively at every fitness level.",
    content: `<p>Starting a home gym can feel overwhelming, but a handful of well-chosen pieces of equipment covers the vast majority of effective training programs. Before purchasing anything, consider your primary goals — strength training, cardio, flexibility, or a combination — and let those goals guide your buying decisions. A set of adjustable dumbbells is the single most versatile starting point, replacing an entire rack of fixed-weight dumbbells while taking up a fraction of the space.</p>
<p>Resistance bands are among the most underrated fitness tools available. They are inexpensive, portable, and suitable for every fitness level — from rehabilitation exercises to heavy compound movements. A complete set typically includes bands of varying resistance levels, allowing you to progressively overload muscles just as you would with traditional weights. Bands are especially effective for warm-ups, mobility work, and supplementing compound lifts with targeted isolation exercises.</p>
<p>For cardiovascular fitness, a jump rope delivers an exceptional workout at minimal cost and with zero footprint when stored. More advanced home gym setups benefit from a foldable rowing machine, which combines full-body strength work with sustained cardio in a single, low-impact movement. Rowers are particularly valuable for those who want to protect their joints while still achieving a high-intensity training effect.</p>
<p>Do not overlook recovery equipment when building your gear collection. A quality foam roller, a set of massage balls, and a yoga mat are indispensable for post-workout recovery and flexibility training. Consistent recovery work reduces injury risk, improves range of motion, and helps you maintain a higher training frequency over time. Investing in recovery tools is every bit as important as investing in the equipment you use to train.</p>`,
    author: "Nexly Team",
    date: "2025-04-20",
    category: "Sports",
    readTime: "5 min read",
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}

export function categoryVariant(category: string): "success" | "warning" | "danger" | "neutral" {
  const map: Record<string, "success" | "warning" | "danger" | "neutral"> = {
    Fashion: "warning",
    "Home & Living": "success",
    Sports: "neutral",
  }
  return map[category] ?? "neutral"
}
