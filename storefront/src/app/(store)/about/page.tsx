import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Container } from "@/components/layout/Container"
import { Users, Globe, Truck, ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Nexly — who we are, what we stand for, and why thousands of customers trust us.",
}

const STATS = [
  { value: "50K+",  label: "Happy Customers" },
  { value: "500+",  label: "Products" },
  { value: "30+",   label: "Countries Shipped" },
  { value: "4.8★",  label: "Average Rating" },
]

const VALUES = [
  {
    icon: Users,
    title: "Customer First",
    desc: "Every decision we make starts with the question: is this good for our customers? From pricing to packaging, you come first.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Guaranteed",
    desc: "We hand-pick every product in our catalog. If it doesn't meet our standards, it doesn't make the cut.",
  },
  {
    icon: Truck,
    title: "Fast & Reliable Delivery",
    desc: "We partner with trusted carriers to get your orders to you quickly, with full tracking from warehouse to door.",
  },
  {
    icon: Globe,
    title: "Sustainably Minded",
    desc: "We're working toward greener packaging and partnering with suppliers who share our commitment to the planet.",
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <div className="relative w-full h-[320px] sm:h-[400px] overflow-hidden bg-[#111111]">
        <Image
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80"
          alt="Our team"
          fill
          priority
          className="object-cover object-center opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <p className="text-[#F0C040] text-xs font-bold uppercase tracking-widest mb-3">Who We Are</p>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
              Built for Shoppers,<br />By Shoppers
            </h1>
          </div>
        </div>
      </div>

      <Container className="py-16">

        {/* Mission */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-2xl font-bold text-[#111111] mb-4">Our Mission</h2>
          <p className="text-[#666666] text-lg leading-relaxed">
            Nexly was founded with a simple idea — shopping online should be easy, affordable, and enjoyable.
            We bring together fashion, electronics, home goods, health products, and sports gear under one roof,
            so you never have to look anywhere else.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-20">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center border border-[#E5E5E5] rounded-xl py-8 px-4">
              <p className="text-3xl font-black text-[#111111] mb-1">{value}</p>
              <p className="text-sm text-[#999999]">{label}</p>
            </div>
          ))}
        </div>

        {/* Story */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"
              alt="Our story"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="text-[#F0C040] text-xs font-bold uppercase tracking-widest mb-3">Our Story</p>
            <h2 className="text-2xl font-bold text-[#111111] mb-4">Started Small, Thinking Big</h2>
            <p className="text-[#666666] leading-relaxed mb-4">
              Nexly started as a small online store in 2020, selling a handful of fashion items.
              As our customers kept asking for more, we kept growing — adding electronics, home goods,
              health products, and sports gear to meet every need.
            </p>
            <p className="text-[#666666] leading-relaxed">
              Today we serve customers across 30+ countries, but we haven't forgotten our roots.
              We still treat every order like it's the only one — packed with care and shipped with pride.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#111111] text-center mb-10">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="border border-[#E5E5E5] rounded-xl p-6">
                <div className="w-10 h-10 rounded-full bg-[#F0C040] flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-[#111111]" />
                </div>
                <h3 className="font-bold text-[#111111] mb-2">{title}</h3>
                <p className="text-sm text-[#666666] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#111111] rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Ready to Shop?</h2>
          <p className="text-white/60 mb-6">Join thousands of happy customers and find everything you need in one place.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#F0C040] hover:bg-yellow-400 text-[#111111] font-bold px-8 py-3 rounded-lg transition-colors"
          >
            Browse All Products
          </Link>
        </div>

      </Container>
    </>
  )
}
