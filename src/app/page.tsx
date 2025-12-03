import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Fork in the Road',
  description: 'Choose your path: Professional wisdom, Shamanic practice, or the integrated Soul Cultivation journey.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-cream to-bg">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-ink mb-6">
          Soul Cultivation
        </h1>
        <p className="text-2xl md:text-3xl text-lavender font-medium mb-4">
          We can&apos;t not become enlightened; it is our destiny path.
        </p>
        <p className="text-xl text-copy max-w-3xl mx-auto">
          We might as well embrace it.
        </p>
      </section>

      {/* The Fork Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-ink mb-4">
            Choose Your Path
          </h2>
          <p className="text-lg text-copy max-w-2xl mx-auto">
            Whether you seek academic understanding, spiritual practice, or the integrated approach,
            your journey to flow begins here.
          </p>
        </div>

        {/* Three Pathways */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Left Path - Professional */}
          <Link href="/professional" className="group">
            <div className="bg-card rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-border hover:border-ocean-blue h-full">
              <div className="text-4xl mb-4 text-ocean-blue">📚</div>
              <h3 className="text-2xl font-bold text-ink mb-3">
                The Material Path
              </h3>
              <p className="text-copy mb-4">
                Social Work • Research • Psychology
              </p>
              <p className="text-sm text-mute">
                Grounded in Master&apos;s level training, backed by sociology and behavioral science.
                The academic foundation.
              </p>
              <div className="mt-6 text-ocean-blue font-medium group-hover:underline">
                Explore Professional →
              </div>
            </div>
          </Link>

          {/* Middle Path - Integrated (RECOMMENDED) */}
          <Link href="/soul-cultivation" className="group relative">
            <div className="absolute -top-3 -right-3 bg-sunrise-gold text-ink text-xs font-bold px-3 py-1 rounded-full shadow-md">
              RECOMMENDED
            </div>
            <div className="bg-gradient-to-br from-teal to-lavender rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full text-white">
              <div className="text-4xl mb-4">🌊</div>
              <h3 className="text-2xl font-bold mb-3">
                The Bridge
              </h3>
              <p className="mb-4 font-medium">
                Soul Cultivation • Integration • Flow
              </p>
              <p className="text-sm opacity-90">
                Where ancient wisdom meets modern psychology. Move from trauma to flow.
                Align your Three Brains. This is the integrated path.
              </p>
              <div className="mt-6 font-bold group-hover:underline">
                Begin Your Journey →
              </div>
            </div>
          </Link>

          {/* Right Path - Shamanic */}
          <Link href="/shamanic" className="group">
            <div className="bg-card rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-border hover:border-lavender h-full">
              <div className="text-4xl mb-4 text-lavender">🕊️</div>
              <h3 className="text-2xl font-bold text-ink mb-3">
                The Soul Path
              </h3>
              <p className="text-copy mb-4">
                Rituals • Energy • Shamanic Practice
              </p>
              <p className="text-sm text-mute">
                Blue Heron lineage. Dagara cosmology. Water cleansing, grief rituals, and 
                space clearing. The energetic foundation.
              </p>
              <div className="mt-6 text-lavender font-medium group-hover:underline">
                Explore Shamanic →
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Quiz CTA */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-teal to-ocean-blue rounded-2xl p-12 text-center text-white shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Discover Your Elemental Path
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Take the Dagara Numerology Quiz to reveal your spirit bird and elemental energy.
          </p>
          <Link 
            href="/quiz"
            className="inline-block bg-white text-teal px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Take the Quiz →
          </Link>
        </div>
      </section>

      {/* About Preview */}
      <section className="container mx-auto px-6 py-16 text-center">
        <p className="text-lg text-copy max-w-3xl mx-auto leading-relaxed">
          <strong className="text-ink">Scott Sherman</strong> — The Mendocino Alchemist. 
          A Master&apos;s level Social Worker and classically trained Shaman (Blue Heron lineage) 
          who bridges ancient wisdom with modern psychology. Like the Flicker bird, 
          he flies ahead to scout the terrain, showing you the path without carrying you up the mountain.
        </p>
        <Link 
          href="/about" 
          className="inline-block mt-6 text-teal font-medium hover:underline"
        >
          Meet Scott →
        </Link>
      </section>
    </main>
  );
}
