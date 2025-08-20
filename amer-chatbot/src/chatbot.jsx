import React, { useEffect, useMemo, useRef, useState } from "react";
import { MessageSquare, Send, Bot, User, Globe, ShieldCheck, Loader2, Languages, RefreshCw, Lock, CheckCircle2 } from "lucide-react";
import "./index.css"; // Import the CSS file

/**
 * Amer Smart Assistant – Web Chatbot (React Prototype)
 * ----------------------------------------------------
 * - Single-file React component with external CSS (no Tailwind dependency)
 * - Multilingual (English/Arabic) with easy extension (Hindi/Urdu/Tagalog, etc.)
 * - Intent router (rule-based) for: Visa Renewal, Emirates ID, Fees, Status Tracking, Documents
 * - Quick replies, typing indicator, basic validations, mock API calls
 * - Clear "Integration points" where you can wire GDRFA/ICA APIs, UAE PASS, payments, WhatsApp
 */

const i18n = {
  en: {
    title: "Amer Smart Assistant",
    subtitle: "Ask me about visas, Emirates ID, fees, documents, or track your status.",
    placeholder: "Type your question...",
    intro:
      "Welcome! I can guide you through residency visa renewal, Emirates ID, fees and required documents. You can also track status with your Emirates ID or passport number.",
    chips: {
      renewal: "Visa Renewal",
      id: "Emirates ID",
      fees: "Fees",
      documents: "Required Documents",
      track: "Track Status",
      arabic: "العربية",
    },
    typing: "Assistant is typing...",
    loginUAEPass: "Login with UAE PASS",
    lastUpdated: "Advisory only – verify final fees/timelines on official portals.",
  },
  ar: {
    title: "مساعد آمر الذكي",
    subtitle: "اسألني عن التأشيرات، بطاقة الهوية الإماراتية، الرسوم، المستندات أو تتبع الحالة.",
    placeholder: "اكتب سؤالك...",
    intro:
      "مرحباً! أستطيع إرشادك في تجديد إقامة الإقامة، بطاقة الهوية الإماراتية، الرسوم والمستندات المطلوبة. يمكنك أيضاً تتبع الحالة برقم الهوية أو جواز السفر.",
    chips: {
      renewal: "تجديد الإقامة",
      id: "الهوية الإماراتية",
      fees: "الرسوم",
      documents: "المستندات",
      track: "تتبع الحالة",
      arabic: "English",
    },
    typing: "...المساعد يكتب",
    loginUAEPass: "تسجيل الدخول عبر UAE PASS",
    loggedIn: "تم التحقق عبر UAE PASS",
    lastUpdated: "للاسترشاد فقط – يرجى التحقق من الرسوم والمدة من القنوات الرسمية.",
  },
};

const quickKnowledge = {
  en: {
    greet: "How can I help you today? Try: 'What are the fees for spouse visa renewal?' or 'Track my visa status'.",
    renewal:
      "Residency visa renewal generally requires: valid passport copy, Emirates ID, medical test (if applicable), tenancy/Ejari, and insurance. Typical processing: 24–72h after submission. Would you like the step‑by‑step flow?",
    renewalSteps: [
      "1) Book medical (if required) → 2) Apply online → 3) Pay fees → 4) Biometrics (if prompted) → 5) Receive e‑visa/updated file"    ],
    id: "Emirates ID renewal: ensure passport validity > 6 months, residence permit valid, and recent photo meeting ICP specs. Processing typically 24–48h after biometrics.",
    documents:
      "Common documents: Passport, Emirates ID, personal photo, tenancy/Ejari, labor contract (if sponsored by company), marriage/birth certificates for dependents.",
    fees:
      "Indicative fees vary by inside/outside status and service type. Example: Spouse Residence Visa (inside) ≈ 1,100–1,250 AED; (outside) ≈ 500–600 AED. Always confirm live totals before paying.",
    track:
      "Enter your Emirates ID (15 digits) or passport number to fetch status. (This demo uses mock data.)",
    applyCTA: "Start Application",
    learnMore: "Learn More",
  },
  ar: {
    greet: "كيف أستطيع مساعدتك اليوم؟ جرّب: 'ما رسوم تجديد تأشيرة الزوج/الزوجة؟' أو 'تتبع حالة التأشيرة'.",
    renewal:
      "عادةً يتطلب تجديد الإقامة: صورة جواز ساري، الهوية الإماراتية، فحص طبي (إن لزم)، إيجاري/سكن، والتأمين. المعالجة غالباً 24–72 ساعة بعد التقديم. هل تريد الخطوات بالتفصيل؟",
    renewalSteps: [
      "1) حجز الفحص الطبي (إن لزم) → 2) التقديم الإلكتروني → 3) دفع الرسوم → 4) البصمة (إن طُلب) → 5) استلام التأشيرة الإلكترونية/تحديث الملف",
      "تريد قائمة تحقق PDF؟ أستطيع إنشائها لك.",
    ],
    id: "تجديد الهوية الإماراتية: التأكد من صلاحية الجواز لأكثر من 6 أشهر، وصلاحية الإقامة، وصورة شخصية وفق مواصفات الهيئة. المعالجة عادة 24–48 ساعة بعد البصمة.",
    documents:
      "المستندات الشائعة: جواز السفر، الهوية الإماراتية، صورة شخصية، إيجاري/عقد سكن، عقد العمل (إن كان الكفيل شركة)، شهادات الزواج/الميلاد للتابعين.",
    fees:
      "الرسوم تقديرية وتختلف حسب داخل/خارج الدولة ونوع الخدمة. مثال: إقامة الزوج/الزوجة (داخل) ≈ 1100–1250 درهم، (خارج) ≈ 500–600 درهم. يرجى التأكد من المبلغ النهائي قبل الدفع.",
    track:
      "أدخل رقم الهوية الإماراتية (15 خانة) أو رقم الجواز لتتبع الحالة. (هذا عرض تجريبي).",
    applyCTA: "ابدأ الطلب",
    learnMore: "المزيد",
  },
};

const mockFetchStatus = async (identifier) => {
  // Mock latency
  await new Promise((r) => setTimeout(r, 800));
  const sample = {
    status: ["Received", "Under Review", "Approved", "Pending Documents"][
      Math.floor(Math.random() * 4)
    ],
    lastUpdate: new Date().toLocaleString(),
    reference: "APP-" + Math.floor(Math.random() * 1_000_000),
  };
  return { input: identifier, ...sample };
};

const feeEstimator = (text) => {
  const t = text.toLowerCase();
  const inside = /inside|داخل|in\s?uae/.test(t);
  const outside = /outside|خارج/.test(t);
  const baseInside = 1189;
  const baseOutside = 539;
  const result = inside
    ? { band: "inside", amount: baseInside }
    : outside
    ? { band: "outside", amount: baseOutside }
    : { band: "estimate", amount: 900 };
  return result;
};

const detectIntent = (text) => {
  const t = text.toLowerCase();
  if (/hi|hello|marhaba|salam|السلام|مرحبا/.test(t)) return "greet";
  if (/renew|renewal|تجديد|إقامة/.test(t)) return "renewal";
  if (/emirates\s?id|eid|هوية/.test(t)) return "id";
  if (/document|مستند|required|requirements|مطلوب/.test(t)) return "documents";
  if (/fee|cost|price|رسوم/.test(t)) return "fees";
  if (/track|status|حالة|تتبع/.test(t)) return "track";
  if (/apply|قدم|ابدأ/.test(t)) return "apply";
  return "fallback";
};

export default function AmerSmartAssistant() {
  const [lang, setLang] = useState("en");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [uaePass, setUaePass] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    // Intro message
    setMessages([
      {
        sender: "bot",
        text: i18n[lang].intro,
        meta: { ts: Date.now() },
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleQuick = async (key) => {
    if (key === "track") {
      setInput(lang === "en" ? "Track status: 784-XXXX-XXXXXXX-?" : "تتبع الحالة: 784-XXXX-XXXXXXX-?");
      return;
    }
    await onSend(quickKnowledge[lang][key] ? key : "");
  };

  const say = (sender, text, extra = {}) => {
    setMessages((m) => [...m, { sender, text, meta: { ts: Date.now(), ...extra } }]);
  };

  const botReply = async (userText) => {
    const intent = detectIntent(userText);
    const K = quickKnowledge[lang];

    switch (intent) {
      case "greet":
        say("bot", K.greet);
        break;
      case "renewal":
        say("bot", K.renewal);
        K.renewalSteps.forEach((line) => say("bot", line));
        break;
      case "id":
        say("bot", K.id);
        break;
      case "documents":
        say("bot", K.documents);
        break;
      case "fees": {
        const { band, amount } = feeEstimator(userText);
        const msg =
          lang === "en"
            ? `Estimated ${band} fee band: ~ AED ${amount}. Use the official portal for the live total before payment.`
            : `تقدير نطاق الرسوم (${band}): ~ ${amount} درهم. يرجى التأكد من المبلغ النهائي عبر البوابة الرسمية قبل الدفع.`;
        say("bot", K.fees);
        say("bot", msg);
        break;
      }
      case "track": {
        const idMatch = userText.match(/(784[- ]?\d{4}[- ]?\d{7}[- ]?\d)/) || userText.match(/\b[A-Z0-9]{6,}\b/);
        if (!idMatch) {
          say(
            "bot",
            lang === "en"
              ? "Please provide your Emirates ID (15 digits) or passport number to check."
              : "يرجى إدخال رقم الهوية الإماراتية (15 خانة) أو رقم الجواز للتحقق."
          );
        } else {
          const ident = idMatch[0];
          setTyping(true);
          const status = await mockFetchStatus(ident);
          setTyping(false);
          const line =
            lang === "en"
              ? `Status: ${status.status}\nReference: ${status.reference}\nLast update: ${status.lastUpdate}`
              : `الحالة: ${status.status}\nالمرجع: ${status.reference}\nآخر تحديث: ${status.lastUpdate}`;
          say("bot", line, { status });
        }
        break;
      }
      case "apply":
        say(
          "bot",
          lang === "en"
            ? "Opening the application flow… (demo). You can integrate the real 'Apply' endpoint here."
            : "بدء مسار التقديم… (عرض تجريبي). يمكنك ربط واجهة 'ابدأ الطلب' الحقيقية هنا."
        );
        break;
      default:
        say(
          "bot",
          lang === "en"
            ? "I didn't fully get that. Try asking about visa renewal, Emirates ID, fees, documents, or 'track status'."
            : "لم أفهم تمامًا. جرّب السؤال عن تجديد الإقامة، الهوية الإماراتية، الرسوم، المستندات أو 'تتبع الحالة'."
        );
        break;
    }
  };

  const onSend = async (forcedIntentKey = "") => {
    const text = forcedIntentKey ? forcedIntentKey : input.trim();
    if (!text) return;
    say("user", forcedIntentKey ? `[${text}]` : text);
    setInput("");
    setTyping(true);
    await new Promise((r) => setTimeout(r, 350));
    setTyping(false);
    await botReply(text);
  };

  const headerBadge = useMemo(() => (
    <div className="amer-badge-group">
      <div className="amer-badge">
        <ShieldCheck size={16} />
        <span>Secure</span>
      </div>
      <button
        onClick={() => setUaePass((v) => !v)}
        className={`amer-badge ${uaePass ? "verified" : ""}`}
        title={uaePass ? i18n[lang].loggedIn : i18n[lang].loginUAEPass}
      >
        {uaePass ? <CheckCircle2 size={16} /> : <Lock size={16} />}
        <span>{uaePass ? i18n[lang].loggedIn : i18n[lang].loginUAEPass}</span>
      </button>
    </div>
  ), [lang, uaePass]);

  return (
    <div className="amer-container">
      <div className="amer-main">
        {/* Header */}
        <div className="amer-header">
          <div className="amer-header-left">
            <div className="amer-bot-icon">
              <Bot size={24} />
            </div>
            <div className="amer-header-info">
              <h1>{i18n[lang].title}</h1>
              <p>{i18n[lang].subtitle}</p>
            </div>
          </div>
          <div className="amer-header-right">
            {headerBadge}
            <button
              onClick={() => setLang((l) => (l === "en" ? "ar" : "en"))}
              className="amer-lang-btn"
              title="Switch Language"
            >
              <Languages size={16} />
              <span>{i18n[lang].chips.arabic}</span>
            </button>
          </div>
        </div>

        {/* Chat area */}
        <div className="amer-chat-area">
          <div className="amer-messages">
            {messages.map((m, idx) => (
              <div key={idx} className={`amer-message ${m.sender}`}>
                {m.sender === "bot" && (
                  <div className="amer-message-avatar bot">
                    <Bot size={16} />
                  </div>
                )}
                <div
                  className={`amer-message-bubble ${m.sender}`}
                  dir={lang === "ar" ? "rtl" : "ltr"}
                >
                  <p className="amer-message-text">{m.text}</p>
                </div>
                {m.sender === "user" && (
                  <div className="amer-message-avatar user">
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}

            {typing && (
              <div className="amer-typing">
                <Loader2 size={16} />
                <span>{i18n[lang].typing}</span>
              </div>
            )}

            {/* Quick replies */}
            <div className="amer-quick-replies">
              <div className="amer-chips">
                {["renewal", "id", "fees", "documents", "track"].map((k) => (
                  <button
                    key={k}
                    onClick={() => handleQuick(k)}
                    className="amer-chip"
                  >
                    {i18n[lang].chips[k]}
                  </button>
                ))}
              </div>
            </div>
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div className="amer-input-area">
          <div className="amer-input-container">
            <div className="amer-input-wrapper">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSend()}
                placeholder={i18n[lang].placeholder}
                className={`amer-input ${lang === "ar" ? "rtl" : ""}`}
              />
            </div>
            <button
              onClick={() => onSend()}
              className="amer-send-btn"
            >
              <Send size={16} />
            </button>
          </div>
          <div className="amer-footer">
            <div className="amer-footer-item">
              <MessageSquare size={12} />
              <span>{i18n[lang].lastUpdated}</span>
            </div>
            <div className="amer-footer-item">
              <RefreshCw size={12} />
              <span>Demo build – replace with live APIs</span>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}