import React, { useEffect, useMemo, useRef, useState } from "react";
import { Send, Bot, User, Loader2, Languages, Lock, CheckCircle2, X, MessageCircle, Paperclip, FileText, Image, File } from "lucide-react";
import "./index.css";

/**
 * Amer Smart Assistant - Enhanced Floating Widget Version
 * --------------------------------------------------------
 * - Floating action button that opens/closes the chat
 * - Compact widget design for embedding on any website
 * - Enhanced multilingual support with comprehensive responses
 * - File upload functionality for documents and images
 * - Advanced intent detection and comprehensive knowledge base
 * - Mobile responsive design with improved accessibility
 */

const i18n = {
  en: {
    title: "Amer Smart Assistant",
    subtitle: "Ask me about visas, Emirates ID, fees, documents, or track your status.",
    placeholder: "Type your question or upload a file...",
    intro: "Welcome! I'm your comprehensive guide for UAE government services. I can help with visa renewals, Emirates ID applications, fee calculations, document requirements, status tracking, and more. How can I assist you today?",
    chips: {
      renewal: "Visa Renewal",
      id: "Emirates ID",
      fees: "Fees Calculator",
      documents: "Required Documents",
      track: "Track Status",
      services: "All Services",
      arabic: "العربية",
    },
    typing: "Assistant is typing...",
    loginUAEPass: "Login with UAE PASS",
    loggedIn: "Verified via UAE PASS",
    lastUpdated: "Advisory only – verify final fees/timelines on official portals.",
    fileUpload: "Upload File",
    fileUploaded: "File uploaded successfully",
    supportedFiles: "Supported: PDF, DOC, DOCX, JPG, PNG (Max 10MB)",
  },
  ar: {
    title: "مساعد آمر الذكي",
    subtitle: "اسألني عن التأشيرات، بطاقة الهوية الإماراتية، الرسوم، المستندات أو تتبع الحالة.",
    placeholder: "اكتب سؤالك أو ارفع ملف...",
    intro: "مرحباً! أنا دليلك الشامل لخدمات الحكومة الإماراتية. أستطيع المساعدة في تجديد التأشيرات، طلبات الهوية الإماراتية، حساب الرسوم، متطلبات المستندات، تتبع الحالة، والمزيد. كيف يمكنني مساعدتك اليوم؟",
    chips: {
      renewal: "تجديد التأشيرة",
      id: "الهوية الإماراتية",
      fees: "حاسبة الرسوم",
      documents: "المستندات المطلوبة",
      track: "تتبع الحالة",
      services: "جميع الخدمات",
      arabic: "English",
    },
    typing: "...المساعد يكتب",
    loginUAEPass: "تسجيل الدخول عبر UAE PASS",
    loggedIn: "تم التحقق عبر UAE PASS",
    lastUpdated: "للاسترشاد فقط – يرجى التحقق من الرسوم والمدة من القنوات الرسمية.",
    fileUpload: "رفع ملف",
    fileUploaded: "تم رفع الملف بنجاح",
    supportedFiles: "المدعوم: PDF, DOC, DOCX, JPG, PNG (حد أقصى 10 ميجا)",
  },
};

// Comprehensive knowledge base
const knowledgeBase = {
  en: {
    greet: "Hello! I'm here to help you with UAE government services. I can assist with:\n\n• Visa renewals and applications\n• Emirates ID services\n• Fee calculations\n• Document requirements\n• Status tracking\n• General inquiries\n\nWhat would you like to know?",
    
    // Visa Services
    renewal: "Here's everything about UAE residence visa renewal:\n\n📋 **Required Documents:**\n• Valid passport (min. 6 months validity)\n• Current Emirates ID\n• Salary certificate or employment contract\n• Tenancy contract (Ejari)\n• Health insurance certificate\n• Medical fitness certificate (if required)\n\n⏱️ **Processing Time:** 24-72 hours\n💰 **Estimated Cost:** AED 1,100 - 1,250 (varies by emirate)\n\nWould you like the step-by-step process?",
    
    renewalSteps: "**Step-by-Step Visa Renewal Process:**\n\n1️⃣ **Prepare Documents** - Gather all required documents\n2️⃣ **Medical Test** - Complete if required (validity check)\n3️⃣ **Online Application** - Submit via official portal\n4️⃣ **Fee Payment** - Pay processing fees\n5️⃣ **Biometrics** - Complete if requested\n6️⃣ **Approval** - Receive updated visa/Emirates ID\n\n📱 You can track progress online with your application number.",
    
    // Emirates ID
    id: "**Emirates ID Services Guide:**\n\n🆕 **New Application:**\n• Valid passport + visa\n• Biometric enrollment\n• Processing: 5-7 working days\n• Cost: AED 270-370\n\n🔄 **Renewal:**\n• Current Emirates ID\n• Valid residence visa\n• Updated photo (white background)\n• Processing: 24-48 hours after biometrics\n• Cost: AED 270\n\n⚠️ **Lost/Damaged:**\n• Police report required\n• Re-enrollment needed\n• Cost: AED 270 + penalties\n\nNeed help with a specific Emirates ID service?",
    
    // Documents
    documents: "**Complete Document Requirements by Service:**\n\n👨‍👩‍👧‍👦 **Family Visa:**\n• Sponsor's salary certificate (min. AED 4,000)\n• Marriage certificate (attested)\n• Birth certificates for children\n• Medical fitness certificates\n• Tenancy contract\n• Health insurance\n\n💼 **Employment Visa:**\n• Employment contract\n• Educational certificates (attested)\n• Experience certificates\n• Medical fitness certificate\n• Passport with 6+ months validity\n\n🎓 **Student Visa:**\n• Admission letter from recognized institution\n• Academic transcripts\n• Financial guarantee (AED 40,000+)\n• Health insurance\n• Medical fitness certificate\n\nWhich specific visa type do you need document details for?",
    
    // Fees
    fees: "**UAE Visa & Emirates ID Fee Calculator:**\n\n🏠 **Residence Visa (Inside UAE):**\n• New: AED 1,200-1,500\n• Renewal: AED 1,100-1,250\n• Multiple entry: +AED 500\n\n✈️ **Entry Permit (Outside UAE):**\n• New: AED 500-650\n• Change status: AED 580-750\n\n🆔 **Emirates ID:**\n• New/Renewal: AED 270\n• Urgent processing: AED 670\n• Replacement: AED 270 + penalties\n\n💡 **Additional Fees:**\n• Medical fitness: AED 300-500\n• Document attestation: AED 50-200\n• Typing services: AED 50-100\n\n*Fees vary by emirate and service type. Always verify current rates on official portals.*",
    
    // Tracking
    track: "**Status Tracking Options:**\n\n🔍 **What you can track:**\n• Visa applications\n• Emirates ID applications\n• Document attestation\n• Medical appointments\n• Payment confirmations\n\n📱 **How to track:**\n1. Visit official portal/app\n2. Enter Emirates ID or passport number\n3. Provide application reference\n4. Check status updates\n\n📧 **Notifications:**\n• SMS updates available\n• Email confirmations\n• Mobile app push notifications\n\nPlease provide your Emirates ID (15 digits) or application reference to check status.",
    
    // Services
    services: "**Complete UAE Government Services:**\n\n🏛️ **AMER Centers:**\n• Visa services\n• Emirates ID\n• Status changes\n• Document collection\n\n🏥 **Health Services:**\n• Medical fitness tests\n• Health insurance\n• Medical approvals\n\n📋 **Document Services:**\n• Attestation services\n• Translation services\n• Certificate verification\n\n🚗 **RTA Services:**\n• License renewal\n• Vehicle registration\n• Traffic fines\n\n🏠 **Housing Services:**\n• Ejari registration\n• Tenancy contracts\n• DEWA connections\n\nWhich service area interests you most?",
    
    // Default responses for various topics
    appointment: "**Booking Appointments:**\n\n📅 **Available Channels:**\n• Official website/mobile app\n• Call center: 600-522637\n• Walk-in (limited slots)\n\n⏰ **Best Times to Book:**\n• Early morning slots (8-10 AM)\n• Avoid weekends and holidays\n• Book 2-3 days in advance\n\n💡 **Tips:**\n• Arrive 15 minutes early\n• Bring all required documents\n• Payment methods: Cash, card, digital\n\nWould you like help finding the nearest center?",
    
    medical: "**Medical Requirements:**\n\n🏥 **Approved Centers:**\n• AMER medical centers\n• Authorized clinics\n• Government hospitals\n\n🩺 **Tests Required:**\n• General health screening\n• Blood tests (HIV, Hepatitis, etc.)\n• Chest X-ray\n• Pregnancy test (if applicable)\n\n📋 **Requirements:**\n• Valid passport\n• Visa copy\n• Recent passport photo\n• Medical form (provided)\n\n💰 **Cost:** AED 300-500\n⏱️ **Results:** 24-48 hours\n\nResults are digitally linked to your application.",
    
    fallback: "I understand you're looking for information about UAE government services. Here's how I can help:\n\n🔹 **Visa Services** - Applications, renewals, requirements\n🔹 **Emirates ID** - New applications, renewals, replacements\n🔹 **Fee Information** - Costs, payment methods, calculations\n🔹 **Documents** - Requirements, attestation, translations\n🔹 **Status Tracking** - Applications, appointments, payments\n🔹 **Appointments** - Booking, rescheduling, locations\n🔹 **Medical Services** - Fitness tests, approved centers\n\nCould you please specify what you'd like to know more about? You can also try asking questions like:\n• 'What documents do I need for spouse visa?'\n• 'How much does Emirates ID renewal cost?'\n• 'Where can I get medical fitness test?'"
  },
  
  ar: {
    greet: "مرحباً! أنا هنا لمساعدتك في خدمات الحكومة الإماراتية. يمكنني المساعدة في:\n\n• تجديد وتطبيقات التأشيرات\n• خدمات الهوية الإماراتية\n• حساب الرسوم\n• متطلبات المستندات\n• تتبع الحالة\n• الاستفسارات العامة\n\nماذا تريد أن تعرف؟",
    
    renewal: "إليك كل شيء عن تجديد تأشيرة الإقامة الإماراتية:\n\n📋 **المستندات المطلوبة:**\n• جواز سفر صالح (صالح لـ 6 أشهر على الأقل)\n• الهوية الإماراتية الحالية\n• شهادة راتب أو عقد عمل\n• عقد إيجار (إيجاري)\n• شهادة التأمين الصحي\n• شهادة اللياقة الطبية (إذا لزم الأمر)\n\n⏱️ **وقت المعالجة:** 24-72 ساعة\n💰 **التكلفة المقدرة:** 1,100 - 1,250 درهم (تختلف حسب الإمارة)\n\nهل تريد العملية خطوة بخطوة؟",
    
    renewalSteps: "**عملية تجديد التأشيرة خطوة بخطوة:**\n\n1️⃣ **تحضير المستندات** - جمع جميع المستندات المطلوبة\n2️⃣ **الفحص الطبي** - إكمال إذا لزم الأمر (فحص الصلاحية)\n3️⃣ **الطلب الإلكتروني** - تقديم عبر البوابة الرسمية\n4️⃣ **دفع الرسوم** - دفع رسوم المعالجة\n5️⃣ **القياسات الحيوية** - إكمال إذا طُلب\n6️⃣ **الموافقة** - استلام التأشيرة/الهوية الإماراتية المحدثة\n\n📱 يمكنك تتبع التقدم عبر الإنترنت برقم طلبك.",
    
    id: "**دليل خدمات الهوية الإماراتية:**\n\n🆕 **طلب جديد:**\n• جواز سفر صالح + تأشيرة\n• تسجيل القياسات الحيوية\n• المعالجة: 5-7 أيام عمل\n• التكلفة: 270-370 درهم\n\n🔄 **التجديد:**\n• الهوية الإماراتية الحالية\n• تأشيرة إقامة صالحة\n• صورة محدثة (خلفية بيضاء)\n• المعالجة: 24-48 ساعة بعد القياسات الحيوية\n• التكلفة: 270 درهم\n\n⚠️ **مفقودة/تالفة:**\n• تقرير الشرطة مطلوب\n• إعادة التسجيل مطلوبة\n• التكلفة: 270 درهم + غرامات\n\nهل تحتاج مساعدة في خدمة معينة للهوية الإماراتية؟",
    
    documents: "**متطلبات المستندات الكاملة حسب الخدمة:**\n\n👨‍👩‍👧‍👦 **تأشيرة عائلية:**\n• شهادة راتب الكفيل (4,000 درهم كحد أدنى)\n• شهادة زواج (مصدقة)\n• شهادات ميلاد الأطفال\n• شهادات اللياقة الطبية\n• عقد إيجار\n• التأمين الصحي\n\n💼 **تأشيرة عمل:**\n• عقد عمل\n• الشهادات التعليمية (مصدقة)\n• شهادات الخبرة\n• شهادة اللياقة الطبية\n• جواز سفر صالح لأكثر من 6 أشهر\n\n🎓 **تأشيرة طالب:**\n• خطاب قبول من مؤسسة معتمدة\n• كشوف الدرجات الأكاديمية\n• ضمان مالي (40,000 درهم+)\n• التأمين الصحي\n• شهادة اللياقة الطبية\n\nأي نوع تأشيرة محدد تحتاج تفاصيل المستندات له؟",
    
    fees: "**حاسبة رسوم التأشيرة والهوية الإماراتية:**\n\n🏠 **تأشيرة الإقامة (داخل الإمارات):**\n• جديدة: 1,200-1,500 درهم\n• تجديد: 1,100-1,250 درهم\n• متعددة الدخول: +500 درهم\n\n✈️ **تصريح دخول (خارج الإمارات):**\n• جديد: 500-650 درهم\n• تغيير الحالة: 580-750 درهم\n\n🆔 **الهوية الإماراتية:**\n• جديد/تجديد: 270 درهم\n• معالجة عاجلة: 670 درهم\n• بديل: 270 درهم + غرامات\n\n💡 **رسوم إضافية:**\n• اللياقة الطبية: 300-500 درهم\n• تصديق المستندات: 50-200 درهم\n• خدمات الكتابة: 50-100 درهم\n\n*تختلف الرسوم حسب الإمارة ونوع الخدمة. تحقق دائماً من الأسعار الحالية في البوابات الرسمية.*",
    
    track: "**خيارات تتبع الحالة:**\n\n🔍 **ما يمكنك تتبعه:**\n• طلبات التأشيرة\n• طلبات الهوية الإماراتية\n• تصديق المستندات\n• مواعيد طبية\n• تأكيدات الدفع\n\n📱 **كيفية التتبع:**\n1. زيارة البوابة/التطبيق الرسمي\n2. إدخال رقم الهوية الإماراتية أو الجواز\n3. تقديم مرجع الطلب\n4. فحص تحديثات الحالة\n\n📧 **الإشعارات:**\n• تحديثات SMS متاحة\n• تأكيدات البريد الإلكتروني\n• إشعارات push للتطبيق المحمول\n\nيرجى تقديم رقم الهوية الإماراتية (15 خانة) أو مرجع الطلب للتحقق من الحالة.",
    
    services: "**خدمات الحكومة الإماراتية الكاملة:**\n\n🏛️ **مراكز آمر:**\n• خدمات التأشيرات\n• الهوية الإماراتية\n• تغيير الحالة\n• جمع المستندات\n\n🏥 **الخدمات الصحية:**\n• فحوص اللياقة الطبية\n• التأمين الصحي\n• الموافقات الطبية\n\n📋 **خدمات المستندات:**\n• خدمات التصديق\n• خدمات الترجمة\n• التحقق من الشهادات\n\n🚗 **خدمات هيئة الطرق:**\n• تجديد الرخصة\n• تسجيل المركبات\n• مخالفات المرور\n\n🏠 **خدمات الإسكان:**\n• تسجيل الإيجاري\n• عقود الإيجار\n• توصيلات ديوا\n\nأي مجال خدمة يهمك أكثر؟",
    
    appointment: "**حجز المواعيد:**\n\n📅 **القنوات المتاحة:**\n• الموقع الرسمي/التطبيق المحمول\n• مركز الاتصال: 600-522637\n• الزيارة المباشرة (مواعيد محدودة)\n\n⏰ **أفضل الأوقات للحجز:**\n• مواعيد الصباح الباكر (8-10 ص)\n• تجنب نهايات الأسبوع والعطل\n• احجز قبل 2-3 أيام\n\n💡 **نصائح:**\n• اصل قبل 15 دقيقة\n• أحضر جميع المستندات المطلوبة\n• طرق الدفع: نقد، بطاقة، رقمي\n\nهل تريد مساعدة في العثور على أقرب مركز؟",
    
    medical: "**المتطلبات الطبية:**\n\n🏥 **المراكز المعتمدة:**\n• المراكز الطبية لآمر\n• العيادات المعتمدة\n• المستشفيات الحكومية\n\n🩺 **الفحوص المطلوبة:**\n• فحص صحي عام\n• فحوص الدم (الإيدز، التهاب الكبد، إلخ)\n• أشعة الصدر\n• فحص الحمل (إن أمكن)\n\n📋 **المتطلبات:**\n• جواز سفر صالح\n• نسخة التأشيرة\n• صورة شخصية حديثة\n• نموذج طبي (مقدم)\n\n💰 **التكلفة:** 300-500 درهم\n⏱️ **النتائج:** 24-48 ساعة\n\nالنتائج مربوطة رقمياً بطلبك.",
    
    fallback: "أفهم أنك تبحث عن معلومات حول خدمات الحكومة الإماراتية. إليك كيف يمكنني المساعدة:\n\n🔹 **خدمات التأشيرات** - الطلبات، التجديدات، المتطلبات\n🔹 **الهوية الإماراتية** - الطلبات الجديدة، التجديدات، البدائل\n🔹 **معلومات الرسوم** - التكاليف، طرق الدفع، الحسابات\n🔹 **المستندات** - المتطلبات، التصديق، الترجمات\n🔹 **تتبع الحالة** - الطلبات، المواعيد، المدفوعات\n🔹 **المواعيد** - الحجز، إعادة الجدولة، المواقع\n🔹 **الخدمات الطبية** - فحوص اللياقة، المراكز المعتمدة\n\nهل يمكنك تحديد ما تريد معرفة المزيد عنه؟ يمكنك أيضاً تجربة أسئلة مثل:\n• 'ما المستندات التي أحتاجها لتأشيرة الزوج؟'\n• 'كم تكلفة تجديد الهوية الإماراتية؟'\n• 'أين يمكنني الحصول على فحص اللياقة الطبية؟'"
  },
};

const mockFetchStatus = async (identifier) => {
  await new Promise((r) => setTimeout(r, 800));
  const statuses = ["Received", "Under Review", "Approved", "Pending Documents", "Ready for Collection"];
  const sample = {
    status: statuses[Math.floor(Math.random() * statuses.length)],
    lastUpdate: new Date().toLocaleString(),
    reference: "APP-" + Math.floor(Math.random() * 1_000_000),
    nextAction: "Visit AMER center for biometrics",
  };
  return { input: identifier, ...sample };
};

const feeEstimator = (text, lang) => {
  const t = text.toLowerCase();
  const inside = /inside|داخل|in\s?uae/.test(t);
  const outside = /outside|خارج/.test(t);
  const urgent = /urgent|عاجل|express/.test(t);
  
  let baseInside = 1189;
  let baseOutside = 539;
  
  if (urgent) {
    baseInside += 300;
    baseOutside += 200;
  }
  
  if (/family|spouse|wife|husband|زوج|عائل/.test(t)) {
    baseInside += 100;
    baseOutside += 50;
  }
  
  const result = inside
    ? { band: "inside", amount: baseInside, type: "residence" }
    : outside
    ? { band: "outside", amount: baseOutside, type: "entry_permit" }
    : { band: "estimate", amount: 900, type: "general" };
    
  return result;
};

const detectIntent = (text) => {
  const t = text.toLowerCase();
  
  // Enhanced intent detection with more patterns
  if (/hi|hello|hey|marhaba|salam|السلام|مرحبا|أهلا/.test(t)) return "greet";
  if (/renew|renewal|تجديد|إقامة|residence/.test(t)) return "renewal";
  if (/emirates\s?id|eid|هوية|identity/.test(t)) return "id";
  if (/document|مستند|required|requirements|مطلوب|papers|أوراق/.test(t)) return "documents";
  if (/fee|cost|price|رسوم|تكلفة|سعر|money/.test(t)) return "fees";
  if (/track|status|حالة|تتبع|check|فحص/.test(t)) return "track";
  if (/appointment|موعد|book|حجز/.test(t)) return "appointment";
  if (/medical|طبي|health|صحة/.test(t)) return "medical";
  if (/service|خدمة|help|مساعدة/.test(t)) return "services";
  if (/apply|قدم|ابدأ|start|begin/.test(t)) return "apply";
  
  return "fallback";
};

const processFileUpload = (file, lang) => {
  const fileSize = (file.size / 1024 / 1024).toFixed(2);
  const fileType = file.type;
  const fileName = file.name;
  
  let response = "";
  
  if (lang === "en") {
    response = `I've received your file "${fileName}" (${fileSize}MB). `;
    
    if (fileType.includes('pdf')) {
      response += "I can help you understand document requirements if this is a certificate or form. ";
    } else if (fileType.includes('image')) {
      response += "If this is a document photo, I can guide you on proper document submission. ";
    }
    
    response += "How can I assist you with this document?";
  } else {
    response = `لقد استلمت ملفك "${fileName}" (${fileSize} ميجا). `;
    
    if (fileType.includes('pdf')) {
      response += "يمكنني مساعدتك في فهم متطلبات المستندات إذا كان هذا شهادة أو نموذج. ";
    } else if (fileType.includes('image')) {
      response += "إذا كانت هذه صورة مستند، يمكنني إرشادك حول تقديم المستندات المناسب. ";
    }
    
    response += "كيف يمكنني مساعدتك بهذا المستند؟";
  }
  
  return response;
};

export default function ChatbotWidget() {
  const [lang, setLang] = useState("en");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [uaePass, setUaePass] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Intro message
    setMessages([
      {
        sender: "bot",
        text: i18n[lang].intro,
        meta: { ts: Date.now() },
      },
    ]);
  }, [lang]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Show notification when new bot message arrives and widget is closed
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === "bot" && !isOpen) {
      setHasNewMessage(true);
    }
  }, [messages, isOpen]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      say("bot", lang === "en" 
        ? "File size exceeds 10MB limit. Please upload a smaller file."
        : "حجم الملف يتجاوز حد 10 ميجا. يرجى رفع ملف أصغر.");
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      say("bot", lang === "en" 
        ? "Unsupported file type. Please upload PDF, DOC, DOCX, JPG, or PNG files only."
        : "نوع الملف غير مدعوم. يرجى رفع ملفات PDF أو DOC أو DOCX أو JPG أو PNG فقط.");
      return;
    }

    setUploadedFiles([...uploadedFiles, file]);
    const response = processFileUpload(file, lang);
    say("user", `📎 ${file.name}`);
    say("bot", response);
  };

  const handleQuick = async (key) => {
    if (key === "track") {
      setInput(lang === "en" ? "Track status: 784-XXXX-XXXXXXX-?" : "تتبع الحالة: 784-XXXX-XXXXXXX-?");
      return;
    }
    await onSend(key);
  };

  const say = (sender, text, extra = {}) => {
    setMessages((m) => [...m, { sender, text, meta: { ts: Date.now(), ...extra } }]);
  };

  const botReply = async (userText) => {
    const intent = detectIntent(userText);
    const K = knowledgeBase[lang];

    try {
      switch (intent) {
        case "greet":
          say("bot", K.greet);
          break;
          
        case "renewal":
          say("bot", K.renewal);
          // Add follow-up after a brief delay
          setTimeout(() => {
            say("bot", K.renewalSteps);
          }, 1000);
          break;
          
        case "id":
          say("bot", K.id);
          break;
          
        case "documents":
          say("bot", K.documents);
          break;
          
        case "fees": {
          const { band, amount, type } = feeEstimator(userText, lang);
          say("bot", K.fees);
          
          const additionalInfo = lang === "en" 
            ? `\n\n💡 **For your query:** Estimated ${band} fee for ${type}: ~AED ${amount}\n\n*This is an estimate. Please verify exact amounts on official portals before payment.*`
            : `\n\n💡 **لاستفسارك:** تقدير رسوم ${band} لـ${type}: ~${amount} درهم\n\n*هذا تقدير. يرجى التحقق من المبالغ الدقيقة على البوابات الرسمية قبل الدفع.*`;
          
          setTimeout(() => {
            say("bot", additionalInfo);
          }, 800);
          break;
        }
        
        case "track": {
          const idMatch = userText.match(/(784[- ]?\d{4}[- ]?\d{7}[- ]?\d)/) || 
                          userText.match(/\b[A-Z0-9]{6,}\b/) ||
                          userText.match(/\b\d{15}\b/);
          
          if (!idMatch) {
            say("bot", K.track);
          } else {
            const ident = idMatch[0];
            setTyping(true);
            const status = await mockFetchStatus(ident);
            setTyping(false);
            
            const statusInfo = lang === "en"
              ? `🔍 **Status Check Results:**\n\n📋 **Application:** ${status.reference}\n📊 **Status:** ${status.status}\n📅 **Last Update:** ${status.lastUpdate}\n📝 **Next Action:** ${status.nextAction}\n\n*This is demo data. Use official portals for real status.*`
              : `🔍 **نتائج فحص الحالة:**\n\n📋 **الطلب:** ${status.reference}\n📊 **الحالة:** ${status.status}\n📅 **آخر تحديث:** ${status.lastUpdate}\n📝 **الإجراء التالي:** ${status.nextAction}\n\n*هذه بيانات تجريبية. استخدم البوابات الرسمية للحالة الحقيقية.*`;
            
            say("bot", statusInfo, { status });
          }
          break;
        }
        
        case "appointment":
          say("bot", K.appointment);
          break;
          
        case "medical":
          say("bot", K.medical);
          break;
          
        case "services":
          say("bot", K.services);
          break;
          
        case "apply":
          say("bot", lang === "en"
            ? "🚀 **Starting Application Process...**\n\nI can guide you through:\n\n1️⃣ **Document Preparation** - What you need\n2️⃣ **Online Application** - Step-by-step guide\n3️⃣ **Fee Payment** - Amount and methods\n4️⃣ **Appointment Booking** - Available slots\n5️⃣ **Submission** - Final checklist\n\nWhich service would you like to apply for? (Visa, Emirates ID, etc.)"
            : "🚀 **بدء عملية التطبيق...**\n\nيمكنني إرشادك خلال:\n\n1️⃣ **تحضير المستندات** - ما تحتاجه\n2️⃣ **الطلب الإلكتروني** - دليل خطوة بخطوة\n3️⃣ **دفع الرسوم** - المبلغ والطرق\n4️⃣ **حجز الموعد** - المواعيد المتاحة\n5️⃣ **التقديم** - قائمة التحقق النهائية\n\nأي خدمة تريد التقدم لها؟ (التأشيرة، الهوية الإماراتية، إلخ)"
          );
          break;
          
        default:
          // Enhanced fallback with context awareness
          const contextualResponse = getContextualResponse(userText, lang);
          say("bot", contextualResponse);
          break;
      }
    } catch (error) {
      console.error("Bot reply error:", error);
      say("bot", lang === "en" 
        ? "I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team."
        : "أعتذر، لكنني أواجه صعوبة في معالجة طلبك الآن. يرجى المحاولة مرة أخرى أو التواصل مع فريق الدعم.");
    }
  };

  const getContextualResponse = (text, lang) => {
    const t = text.toLowerCase();
    const K = knowledgeBase[lang];
    
    // Check for specific topics mentioned
    if (t.includes('visa') || t.includes('تأشيرة')) {
      return K.renewal;
    } else if (t.includes('id') || t.includes('هوية')) {
      return K.id;
    } else if (t.includes('fee') || t.includes('cost') || t.includes('رسوم')) {
      return K.fees;
    } else if (t.includes('document') || t.includes('مستند')) {
      return K.documents;
    } else if (t.includes('appointment') || t.includes('موعد')) {
      return K.appointment;
    } else if (t.includes('medical') || t.includes('طبي')) {
      return K.medical;
    }
    
    return K.fallback;
  };

  const onSend = async (forcedIntentKey = "") => {
    const text = forcedIntentKey ? forcedIntentKey : input.trim();
    if (!text) return;
    
    say("user", forcedIntentKey ? `[Quick: ${i18n[lang].chips[text] || text}]` : text);
    setInput("");
    setTyping(true);
    
    // Simulate thinking time
    await new Promise((r) => setTimeout(r, 500 + Math.random() * 500));
    setTyping(false);
    
    await botReply(text);
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessage(false);
    }
  };

  const headerBadge = useMemo(() => (
    <div className="amer-header-badges">
      <button
        onClick={() => setUaePass((v) => !v)}
        className={`amer-badge ${uaePass ? "verified" : ""}`}
        title={uaePass ? i18n[lang].loggedIn : i18n[lang].loginUAEPass}
        aria-label={uaePass ? i18n[lang].loggedIn : i18n[lang].loginUAEPass}
      >
        {uaePass ? <CheckCircle2 size={12} /> : <Lock size={12} />}
        <span>{uaePass ? "UAE PASS" : "Login"}</span>
      </button>
    </div>
  ), [lang, uaePass]);

  return (
    <div className="amer-widget">
      {/* Floating Action Button */}
      <button
        className={`amer-fab ${isOpen ? 'opened' : ''} ${hasNewMessage ? 'bounce' : ''}`}
        onClick={toggleWidget}
        title="Amer Smart Assistant"
        aria-label="Toggle Chat Assistant"
      >
        {hasNewMessage && <div className="amer-badge-notification">1</div>}
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Widget Window */}
      <div className={`amer-widget-window ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="amer-header">
          <div className="amer-header-left">
            <div className="amer-bot-icon">
              <Bot size={16} />
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
              aria-label="Switch Language"
            >
              <Languages size={12} />
              <span>{i18n[lang].chips.arabic}</span>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="amer-close-btn"
              title="Close"
              aria-label="Close Chat"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="amer-chat-area">
          <div className="amer-messages">
            {messages.map((m, idx) => (
              <div key={idx} className={`amer-message ${m.sender}`}>
                {m.sender === "bot" && (
                  <div className="amer-message-avatar bot">
                    <Bot size={12} />
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
                    <User size={12} />
                  </div>
                )}
              </div>
            ))}

            {typing && (
              <div className="amer-typing">
                <Loader2 size={12} />
                <span>{i18n[lang].typing}</span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick Replies */}
          <div className="amer-quick-replies">
            <div className="amer-chips">
              {["renewal", "id", "fees", "documents", "track", "services"].map((k) => (
                <button
                  key={k}
                  onClick={() => handleQuick(k)}
                  className="amer-chip"
                  aria-label={i18n[lang].chips[k]}
                >
                  {i18n[lang].chips[k]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="amer-input-area">
          <div className="amer-input-container">
            <div className="amer-input-wrapper">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSend()}
                placeholder={i18n[lang].placeholder}
                className={`amer-input ${lang === "ar" ? "rtl" : ""}`}
                aria-label="Type your message"
              />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="amer-file-btn"
              title={i18n[lang].fileUpload}
              aria-label={i18n[lang].fileUpload}
            >
              <Paperclip size={14} />
            </button>
            <button
              onClick={() => onSend()}
              className="amer-send-btn"
              disabled={!input.trim()}
              aria-label="Send message"
            >
              <Send size={14} />
            </button>
          </div>
          <div className="amer-file-info">
            <span>{i18n[lang].supportedFiles}</span>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          aria-label="Upload file"
        />
      </div>
    </div>
  );
}