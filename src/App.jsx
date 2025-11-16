import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Stable, working build — JS-only version:
 * - Removed all TypeScript syntax (: any, <Type>, as const, type ...).
 * - Kept your layout, pages, logic, and behaviour exactly the same.
 * - Motion is mocked via simple wrappers so it works without framer-motion.
 */

// ------- tiny motion-less wrappers (safe everywhere) -------
const omitMotion = (p) => {
  if (!p || typeof p !== "object") return p;
  const { variants, initial, animate, exit, transition, layout, ...rest } = p;
  return rest;
};

const motion = {
  div: (props) => <div {...omitMotion(props)} />,
  span: (props) => <span {...omitMotion(props)} />,
  button: (props) => <button {...omitMotion(props)} />,
};

const AnimatePresence = ({ children }) => <>{children}</>;
const pageVariant = {}; // kept for safety if referenced later

// -------------------- Routing Keys --------------------
export const PAGES = {
  HOME: "home",
  LETTER: "letter",
  GALLERY: "gallery",
  REASONS: "reasons",
  BUCKET: "bucket",
  SCRATCH: "scratch",
  CERT: "cert",
  WISHES: "wishes",
};

// -------------------- Style helpers --------------------
const cx = (...xs) => xs.filter(Boolean).join(" ");

const appGradient =
  "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-100 via-pink-50 to-rose-200";
const glass =
  "border border-rose-200/60 bg-white/80 backdrop-blur-xl shadow rounded-3xl";

function Button({ className, variant = "default", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition active:scale-[0.99] disabled:opacity-60";
  const variants = {
    default: "bg-rose-500 text-white hover:bg-rose-600",
    secondary: "bg-rose-100 text-rose-700 hover:bg-rose-200",
    outline: "border border-rose-300 text-rose-700 hover:bg-rose-50",
    ghost: "text-rose-700 hover:bg-rose-50",
  };
  return (
    <button className={cx(base, variants[variant], className)} {...props} />
  );
}

function Card({ className, ...rest }) {
  return <div className={cx(glass, className)} {...rest} />;
}

const CardHeader = (p) => (
  <div {...p} className={cx("px-6 pt-6", p.className)} />
);

const CardContent = (p) => (
  <div {...p} className={cx("px-6 pb-6", p.className)} />
);

const CardTitle = ({ className, children, ...p }) => (
  <h2
    {...p}
    className={cx("text-2xl font-semibold text-rose-700", className)}
  >
    {children}
  </h2>
);

const Input = (p) => (
  <input
    {...p}
    className={cx(
      "w-full rounded-2xl border border-rose-300/70 bg-white/80 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-300",
      p.className
    )}
  />
);

const Textarea = (p) => (
  <textarea
    {...p}
    className={cx(
      "w-full rounded-xl border-2 border-rose-200 bg-white/80 px-4 py-2.5 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 transition-all resize-none",
      p.className
    )}
  />
);

// -------------------- Background sparkles --------------------
function SparkleBg() {
  const dots = useMemo(() => Array.from({ length: 50 }).map((_, i) => i), []);
  const floaters = useMemo(
    () => Array.from({ length: 18 }).map((_, i) => i),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((i) => (
        <span
          key={`d-${i}`}
          className="absolute rounded-full bg-rose-200/30"
          style={{
            width: 3,
            height: 3,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.5,
          }}
        />
      ))}

      {floaters.map((i) => (
        <motion.span
          key={`m-${i}`}
          className="absolute rounded-full bg-pink-200/50"
          style={{
            width: 4,
            height: 4,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
}

// -------------------- Mini confetti --------------------
function useMiniConfetti() {
  const [shots, setShots] = useState(0);
  const fire = () => setShots((s) => s + 1);
  return { shots, fire };
}

function ConfettiLayer({ shots }) {
  const [burst, setBurst] = useState([]);

  useEffect(() => {
    if (shots <= 0) return;
    const items = Array.from({ length: 14 }).map((_, idx) => ({
      id: `${shots}-${idx}`,
      x: Math.random() * 100,
    }));
    setBurst(items);
    const t = setTimeout(() => setBurst([]), 1200);
    return () => clearTimeout(t);
  }, [shots]);

  return (
    <div className="pointer-events-none absolute inset-0">
      {burst.map((b) => (
        <motion.div
          key={b.id}
          className="absolute text-xl"
          style={{ left: `${b.x}%`, top: "50%" }}
        >
          {Math.random() > 0.5 ? "✨" : "💖"}
        </motion.div>
      ))}
    </div>
  );
}

// -------------------- Gate Modal --------------------
function AnswerGate({ open, onSubmit, onClose }) {
  const [ans, setAns] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) {
      setShow(false);
      const id = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(id);
    } else {
      setAns("");
    }
  }, [open]);

  if (!open) return null;

  const submit = () => {
    const v = ans.trim();
    if (!v) return;
    onSubmit(v);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-rose-300/40 backdrop-blur-sm grid place-items-center p-6"
        onClick={onClose}
      >
        <motion.div
          className={cx(
            `max-w-lg w-full rounded-3xl ring-1 ring-rose-200/60 shadow-2xl ${glass} relative overflow-hidden transform-gpu transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]`,
            show
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-1"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pointer-events-none absolute -top-2 left-6 text-2xl">
            ✨
          </div>
          <div className="pointer-events-none absolute -bottom-3 right-6 text-2xl">
            🌟
          </div>
          <div className="px-6 pt-6 pb-4 text-center">
            <div className="text-2xl">💖</div>
            <h3 className="mt-2 text-lg sm:text-xl text-rose-800 font-semibold">
              Kaivalya tara mate kon che? (answer in one word)
            </h3>
            <div className="mt-4 flex gap-2">
              <Input
                autoFocus
                value={ans}
                onChange={(e) => setAns(e.target.value)}
                placeholder="e.g. jaan, prince, hero…"
                className="rounded-full border-rose-300 px-4 py-3"
              />
              <Button onClick={submit} className="rounded-full px-5 py-3">
                Continue
              </Button>
            </div>
            <Button variant="ghost" className="mt-3" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// -------------------- Bottom Nav --------------------
function Nav({ page, setPage }) {
  const items = [
    { id: PAGES.HOME, icon: "🏠", label: "Home" },
    { id: PAGES.LETTER, icon: "💌", label: "Open Letter" },
    { id: PAGES.GALLERY, icon: "📷", label: "My glowing Maharani" },
    { id: PAGES.REASONS, icon: "💖", label: "19 Reasons" },
    { id: PAGES.BUCKET, icon: "📝", label: "Bucket List" },
    { id: PAGES.SCRATCH, icon: "🎁", label: "Scratch Cards" },
    { id: PAGES.CERT, icon: "📜", label: "Certificate" },
    { id: PAGES.WISHES, icon: "🎉", label: "Make a wish" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-5xl">
      <div className="rounded-[28px] border-2 border-rose-200/50 bg-white/80 backdrop-blur-xl shadow-2xl px-4 py-3">
        <div className="flex justify-between gap-1 overflow-x-auto">
          {items.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => setPage(id)}
              className={`flex flex-col items-center justify-center min-w-[84px] px-4 py-3 rounded-2xl transition-all ${
                page === id
                  ? "bg-rose-500 text-white shadow-lg scale-[1.02]"
                  : "text-rose-600 hover:bg-rose-50"
              }`}
              aria-label={label}
            >
              <span className="text-lg mb-1 leading-none">{icon}</span>
              <span className="text-xs font-medium text-center leading-tight">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------- Pages --------------------
function HomePage({ setPage, openLetter }) {
  return (
    <motion.div className="mx-auto w-full max-w-4xl transform-gpu transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
      <Card className="rounded-[32px] border-2 border-rose-200/50 bg-white/80 backdrop-blur-2xl shadow-2xl">
        <CardHeader className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-rose-700 flex items-center justify-center gap-3">
            <span>🎁</span>
            <span>Happy Birthday, Priyu!</span>
            <span>✨</span>
          </h1>
          <p className="mt-3 text-rose-600">
            Today is your day — soft lights, calm skies, and all my love wrapped
            around you.
          </p>
          <p className="text-rose-600">Explore your surprise pages below 💝</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              className="h-14 rounded-[18px] w-full"
              onClick={openLetter}
            >
              💌 Open Letter
            </Button>
            <Button
              className="h-14 rounded-[18px] w-full"
              onClick={() => setPage(PAGES.GALLERY)}
              variant="secondary"
            >
              📷 My glowing Maharani
            </Button>
            <Button
              className="h-14 rounded-[18px] w-full"
              onClick={() => setPage(PAGES.REASONS)}
              variant="outline"
            >
              💖 19 Reasons
            </Button>
            <Button
              className="h-14 rounded-[18px] w-full"
              onClick={() => setPage(PAGES.BUCKET)}
            >
              📝 Bucket List
            </Button>
            <Button
              className="h-14 rounded-[18px] w-full"
              onClick={() => setPage(PAGES.SCRATCH)}
              variant="secondary"
            >
              🎁 Scratch Cards
            </Button>
            <Button
              className="h-14 rounded-[18px] w-full"
              onClick={() => setPage(PAGES.CERT)}
              variant="outline"
            >
              📜 Certificate
            </Button>
            <Button
              className="h-14 rounded-[18px] w-full"
              onClick={() => setPage(PAGES.WISHES)}
            >
              🎉 Make a wish
            </Button>
          </div>
          <div className="text-center text-sm text-rose-500">
            Tip: Use the floating menu at the bottom to switch pages anytime.
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function LetterPage({ gfAnswer }) {
  const term = gfAnswer ? `“${gfAnswer}”` : "second daddy";

  return (
    <motion.div className="mx-auto max-w-3xl transform-gpu transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
      <Card>
        <CardHeader>
          <CardTitle>A Quiet Letter for You</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-rose-900/90 leading-relaxed">
          <div className="text-center mb-2">
            <h2 className="text-3xl sm:text-4xl font-[cursive] bg-gradient-to-r from-pink-500 to-rose-500 text-transparent bg-clip-text">
              To My Beautiful Priyu 💕
            </h2>
            <p className="text-rose-500 italic text-lg mt-1">
              From Kaivu, with all my love
            </p>
          </div>
          <p>
            <strong>
              Happiest 19th birthday to the most amazing person in my life!
            </strong>{" "}
            I wish many more happy, joyful years to come in your life — filled
            with love, laughter, and endless memories.
          </p>
          <p>
            Today is your day — soft lights, calm skies, and all my love wrapped
            around you. You are truly special — not just to me, but to the whole
            world. Every wish you whisper deserves to come true, and I hope life
            gives you every single dream you chase.
          </p>
          <p>
            Your kindness touches everyone around you. Your sanskari values and
            respectful nature make you one of a kind — beautiful inside and out.
            You are my soft place. Thank you for your patience, your glow, and
            the way you make the world feel kinder. Your prince, Kaivu, will
            always be right beside you, no matter what happens. Even if the
            world stands against you, that means the world stands against{" "}
            <em>us</em>, because you’ll never face anything alone.
          </p>
          <p>
            Thank you for being you — for understanding me, supporting my
            dreams, making me laugh, and filling my life with so much love and
            happiness. Here’s to all our adventures together, and to making every
            dream on our bucket list come true.
          </p>
          <p>
            Keep this page, because it will always tell you the same truth: I
            love you, Priyu. 💞 And remember, your {term} will never let you
            walk alone. I’ll keep supporting you, guiding you, and helping you
            reach every goal you dream of — because your dreams are my dreams,
            and your happiness is my forever purpose.
          </p>
          <div className="text-center mt-8">
            <h3 className="text-2xl font-[cursive] bg-gradient-to-r from-pink-500 to-rose-500 text-transparent bg-clip-text">
              Forever yours, Kaivu 💕
            </h3>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ReasonsPage() {
  const reasons = [
    {
      icon: "💖",
      text: "Your smile lights up my entire world and makes everything better",
    },
    {
      icon: "🌸",
      text: "You're the most caring person I've ever met - you always put others first",
    },
    {
      icon: "✨",
      text: "Your beauty, inside and out, takes my breath away every single day",
    },
    {
      icon: "🌟",
      text: "You respect everyone around you and treat people with such kindness",
    },
    {
      icon: "💕",
      text: "Your sanskari values make you even more special and unique",
    },
    {
      icon: "🦋",
      text: "You understand me like no one else ever has or ever will",
    },
    {
      icon: "🌺",
      text: "Your laugh is my favorite sound in the entire universe",
    },
    {
      icon: "💝",
      text: "You support my dreams and believe in me even when I don't",
    },
    {
      icon: "🎀",
      text: "The way you care for people shows how beautiful your heart truly is",
    },
    {
      icon: "🌈",
      text: "You make ordinary moments feel extraordinary just by being there",
    },
    {
      icon: "💗",
      text: "Your sweetness melts my heart every single time we talk",
    },
    {
      icon: "🦄",
      text: "You're patient with me, even when I'm being difficult",
    },
    {
      icon: "🌙",
      text: "Your presence brings me peace and comfort like nothing else",
    },
    {
      icon: "⭐",
      text: "You inspire me to be a better person every day",
    },
    {
      icon: "💫",
      text: "The way you handle challenges with grace amazes me constantly",
    },
    {
      icon: "🎨",
      text: "You see the good in everyone and everything around you",
    },
    {
      icon: "🌻",
      text: "Your thoughtfulness in small gestures means the world to me",
    },
    {
      icon: "💞",
      text: "You're my best friend, my love, and my everything all in one",
    },
    {
      icon: "👑",
      text: "You're my Maharani, my queen, and you deserve the entire world",
    },
  ];

  return (
    <motion.div className="mx-auto max-w-3xl transform-gpu transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
      <Card className="p-6 mt-10 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
        <CardHeader>
          <CardTitle>19 Reasons I Love You 💕</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reasons.map((r, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-rose-50 border border-white/60 text-rose-900/90 shadow-sm"
              >
                <div className="flex gap-3">
                  <div className="text-2xl">{r.icon}</div>
                  <div className="flex-1">
                    <div className="text-xs text-rose-500">
                      Reason #{i + 1}
                    </div>
                    <div className="text-rose-700">{r.text}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function BucketListPage() {
  // BL shape: { id: string, text: string, by: "priyu" | "kaivu", completed: boolean }
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("bucket_list_v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [newItem, setNewItem] = useState("");
  const [addedBy, setAddedBy] = useState("priyu");

  useEffect(() => {
    try {
      localStorage.setItem("bucket_list_v1", JSON.stringify(items));
    } catch {}
  }, [items]);

  const add = () => {
    if (!newItem.trim()) return;
    const entry = {
      id: Date.now().toString(),
      text: newItem.trim(),
      by: addedBy,
      completed: false,
    };
    setItems((s) => [entry, ...s]);
    setNewItem("");
  };

  const toggle = (id) =>
    setItems((it) =>
      it.map((x) => (x.id === id ? { ...x, completed: !x.completed } : x))
    );

  const del = (id) => setItems((it) => it.filter((x) => x.id !== id));

  return (
    <motion.div className="mx-auto max-w-3xl transform-gpu transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
      <Card className="p-6 mt-10 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
        <CardHeader>
          <CardTitle>Our Bucket List 🌟</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            rows={3}
            placeholder="Add something you'd love to do together…"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <div className="flex gap-2">
            <select
              value={addedBy}
              onChange={(e) => setAddedBy(e.target.value)}
              className="rounded-xl border-2 border-rose-200 bg-white/80 px-4 py-2.5 outline-none"
            >
              <option value="priyu">Added by Priyu 👑</option>
              <option value="kaivu">Added by Kaivu 💕</option>
            </select>
            <Button className="flex-1" onClick={add}>
              Add to List
            </Button>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {items.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-rose-400">Start adding your dreams! ✨</p>
              </Card>
            ) : (
              items.map((item) => (
                <Card
                  key={item.id}
                  className={cx(
                    "p-4 transition-all",
                    item.completed ? "opacity-60" : ""
                  )}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggle(item.id)}
                      className={cx(
                        "mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                        item.completed
                          ? "bg-rose-400 border-rose-400"
                          : "border-rose-300"
                      )}
                      aria-label="Toggle complete"
                    >
                      {item.completed ? "✓" : ""}
                    </button>
                    <div className="flex-1">
                      <p
                        className={cx(
                          "text-rose-700",
                          item.completed ? "line-through" : ""
                        )}
                      >
                        {item.text}
                      </p>
                      <p className="text-xs text-rose-600 mt-1">
                        <span className="px-2 py-0.5 rounded-full bg-rose-200/60 text-rose-800">
                          {item.by === "priyu" ? "👑 Priyu" : "💕 Kaivu"}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => del(item.id)}
                      className="text-rose-400 hover:text-rose-600 p-1"
                      aria-label="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ScratchCard({ message, emoji }) {
  const canvasRef = useRef(null);
  const [scratched, setScratched] = useState(false);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    ctx.fillStyle = "#f9a8d4";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#fbcfe8";
    for (let i = 0; i < 20; i++) {
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        4,
        4
      );
    }

    ctx.font = "bold 14px sans-serif";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText("Scratch me! 💕", canvas.width / 4, canvas.height / 4);
  }, []);

  const scratch = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const isTouch = "touches" in e;
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x * 2, y * 2, 40, 0, Math.PI * 2);
    ctx.fill();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }
    if (transparent / (pixels.length / 4) > 0.5 && !scratched) {
      setScratched(true);
    }
  };

  return (
    <div className="relative">
      <Card className="p-8 text-center min-h-[200px] flex items-center justify-center">
        <div>
          <div className="text-5xl mb-4">{emoji}</div>
          <p className="text-lg text-rose-700 font-medium">{message}</p>
        </div>
      </Card>
      {!scratched && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-pointer rounded-3xl"
          onMouseDown={() => setDrawing(true)}
          onMouseUp={() => setDrawing(false)}
          onMouseMove={scratch}
          onTouchStart={() => setDrawing(true)}
          onTouchEnd={() => setDrawing(false)}
          onTouchMove={scratch}
        />
      )}
    </div>
  );
}

function ScratchCardsPage() {
  const cards = [
    { emoji: "✨", message: "You make every day feel like magic" },
    { emoji: "💕", message: "Your smile is my favorite view" },
    { emoji: "🌟", message: "I fall for you more every single day" },
    { emoji: "💝", message: "You're my best decision ever made" },
    { emoji: "🦋", message: "Forever grateful you're mine" },
    { emoji: "💗", message: "You're the reason I believe in love" },
  ];

  return (
    <motion.div className="mx-auto max-w-3xl transform-gpu transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
      <Card className="p-6 mt-10 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
        <CardHeader>
          <CardTitle>Scratch & Reveal 💕</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((c, i) => (
              <ScratchCard key={i} emoji={c.emoji} message={c.message} />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function WishesPage() {
  const { shots, fire } = useMiniConfetti();
  // Wish shape: { id: string, text: string, by: "priyu" | "kaivu" }
  const [wish, setWish] = useState("");
  const [by, setBy] = useState("priyu");
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("wishes_list_v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("wishes_list_v1", JSON.stringify(items));
    } catch {}
  }, [items]);

  const add = () => {
    const t = wish.trim();
    if (!t) return;
    const entry = { id: Date.now() + "", text: t, by };
    setItems((s) => [entry, ...s]);
    setWish("");
    fire();
  };

  const remove = (idx) => {
    setItems((s) => s.filter((_, i) => i !== idx));
  };

  const clearAll = () => setItems([]);

  return (
    <motion.div className="mx-auto max-w-3xl relative">
      <ConfettiLayer shots={shots} />
      <Card className={glass}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>🎉 Make a wish</span>
            {items.length > 0 && (
              <Button
                variant="ghost"
                className="rounded-xl"
                onClick={clearAll}
              >
                Clear all
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder="Type a wish…"
            />
            <select
              value={by}
              onChange={(e) => setBy(e.target.value)}
              className="rounded-xl border border-rose-300/70 bg-white/80 px-3 py-2 text-sm"
              aria-label="Wish added by"
            >
              <option value="priyu">👑 Priyu</option>
              <option value="kaivu">💕 Kaivu</option>
            </select>
            <Button onClick={add} className="rounded-2xl">
              Add
            </Button>
          </div>

          {/* Scrollable list */}
          <div className="grid gap-3 max-h-80 overflow-y-auto pr-1">
            {items.length === 0 && (
              <p className="text-rose-900/70">
                Your wish jar is empty. Add the first one! ✨
              </p>
            )}
            {items.map((w, i) => (
              <div
                key={w.id}
                className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3 bg-rose-50 border border-white/60 text-rose-900/90 shadow-sm"
              >
                <span className="break-words pr-2">{w.text}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-rose-200/60 text-rose-800">
                    {w.by === "priyu" ? "👑 Priyu" : "💕 Kaivu"}
                  </span>
                  <Button
                    variant="outline"
                    className="rounded-xl h-8 px-3"
                    onClick={() => remove(i)}
                  >
                    🗑️
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function GalleryPage() {
  const photos = [
    {
      src: "https://i.imgur.com/Q35BSw6.png",
      caption: "Us, forever in one frame 💞",
    },
    { src: "https://i.imgur.com/KEqnJpr.jpeg", caption: "Princess energy, always 🌸" },
    { src: "https://i.imgur.com/huTPwU3.jpeg", caption: "My glowing Maharani 👑" },
    {
      src: "https://i.imgur.com/u2HRKkm.jpeg",
      caption: "Exactly 19 years ago this cute angel was born ✨",
    },
    { src: "https://i.imgur.com/t3GncPB.jpeg", caption: "Softest smile, brightest eyes ✨" },
    { src: "https://i.imgur.com/yOjxAs4.jpeg", caption: "My favorite view 🫶" },
  ];

  const [openIdx, setOpenIdx] = useState(null);
  const startX = useRef(null);

  const close = () => setOpenIdx(null);
  const next = () =>
    setOpenIdx((i) => (i === null ? 0 : (i + 1) % photos.length));
  const prev = () =>
    setOpenIdx((i) => (i === null ? 0 : (i - 1 + photos.length) % photos.length));

  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    const x = startX.current;
    if (x === null) return;
    startX.current = null;
    const diff = e.changedTouches[0].clientX - x;
    if (diff > 40) prev();
    if (diff < -40) next();
  };

  return (
    <motion.div className="mx-auto max-w-5xl">
      <Card className="p-6 mt-10 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
        <CardHeader>
          <CardTitle>My glowing Maharani 📸</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((p, i) => (
              <button
                key={i}
                className="group relative"
                onClick={() => setOpenIdx(i)}
              >
                <img
                  src={p.src}
                  alt={p.caption}
                  className="w-full h-40 md:h-44 object-cover rounded-2xl border border-rose-200/60 shadow"
                />
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/10 transition" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {openIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          onClick={close}
        >
          <div
            className="relative w-full max-w-3xl transform-gpu transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[openIdx].src}
              alt={photos[openIdx].caption}
              className="w-full max-h-[70vh] object-contain rounded-2xl"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            />
            <div className="mt-3 text-center text-white text-sm md:text-base">
              {photos[openIdx].caption}
            </div>
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
              <button
                onClick={prev}
                className="text-white/90 bg-black/30 hover:bg-black/50 w-10 h-10 rounded-full grid place-items-center"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="text-white/90 bg-black/30 hover:bg-black/50 w-10 h-10 rounded-full grid place-items-center"
              >
                ›
              </button>
            </div>
            <button
              onClick={close}
              className="absolute -top-3 -right-3 bg-rose-500 text-white w-8 h-8 rounded-full"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function CertificatePage() {
  return (
    <motion.div className="min-h-screen p-6 py-20">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-rose-600 mb-1">Love Certificate 💕</h1>
        <p className="text-rose-500 mb-8">A special certificate just for you</p>
        <div className="mx-auto max-w-3xl rounded-3xl border-[6px] border-rose-300/80 bg-white/70 shadow-lg p-4 relative">
          <div className="absolute -top-3 left-4 text-2xl">🌸</div>
          <div className="absolute -top-3 right-4 text-2xl">🌸</div>
          <div className="rounded-2xl border-2 border-rose-200 bg-gradient-to-b from-rose-50/70 to-pink-50/60 px-8 sm:px-12 py-10 text-rose-700">
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-rose-700 mb-8">
              Certificate of Love
            </h2>
            <p className="text-rose-500">This certifies that</p>
            <p className="text-3xl sm:text-4xl font-extrabold text-rose-700 my-4">
              Priyu <span className="align-middle">👑</span>
            </p>
            <p className="max-w-xl mx-auto leading-relaxed">
              is the most beautiful, caring, and amazing person in the entire world and is deeply loved
              by Kaivu
            </p>
            <p className="text-2xl font-semibold text-rose-600 mt-8">
              Forever and Always ✨
            </p>
            <hr className="my-8 border-rose-200" />
            <p className="text-sm text-rose-400 mb-4">
              Dated: {new Date().toLocaleDateString()}
            </p>
            <p className="text-xl text-rose-700">Kaivu ♡</p>
          </div>
          <div className="absolute -bottom-3 left-5 text-2xl">💗</div>
          <div className="absolute -bottom-3 right-5 text-2xl">💗</div>
        </div>
      </div>
    </motion.div>
  );
}

// -------------------- Simple transition helpers --------------------
function PageFade({ dep, children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [dep]);

  return (
    <div
      className={cx(
        "transform-gpu transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}
    >
      {children}
    </div>
  );
}

// -------------------- App --------------------
export default function App() {
  const [page, setPage] = useState(PAGES.HOME);
  const [showGate, setShowGate] = useState(false);
  const [gfAnswer, setGfAnswer] = useState(null);
  const { shots } = useMiniConfetti();

  // music: manual toggle only; auto-pause on Letter page
  const audioRef = useRef(null);
  const [audioSrc] = useState("https://files.catbox.moe/jv1tlw.m4a");
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const el = audioRef.current;
    if (el) el.volume = 0.7;
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (page === PAGES.LETTER) {
      el.pause();
      setIsPlaying(false);
    }
  }, [page]);

  const toggleAudio = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      try {
        await el.play();
        setIsPlaying(true);
      } catch {}
    }
  };

  const openLetter = () => setShowGate(true);

  const handleSubmitAnswer = (ans) => {
    setGfAnswer(ans);
    setShowGate(false);
    setPage(PAGES.LETTER);
  };

  const renderPage = () => {
    switch (page) {
      case PAGES.HOME:
        return <HomePage setPage={setPage} openLetter={openLetter} />;
      case PAGES.LETTER:
        return <LetterPage gfAnswer={gfAnswer} />;
      case PAGES.GALLERY:
        return <GalleryPage />;
      case PAGES.REASONS:
        return <ReasonsPage />;
      case PAGES.BUCKET:
        return <BucketListPage />;
      case PAGES.SCRATCH:
        return <ScratchCardsPage />;
      case PAGES.CERT:
        return <CertificatePage />;
      case PAGES.WISHES:
        return <WishesPage />;
      default:
        return <HomePage setPage={setPage} openLetter={openLetter} />;
    }
  };

  return (
    <div className={cx("min-h-screen relative", appGradient)}>
      <SparkleBg />
      <ConfettiLayer shots={shots} />
      <audio ref={audioRef} src={audioSrc} loop preload="auto" />
      <main className="px-4 sm:px-6 py-10 sm:py-16 max-w-6xl mx-auto">
        <PageFade dep={page}>{renderPage()}</PageFade>
      </main>
      <AnswerGate
        open={showGate}
        onSubmit={handleSubmitAnswer}
        onClose={() => setShowGate(false)}
      />
      <Nav page={page} setPage={setPage} />
      <motion.button
        onClick={toggleAudio}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        className="fixed bottom-24 right-4 z-40 grid place-items-center w-11 h-11 rounded-full shadow-lg text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-95"
        style={{ background: "linear-gradient(135deg, #fb7185, #f43f5e)" }}
      >
        <span className="text-xl">{isPlaying ? "💗🔊" : "💗🔇"}</span>
      </motion.button>
    </div>
  );
}
