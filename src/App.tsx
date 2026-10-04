import { type FormEvent, type KeyboardEvent, type MouseEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Carrot,
  CircleHelp,
  Dog,
  Flower2,
  FileText,
  House,
  Leaf,
  MessageCircleQuestion,
  Menu,
  Moon,
  Play,
  Search,
  Sprout,
  Sun,
  Video,
  Users,
  X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import wordsJson from '../data/words.json';
import alphabetJson from '../data/alphabet.json';
import articlesJson from '../data/articles.json';
import fruitsJson from '../data/fruits_vegetables.json';
import conversationsJson from '../data/conversations.json';
import faqJson from '../data/faq.json';
import storiesJson from '../data/stories.json';

type Word = (typeof wordsJson)[number] & { mediaUrl?: string; mediaType?: 'image' | 'video' };
type Letter = (typeof alphabetJson)[number] & { signMediaUrl?: string; exampleMediaUrl?: string };
type Article = (typeof articlesJson)[number];
type Produce = (typeof fruitsJson)[number] & { mediaUrl?: string; mediaType?: 'image' | 'video' };
type Conversation = (typeof conversationsJson)[number];
type FAQ = (typeof faqJson)[number];
type Story = (typeof storiesJson)[number];
type LoadState = 'loading' | 'ready' | 'error';
type Theme = 'light' | 'dark';

const queryClient = new QueryClient();

const safeSignMedia: Record<string, { url: string; type: 'video' | 'gif' }> = {
  hello: { url: 'https://media.signbsl.com/videos/asl/aslsignbank/mp4/BYE-BYE-425.mp4', type: 'video' },
  love: { url: 'https://media.signbsl.com/videos/asl/aslsignbank/mp4/LOVEb-3063.mp4', type: 'video' },
  apple: { url: 'https://media.signbsl.com/videos/asl/aslsignbank/mp4/APPLEx-406.mp4', type: 'video' },
  corn: { url: 'https://media.signbsl.com/videos/asl/aslsignbank/mp4/CORN_2-2464.mp4', type: 'video' },
  broccoli: { url: 'https://media.signbsl.com/videos/asl/aslsignbank/mp4/BROCCOLI-2137.mp4', type: 'video' },
  lemon: { url: 'https://media.signbsl.com/videos/asl/aslsignbank/mp4/LEMONtap-1679.mp4', type: 'video' },
  tomato: { url: 'https://media.signbsl.com/videos/asl/aslsignbank/mp4/TOMATOix-1253.mp4', type: 'video' },
  dream: { url: 'https://media.signbsl.com/videos/asl/aslsignbank/mp4/DREAM-578.mp4', type: 'video' },
  explore: { url: 'https://media.signbsl.com/videos/asl/aslsignbank/mp4/EXPLORE-816.mp4', type: 'video' },
  flower: { url: 'https://media.signbsl.com/videos/asl/aslsignbank/mp4/FLOWER-381.mp4', type: 'video' },
  make: { url: 'https://media.signbsl.com/videos/asl/aslsignbank/mp4/MAKE-502.mp4', type: 'video' },
  rainbow: { url: 'https://media.signbsl.com/videos/asl/aslsignbank/mp4/RAINBOW-745.mp4', type: 'video' },
  share: { url: 'https://media.signbsl.com/videos/asl/aslsignbank/mp4/SHARE-251.mp4', type: 'video' },
  welcome: { url: 'https://media.signbsl.com/videos/asl/aslsignbank/mp4/WELCOME-1476.mp4', type: 'video' },
  kitchen: { url: 'https://assets-videos.startasl.com/videos-new/kitchen.mp4', type: 'video' },
};

const gameSigns = [
  { id: 'dream', word: 'Dream', mediaUrl: safeSignMedia.dream.url, mediaType: 'video' as const },
  { id: 'explore', word: 'Explore', mediaUrl: safeSignMedia.explore.url, mediaType: 'video' as const },
  { id: 'flower', word: 'Flower', mediaUrl: safeSignMedia.flower.url, mediaType: 'video' as const },
  { id: 'make', word: 'Make', mediaUrl: safeSignMedia.make.url, mediaType: 'video' as const },
  { id: 'rainbow', word: 'Rainbow', mediaUrl: safeSignMedia.rainbow.url, mediaType: 'video' as const },
  { id: 'share', word: 'Share', mediaUrl: safeSignMedia.share.url, mediaType: 'video' as const },
  { id: 'welcome', word: 'Welcome', mediaUrl: safeSignMedia.welcome.url, mediaType: 'video' as const },
  { id: 'corn', word: 'Corn', mediaUrl: safeSignMedia.corn.url, mediaType: 'video' as const },
];

function useGardenData() {
  const [status, setStatus] = useState<LoadState>('loading');
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const collections = [wordsJson, alphabetJson, articlesJson, fruitsJson, conversationsJson, faqJson, storiesJson];
      setStatus(collections.every(Array.isArray) ? 'ready' : 'error');
    }, 180);
    return () => window.clearTimeout(timer);
  }, []);
  return {
    status,
    words: wordsJson as Word[],
    alphabet: alphabetJson as Letter[],
    articles: articlesJson as Article[],
    fruits: fruitsJson as Produce[],
    conversations: conversationsJson as Conversation[],
    faq: faqJson as FAQ[],
    stories: storiesJson as Story[],
  };
}

function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = window.localStorage.getItem('asl-garden-theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('asl-garden-theme', theme);
  }, [theme]);

  return { theme, toggleTheme: () => setTheme((value) => value === 'light' ? 'dark' : 'light') };
}

function Brand() {
  return (
    <Link href="/" className="site-brand" aria-label="ASL Garden home">
      <span className="site-brand-mark" aria-hidden="true"><Sprout size={21} strokeWidth={2.6} /></span>
      <span>ASL <em>Garden</em></span>
    </Link>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const courseLinks = [
    { href: '/reference', label: 'Alphabet' },
    { href: '/numbers', label: 'Numbers' },
    { href: '/situations', label: 'Learn by situation' },
    { href: '/word-banks', label: 'Word banks' },
  ];
  const links: { href: string; label: string; children?: { href: string; label: string }[] }[] = [
    { href: '/games', label: 'Games' },
    { href: '/lookup', label: 'Translator' },
    { href: '/courses', label: 'Courses', children: courseLinks },
    { href: '/stories', label: 'Stories' },
    { href: '/journal', label: 'Journal' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <nav className={`main-nav ${open ? 'open' : ''}`} aria-label="Main navigation">
          {links.map((link) => link.children ? (
            <div
              key={link.href}
              style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}
              onMouseEnter={() => { if (!open) setCoursesOpen(true); }}
              onMouseLeave={() => setCoursesOpen(false)}
              onFocus={() => { if (!open) setCoursesOpen(true); }}
              onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setCoursesOpen(false); }}
            >
              <Link
                href={link.href}
                className={`nav-link ${location === link.href || link.children.some((child) => child.href === location) ? 'active' : ''}`}
                onClick={() => { setOpen(false); setCoursesOpen(false); }}
              >
                {link.label}
              </Link>
              {(coursesOpen || open) && (
                <div
                  style={open
                    ? { display: 'flex', flexDirection: 'column', paddingLeft: 16 }
                    : { position: 'absolute', top: '100%', left: 0, minWidth: 210, padding: 8, borderRadius: 12, background: 'Canvas', color: 'CanvasText', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 10px 28px rgba(0,0,0,0.18)', zIndex: 50, display: 'flex', flexDirection: 'column' }}
                >
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="nav-link"
                      style={open ? undefined : { color: 'CanvasText', padding: '8px 12px', whiteSpace: 'nowrap' }}
                      onClick={() => { setOpen(false); setCoursesOpen(false); }}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${location === link.href ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <a href="./#learning-paths" className="header-cta" onClick={() => setOpen(false)}>Start learning <ArrowRight size={16} /></a>
          <button type="button" className="menu-button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            {open ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
      </div>
    </header>
  );
}

function SignVisual({
  label,
  kind = 'hello',
  mediaUrl,
  mediaType,
  large = false,
  fingerspell = false,
  onMediaError,
  fallback,
}: {
  label: string;
  kind?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'gif';
  large?: boolean;
  fingerspell?: boolean;
  onMediaError?: () => void;
  fallback?: ReactNode;
}) {
  const normalized = kind.trim().toLowerCase().replace(/\s+/g, '-');
  const media = mediaUrl ? { url: mediaUrl, type: mediaType ?? 'video' } : safeSignMedia[normalized];
  const [mediaFailed, setMediaFailed] = useState(false);

  useEffect(() => {
    setMediaFailed(false);
  }, [media?.url]);

  if (mediaFailed && fallback) {
    return <div className={`sign-visual sign-fallback ${large ? 'large' : ''}`} aria-label={`ASL visual for ${label}`}>{fallback}</div>;
  }

  if (media?.type === 'video') {
    return (
      <div className={`sign-visual sign-player sign-gif-style ${large ? 'large' : ''}`} aria-label={`Animated ASL sign for ${label}`}>
        <video src={media.url} autoPlay loop muted playsInline preload="metadata" aria-label={`ASL sign for ${label}`} onError={() => { setMediaFailed(true); onMediaError?.(); }} />
      </div>
    );
  }
  if (media?.type === 'gif') {
    return <div className={`sign-visual sign-gif ${large ? 'large' : ''}`}><img src={media.url} alt={`ASL sign for ${label}`} /></div>;
  }
  // Never render a text-only placeholder or an embedded search page in a learning card.
  // If we do not have a verified visual sign clip, the caller should omit the item.
  return null;
}

function FingerspellStrip({ word }: { word: string }) {
  const letters = word.toUpperCase().replace(/[^A-Z]/g, '').split('');
  return <div className="fingerspell-strip" aria-label={`Fingerspelled ${word}`}>{letters.map((letter, index) => <span className="letter-sticker" key={`${letter}-${index}`}><img src={alphabetImageUrl(letter)} alt={`${letter} handshape`} /><b>{letter}</b></span>)}</div>;
}

function signKindForWord(word: string) {
  const normalized = word.trim().toLowerCase().replace(/[.,!?]/g, '');
  return normalized === 'thank you' ? 'thank-you' : normalized.replace(/\s+/g, '-');
}

function SignedWord({
  word,
  kind = signKindForWord(word),
  compact = false,
  mediaUrl,
  mediaType,
  credit
}: {
  word: string;
  kind?: string;
  compact?: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'gif';
  credit?: string;
}) {
  return (
    <div className={`signed-word ${compact ? 'compact' : ''}`}>
      <SignVisual
        label={word}
        kind={kind}
        mediaUrl={mediaUrl}
        mediaType={mediaType}
      />

      {credit && (
        <div className="sign-credit">
          {credit}
        </div>
      )}

      <span>{word}</span>
    </div>
  );
}

function SignedWordRow({ words, compact = false }: { words: string[]; compact?: boolean }) {
  return <div className="signed-word-row">{words.map((word) => <SignedWord key={`${word}-${signKindForWord(word)}`} word={word} compact={compact} />)}</div>;
}

function StickerSign({ label, emoji }: { label: string; emoji: string }) {
  return <div className="sign-sticker" role="img" aria-label={`${label} sign sticker`}><span>{emoji}</span><small>sticker sign</small></div>;
}

function PageIntro({ eyebrow, title, copy, children }: { eyebrow: string; title: string; copy: string; children?: ReactNode }) {
  return (
    <section className="page-intro">
      <div className="page-wrap page-intro-inner">
        <div>
          <div className="section-kicker">{eyebrow}</div>
          <h1>{title}</h1>
          <p>{copy}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="home-copy">
            <div className="eyebrow">A place to grow your hands</div>
            <h1>Find your <span>sign.</span></h1>
            <p>ASL Garden is a joyful corner of the internet for learning American Sign Language through play, practice, and real connection.</p>
            <div className="hero-actions">
              <Link href="/courses" className="button-primary">Explore a lesson <ArrowRight size={18} /></Link>
              <Link href="/stories" className="button-ghost">Stories</Link>
            </div>
            <div className="hero-note"><Users size={15} /> Made for Deaf, hard-of-hearing, and hearing learners.</div>
          </div>
          <div className="hero-sign-pair" aria-label="Featured ASL signs">
            <div className="hero-sign-card hero-sign-hello">
              <StickerSign label="Hello" emoji="👋🏻" />
              <div><span>Featured sign</span><strong>Hello</strong></div>
            </div>
            <div className="hero-sign-card hero-sign-love">
              <StickerSign label="I Love You" emoji="🤟🏻" />
              <div><span>Featured sign</span><strong>I Love You</strong></div>
            </div>
            <Flower2 className="hero-flower flower-top" size={58} aria-hidden="true" />
            <Flower2 className="hero-flower flower-bottom" size={72} aria-hidden="true" />
          </div>
        </div>
      </section>
      <section id="learning-paths" className="home-paths content-section">
        <div className="page-wrap">
          <div className="section-head">
            <div><div className="section-kicker">Pick a path</div><h2 className="section-title">Small lessons.<br />Big lightbulbs.</h2></div>
            <p className="section-intro">Every part of the garden has its own place to explore. Start anywhere.</p>
          </div>
          <div className="path-grid">
            <Link href="/games" className="path-card path-card-blue"><CircleHelp size={30} /><span>Playful practice</span><h3>Games & quizzes</h3><p>Match, remember, and try again without pressure.</p><ArrowRight className="path-arrow" /></Link>
            <Link href="/lookup" className="path-card path-card-pink"><Search size={30} /><span>Find a sign</span><h3>Word translator</h3><p>Search a word and see its visual sign guide first.</p><ArrowRight className="path-arrow" /></Link>
            <Link href="/reference" className="path-card path-card-yellow"><BookOpen size={30} /><span>Turn the page</span><h3>Alphabet book</h3><p>Letters, signs, and the objects that bring them to life.</p><ArrowRight className="path-arrow" /></Link>
            <Link href="/courses" className="path-card path-card-green"><Leaf size={30} /><span>Learn step by step</span><h3>Courses</h3><p>Alphabet, numbers, situations, and word banks in one place.</p><ArrowRight className="path-arrow" /></Link>
            
          </div>
        </div>
      </section>
    </>
  );
}

const lessons = [
  { id: 'meeting', title: 'Meeting someone', blurb: 'Say hello, share your name, and talk about friends and family.', words: ['hello', 'my', 'name', 'your', 'friend', 'meet', 'welcome', 'family', 'fine', 'ask'] },
  { id: 'restaurant', title: 'At the restaurant', blurb: 'Order food and drinks and ask for what you need.', words: ['restaurant', 'eat', 'want', 'water', 'drink', 'coffee', 'pizza', 'salad', 'fork', 'spoon', 'plate', 'help'] },
  { id: 'family', title: 'My family', blurb: 'Learn the signs for the people in your family.', words: ['mother', 'father', 'sister', 'brother', 'grandma', 'grandpa', 'son', 'daughter', 'husband', 'wife', 'cousin', 'parents'] },
  { id: 'day', title: 'My day', blurb: 'Talk about when things happen and where you go.', words: ['morning', 'today', 'tomorrow', 'yesterday', 'work', 'school', 'home', 'breakfast', 'lunch', 'dinner', 'go', 'come'] },
  { id: 'school', title: 'At school', blurb: 'Signs for classes, learning, and homework.', words: ['class', 'teacher', 'student', 'book', 'homework', 'test', 'learn', 'read', 'write', 'understand', 'easy', 'hard'] },
  { id: 'health', title: 'Not feeling well', blurb: 'Say what hurts and ask for help.', words: ['sick', 'headache', 'cough', 'dizzy', 'medicine', 'help', 'head', 'heart', 'hand', 'leg', 'rest', 'allergy'] },
  { id: 'freetime', title: 'Free time', blurb: 'Talk about hobbies and things you enjoy.', words: ['movie', 'hike', 'walk', 'exercise', 'game', 'play', 'soccer', 'travel', 'love', 'like', 'favorite', 'watch'] },
  { id: 'celebrations', title: 'Celebrations', blurb: 'Birthdays, parties, and holidays.', words: ['birthday', 'party', 'gift', 'wedding', 'celebrate', 'surprise', 'invite', 'decorate', 'christmas', 'halloween', 'fireworks'] },
];

const topics = [
  { id: 'family-all', title: 'Family', blurb: 'Every family sign in one place.', words: ['sister', 'brother', 'sibling', 'parents', 'mother', 'father', 'grandma', 'grandpa', 'girl', 'boy', 'son', 'daughter', 'husband', 'wife', 'uncle', 'aunt', 'nephew', 'niece', 'cousin', 'child', 'adopt', 'children', 'old', 'young', 'partner', 'relative'] },
  { id: 'food-all', title: 'Food', blurb: 'Meals, drinks, and favorite dishes.', words: ['water', 'breakfast', 'lunch', 'dinner', 'coffee', 'drink', 'bread', 'egg', 'cheese', 'taco', 'chicken', 'fruit', 'vegetable', 'meat', 'burrito', 'pasta', 'pizza', 'salad', 'burger', 'fries', 'sandwich', 'sushi'] },
  { id: 'kitchen', title: 'Kitchen', blurb: 'Tools and things in the kitchen.', words: ['bake', 'taste', 'fork', 'spoon', 'knife', 'chopsticks', 'bowl', 'plate', 'napkin', 'straw', 'blender', 'freezer', 'toast', 'juice', 'sauce', 'ice', 'soda', 'tea', 'glass'] },
  { id: 'animals', title: 'Animals', blurb: 'Pets and wild animals.', words: ['animal', 'pet', 'dog', 'cat', 'bird', 'bear', 'bug', 'butterfly', 'cow', 'deer', 'dolphin', 'fish', 'horse', 'lion', 'monkey', 'mouse', 'pig', 'snake', 'spider', 'turtle'] },
  { id: 'people', title: 'People', blurb: 'Words for people and groups.', words: ['people', 'person', 'friend', 'family', 'roommate', 'man', 'woman', 'any', 'anyone', 'someone', 'several', 'all', 'other', 'many', 'some', 'nobody', 'have', 'deaf', 'hearing'] },
  { id: 'body-health', title: 'Body and health', blurb: 'Body parts and health words.', words: ['health', 'medicine', 'headache', 'allergy', 'break', 'sick', 'nausea', 'help', 'protect', 'rest', 'try', 'cough', 'dizzy', 'bone', 'body', 'head', 'heart', 'hand', 'leg', 'feet'] },
  { id: 'sports', title: 'Sports', blurb: 'Sports, teams, and games.', words: ['sport', 'ball', 'baseball', 'basketball', 'cheerleading', 'football', 'hockey', 'soccer', 'tennis', 'track', 'volleyball', 'practice', 'game', 'team', 'win', 'lose', 'play', 'player', 'race', 'ready'] },
  { id: 'time-all', title: 'Time', blurb: 'Days, months, and when things happen.', words: ['time', 'morning', 'everyday', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'weekend', 'month', 'year', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'again', 'never', 'often', 'usually', 'sometimes', 'soon', 'next', 'last', 'later'] },
  { id: 'school-all', title: 'School', blurb: 'Learning and school life.', words: ['class', 'college', 'test', 'hard', 'easy', 'graduate', 'homework', 'book', 'teacher', 'student', 'spell', 'teach', 'understand', 'learn', 'know', 'write', 'read', 'remember', 'think', 'forget'] },
  { id: 'digital', title: 'Phones and computers', blurb: 'Technology and messages.', words: ['computer', 'laptop', 'internet', 'wifi', 'phone', 'battery', 'email', 'message', 'camera', 'picture', 'flash', 'filming', 'edit', 'post', 'delete', 'send', 'texting', 'google'] },
  { id: 'holidays-all', title: 'Holidays', blurb: 'Celebrations through the year.', words: ['holiday', 'plan', 'surprise', 'party', 'decorate', 'gift', 'birthday', 'invite', 'host', 'wedding', 'celebrate', 'fireworks', 'halloween', 'costume', 'thanksgiving', 'christmas', 'cancel'] },
  { id: 'leisure', title: 'Hobbies and feelings', blurb: 'What you enjoy and how you feel.', words: ['enjoy', 'talk', 'cook', 'exercise', 'hike', 'walk', 'love', 'movie', 'can', 'socialize', 'travel', 'like', 'watch', 'ask', 'feel', 'fine', 'want', 'say', 'favorite', 'not'] },
  { id: 'places', title: 'Places and getting around', blurb: 'Where you go and how you get there.', words: ['go', 'leave', 'attend', 'come', 'drive', 'deliver', 'live', 'work', 'eat', 'home', 'house', 'store', 'restaurant', 'school', 'dorm', 'meet', 'need', 'far', 'near', 'here'] },
];

function LessonPage({ id }: { id: string }) {
  const lesson = [...lessons, ...topics].find((item) => item.id === id);
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [id]);

  if (!lesson) {
    return (
      <main className="page-wrap page-content">
        <p>Lesson not found.</p>
        <Link href="/courses">Back to courses</Link>
      </main>
    );
  }

  const count = lesson.words.length;
  const word = lesson.words[active];
  const isSituation = lessons.some((item) => item.id === id);

  return (
    <>
      <PageIntro eyebrow={isSituation ? 'Learn by situation' : 'Word bank'} title={lesson.title} copy={lesson.blurb} />
      <main className="page-wrap page-content">
        <div style={{ maxWidth: 460, margin: '0 auto' }}>
          <AslologyClip key={word} word={word} />
          <p style={{ textAlign: 'center', fontSize: '0.8rem', opacity: 0.7, marginTop: 6 }}>{active + 1} of {count}</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
            <button type="button" className="button-primary" onClick={() => setActive((value) => (value - 1 + count) % count)}>Previous</button>
            <button type="button" className="button-primary" onClick={() => setActive((value) => (value + 1) % count)}>Next</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 20 }}>
            {lesson.words.map((w, i) => (
              <button
                key={w}
                type="button"
                onClick={() => setActive(i)}
                style={{ padding: '6px 12px', borderRadius: 999, border: '1px solid currentColor', background: 'none', color: 'inherit', cursor: 'pointer', fontWeight: i === active ? 700 : 400, opacity: i === active ? 1 : 0.6, textTransform: 'capitalize' }}
              >
                {w}
              </button>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: 24 }}>
            <Link href={isSituation ? '/situations' : '/word-banks'}>Back to {isSituation ? 'situations' : 'word banks'}</Link>
          </p>
        </div>
      </main>
    </>
  );
}

function SituationsPage() {
  return (
    <>
      <PageIntro eyebrow="Learn by situation" title="Pick a situation." copy="Learn the signs you would use in real moments." />
      <main className="page-wrap page-content">
        <div className="path-grid">
          {lessons.map((lesson, i) => (
            <Link key={lesson.id} href={'/lesson/' + lesson.id} className="path-card path-card-pink">
              <BookOpen size={30} />
              <span>Situation {i + 1}</span>
              <h3>{lesson.title}</h3>
              <p>{lesson.blurb}</p>
              <ArrowRight className="path-arrow" />
            </Link>
          ))}
        </div>
        <p style={{ marginTop: 24 }}><Link href="/courses">Back to courses</Link></p>
      </main>
    </>
  );
}

function WordBanksPage() {
  return (
    <>
      <PageIntro eyebrow="Word banks" title="Choose a topic." copy="Pick the group of signs you want to learn." />
      <main className="page-wrap page-content">
        <div className="path-grid">
          {topics.map((topic) => (
            <Link key={topic.id} href={'/lesson/' + topic.id} className="path-card path-card-green">
              <FileText size={30} />
              <span>{topic.words.length} signs</span>
              <h3>{topic.title}</h3>
              <p>{topic.blurb}</p>
              <ArrowRight className="path-arrow" />
            </Link>
          ))}
        </div>
        <p style={{ marginTop: 24 }}><Link href="/courses">Back to courses</Link></p>
      </main>
    </>
  );
}

// ASL Journal: add new articles at the top of this list.
// Each paragraph is one line inside double quotes. Do not use straight double quotes inside the text.
const journalArticles = [
  {
    id: 'welcome',
    title: 'Welcome to the ASL Journal',
    date: 'October 2026',
    summary: 'A first note from ASL Garden.',
    paragraphs: [
      "Welcome to the ASL Journal. This is where we share notes about learning American Sign Language.",
      "Check back soon for new articles.",
    ],
  },
];

function JournalPage() {
  return (
    <>
      <PageIntro eyebrow="ASL Journal" title="Notes from the garden." copy="Articles about learning and understanding American Sign Language." />
      <main className="page-wrap page-content">
        <div className="path-grid">
          {journalArticles.map((article) => (
            <Link key={article.id} href={'/journal/' + article.id} className="path-card path-card-yellow">
              <BookOpen size={30} />
              <span>{article.date}</span>
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
              <ArrowRight className="path-arrow" />
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

function JournalArticlePage({ id }: { id: string }) {
  const article = journalArticles.find((item) => item.id === id);
  if (!article) {
    return (
      <main className="page-wrap page-content">
        <p>Article not found.</p>
        <Link href="/journal">Back to the journal</Link>
      </main>
    );
  }
  return (
    <>
      <PageIntro eyebrow={article.date} title={article.title} copy={article.summary} />
      <main className="page-wrap page-content">
        <article style={{ maxWidth: 680, margin: '0 auto' }}>
          {article.paragraphs.map((paragraph, i) => (
            <p key={i} style={{ marginBottom: 16, lineHeight: 1.7 }}>{paragraph}</p>
          ))}
          <p style={{ marginTop: 32 }}><Link href="/journal">Back to the journal</Link></p>
        </article>
      </main>
    </>
  );
}

function CoursesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Courses"
        title="Choose what you want to learn."
        copy="Pick a course and grow your ASL skills one step at a time."
      />
      <main className="page-wrap page-content">
        <div className="path-grid">
          <Link href="/reference" className="path-card path-card-yellow">
            <BookOpen size={30} />
            <span>Course 01</span>
            <h3>Alphabet</h3>
            <p>Learn the ASL signs for every letter and practice with visual examples.</p>
            <ArrowRight className="path-arrow" />
          </Link>

          <Link href="/numbers" className="path-card path-card-blue">
            <FileText size={30} />
            <span>Course 02</span>
            <h3>Numbers</h3>
            <p>Practice ASL number signs and build confidence with numbers.</p>
            <ArrowRight className="path-arrow" />
          </Link>

          <Link href="/situations" className="path-card path-card-pink">
            <BookOpen size={30} />
            <span>Course 03</span>
            <h3>Learn by situation</h3>
            <p>Practice the signs you need at a restaurant, at school, with family, and more.</p>
            <ArrowRight className="path-arrow" />
          </Link>

          <Link href="/word-banks" className="path-card path-card-green">
            <FileText size={30} />
            <span>Course 04</span>
            <h3>Word banks</h3>
            <p>Choose a topic, like animals, food, or time, and learn its signs.</p>
            <ArrowRight className="path-arrow" />
          </Link>
        </div>
      </main>
    </>
  );
}

function ConversationPage({ conversations }: { conversations: Conversation[] }) {
  return (
    <>
      <PageIntro eyebrow="Open a conversation" title="Signs and words, side by side." copy="Read a few short exchanges one word at a time. Each word gets its own visual space so hands and language stay connected.">
        <div className="intro-badge"><Users size={16} /> Practice together</div>
      </PageIntro>
      <main className="page-wrap page-content conversation-page">
        {conversations.map((conversation) => (
          <article className="conversation-card" key={conversation.id}>
            <div className="conversation-heading"><span>{conversation.title}</span><strong>{conversation.context}</strong></div>
            {conversation.lines.map((line, index) => (
              <div className={`conversation-line ${index % 2 ? 'reply' : ''}`} key={`${conversation.id}-${line.speaker}`}>
                <div className="speaker">{line.speaker}</div>
                <div className="conversation-words">
                  {line.words.map((word) => <div className="conversation-word" key={`${line.speaker}-${word.word}`}><SignVisual label={word.word} kind={word.kind} /><span>{word.word}</span></div>)}
                </div>
              </div>
            ))}
          </article>
        ))}
      </main>
    </>
  );
}


function GamesPage({ words: _words }: { words: Word[] }) {
  const pool = gameSigns;
  const [round, setRound] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const current = pool[round % pool.length];
  const options = useMemo(() => [current, ...pool.filter((word) => word.id !== current.id).slice(0, 2)].sort((a,b) => a.word.localeCompare(b.word)), [current, pool]);
  const nextRound = () => { setAnswer(null); setRound((value) => value + 1); };
  return (
    <>
      <PageIntro eyebrow="Visual sign guessing game" title="Watch the sign. Guess the word." copy="A real sign video is shown first. Choose the English word you think matches it. There is no voice and no fingerspelling in the game." />
      <main className="page-wrap page-content">
        <section className="game-board visual-game-board">
          <div className="game-question">
            <div className="section-kicker">Round {round + 1}</div>
            <h2>What word is this sign?</h2>
            <SignVisual label={current.word} kind={current.id} mediaUrl={current.mediaUrl} mediaType={current.mediaType} large />
            <p className="game-prompt">Watch the signer, then choose the English word.</p>
          </div>
          <div className="game-answer">
            <div className="game-options">{options.map((option) => <button type="button" key={option.id} className={`game-option verbal-option ${answer === option.id ? (option.id === current.id ? 'correct' : 'wrong') : ''}`} onClick={() => setAnswer(option.id)}><span>{option.word}</span></button>)}</div>
            <div className="game-feedback" role="status" aria-live="polite">{answer ? answer === current.id ? 'Correct! Great watching.' : `Not this one. The sign is “${current.word}”.` : 'Choose the English word.'}</div>
            {answer && <button type="button" className="text-button" onClick={nextRound}>Next sign <ArrowRight size={16} /></button>}
          </div>
        </section>
      </main>
    </>
  );
}

function translateToASLGloss(input: string) {
  const raw = input.trim().replace(/\s+/g, ' ');
  if (!raw) return { gloss: '', tokens: [] as string[] };
  const tokens = raw.match(/[A-Za-z]+(?:'[A-Za-z]+)?|[0-9]+/g) ?? [];
  const common = new Set(['a','an','the','to','of','and','is','am','are','was','were','do','does','did','it']);
  let kept = tokens.map((token) => token.toLowerCase()).filter((token) => !common.has(token));
  const wh = kept.filter((token) => ['who','what','when','where','why','how','which','whose'].includes(token));
  kept = kept.filter((token) => !wh.includes(token));
  if (wh.length) kept = [...kept, ...wh];
  const gloss = kept.map((token) => token.toUpperCase()).join(' ');
  return { gloss, tokens: kept };
  }
const aslologyMedia = new Map<string, string>([
  // Greeting
  ['hi', 'hXG4CXZH'], ['hello', 'hXG4CXZH'],
  ['sign', '3z9FS3KT'], ['name', 'oYOZ10hU'], ['what', 'eTxytJM8'],
  ['you', 'C0M4CTr5'], ['your', 'ur9xlY4r'],
  ['i', 'kAFnWdCp'], ['me', 'kAFnWdCp'], ['my', 'BphfjXXz'],

  // Sports
  ['sport', 'C1kzmLNX'], ['ball', 'I7piwZg7'], ['baseball', 'cyK1OHwt'], ['basketball', 'rdh29JGe'],
  ['cheerleading', 'bczwbkOP'], ['football', 'HtW6eNHT'], ['hockey', '7hD31stP'], ['soccer', 'nOgu0rJf'],
  ['tennis', '8eDPpA9o'], ['track', 'YV08MfUx'], ['volleyball', 'kJdWxf0u'], ['practice', 'LIuU5FaT'],
  ['game', 'md9lUwAU'], ['team', '9dpu6nWG'], ['equal', 'ml7NRXOQ'], ['tie', 'ml7NRXOQ'],
  ['win', 'zO9jPKUR'], ['lose', 'oA7QAUaA'], ['play', 'm2sHHTZv'], ['player', 'bKJckDOd'],
  ['race', '7LwJ3hxO'], ['contest', '7LwJ3hxO'], ['ready', 'F7tzb0Fy'],

  // Health
  ['health', 'NK253bDZ'], ['heal', 'NK253bDZ'], ['recover', 'NK253bDZ'],
  ['medicine', 'Cf5NDYzu'], ['medical', 'Cf5NDYzu'], ['headache', '0IUaX8bb'], ['allergy', 'oLGudwiM'],
  ['break', '95bzUsVp'], ['broken', '95bzUsVp'], ['sick', '9HbIhVJi'],
  ['nausea', 'z4I14ChP'], ['disgust', 'z4I14ChP'], ['help', 'XwpuXOHz'],
  ['protect', 'djBUX4X9'], ['block', 'djBUX4X9'], ['prevent', 'djBUX4X9'],
  ['rest', 'CB6bVgNL'], ['try', 'YNdNleoF'], ['attempt', 'YNdNleoF'], ['cough', 'LvI3Y61R'],
  ['dizzy', 'OXJNiifL'], ['bone', 'ibG8AS2W'], ['skeleton', 'ibG8AS2W'], ['body', 'PqK8Ei8W'],
  ['head', 'BpqJPmmb'], ['heart', 'XRmgJttw'], ['hand', 'YwqpPW81'], ['leg', 'NVqqxUXr'],
  ['feet', 'PNaGWRsJ'], ['foot', 'PNaGWRsJ'],

  // Holiday
  ['holiday', 'YyrdpCZP'], ['plan', 'z2cvybL1'], ['surprise', 'i7rTYWs3'], ['party', 'nZh5z0SV'],
  ['decorate', 'ySbOHh2Y'], ['present', 'zctpuVMX'], ['gift', 'zctpuVMX'], ['birthday', 'jqHe3fxi'],
  ['invite', 'Y5EJbh3j'], ['welcome', 'Y5EJbh3j'], ['host', 'GSVaFbdi'],
  ['proposal', 'ZwPLSwtt'], ['propose', 'ZwPLSwtt'], ['wedding', '8IneZ11H'],
  ['celebrate', 'hm28ygYR'], ['anniversary', 'hm28ygYR'], ['fireworks', 'gbl7W3Sn'],
  ['halloween', 'pXAguEjJ'], ['costume', 'DM5O4PR2'], ['thanksgiving', 'ZY4IEVGA'],
  ['christmas', 'HuHKL3B2'], ['cancel', 'eg9L4GUb'],

  // Cooking
  ['bake', 'mfkILUs1'], ['taste', '7mylAGSj'], ['fork', 'MXOgrpgM'], ['spoon', 'ZmYvpt1U'],
  ['knife', '7f0qiZXr'], ['chopsticks', 'eiqztwF8'], ['bowl', 'iGWBTxDj'], ['plate', 'tm5fqWXy'],
  ['napkin', 'zMc43FNT'], ['straw', 'PifD4bqG'], ['blender', 'dgQugFqj'], ['freezer', 'sTCSLBXj'],
  ['toast', 'BO6rPthF'], ['juice', 'W7JFfcnJ'],
  ['sauce', 'KDgU4Axe'], ['dressing', 'KDgU4Axe'], ['syrup', 'KDgU4Axe'],
  ['ice', 'oYXxuGaP'], ['soda', 'ep7uVEUg'], ['tea', 'GFGeIBqR'], ['glass', 'bz4BOGgZ'],

  // Animals
  ['animal', 'ayXQ0Gwi'], ['pet', 'Ovjn8sOg'], ['dog', 'T6Djh8Pa'], ['cat', 'ZrnJyog2'],
  ['bird', '82wIK4Rp'], ['bear', 'o39hNDLo'], ['bug', '94Zc3IRu'], ['butterfly', 'NoOMPVAU'],
  ['cow', 'jNOqWAiY'], ['deer', 'QCPFCunX'], ['dolphin', 'Pzv449Xw'], ['fish', 'xQQiQD3P'],
  ['horse', 'GId0YvHE'], ['lion', 'Ly92WBfx'], ['monkey', 'rc2J76yM'], ['ape', 'rc2J76yM'],
  ['mouse', 'lmhVw0Jr'], ['pig', '0EGW0p9y'], ['snake', '3JzHniMC'], ['spider', 'Bub4TpwI'],
  ['turtle', 'VbbrhBO4'],

  // People
  ['people', 'ylWD3mFW'], ['person', 'VyEDlmBp'], ['friend', 'qLJJwx6O'], ['family', 'ijVGOrF8'],
  ['roommate', 'qr249a1Y'], ['man', '66RpPYsq'], ['woman', 'eHicRJnD'], ['any', 'meN0smve'],
  ['anyone', 'G5TvmM09'], ['someone', 'NjQRWsZJ'], ['something', 'NjQRWsZJ'],
  ['several', 'xgzkZx39'], ['few', 'xgzkZx39'],
  ['all', 'z7MpkfHp'], ['whole', 'z7MpkfHp'], ['entire', 'z7MpkfHp'],
  ['other', 'zd2X5ruo'], ['another', 'zd2X5ruo'], ['many', 'hHaWhBVr'], ['some', 'AKYspFkn'],
  ['nobody', '1M8cE77C'], ['nothing', '1M8cE77C'], ['none', '1M8cE77C'],
  ['have', '5m1zicdn'], ['contain', '5m1zicdn'], ['deaf', 'o2IzxG0T'], ['hearing', 'lqVAuR4A'],

  // Leisure
  ['enjoy', 'nkiTWV1O'], ['hobby', 'nkiTWV1O'], ['talk', 'IcvjOPGp'], ['conversation', 'IcvjOPGp'],
  ['cook', 'N65FN8uz'], ['exercise', '6pzgbCKg'], ['fitness', '6pzgbCKg'], ['workout', '6pzgbCKg'],
  ['hike', 'ncZi09s9'], ['walk', 'L98OZdHB'], ['love', '1ktZZRig'], ['movie', '4zU3YmYT'],
  ['can', '7lbeKHOQ'], ['socialize', 'a7Orzbyu'], ['travel', 'mMwdHDop'], ['like', 'H3M9vyJ2'],
  ['watch', 'H7OFjz4d'], ['ask', 'xCBfGEnM'], ['feel', '9Rre9jpQ'], ['fine', 'pA5wTR0g'],
  ['want', 'ryOGDUio'], ['say', 'QrAMsPe9'], ['favorite', 'r4Fq1Qjy'], ['prefer', 'r4Fq1Qjy'],
  ['not', 'mUIlDcOw'], ["don't", 'mUIlDcOw'],

  // Time
  ['time', 'SEgmGXeT'], ['morning', 'oMY6fIOd'], ['everyday', 'c4hGiyaD'], ['daily', 'c4hGiyaD'],
  ['night', 'L1obGxJm'], ['today', 'eQNjldDQ'], ['tomorrow', 'UwiJQokW'], ['yesterday', 'c2hm3m1z'],
  ['week', 'fzsHzTmi'], ['weekend', '2VarxIL2'], ['month', 'bHwpU86q'], ['year', 'w0r9FSKR'],
  ['monday', 'EgqXFhOC'], ['tuesday', 'aMRfyIsy'], ['wednesday', 'lrLokURR'], ['thursday', '1j5mDSDu'],
  ['friday', 'WmqRlIBW'], ['saturday', 'ncmOyFEi'], ['sunday', 'PY7Aa1n2'],
  ['again', 'jxhIYDHa'], ['never', 'j9pI6BLE'], ['often', 'DlsnkTGB'],
  ['usually', 'dmQ8M7RZ'], ['tend', 'dmQ8M7RZ'], ['typical', 'dmQ8M7RZ'],
  ['sometime', 'OHHmSRcc'], ['sometimes', 'OHHmSRcc'], ['soon', 'fWLbmvZN'], ['next', 'yD8YU587'],
  ['last', '2LsLB9eQ'], ['past', '2LsLB9eQ'], ['later', 'WNTeudC1'],

  // Digital communication
  ['computer', '72HN7JQZ'], ['laptop', 'gUemobF8'],
  ['internet', 'iHJOxjaT'], ['online', 'iHJOxjaT'], ['website', 'iHJOxjaT'],
  ['wifi', 'wFwmdqSt'], ['phone', 'aPHCc6J0'], ['battery', 'UeapH9UV'], ['charge', 'UeapH9UV'],
  ['email', 'o47zgwtu'], ['message', 'gYXiL58U'], ['camera', 'wr8hbBvx'], ['picture', 'GRS5zcDK'],
  ['flash', 'MQwL71vm'], ['filming', 'B9aWyAZp'], ['recording', 'B9aWyAZp'],
  ['edit', 'qYtHwb6H'], ['editing', 'qYtHwb6H'], ['post', 'h8VcIkIf'], ['poster', 'h8VcIkIf'],
  ['delete', 'mIlysdqf'], ['eliminate', 'mIlysdqf'], ['send', 'gahKB5CY'],
  ['texting', 'iu41ypmm'], ['google', 'dSfW9eq7'],

  // School
  ['class', 'hW2LfJEf'], ['course', 'hW2LfJEf'], ['college', 'urOgPwDk'],
  ['test', '3vgSJHKT'], ['exam', '3vgSJHKT'], ['hard', 'rA57uYeV'], ['difficult', 'rA57uYeV'],
  ['easy', 'q9A1rfg5'], ['graduate', 'hHUxWLyl'], ['graduation', 'hHUxWLyl'],
  ['homework', 'wBsFrXIi'], ['book', 'tDw7LQFc'], ['teacher', 'neVzl5bf'], ['student', 'PCoQnRZa'],
  ['spell', 'SDtr8YGS'], ['fingerspelling', 'SDtr8YGS'], ['teach', 'qvKO8S4V'], ['educate', 'qvKO8S4V'],
  ['understand', 'MImyziej'], ['learn', 'BDeIey8e'], ['know', '2CNhIRf4'], ['aware', '2CNhIRf4'],
  ['write', 'ANR68qha'], ['read', 'AW7v2gI4'], ['remember', '3ndspFjs'], ['think', 'jTfukcwG'],
  ['forget', 'mcXo8AK0'],

  // Food
  ['water', 'j9z8zMNH'], ['breakfast', 'rnaEFGGS'], ['lunch', 'XQdlc4xs'], ['dinner', '1rHShRHN'],
  ['coffee', 'DAsrKhrH'], ['drink', 'hkdLT2mO'], ['bread', 'uDtqAIaL'], ['egg', 'qIjCOH5a'],
  ['cheese', 'ItfgOCTF'], ['taco', 'OgosX324'], ['chicken', 'g5CW8h5t'], ['fruit', 'UbQuk0Mt'],
  ['vegetable', 'RfYDjVJC'], ['meat', 'azqfi6WC'], ['burrito', '4tkjA2Wz'],
  ['pasta', 'XDFA219V'], ['spaghetti', 'XDFA219V'], ['pizza', 'c9EtWzsG'], ['salad', 'BaKLLATS'],
  ['burger', '3XrFsWjK'], ['fries', 'WQ4aLkyR'], ['sandwich', 'DnFczqti'], ['sushi', '9FXDAPjb'],

  // Family
  ['sister', 'iONuYZxB'], ['brother', 'TBtkpw8d'], ['sibling', 'q27xUb3L'], ['parents', 'cCoif7YC'],
  ['mother', 'ejSCv9cr'], ['father', 'jjZDBr05'], ['grandma', '6Ww9WGzV'], ['grandpa', 'M1USA9GY'],
  ['girl', '4El9ElvK'], ['boy', 'G4BXsq4k'], ['son', 'hdZJpibi'], ['daughter', 'oO5EWw90'],
  ['husband', 'KJyIHLjJ'], ['wife', 'WkS719fV'], ['uncle', 'FVAc2yvl'], ['aunt', '0FaUknok'],
  ['nephew', 'WbENMyfX'], ['niece', 'DsAxxu38'], ['cousin', 'yfvUPuTu'], ['child', 'bRdAArWk'],
  ['adopt', 'NUw8GHIe'], ['children', 'RWzmb2Kj'], ['old', 'fQVrNVc5'],
  ['young', 'VfNAOoH8'], ['youth', 'VfNAOoH8'], ['partner', '2VIuZOTL'], ['relative', '4KnFjek6'],
  ['side', 'UFPFBpM3'],

  // Commuting
  ['go', 'zJmzYCq4'], ['leave', 'eFteqxaN'], ['attend', '5mQ8OhYH'], ['come', 'vuUFQmtU'],
  ['drive', 'gMfP99E6'], ['deliver', 'XyuHOCE7'], ['live', 'qJdE7tt8'],
  ['work', 'NnUx8Dbd'], ['job', 'NnUx8Dbd'],
  ['eat', '8rGJGMDZ'], ['food', '8rGJGMDZ'], ['grocery', '8rGJGMDZ'],
  ['home', 'pTsAgz1J'], ['house', '5220dLxD'], ['store', 'rM2HjenP'], ['restaurant', 'EONScYUu'],
  ['school', '67PoDAvC'], ['dorm', 'IfpZtisl'], ['meet', 'BZYcwxf2'],
  ['need', 'J7ShFoHK'], ['should', 'J7ShFoHK'],
  ['far', 'WHdqP8C9'], ['distance', 'WHdqP8C9'], ['near', 'QT2WIuNG'], ['close', 'QT2WIuNG'],
  ['here', 'ZHrIoKQg'],
]);

function AslologySign({ word }: { word: string }) {
  const id = aslologyMedia.get(word.toLowerCase());
  return (
    <div className="signed-word">
      <div className="sign-visual sign-player sign-gif-style" aria-label={`Animated ASL sign for ${word}`}>
        <iframe
          title={`ASL sign for ${word}`}
          src={`https://videopress.com/embed/${id}?autoPlay=1&loop=1&muted=1&controls=0&playsinline=1`}
          style={{ width: '100%', aspectRatio: '16 / 9', border: 0 }}
          allow="autoplay; fullscreen"
          loading="lazy"
        />
      </div>
      <div className="sign-credit" style={{ fontSize: '0.7rem', opacity: 0.75 }}>
        Sign video by Garrett Bose of{' '}
        <a href="https://aslology.com" target="_blank" rel="noopener noreferrer">ASLology</a>
      </div>
      <span>{word}</span>
    </div>
  );
}

function AslologyClip({ word }: { word: string }) {
  const id = aslologyMedia.get(word.toLowerCase());
  const [ready, setReady] = useState(false);
  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <div style={{ width: '100%', aspectRatio: '16 / 9', borderRadius: 16, overflow: 'hidden', background: 'rgba(0,0,0,0.04)' }}>
        <iframe
          title={'ASL sign for ' + word}
          src={'https://videopress.com/embed/' + id + '?autoPlay=1&loop=1&muted=1&controls=0&playsinline=1'}
          onLoad={() => setReady(true)}
          style={{ width: '100%', height: '100%', border: 0, opacity: ready ? 1 : 0, transition: 'opacity 0.4s', transform: 'scale(1.3)', transformOrigin: 'center', pointerEvents: 'none' }}
          allow="autoplay; fullscreen"
        />
      </div>
      <div style={{ fontSize: '0.7rem', opacity: 0.75, marginTop: 6 }}>
        Sign video by Garrett Bose of{' '}
        <a href="https://aslology.com" target="_blank" rel="noopener noreferrer">ASLology</a>
      </div>
      <div style={{ fontSize: '1.1rem', marginTop: 4 }}>{word}</div>
    </div>
  );
}

function SentencePlayer({
  tokens,
  mediaByWord,
}: {
  tokens: string[];
  mediaByWord: Map<string, { url: string; type: 'video' | 'gif' }>;
}) {
  const [active, setActive] = useState(0);
  const [playerKey, setPlayerKey] = useState(0);

  const sentenceKey = tokens.join(' ');

  useEffect(() => {
    setActive(0);
    setPlayerKey((key) => key + 1);
  }, [sentenceKey]);

  useEffect(() => {
    if (tokens.length < 2) return;

    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % tokens.length);
      setPlayerKey((key) => key + 1);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [active, sentenceKey]);

  if (!tokens.length) return null;

  const token = tokens[active] ?? tokens[0];
  const lower = token.toLowerCase();

  const aslologyId = aslologyMedia.get(lower);
  const local = mediaByWord.get(lower);

  return (
    <div>
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          borderRadius: 16,
          overflow: 'hidden',
          background: 'rgba(0,0,0,0.04)',
        }}
      >
        {aslologyId ? (
          <iframe
            key={playerKey}
            title={`ASL sign for ${token}`}
            src={`https://videopress.com/embed/${aslologyId}?autoPlay=1&loop=1&muted=1&controls=0&playsinline=1`}
            style={{
              width: '100%',
              height: '100%',
              border: 0,
              transform: 'scale(1.3)',
              transformOrigin: 'center',
            }}
            allow="autoplay; fullscreen"
          />
        ) : (
          <SignedWord
            key={`${playerKey}-${token}`}
            word={token}
            mediaUrl={local?.url}
            mediaType={local?.type}
          />
        )}
      </div>

      {aslologyId && (
        <div
          style={{
            fontSize: '0.7rem',
            opacity: 0.75,
            textAlign: 'center',
            marginTop: 6,
          }}
        >
          Sign video by Garrett Bose of{' '}
          <a
            href="https://aslology.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            ASLology
          </a>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: 8,
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: 12,
        }}
      >
        {tokens.map((t, i) => (
          <button
            key={`${t}-${i}`}
            type="button"
            onClick={() => {
              setActive(i);
              setPlayerKey((key) => key + 1);
            }}
            style={{
              fontWeight: i === active ? 700 : 400,
              opacity: i === active ? 1 : 0.6,
              background: 'none',
              border: 0,
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

function LookupPage({ words }: { words: Word[] }) {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const translation = useMemo(() => translateToASLGloss(submitted), [submitted]);
  const mediaByWord = useMemo(() => new Map(Object.entries(safeSignMedia)), []);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(query); };
const visibleTokens = translation.tokens.filter((token) => mediaByWord.has(token.toLowerCase()) || aslologyMedia.has(token.toLowerCase()));  return (
    <>
      <PageIntro eyebrow="English → ASL visual translator" title="Type a sentence and watch the signs." copy="The translator creates an ASL-style gloss and opens a visual sign for each word. For words with a local licensed clip, the clip plays here; other words use a visual dictionary page." />
      <main className="page-wrap page-content">
        <form className="translator-form translator-form-large" onSubmit={submit} role="search">
          <Search size={22} aria-hidden="true" />
          <label htmlFor="word-search" className="sr-only">Enter English text</label>
          <textarea id="word-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Type a sentence… e.g. I love apples and broccoli." rows={4} />
          <button type="submit" className="button-primary">Show signs <ArrowRight size={17} /></button>
        </form>
        {submitted ? <section className="translator-result translator-sentence-result">
          <div><div className="section-kicker">ASL-style gloss</div><h2>{translation.gloss || 'No words to show'}</h2><p className="result-note">ASL has its own grammar, so this is a learning aid rather than a perfect automatic translation.</p></div>
          <div style={{ maxWidth: 460, margin: '0 auto' }}><SentencePlayer tokens={visibleTokens} mediaByWord={mediaByWord} /></div><div className="translated-word-grid">{([] as string[]).map((token, index) => { if (aslologyMedia.has(token.toLowerCase())) return <AslologySign key={token + '-' + index} word={token} />; const local = mediaByWord.get(token.toLowerCase());return <SignedWord key={`${token}-${index}`} word={token} compact mediaUrl={local?.url} mediaType={local?.type} />; })}</div>
          {!visibleTokens.length && <p className="result-note">No verified visual sign is available for the entered words yet.</p>}
        </section> : <div className="search-welcome"><div className="translator-welcome-art">ASL</div><div><h2>What do you want to say?</h2><p>Type any English sentence and the page will turn it into a visual word-by-word learning sequence.</p></div></div>}
      </main>
    </>
  );
}

const alphabetImageUrl = (letter: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/Sign_language_${letter.toUpperCase()}.svg`;

// Public-domain photographic ASL alphabet from Wikimedia Commons (Cwterp).
// It is arranged A–Y in five columns across five rows, with Z on the final row.
const startAslAlphabetImage = 'https://www.startasl.com/wp-content/uploads/sign-language-alphabet.png';

// These crop boxes are taken from the same Start ASL alphabet artwork used in the
// original Replit reference. The SVG viewBox shows only the photographed hand,
// leaving the printed letter/copyright text outside the crop.
const startAslHandCrops: Record<string, [number, number, number, number]> = {
  A: [55, 78, 86, 118], B: [205, 68, 92, 130], C: [360, 78, 94, 120], D: [508, 72, 78, 130], E: [628, 78, 82, 120],
  F: [55, 245, 92, 125], G: [205, 250, 105, 102], H: [360, 250, 112, 105], I: [508, 242, 82, 115], J: [620, 238, 92, 122],
  K: [55, 408, 92, 110], L: [205, 415, 100, 104], M: [360, 415, 92, 112], N: [505, 418, 86, 105], O: [625, 412, 92, 125],
  P: [55, 555, 92, 112], Q: [205, 562, 92, 105], R: [350, 535, 105, 135], S: [500, 558, 84, 104], T: [625, 558, 84, 104],
  U: [55, 704, 88, 112], V: [205, 700, 92, 115], W: [360, 698, 100, 118], X: [505, 700, 92, 112], Y: [620, 700, 95, 118],
  Z: [55, 858, 96, 100],
};

function StartAslHand({ letter }: { letter: string }) {
  const [x, y, width, height] = startAslHandCrops[letter.toUpperCase()] ?? startAslHandCrops.A;
  return (
    <svg className="startasl-hand-crop" viewBox={`${x} ${y} ${width} ${height}`} role="img" aria-label={`ASL fingerspelling handshape for ${letter}`}>
      <image href={startAslAlphabetImage} x="0" y="0" width="773" height="1000" preserveAspectRatio="none" />
    </svg>
  );
}

function ReferencePage({ alphabet }: { alphabet: Letter[] }) {
  // Keep the original Replit picture-book layout: handshape on the left,
  // animated sign example on the right, and the A → Word label underneath.
  // Only reusable/verified Signbank clips are used here.
  // Same visual-video source family as the original Replit alphabet cards.
  // The handshape artwork is the Start ASL alphabet image; the word examples
  // use the matching legacy Start ASL video filenames where available.
  const safeExamples: Record<string, string> = {
    A: 'https://assets-videos-legacy.startasl.com/videos/apple-2.mp4',
    B: 'https://assets-videos-legacy.startasl.com/videos/book.mp4',
    C: 'https://assets-videos-legacy.startasl.com/videos/church.mp4',
    D: 'https://assets-videos-legacy.startasl.com/videos/dance.mp4',
    E: 'https://assets-videos-legacy.startasl.com/videos/early.mp4',
    F: 'https://assets-videos-legacy.startasl.com/videos/flower.mp4',
    G: 'https://assets-videos-legacy.startasl.com/videos/gardening.mp4',
    H: 'https://assets-videos-legacy.startasl.com/videos/hello.mp4',
    I: 'https://assets-videos-legacy.startasl.com/videos/ime.mp4',
    J: 'https://assets-videos-legacy.startasl.com/videos/jacket.mp4',
    K: 'https://assets-videos.startasl.com/videos-new/kitchen.mp4',
    L: 'https://assets-videos-legacy.startasl.com/videos/learn.mp4',
    M: 'https://assets-videos-legacy.startasl.com/videos/married.mp4',
    N: 'https://assets-videos-legacy.startasl.com/videos/nice.mp4',
    O: 'https://assets-videos-legacy.startasl.com/videos/open.mp4',
    P: 'https://assets-videos-legacy.startasl.com/videos/play.mp4',
    Q: 'https://assets-videos-legacy.startasl.com/videos/quiet.mp4',
    R: 'https://media.signbsl.com/videos/asl/aslsignbank/mp4/RAINBOW-745.mp4',
    S: 'https://assets-videos-legacy.startasl.com/videos/school.mp4',
    T: 'https://assets-videos-legacy.startasl.com/videos/table.mp4',
    U: 'https://assets-videos-legacy.startasl.com/videos/university.mp4',
    V: 'https://assets-videos-legacy.startasl.com/videos/vacation.mp4',
    W: 'https://assets-videos-legacy.startasl.com/videos/wait.mp4',
    X: 'https://assets-videos-legacy.startasl.com/videos/excited.mp4',
    Y: 'https://assets-videos-legacy.startasl.com/videos/you.mp4',
    Z: 'https://upload.wikimedia.org/wikipedia/commons/4/49/ASL_O%40Side-PalmForward.jpg',
  };

  const visibleAlphabet = alphabet.filter((item) => Boolean(safeExamples[item.letter]));

  return (
    <main className="alphabet-reference-page">
      <div className="page-wrap alphabet-reference-wrap">
        <div className="alphabet-book alphabet-replit-grid">
          {visibleAlphabet.map((item) => (
            <article className="alphabet-card alphabet-replit-card" key={item.letter}>
              <div className="alphabet-sticker"><span>{item.letter}</span><small>fingerspell</small></div>
              <div className="alphabet-pair alphabet-replit-pair">
                <div className="alphabet-panel alphabet-hand-panel">
                  <div className="alphabet-hand-image">
                    <StartAslHand letter={item.letter} />
                  </div>
                  <span className="visual-caption">LETTER {item.letter}</span>
                </div>
                <div className="alphabet-panel alphabet-example-panel">
                  <SignVisual
                    label={item.word}
                    kind={signKindForWord(item.word)}
                    mediaUrl={safeExamples[item.letter]}
                    mediaType={item.letter === 'Z' ? 'image' : 'video'}
                    fallback={<StartAslHand letter={item.letter} />}
                  />
                  <span className="visual-caption">{item.word.toUpperCase()}</span>
                </div>
              </div>
              <h3>{item.letter} → {item.word}</h3>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

const numberImageUrl = (number: number) => `https://commons.wikimedia.org/wiki/Special:FilePath/LSQ_${number}.jpg`;

function NumberVisual({ number }: { number: number }) {
  const direct = number <= 23 || number % 10 === 0;
  if (direct) return <img src={numberImageUrl(number)} alt={`ASL sign for number ${number}`} loading="lazy" />;
  const tens = Math.floor(number / 10) * 10;
  const ones = number % 10;
  return <div className="number-composed-sign"><img src={numberImageUrl(tens)} alt={`ASL sign for ${tens}`} loading="lazy" /><span>+</span><img src={numberImageUrl(ones)} alt={`ASL sign for ${ones}`} loading="lazy" /></div>;
}

function NumbersPage() {
  const numbers = Array.from({ length: 100 }, (_, index) => index + 1);
  return (
    <>
      <PageIntro eyebrow="Number practice" title="Every number gets a hand sign." copy="Numbers 1–100 now have their own page. The sign image is shown directly on every card; compound numbers use their visual parts." />
      <main className="page-wrap page-content">
        <div className="numbers-grid visual-numbers-grid">{numbers.map((number) => <article className="number-card visual-number-card" key={number}><div className="number-sign-image"><NumberVisual number={number} /></div><strong>{number}</strong></article>)}</div>
      </main>
    </>
  );
}

function FruitsPage({ fruits }: { fruits: Produce[] }) {
  // Food clips use the current Start ASL video collection for the produce
  // cards that were blank with the older Signbank URLs. The older Signbank
  // clips remain as fallbacks for entries we already had working.
  const foodMedia: Record<string, string> = {
    apple: 'https://assets-videos.startasl.com/videos-new/apple.mp4',
    banana: 'https://assets-videos.startasl.com/videos-new/banana.mp4',
    carrot: 'https://assets-videos.startasl.com/videos-new/carrot.mp4',
    cherry: 'https://assets-videos.startasl.com/videos-new/cherry.mp4',
    tomato: 'https://assets-videos.startasl.com/videos-new/tomato.mp4',
    corn: safeSignMedia.corn.url,
    broccoli: safeSignMedia.broccoli.url,
    potato: 'https://assets-videos.startasl.com/videos-new/potato.mp4',
    onion: 'https://assets-videos.startasl.com/videos-new/onion.mp4',
    garlic: 'https://assets-videos.startasl.com/videos-new/garlic.mp4',
    lettuce: 'https://assets-videos.startasl.com/videos-new/lettuce.mp4',
    cucumber: 'https://assets-videos.startasl.com/videos-new/cucumber.mp4',
    spinach: 'https://assets-videos.startasl.com/videos-new/spinach.mp4',
    pepper: 'https://assets-videos.startasl.com/videos-new/pepper.mp4',
    peas: 'https://assets-videos.startasl.com/videos-new/peas.mp4',
    pumpkin: 'https://assets-videos.startasl.com/videos-new/pumpkin.mp4',
    'sweet-potato': 'https://assets-videos.startasl.com/videos-new/sweet-potato.mp4',
    zucchini: 'https://assets-videos.startasl.com/videos-new/zucchini.mp4',
    mushroom: 'https://assets-videos.startasl.com/videos-new/mushroom.mp4',
    cauliflower: 'https://assets-videos.startasl.com/videos-new/cauliflower.mp4',
    bean: 'https://assets-videos.startasl.com/videos-new/bean.mp4',
  };
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const visible = fruits.filter((item) => Boolean(foodMedia[item.id]) && !failed[item.id]);

  return (
    <>
      <PageIntro eyebrow="Food garden" title="Food: fruits & vegetables." copy="See the animated ASL sign first. Clips are embedded without controls so they behave like GIFs, while staying video files rather than making new copies of other sites' media.">
        <div className="intro-badge"><Carrot size={16} /> Visual food shelf</div>
      </PageIntro>
      <main className="page-wrap page-content">
        <div className="produce-grid">
          {visible.map((item) => {
            const media = foodMedia[item.id];
            return (
              <article className="produce-card" key={item.id}>
                <div className="food-sign-frame">
                  <SignVisual
                    label={item.word}
                    kind={item.id}
                    mediaUrl={media}
                    mediaType="video"
                    large
                    onMediaError={() => setFailed((current) => ({ ...current, [item.id]: true }))}
                  />
                </div>
                <div><span>{item.type}</span><h2>{item.word}</h2></div>
              </article>
            );
          })}
        </div>
      </main>
    </>
  );
}

function StoryIllustration({ theme }: { theme: string }) {
  return <div className={`story-illustration story-illustration-${theme}`} aria-label="Playful story illustration" role="img"><Dog size={66} /><Sun size={44} /><House size={42} /></div>;
}

function StoryWord({ word }: { word: string }) {
  const letters = word.toUpperCase().replace(/[^A-Z]/g, '').split('');
  return <div className="story-spelled-word"><div className="story-letter-strip">{letters.map((letter, index) => <img key={`${letter}-${index}`} src={alphabetImageUrl(letter)} alt={`${letter} in ASL fingerspelling`} loading="lazy" />)}</div><strong>{word}</strong></div>;
}

function StoryLine({ text }: { text: string }) {
  const tokens = text.match(/[A-Za-z]+(?:'[A-Za-z]+)?|[0-9]+|[.,!?]/g) ?? [];
  return <div className="story-word-line">{tokens.filter((token) => !/^[.,!?]$/.test(token)).map((token, index) => <StoryWord word={token} key={`${token}-${index}`} />)}</div>;
}

function StoriesPage({ stories }: { stories: Story[] }) {
  const [storyIndex, setStoryIndex] = useState(0);
  const story = stories[storyIndex];
  if (!story) return null;
  return (
    <>
      <PageIntro eyebrow="Storybook garden" title="Read it, spell it, sign it." copy="Read the simple English story. Above every word, each letter is shown with its ASL fingerspelling handshape." />
      <main className="page-wrap page-content">
        <div className="story-picker" aria-label="Choose a story">{stories.map((item, index) => <button type="button" className={index === storyIndex ? 'active' : ''} onClick={() => setStoryIndex(index)} key={item.id}>{item.title}</button>)}</div>
        <section className={`storybook storybook-${story.theme}`}>
          <div className="storybook-header"><span>Complete story</span><strong>{story.title}</strong></div>
          <StoryIllustration theme={story.theme} />
          <div className="storybook-copy"><h2>{story.title}</h2><p>{story.subtitle}</p><div className="story-full-text">{story.pages.map((page, index) => <section key={`${page.label}-${index}`}><span className="story-page-label">{page.label}</span><StoryLine text={page.sentence} /></section>)}</div></div>
          <div className="storybook-controls"><Link href="/lookup" className="text-button">Try the visual translator →</Link></div>
        </section>
      </main>
    </>
  );
}

function FAQPage({ faq }: { faq: FAQ[] }) {
  const questions = [
    { id: 'who', question: 'Who can learn ASL?', words: ['Who', 'can', 'learn', 'ASL'], answer: 'Anyone can begin learning ASL. Deaf people, hearing people, families, students, teachers, and interpreters all learn in different ways and at different speeds.' },
    { id: 'what', question: 'What does this sign mean?', words: ['What', 'does', 'this', 'sign', 'mean'], answer: 'Use the dictionary or source links to compare signs and meanings. A single English word can have more than one ASL sign depending on meaning and context.' },
    { id: 'when', question: 'When should I use a WH-question?', words: ['When', 'use', 'WH-question'], answer: 'WH-questions ask for information such as a person, thing, time, place, reason, or method. In ASL, the question word is commonly placed toward the end and paired with the appropriate facial grammar.' },
    { id: 'where', question: 'Where is the sign used?', words: ['Where', 'sign', 'use'], answer: 'ASL is used primarily in the United States and parts of Canada, but sign languages are not universal. Regional variation can exist within ASL too.' },
    { id: 'why', question: 'Why can one English word have different signs?', words: ['Why', 'one', 'English', 'word', 'different', 'sign'], answer: 'Meaning and context matter. English words can be polysemous, and ASL can distinguish those meanings with different signs or constructions.' },
    { id: 'how', question: 'How do I practice a new sign?', words: ['How', 'practice', 'new', 'sign'], answer: 'Watch a reliable signer, notice handshape, movement, location and non-manual markers, then practice in a short sentence. For important communication, learn with fluent Deaf signers or qualified teachers.' },
    { id: 'which', question: 'Which sign should I choose?', words: ['Which', 'sign', 'choose'], answer: 'Choose the sign that matches the meaning and context. When several variants exist, compare examples from more than one reputable ASL source.' },
  ];
  return (
    <>
      <PageIntro eyebrow="WH-questions for curious hands" title="Who, what, when, where, why, how, which." copy="These are real ASL-learning questions—not a quiz about what ASL stands for. Each question has a sign row above it so you can study the WH-word first." />
      <main className="page-wrap page-content faq-page">
        {questions.map((item) => <article className="faq-card wh-question-card" key={item.id}><MessageCircleQuestion size={32} aria-hidden="true" /><SignedWordRow words={item.words} compact /><h2>{item.question}</h2><p>{item.answer}</p></article>)}
      </main>
    </>
  );
}

function LoadingState() {
  return <div className="page-wrap status-box" role="status"><div className="skeleton" /><div className="skeleton wide" /><span className="sr-only">Growing your lesson garden</span></div>;
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return <div className="page-wrap status-box" role="alert"><strong>That patch needs a little water.</strong><p>We could not open the garden content right now.</p><button type="button" className="button-primary" onClick={onRetry}>Try again</button></div>;
}


function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="About ASL Garden"
        title="A small garden for learning ASL."
        copy="ASL Garden is a free educational project designed to make American Sign Language learning visual, approachable, and enjoyable."
      />

      <main className="page-wrap page-content info-page">
        <article className="info-card">
          <div className="section-kicker">Why ASL Garden exists</div>

          <h2>Learning ASL is more than memorizing an English word.</h2>

          <p>
            ASL Garden was created to give learners a visual way to explore
            and practice American Sign Language.
          </p>

          <p>
            Instead of relying only on written definitions, the site brings
            together signs, movement, examples, games, stories, and
            interactive activities so learners can practice in different ways.
          </p>

          <p>
            The goal is simple: make learning ASL feel more visual, friendly,
            and fun.
          </p>
        </article>

        <div className="info-grid">
          <article className="info-card">
            <h3>What you can explore</h3>

            <p>
              ASL Garden brings several learning experiences together in one
              place.
            </p>

            <ul>
              <li>Alphabet and fingerspelling</li>
              <li>Numbers</li>
              <li>Food, fruits, and vegetables</li>
              <li>Visual ASL translation practice</li>
              <li>Interactive games</li>
              <li>Stories with signs</li>
              <li>ASL Garden Journal articles</li>
            </ul>
          </article>

          <article className="info-card">
            <h3>Learn by seeing</h3>

            <p>
              American Sign Language is a visual language. ASL Garden therefore
              focuses on seeing, practicing, and repeating signs rather than
              presenting vocabulary as text alone.
            </p>

            <p>
              The different sections of the site are designed to give learners
              more than one way to practice and revisit what they have learned.
            </p>
          </article>

          <article className="info-card">
            <h3>About the ASL videos</h3>

            <p>
              Many of the ASL videos in the Translator and in the Courses are
              provided by Garrett Bose of ASLology with permission.
            </p>

            <p>
              These videos are used as learning resources within the ASL Garden
              Translator and are credited to their creator.
            </p>

            <p>
              <a
                href="https://aslology.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit ASLology
              </a>
            </p>
          </article>

          <article className="info-card">
            <h3>ASL Garden Journal</h3>

            <p>
              The Journal is where ASL Garden can go beyond vocabulary.
            </p>

            <p>
              It can include original articles, explanations, fun facts,
              learning tips, quizzes, interesting ASL topics, and other
              educational material.
            </p>

            <p>
              The goal is to make learning informative without making it boring.
            </p>
          </article>

          <article className="info-card">
            <h3>Our approach</h3>

            <p>
              ASL Garden is designed as a learning aid for people who want to
              explore and practice ASL.
            </p>

            <p>
              The site combines visual learning with repetition, interaction,
              and simple explanations so learners can study at their own pace.
            </p>
          </article>

          <article className="info-card">
            <h3>Credits</h3>

            <p>
              ASL Garden's interface, learning activities, games, stories,
              lessons, and other original site material are part of the
              ASL Garden project.
            </p>

            <p>
              External media is identified and credited to its respective
              creator or source.
            </p>

            <p>
              <strong>
                ASL videos in the Translator and Courses: Garrett Bose of
                ASLology — used with permission.
              </strong>
            </p>

            <p>
              Some sign videos are courtesy of{' '}
              <a href="https://aslsignbank.com" target="_blank" rel="noopener noreferrer">ASL Signbank</a>{' '}
              (Hochgesang, Crasborn &amp; Lillo-Martin), used under{' '}
              <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a>.
            </p>
          </article>
        </div>
      </main>
    </>
  );
}

function PrivacyPage() {
  return (
    <>
      <PageIntro eyebrow="Privacy" title="Privacy at ASL Garden." copy="This page explains the kinds of information the site may process and the choices visitors have. It is written for the current educational site and should be updated if new services are added." />
      <main className="page-wrap page-content info-page">
        <article className="info-card">
          <div className="section-kicker">Last updated: September 24, 2026</div>
          <h2>What we collect</h2>
          <p>ASL Garden does not require an account to browse its lessons. The site may receive ordinary technical information from hosting, security, analytics, or advertising services when those services are enabled, such as an IP address, browser information, approximate region, pages requested, and timestamps.</p>
          <h3>Cookies and advertising</h3>
          <p>If Google AdSense or another advertising service is enabled, that service may use cookies or similar technologies to deliver, measure, and personalize advertising according to its policies and applicable law. Advertising and consent settings will be added before ads are served where required.</p>
          <h3>External media</h3>
          <p>Some learning media is loaded from third-party hosts. Those hosts may receive technical request information when your browser loads a resource. Their own privacy policies apply to those requests.</p>
          <h3>Children and learners</h3>
          <p>ASL Garden is an educational website and does not intentionally ask children to create accounts or submit personal information. Visitors should not enter sensitive personal information into forms or messages.</p>
          <h3>Your choices</h3>
          <p>You can disable cookies through your browser, use available consent controls, and avoid features that require optional services. Some site features may work differently when optional technologies are blocked.</p>
          <h3>Contact</h3>
          <p>For privacy questions or requests, use the <Link href="/contact" className="text-link">Contact page</Link> to email the site owner.</p>
        </article>
      </main>
    </>
  );
}

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  async function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError('');

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      formData.append('access_key', '0352233f-013a-4cfb-b76c-0e88d363d570');
      formData.append('subject', 'New message from ASL Garden');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.message || 'Submission failed');

      form.reset();
      setSubmitted(true);
    } catch {
      setError('Something went wrong while sending your message. Please try again in a moment.');
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <PageIntro
        eyebrow="Contact ASL Garden"
        title="Have a suggestion, question, or idea?"
        copy="I would love to hear from learners and visitors. Send a message with feedback, suggestions, corrections, accessibility issues, or anything you think could make ASL Garden better."
      >
        <div className="intro-badge"><MessageCircleQuestion size={16} /> Feedback is welcome</div>
      </PageIntro>
      <main className="page-wrap page-content info-page">
        <article className="info-card contact-card">
          <div className="section-kicker">Get in touch</div>
          <h2>Send a message.</h2>
          <p className="contact-intro">Fill out the form below and your message will be sent to the ASL Garden creator. You can use it for suggestions, corrections, questions, ideas, or feedback.</p>
          {submitted && (
            <div className="contact-success" role="status">
              <strong>Thank you for your message! 🌱</strong>
              <span>Your feedback has been sent successfully.</span>
            </div>
          )}
          <form name="contact" method="POST" onSubmit={handleContactSubmit} className="contact-form">
            <input type="checkbox" name="botcheck" tabIndex={-1} aria-hidden="true" style={{ display: 'none' }} />
            <p className="contact-honeypot" aria-hidden="true">
              <label>Do not fill this out: <input name="bot-field" tabIndex={-1} autoComplete="off" /></label>
            </p>
            <div className="contact-form-grid">
              <label className="contact-field">
                <span>First name</span>
                <input type="text" name="firstName" placeholder="Your first name" autoComplete="given-name" required />
              </label>
              <label className="contact-field">
                <span>Last name</span>
                <input type="text" name="lastName" placeholder="Your last name" autoComplete="family-name" required />
              </label>
            </div>
            <label className="contact-field">
              <span>Email address</span>
              <input type="email" name="email" placeholder="you@example.com" autoComplete="email" required />
            </label>
            <label className="contact-field">
              <span>What is your message about?</span>
              <select name="topic" defaultValue="Suggestion" required>
                <option>Suggestion</option>
                <option>Question</option>
                <option>Correction</option>
                <option>Accessibility feedback</option>
                <option>Technical problem</option>
                <option>Other</option>
              </select>
            </label>
            <label className="contact-field">
              <span>Message</span>
              <textarea name="message" rows={7} placeholder="Write your message here..." required />
            </label>
            {error && <div className="contact-error" role="alert">{error}</div>}
            <div className="contact-form-footer">
              <p className="contact-note">Please do not include passwords, payment information, or other sensitive personal information.</p>
              <button className="button-primary contact-submit" type="submit" disabled={sending}>
                <MessageCircleQuestion size={18} /> {sending ? 'Sending…' : 'Send message'}
              </button>
            </div>
          </form>
        </article>
      </main>
    </>
  );
}

function SourcesPage() {
  return (
    <>
      <PageIntro eyebrow="Sources & media" title="Know where the learning visuals come from." copy="ASL Garden combines original explanations and interface work with selected third-party reference media. This page makes that distinction visible to learners and reviewers." />
      <main className="page-wrap page-content info-page">
        <div className="info-grid">
          <article className="info-card"><h2>ASL Signbank</h2><p>Some sign videos are sourced from ASL Signbank. The project publishes conditions for reuse under a CC BY-NC-SA 4.0 license and requests attribution and a direct link to the video when reused.</p><a className="text-link" href="https://aslsignbank.haskins.yale.edu/about/conditions/" target="_blank" rel="noreferrer">Read ASL Signbank conditions →</a></article>
          <article className="info-card"><h2>Start ASL</h2><p>Some alphabet artwork and reference videos come from Start ASL. Start ASL's published terms should be checked before redistributing or republishing its copyrighted material. ASL Garden links to externally hosted resources rather than presenting them as original work.</p><a className="text-link" href="https://www.startasl.com/terms-and-policies/" target="_blank" rel="noreferrer">Read Start ASL terms →</a></article>
          <article className="info-card"><h2>Learning guidance</h2><p>The explanations and organization of lessons on ASL Garden are original project content. Visual references are supplementary; learners should compare reputable sources and seek guidance from fluent Deaf signers or qualified instructors for nuanced language use.</p></article>
        </div>
        <div className="info-card source-warning"><strong>Important:</strong> Third-party media is subject to its own copyright and license terms. If a media owner asks ASL Garden to remove or change a resource, the project should comply promptly.</div>
      </main>
    </>
  );
}

function AccessibilityPage() {
  return (
    <>
      <PageIntro eyebrow="Accessibility" title="Built to be easier to use." copy="ASL Garden aims to support keyboard users, mobile learners, people who prefer reduced motion, and learners who need text around visual material." />
      <main className="page-wrap page-content info-page">
        <article className="info-card">
          <h2>Current accessibility practices</h2>
          <ul className="info-list"><li>Keyboard-focus indicators are visible on interactive controls.</li><li>Navigation has labels and a mobile menu.</li><li>Learning videos are muted and do not depend on audio.</li><li>Images and sign visuals include descriptive alternative text where practical.</li><li>The site respects the browser's reduced-motion preference.</li><li>Content remains available as text alongside visual examples whenever the lesson requires it.</li></ul>
          <h3>Need help?</h3><p>If a page or learning activity is difficult to access, the site owner can use that feedback to improve the experience.</p>
        </article>
      </main>
    </>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="page-wrap">
        <p>© 2026 ASL Garden. All rights reserved. <Link href="/about">Credits</Link></p>
      </div>
    </footer>
  );
}

function Router({ data }: { data: ReturnType<typeof useGardenData> }) {
  return (
    <ErrorBoundary resetKey={useLocation()[0]}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/courses" component={CoursesPage} />
        <Route path="/situations" component={SituationsPage} />
        <Route path="/word-banks" component={WordBanksPage} />
        <Route path="/lesson/:id">{(params) => <LessonPage id={params.id} />}</Route>
        <Route path="/journal" component={JournalPage} />
        <Route path="/journal/:id">{(params) => <JournalArticlePage id={params.id} />}</Route>
        <Route path="/conversation">{() => <ConversationPage conversations={data.conversations} />}</Route>
        <Route path="/games">{() => <GamesPage words={data.words} />}</Route>
        <Route path="/lookup">{() => <LookupPage words={data.words} />}</Route>
        <Route path="/reference">{() => <ReferencePage alphabet={data.alphabet} />}</Route>
        <Route path="/numbers" component={NumbersPage} />
        <Route path="/fruits-vegetables">{() => <FruitsPage fruits={data.fruits} />}</Route>
        <Route path="/stories">{() => <StoriesPage stories={data.stories} />}</Route>
        <Route path="/about" component={AboutPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/sources" component={SourcesPage} />
        <Route path="/accessibility" component={AccessibilityPage} />
        <Route component={NotFound} />
      </Switch>
    </ErrorBoundary>
  );
}

function App() {
  const data = useGardenData();
  const [attempt, setAttempt] = useState(0);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <div className="app-shell"><Header /><main>{data.status === 'loading' ? <div className="status-region"><LoadingState /></div> : data.status === 'error' ? <div className="status-region"><ErrorState onRetry={() => setAttempt((value) => value + 1)} /></div> : <Router key={attempt} data={data} />}</main><Footer /></div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
