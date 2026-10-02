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
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const links = [
    { href: '/games', label: 'Games' },
    { href: '/lookup', label: 'Translator' },
    { href: '/courses', label: 'Courses' },
    { href: '/stories', label: 'Stories' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <nav className={`main-nav ${open ? 'open' : ''}`} aria-label="Main navigation">
          {links.map((link) => (
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
            <Link href="/fruits-vegetables" className="path-card path-card-green"><Carrot size={30} /><span>Fresh from the garden</span><h3>Fruits & vegetables</h3><p>Practice signs for favorite foods with a visual-first guide.</p><ArrowRight className="path-arrow" /></Link>
            
          </div>
        </div>
      </section>
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

          <Link href="/fruits-vegetables" className="path-card path-card-green">
            <Carrot size={30} />
            <span>Course 03</span>
            <h3>Food</h3>
            <p>Explore food, fruit, and vegetable signs with visual practice.</p>
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

function LookupPage({ words }: { words: Word[] }) {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const translation = useMemo(() => translateToASLGloss(submitted), [submitted]);
  const mediaByWord = useMemo(() => new Map(Object.entries(safeSignMedia)), []);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(query); };
  const visibleTokens = translation.tokens.filter((token) => mediaByWord.has(token.toLowerCase()));
  return (
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
          <div className="translated-word-grid">{visibleTokens.map((token, index) => { const local = mediaByWord.get(token.toLowerCase()); return <SignedWord key={`${token}-${index}`} word={token} compact mediaUrl={local?.url} mediaType={local?.type} />; })}</div>
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
        copy="ASL Garden is an independent learning project designed to make early American Sign Language practice visual, approachable, and easy to revisit."
      >
        <div className="intro-badge"><Leaf size={16} /> Learn by seeing and practicing</div>
      </PageIntro>
      <main className="page-wrap page-content info-page">
        <article className="info-card">
          <div className="section-kicker">Why it exists</div>
          <h2>Learning a sign is more than memorizing an English word.</h2>
          <p>ASL Garden puts handshape, movement, examples, and short explanations together so learners can notice patterns instead of relying on a text-only dictionary. The site is intended for practice and orientation, not as a substitute for instruction from fluent Deaf signers or qualified ASL teachers.</p>
        </article>
        <div className="info-grid">
          <article className="info-card"><h3>What you can practice</h3><p>Use the alphabet for fingerspelling, numbers for visual repetition, the translator for vocabulary prompts, games for recall, food cards for themed vocabulary, conversations for short exchanges, and stories for repeated reading practice.</p></article>
          <article className="info-card"><h3>How to use the visuals</h3><p>Watch the signer, identify the handshape and movement, pause and imitate, then use the sign in a short phrase. When a word has variants, compare context and reputable sources rather than assuming one English word always maps to one sign.</p></article>
        <article className="info-card">
  <h3>About the media</h3>
  <p>
    ASL Garden uses visual ASL examples to make learning more accessible
    and easier to understand.
  </p>
  <p>
    ASL sign videos used in the Translator are provided by Garrett Bose
    of ASLology with permission.
  </p>
  <p>
    <a
      href="https://asllology.com/"
      target="_blank"
      rel="noreferrer"
    >
      Visit ASLology
    </a>
  </p>
</article>
          <article className="info-card"><h3>Accessibility</h3><p>The interface supports keyboard focus, descriptive labels, reduced-motion preferences, responsive layouts, and text alternatives for learning visuals where practical. If a feature is difficult to use, the project can be improved through user feedback.</p></article>
        </div>
        <div className="info-links"><Link href="/sources" className="button-primary"><FileText size={17}/> View sources & media notes</Link><Link href="/privacy" className="button-ghost info-ghost">Read the privacy policy</Link></div>
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
        <p>© 2026 ASL Garden. All rights reserved.</p>
        <p>
          Some sign videos courtesy of{" "}
          <a href="https://aslsignbank.com" target="_blank" rel="noopener noreferrer">ASL Signbank</a>{" "}
          (Hochgesang, Crasborn &amp; Lillo-Martin), used under{" "}
          <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a>.
        </p>
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
