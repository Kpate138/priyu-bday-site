import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";

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
  EDITS: "edits",
};

// -------------------- Motion Variants & Style Helpers --------------------
const pageVariant = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.2 } },
};
const glass = "border border-rose-200/60 bg-white/80 backdrop-blur-xl shadow rounded-3xl p-4 sm:p-6";
const appGradient = "bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-rose-50 via-pink-50 to-purple-50";

// -------------------- Tiny UI Primitives --------------------
function cx(...xs) {
  return xs.filter(Boolean).join(" ");
}

function Button({ className, variant = "default", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition active:scale-[0.99] disabled:opacity-60";
  const variants = {
    default: "bg-rose-500 text-white hover:bg-rose-600",
    secondary: "bg-rose-100 text-rose-700 hover:bg-rose-200",
    outline: "border border-rose-300 text-rose-700 hover:bg-rose-50",
    ghost: "text-rose-700 hover:bg-rose-50",
  };
  return <button className={cx(base, variants[variant], className)} {...props} />;
}

function Card({ className, ...rest }) {
  return (
    <div
      className={cx(
        "rounded-3xl border border-rose-200/60 bg-white/80 backdrop-blur-xl shadow",
        className
      )}
      {...rest}
    />
  );
}
const CardHeader = ({ className, ...rest }) => (
  <div className={cx("px-6 pt-6", className)} {...rest} />
);
const CardContent = ({ className, ...rest }) => (
  <div className={cx("px-6 pb-6", className)} {...rest} />
);
const CardTitle = ({ className, ...rest }) => (
  <h2 className={cx("text-2xl font-semibold text-rose-700", className)} {...rest} />
);
const Input = ({ className, ...rest }) => (
  <input
    {...rest}
    className={cx(
      "w-full rounded-2xl border border-rose-300/70 bg-white/80 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-300",
      className
    )}
  />
);
const Textarea = ({ className, ...rest }) => (
  <textarea
    {...rest}
    className={cx(
      "w-full rounded-xl border-2 border-rose-200 bg-white/80 px-4 py-2.5 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 transition-all resize-none",
      className
    )}
  />
);

// -------------------- Background Sparkles & Confetti --------------------
function SparkleBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[...Array(28)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-pink-200/60"
          style={{
            width: 5,
            height: 5,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ y: [0, -14, 0], opacity: [0.25, 0.8, 0.25], scale: [1, 1.1, 1] }}
          transition={{ duration: 5 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
function useMiniConfetti() {
  const [shots, setShots] = useState(0);
  return { shots, fire: () => setShots((s) => s + 1) };
}
function ConfettiLayer({ shots }) {
  const [pieces, setPieces] = useState([]);
  useEffect(() => {
    if (shots <= 0) return;
    const burst = Array.from({ length: 28 }, (_, j) => ({ id: Date.now() + j, x: Math.random() }));
    setPieces((p) => [...p, ...burst]);
    const t = setTimeout(() => setPieces((p) => p.slice(burst.length)), 1800);
    return () => clearTimeout(t);
  }, [shots]);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-2 h-2 rounded-sm bg-gradient-to-br from-rose-400 to-amber-300"
          style={{ left: `${p.x * 100}%`, top: 0 }}
          initial={{ y: -10, rotate: 0, opacity: 0.8 }}
          animate={{ y: [0, 120, 220, 280, 340], rotate: [0, 120, 260, 320, 380], opacity: [0.9, 0.9, 0.8, 0.6, 0] }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

// -------------------- Nav --------------------
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
    { id: PAGES.EDITS, icon: "✨", label: "Edits of my Queen" },
  ];
  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-30 ${glass} px-2 py-1 flex gap-1 overflow-auto`}
      role="navigation"
      aria-label="Bottom navigation"
    >
      {items.map(({ id, icon, label }) => (
        <Button
          key={id}
          onClick={() => setPage(id)}
          variant={page === id ? "default" : "ghost"}
          className={cx(
            "rounded-xl px-3 sm:px-4 py-5 font-medium",
            page === id ? "bg-rose-400 text-white" : "text-rose-600"
          )}
          aria-label={label}
        >
          <span className="mr-1">{icon}</span>
          <span className="hidden sm:inline">{label}</span>
        </Button>
      ))}
    </div>
  );
}

// -------------------- Pages --------------------
function HomePage({ setPage, openLetter }) {
  return (
    <motion.div variants={pageVariant} initial="initial" animate="animate" exit="exit" className="mx-auto w-full max-w-3xl">
      <Card className={`${glass}`}>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl sm:text-4xl font-bold tracking-tight text-rose-700 flex items-center justify-center gap-2">
            <span>🎁</span>
            Happy Birthday, Priyu!
            <span>✨</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-rose-900/80 text-lg leading-relaxed text-center">
            Today is your day — soft lights, calm skies, and all my love wrapped around you. Explore your surprise pages below 💝
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Button className="h-14" onClick={openLetter}>💌 Open Letter</Button>
            <Button className="h-14" onClick={() => setPage(PAGES.GALLERY)} variant="secondary">
              📷 My glowing Maharani
            </Button>
            <Button className="h-14" onClick={() => setPage(PAGES.REASONS)} variant="outline">
              💖 19 Reasons
            </Button>
            <Button className="h-14" onClick={() => setPage(PAGES.BUCKET)}>📝 Bucket List</Button>
            <Button className="h-14" onClick={() => setPage(PAGES.SCRATCH)} variant="secondary">
              🎁 Scratch Cards
            </Button>
            <Button className="h-14" onClick={() => setPage(PAGES.CERT)} variant="outline">
              📜 Certificate
            </Button>
            <Button className="h-14" onClick={() => setPage(PAGES.WISHES)}>🎉 Make a wish</Button>
            <Button className="h-14" onClick={() => setPage(PAGES.EDITS)} variant="secondary">
              ✨ Edits
            </Button>
          </div>
          <div className="text-center text-sm text-rose-800/70">
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
    <motion.div variants={pageVariant} initial="initial" animate="animate" exit="exit" className="mx-auto max-w-3xl">
      <Card className={`${glass}`}>
        <CardHeader>
          <CardTitle>A Quiet Letter for You</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-rose-900/90 leading-relaxed">
          <div className="text-center mb-2">
            <h2 className="text-3xl sm:text-4xl font-[cursive] bg-gradient-to-r from-pink-500 to-rose-500 text-transparent bg-clip-text">
              To My Beautiful Priyu 💕
            </h2>
            <p className="text-rose-500 italic text-lg mt-1">From Kaivu, with all my love</p>
          </div>
          <p>
            <strong>Happiest 19th birthday to the most amazing person in my life!</strong> I wish many more happy, joyful years to come in your life — filled with love, laughter, and endless memories. Today is your day — soft lights, calm skies, and all my love wrapped around you. You are truly special — not just to me, but to the whole world. Every wish you whisper deserves to come true, and I hope life gives you every single dream you chase.
          </p>
          <p>
            Your kindness touches everyone around you. Your sanskari values and respectful nature make you one of a kind — beautiful inside and out. You are my soft place. Thank you for your patience, your glow, and the way you make the world feel kinder. Your prince, Kaivu, will always be right beside you, no matter what happens. Even if the world stands against you, that means the world stands against <em>us</em>, because you’ll never face anything alone.
          </p>
          <p>
            Thank you for being you — for understanding me, supporting my dreams, making me laugh, and filling my life with so much love and happiness. Here’s to all our adventures together, and to making every dream on our bucket list come true.
          </p>
          <p>
            Keep this page, because it will always tell you the same truth: I love you, Priyu. 💞 And remember, your {term} will never let you walk alone. I’ll keep supporting you, guiding you, and helping you reach every goal you dream of — because your dreams are my dreams, and your happiness is my forever purpose.
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

function GalleryPage() {
  const album = [
    { src: "https://i.imgur.com/Q35BSw6.png", caption: "" },
    { src: "https://i.imgur.com/KEqnJpr.jpeg", caption: "" },
    { src: "https://i.imgur.com/huTPwU3.jpeg", caption: "" },
    { src: "https://i.imgur.com/u2HRKkm.jpeg", caption: "" },
    { src: "https://i.imgur.com/t3GncPB.jpeg", caption: "" },
    { src: "https://i.imgur.com/yOjxAs4.jpeg", caption: "" },
  ];
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const openAt = (i) => { setIndex(i); setOpen(true); };
  const close = () => setOpen(false);
  const prev = () => setIndex((i) => (i - 1 + album.length) % album.length);
  const next = () => setIndex((i) => (i + 1) % album.length);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  const startX = React.useRef(null);
  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 40) { dx > 0 ? prev() : next(); }
    startX.current = null;
  };
  return (
    <motion.div variants={pageVariant} initial="initial" animate="animate" exit="exit" className="mx-auto max-w-4xl">
      <Card className={`${glass}`}>
        <CardHeader>
          <CardTitle>My glowing Maharani</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {album.map((item, i) => (
              <div key={i} className="flex flex-col gap-2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="aspect-square rounded-2xl overflow-hidden shadow-md border border-white/50 bg-white/60 cursor-pointer"
                  onClick={() => openAt(i)}
                >
                  <img src={item.src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
                </motion.div>
                <div className="min-h-[1.75rem] text-center text-xs sm:text-sm text-rose-900/80 px-1">
                  {item.caption?.trim() ? (
                    item.caption
                  ) : (
                    <span className="text-rose-400/70">(caption coming soon)</span>
                  )}
                </div>
              </div>
            ))}
            <div className="hidden sm:grid place-items-center aspect-square rounded-2xl border border-dashed border-rose-200 text-rose-600/70 bg-rose-50/40 text-sm">
              Add more later ✨
            </div>
          </div>
        </CardContent>
      </Card>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={close}>
            <div className="absolute inset-0 flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 text-white">
                <button onClick={close} className="text-white/90 hover:text-white text-lg">✕ Close</button>
                <div className="text-sm opacity-80">{index + 1} / {album.length}</div>
              </div>
              <div className="flex-1 grid place-items-center select-none" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
                <motion.img
                  key={album[index].src}
                  src={album[index].src}
                  alt={album[index].caption || `Photo ${index + 1}`}
                  className="max-h-[70vh] max-w-[92vw] object-contain rounded-xl shadow"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <div className="px-4 pb-6 text-center text-white/90 text-sm min-h-[2rem]">
                {album[index].caption?.trim() ? (
                  album[index].caption
                ) : (
                  <span className="opacity-60">(caption coming soon)</span>
                )}
              </div>
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 pointer-events-none">
                <button onClick={prev} className="pointer-events-auto w-10 h-10 grid place-items-center rounded-full bg-white/20 hover:bg-white/30 text-white text-xl">‹</button>
                <button onClick={next} className="pointer-events-auto w-10 h-10 grid place-items-center rounded-full bg-white/20 hover:bg-white/30 text-white text-xl">›</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// 19 Reasons
function ReasonsPage() {
  const reasons = [
    { icon: "💖", text: "Your smile lights up my entire world and makes everything better" },
    { icon: "🌸", text: "You're the most caring person I've ever met - you always put others first" },
    { icon: "✨", text: "Your beauty, inside and out, takes my breath away every single day" },
    { icon: "🌟", text: "You respect everyone around you and treat people with such kindness" },
    { icon: "💕", text: "Your sanskari values make you even more special and unique" },
    { icon: "🦋", text: "You understand me like no one else ever has or ever will" },
    { icon: "🌺", text: "Your laugh is my favorite sound in the entire universe" },
    { icon: "💝", text: "You support my dreams and believe in me even when I don't" },
    { icon: "🎀", text: "The way you care for people shows how beautiful your heart truly is" },
    { icon: "🌈", text: "You make ordinary moments feel extraordinary just by being there" },
    { icon: "💗", text: "Your sweetness melts my heart every single time we talk" },
    { icon: "🦄", text: "You're patient with me, even when I'm being difficult" },
    { icon: "🌙", text: "Your presence brings me peace and comfort like nothing else" },
    { icon: "⭐", text: "You inspire me to be a better person every day" },
    { icon: "💫", text: "The way you handle challenges with grace amazes me constantly" },
    { icon: "🎨", text: "You see the good in everyone and everything around you" },
    { icon: "🌻", text: "Your thoughtfulness in small gestures means the world to me" },
    { icon: "💞", text: "You're my best friend, my love, and my everything all in one" },
    { icon: "👑", text: "You're my Maharani, my queen, and you deserve the entire world" },
  ];
  return (
    <motion.div variants={pageVariant} initial="initial" animate="animate" exit="exit" className="min-h-screen p-6 py-20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600 mb-3">
            19 Reasons I Love You 💕
          </h1>
          <p className="text-rose-600">One for each beautiful year of your life</p>
        </div>
        <div className="space-y-4">
          {reasons.map((reason, i) => (
            <motion.div key={i} initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-5 hover:shadow-2xl transition-all cursor-pointer hover:scale-[1.02]">
                <div className="flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0">{reason.icon}</span>
                  <div>
                    <span className="text-sm font-semibold text-rose-500">Reason #{i + 1}</span>
                    <p className="text-rose-700 mt-1">{reason.text}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Bucket List (NO persistence)
function BucketListPage() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [addedBy, setAddedBy] = useState("priyu");

  const addItem = () => {
    if (!newItem.trim()) return;
    const entry = { id: Date.now() + "", text: newItem.trim(), by: addedBy, completed: false };
    setItems((s) => [entry, ...s]);
    setNewItem("");
  };
  const toggle = (id) => {
    setItems((s) => s.map((it) => (it.id === id ? { ...it, completed: !it.completed } : it)));
  };
  const del = (id) => setItems((s) => s.filter((it) => it.id !== id));

  return (
    <motion.div variants={pageVariant} initial="initial" animate="animate" exit="exit" className="mx-auto max-w-3xl">
      <Card className={`${glass}`}>
        <CardHeader>
          <CardTitle className="text-rose-700">Our Bucket List 🌟</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Textarea
              placeholder="Add something you'd love to do together..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              rows={3}
            />
            <div className="flex gap-3">
              <select
                value={addedBy}
                onChange={(e) => setAddedBy(e.target.value)}
                className="rounded-xl border-2 border-rose-200 bg-white/80 px-4 py-2.5 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50"
              >
                <option value="priyu">Added by Priyu 👑</option>
                <option value="kaivu">Added by Kaivu 💕</option>
              </select>
              <Button onClick={addItem} className="gap-2 flex-1">
                Add to List
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            {items.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-rose-400">Start adding your dreams! ✨</p>
              </Card>
            ) : (
              items.map((item) => (
                <Card key={item.id} className={cx("p-4 transition-all", item.completed ? "opacity-60" : "") }>
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggle(item.id)}
                      className={cx(
                        "mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                        item.completed ? "bg-rose-400 border-rose-400" : "border-rose-300"
                      )}
                      aria-label="Toggle complete"
                    >
                      {item.completed ? "✓" : ""}
                    </button>
                    <div className="flex-1">
                      <p className={cx("text-rose-700", item.completed ? "line-through" : "")}>{item.text}</p>
                      <p className="text-xs text-rose-400 mt-1">
                        {item.by === "priyu" ? "👑 Priyu's wish" : "💕 Kaivu's wish"}
                      </p>
                    </div>
                    <button onClick={() => del(item.id)} className="text-rose-400 hover:text-rose-600 p-1" aria-label="Delete">
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

// Scratch Card (re-usable)
function ScratchCard({ message, emoji }) {
  const canvasRef = useRef(null);
  const [done, setDone] = useState(false);
  const [drawing, setDrawing] = useState(false);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.offsetWidth * 2;
    const h = canvas.offsetHeight * 2;
    canvas.width = w;
    canvas.height = h;
    ctx.scale(2, 2);
    ctx.fillStyle = "#f9a8d4";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#fbcfe8";
    for (let i = 0; i < 20; i++) {
      ctx.fillRect(Math.random() * w, Math.random() * h, 4, 4);
    }
    ctx.font = "bold 14px sans-serif";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText("Scratch me! 💕", w / 4, h / 4);
  }, []);
  const scratch = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const client = "touches" in e ? e.touches[0] : e;
    const x = client.clientX - rect.left;
    const y = client.clientY - rect.top;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x * 2, y * 2, 40, 0, Math.PI * 2);
    ctx.fill();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < imageData.length; i += 4) {
      if (imageData[i] === 0) transparent++;
    }
    if (transparent / (imageData.length / 4) > 0.5 && !done) setDone(true);
  };
  return (
    <div className="relative">
      <Card className="p-8 text-center min-h-[200px] flex items-center justify-center">
        <div>
          <div className="text-5xl mb-4">{emoji}</div>
          <p className="text-lg text-rose-700 font-medium">{message}</p>
        </div>
      </Card>
      {!done && (
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
    <motion.div variants={pageVariant} initial="initial" animate="animate" exit="exit" className="min-h-screen p-6 py-20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600 mb-3">
            Scratch & Reveal 💕
          </h1>
          <p className="text-rose-600">Discover sweet messages just for you</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((c, i) => (
            <motion.div key={i} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.05 }}>
              <ScratchCard emoji={c.emoji} message={c.message} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Wishes (NO persistence)
function WishesPage() {
  const { shots, fire } = useMiniConfetti();
  const [wish, setWish] = useState("");
  const [items, setItems] = useState([]);

  const add = () => {
    const t = wish.trim();
    if (!t) return;
    const entry = { id: Date.now() + "", text: t };
    setItems((s) => [entry, ...s]);
    setWish("");
    fire();
  };
  const remove = (idx) => { setItems((s) => s.filter((_, i) => i !== idx)); };
  const clearAll = () => setItems([]);

  return (
    <motion.div variants={pageVariant} initial="initial" animate="animate" exit="exit" className="mx-auto max-w-3xl relative">
      <ConfettiLayer shots={shots} />
      <Card className={`${glass}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>🎉 Make a wish</span>
            {items.length > 0 && (
              <Button variant="ghost" className="rounded-xl" onClick={clearAll}>Clear all</Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={wish} onChange={(e) => setWish(e.target.value)} placeholder="Type a wish…" />
            <Button onClick={add} className="rounded-2xl">Add</Button>
          </div>
          <div className="grid gap-3">
            {items.length === 0 && (<p className="text-rose-900/70">Your wish jar is empty. Add the first one! ✨</p>)}
            {items.map((w, i) => (
              <div key={w.id} className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3 bg-rose-50 border border-white/60 text-rose-900/90 shadow-sm">
                <span className="break-words pr-2">{w.text}</span>
                <Button variant="outline" className="rounded-xl h-8 px-3" onClick={() => remove(i)}>🗑️</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Edits (images / YouTube with captions)
function EditsPage() {
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [items, setItems] = useState([]);
  const add = () => {
    const u = url.trim(); if (!u) return;
    setItems([{ url: u, caption: caption.trim(), addedAt: Date.now() }, ...items]);
    setUrl(""); setCaption("");
  };
  const remove = (idx) => setItems(items.filter((_, i) => i !== idx));
  const clearAll = () => setItems([]);
  const isYouTube = (u) => /(youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)/i.test(u);
  const toEmbed = (u) => (u.includes("watch?v=") ? u.replace("watch?v=", "embed/") : u);
  return (
    <motion.div variants={pageVariant} initial="initial" animate="animate" exit="exit" className="mx-auto max-w-4xl">
      <Card className={`${glass}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">✨ Edits of my Queen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid sm:grid-cols-[1.5fr_1fr_auto] gap-2">
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste image URL or YouTube link" />
            <Input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption (optional)" />
            <Button onClick={add}>Add</Button>
          </div>
          {items.length > 0 && (
            <div className="flex justify-end">
              <Button variant="ghost" className="rounded-xl text-rose-600" onClick={clearAll}>Clear all</Button>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.length === 0 && [1, 2, 3].map((_, i) => (
              <div key={i} className="rounded-2xl aspect-video bg-gradient-to-br from-rose-100 via-pink-50 to-sky-50 flex items-center justify-center text-rose-400 font-medium animate-pulse">
                Coming soon — Edit {i + 1}
              </div>
            ))}
            {items.map((it, i) => (
              <motion.div key={it.addedAt + "-" + i} whileHover={{ scale: 1.01 }} className="rounded-2xl overflow-hidden border border-white/60 shadow-md bg-white/60">
                <div className="w-full aspect-video bg-rose-100/50 flex items-center justify-center">
                  {isYouTube(it.url) ? (
                    <iframe className="w-full h-full" src={toEmbed(it.url)} title={`edit-${i}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                  ) : (
                    <img src={it.url} alt={it.caption || `edit-${i}`} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-3 flex items-center justify-between gap-3">
                  <div className="text-sm text-rose-900/90 truncate max-w-[75%]">{it.caption || "(no caption)"}</div>
                  <Button variant="outline" className="rounded-xl h-8 px-3" onClick={() => remove(i)}>🗑️</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// -------------------- Cute Answer Gate (modal) --------------------
function AnswerGate({ open, onSubmit, onClose }) {
  const [ans, setAns] = useState("");
  useEffect(() => { if (!open) setAns(""); }, [open]);
  if (!open) return null;
  const submit = () => { const v = ans.trim(); if (!v) return; onSubmit(v); };
  const onKey = (e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") onClose(); };
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-rose-900/40 backdrop-blur-sm grid place-items-center p-6" onClick={onClose}>
        <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} transition={{ duration: 0.2 }} className={`max-w-md w-full ${glass} rounded-3xl p-6 text-center relative`} onClick={(e) => e.stopPropagation()}>
          <div className="text-2xl">💖</div>
          <h3 className="mt-2 text-xl text-rose-800 font-semibold">Kaivalya tara mate kon che? (answer in one word)</h3>
          <div className="mt-4 flex gap-2">
            <Input autoFocus value={ans} onChange={(e) => setAns(e.target.value)} onKeyDown={onKey} placeholder="e.g. jaan, prince, hero…" />
            <Button onClick={submit}>Continue</Button>
          </div>
          <Button variant="ghost" className="mt-3" onClick={onClose}>Cancel</Button>
          <div className="pointer-events-none absolute -top-6 left-6 text-2xl">✨</div>
          <div className="pointer-events-none absolute -bottom-6 right-6 text-2xl">🌸</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// -------------------- Certificate Page --------------------
function CertificatePage() {
  const downloadCertificate = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800; canvas.height = 600;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, "#fff1f2");
    gradient.addColorStop(1, "#fce7f3");
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 800, 600);
    ctx.strokeStyle = "#fb7185"; ctx.lineWidth = 8; ctx.strokeRect(20, 20, 760, 560);
    ctx.strokeStyle = "#fda4af"; ctx.lineWidth = 4; ctx.strokeRect(30, 30, 740, 540);
    ctx.fillStyle = "#be123c"; ctx.font = "bold 48px serif"; ctx.textAlign = "center"; ctx.fillText("Certificate of Love", 400, 100);
    ctx.font = "24px serif"; ctx.fillStyle = "#e11d48"; ctx.fillText("This certifies that", 400, 180);
    ctx.font = "bold 36px serif"; ctx.fillStyle = "#be123c"; ctx.fillText("Priyu", 400, 240);
    ctx.font = "20px serif"; ctx.fillStyle = "#e11d48";
    ctx.fillText("is the most beautiful, caring, and amazing", 400, 300);
    ctx.fillText("person in the entire world", 400, 330);
    ctx.fillText("and is deeply loved by Kaivu", 400, 360);
    ctx.fillText("Forever and Always", 400, 420);
    ctx.font = "italic 18px serif"; ctx.fillText(`Dated: ${new Date().toLocaleDateString()}`, 400, 490);
    ctx.font = "bold 24px cursive"; ctx.fillText("Kaivu ♡", 400, 540);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "Love-Certificate-Priyu.png"; a.click();
      URL.revokeObjectURL(url);
    });
  };
  return (
    <motion.div variants={pageVariant} initial="initial" animate="animate" exit="exit" className="min-h-screen p-6 py-20 flex items-center justify-center">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600 mb-3">Love Certificate 💕</h1>
        <p className="text-rose-600 mb-6">A special certificate just for you</p>
        <Card className="p-12 text-center border-4 border-rose-300 relative overflow-hidden">
          <div className="absolute top-4 left-4 text-3xl">🌸</div>
          <div className="absolute top-4 right-4 text-3xl">🌸</div>
          <div className="absolute bottom-4 left-4 text-3xl">💕</div>
          <div className="absolute bottom-4 right-4 text-3xl">💕</div>
          <div className="border-2 border-rose-200 rounded-2xl p-8 bg-gradient-to-br from-rose-50 to-pink-50">
            <h2 className="text-4xl font-serif font-bold text-rose-700 mb-6">Certificate of Love</h2>
            <div className="space-y-4 text-rose-600">
              <p className="text-lg">This certifies that</p>
              <p className="text-3xl font-bold text-rose-700 my-6">Priyu 👑</p>
              <p className="text-lg leading-relaxed max-w-lg mx-auto">is the most beautiful, caring, and amazing person in the entire world and is deeply loved by Kaivu</p>
              <p className="text-2xl font-semibold text-rose-600 mt-8">Forever and Always ✨</p>
              <div className="mt-8 pt-6 border-t-2 border-rose-200">
                <p className="text-sm text-rose-500">Dated: {new Date().toLocaleDateString()}</p>
                <p className="text-2xl mt-4 text-rose-700">Kaivu ♡</p>
              </div>
            </div>
          </div>
        </Card>
        <div className="mt-6"><Button onClick={downloadCertificate}>Download Certificate</Button></div>
      </div>
    </motion.div>
  );
}

// -------------------- App --------------------
function App() {
  const [page, setPage] = useState(PAGES.HOME);
  const [showGate, setShowGate] = useState(false);
  const [gfAnswer, setGfAnswer] = useState(null);
  const { shots } = useMiniConfetti();

  // ---- Background music (Tum Se Hi) ----
  const EMBEDDED_AUDIO = "https://files.catbox.moe/jv1tlw.m4a";
  const audioRef = useRef(null);
  const [audioSrc] = useState(EMBEDDED_AUDIO);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const excluded = page === PAGES.LETTER || page === PAGES.EDITS;

  useEffect(() => {
    try {
      const el = audioRef.current;
      if (!el) return;
      el.volume = 0.7;
      const tryPlay = async () => {
        if (!audioSrc) { setIsPlaying(false); return; }
        if (excluded) { el.pause(); setIsPlaying(false); return; }
        if (!userPaused) {
          try { await el.play(); setIsPlaying(true); } catch {}
        }
      };
      tryPlay();
      const onGesture = () => { tryPlay(); window.removeEventListener("pointerdown", onGesture); window.removeEventListener("keydown", onGesture); };
      window.addEventListener("pointerdown", onGesture);
      window.addEventListener("keydown", onGesture);
      return () => { window.removeEventListener("pointerdown", onGesture); window.removeEventListener("keydown", onGesture); };
    } catch {}
  }, [audioSrc, excluded, userPaused]);

  useEffect(() => {
    const el = audioRef.current; if (!el || !audioSrc) return;
    (async () => {
      if (excluded) { el.pause(); setIsPlaying(false); }
      else if (!userPaused) { try { await el.play(); setIsPlaying(true); } catch {} }
    })();
  }, [page]);

  const toggleAudio = async () => {
    const el = audioRef.current; if (!el) return;
    if (isPlaying) { el.pause(); setIsPlaying(false); setUserPaused(true); }
    else { try { await el.play(); setIsPlaying(true); setUserPaused(false); } catch {} }
  };

  const openLetter = () => { setShowGate(true); };
  const handleSubmitAnswer = (ans) => { setGfAnswer(ans); setShowGate(false); setPage(PAGES.LETTER); };

  return (
    <div className={`min-h-screen ${appGradient} relative`}>
      <audio ref={audioRef} src={audioSrc || undefined} loop preload="auto"></audio>

      <SparkleBg />
      <ConfettiLayer shots={shots} />
      <main className="px-4 sm:px-6 py-10 sm:py-16 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {page === PAGES.HOME && (<HomePage key="home" setPage={setPage} openLetter={openLetter} />)}
          {page === PAGES.LETTER && <LetterPage key="letter" gfAnswer={gfAnswer} />}
          {page === PAGES.GALLERY && <GalleryPage key="gallery" />}
          {page === PAGES.REASONS && <ReasonsPage key="reasons" />}
          {page === PAGES.BUCKET && <BucketListPage key="bucket" />}
          {page === PAGES.SCRATCH && <ScratchCardsPage key="scratch" />}
          {page === PAGES.CERT && <CertificatePage key="cert" />}
          {page === PAGES.WISHES && <WishesPage key="wishes" />}
          {page === PAGES.EDITS && <EditsPage key="edits" />}
        </AnimatePresence>
      </main>
      <AnswerGate open={showGate} onSubmit={handleSubmitAnswer} onClose={() => setShowGate(false)} />
      <Nav page={page} setPage={setPage} />

      <motion.button
        onClick={toggleAudio}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        className="fixed bottom-24 right-4 z-40 grid place-items-center w-11 h-11 rounded-full shadow-lg text-white"
        style={{ background: "linear-gradient(135deg, #fb7185, #f43f5e)" }}
        animate={{ scale: isPlaying ? [1, 1.08, 1] : 1 }}
        transition={{ repeat: isPlaying ? Infinity : 0, duration: 1.6 }}
      >
        <span className="text-xl">{isPlaying ? "💗🔊" : "💗🔇"}</span>
      </motion.button>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);