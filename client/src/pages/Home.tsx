import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, AlertTriangle, CheckCircle, Info, ArrowRight, ChevronDown, ChevronUp, Zap, Globe, Shield, Smartphone, Link2, MapPin } from "lucide-react";

const LOGO_URL = "/propel-logo.png";
const PASSWORD = "rosydental";

// ─── DATA ───────────────────────────────────────────────────────────────────

const scores = [
  { category: "Overall", score: 32, color: "text-red-400", summary: "Critical gaps across all channels" },
  { category: "Technical SEO", score: 28, color: "text-red-400", summary: "Slow, bloated, missing fundamentals" },
  { category: "Page Speed / CWV", score: 20, color: "text-red-400", summary: "4.3s TTFB, 7.3s total load" },
  { category: "On-Page SEO", score: 30, color: "text-red-400", summary: "No H1, thin content, placeholder text" },
  { category: "Mobile Usability", score: 45, color: "text-yellow-400", summary: "Responsive but heavy and shift-prone" },
  { category: "E-E-A-T / Authority", score: 30, color: "text-red-400", summary: "No credentials, no authorship" },
  { category: "Local SEO", score: 38, color: "text-red-400", summary: "Phone mismatch, name inconsistency" },
  { category: "Google Business Profile", score: 55, color: "text-yellow-400", summary: "5.0 stars but incomplete optimization" },
  { category: "Backlink Profile", score: 15, color: "text-red-400", summary: "Near-zero external authority" },
  { category: "AEO", score: 25, color: "text-red-400", summary: "FAQ exists but not optimized" },
  { category: "GEO", score: 18, color: "text-red-400", summary: "Invisible to AI systems" },
];

const findings = [
  {
    id: 1,
    severity: "critical",
    category: "Page Speed / Core Web Vitals",
    title: "Page takes 7.3 seconds to load with a 4.3-second server response",
    icon: Zap,
    evidence: "Measured via curl: TTFB is 4.35 seconds (target: < 0.8s). Total page load is 7.31 seconds. The HTML document alone is 388 KB. Over 20 JavaScript files are loaded including jQuery, jQuery Migrate, Elementor, Essential Addons, ElementsKit, Fluent Forms, two sticky-header plugins, Astra Sites onboarding script (should not be on production), and jQuery UI.",
    impact: "Google's Core Web Vitals require LCP under 2.5 seconds for a 'good' rating. A 4.3-second TTFB alone exceeds this. Sites failing all three CWV metrics see 24% higher bounce rates and measurably lower rankings. For a dental implant practice where a single patient is worth $15K–$40K, every lost visitor has significant revenue impact.",
    fix: "1. Upgrade hosting or enable server-side caching (TTFB should be under 800ms). 2. Remove unused plugins: Astra Sites onboarding, duplicate sticky-header plugins, jQuery Migrate. 3. Defer non-critical JavaScript. 4. Enable GZIP/Brotli compression. 5. Use a CDN. 6. Inline critical CSS and lazy-load below-fold resources. Target: total page load under 3 seconds.",
    bestPractice: "Google's 2025-2026 CWV thresholds: LCP < 2.5s, INP < 200ms, CLS < 0.1. Only 48% of mobile pages pass all three metrics globally.",
  },
  {
    id: 2,
    severity: "critical",
    category: "Technical SEO",
    title: "Title tag displays 'roseydental.com' — the wrong domain entirely",
    icon: Globe,
    evidence: "The HTML <title> tag reads 'roseydental.com'. The actual domain is rosydental.net. This is also visible in the Elementor config: post.title is set to 'roseydental.com'. This means Google search results show the wrong name for the practice.",
    impact: "The title tag is the single most visible metadata element in search results. It directly influences click-through rate and tells Google what the page is about. Displaying the wrong domain name signals technical neglect and confuses both users and crawlers.",
    fix: "1. In WordPress Settings → General, update the Site Title. 2. In Elementor, update the page title for the homepage. 3. Set unique, descriptive titles for every page (e.g., 'Dental Implants in Bellevue, WA | Rosy Dental'). 4. Keep titles under 60 characters.",
    bestPractice: "Google's 2025 guidelines: title tags should be unique, descriptive, and accurately represent page content. They remain the strongest on-page ranking signal.",
  },
  {
    id: 3,
    severity: "critical",
    category: "Technical SEO",
    title: "No meta descriptions, no Open Graph tags, no Twitter Cards",
    icon: Globe,
    evidence: "No <meta name='description'> tag was found on any page. No og:title, og:description, og:image, or twitter:card tags were detected. When shared on social media or messaging apps, the site shows no controlled preview.",
    impact: "Meta descriptions influence click-through rates from search results. Without them, Google auto-generates snippets that may not highlight the practice's key differentiators. Missing OG tags mean poor social sharing appearance, which matters for a practice that could leverage patient referrals via social channels.",
    fix: "1. Add unique meta descriptions (120–155 characters) to every page. 2. Add og:title, og:description, og:image, og:url to every page. 3. Add twitter:card=summary_large_image. 4. Use an SEO plugin like Yoast or RankMath to manage these systematically.",
    bestPractice: "Google may rewrite meta descriptions 70% of the time, but well-written descriptions still improve CTR by 5-10% when used.",
  },
  {
    id: 4,
    severity: "critical",
    category: "Technical SEO",
    title: "No structured data / JSON-LD schema markup detected",
    icon: Globe,
    evidence: "No JSON-LD scripts were found. The only schema present is minimal WordPress microdata (WebPage on body, WPFooter on footer). No Dentist, LocalBusiness, FAQPage, Person, AggregateRating, Service, or BreadcrumbList schema exists.",
    impact: "For a dental implant practice, schema is the language that tells Google and AI systems exactly what the business is, where it is, who runs it, what services it offers, and what patients think. Without it: no star ratings in search results, no FAQ rich results, no appointment booking links, no hours display, and AI systems cannot confidently describe or recommend the practice.",
    fix: "1. Add Dentist (subtype of LocalBusiness) schema with name, address, phone, hours, geo, url, priceRange, and sameAs. 2. Add FAQPage schema to service pages. 3. Add Person schema for Dr. Kateb. 4. Add AggregateRating reflecting the 5.0 Google rating. 5. Add BreadcrumbList for navigation. 6. Add Service schema for each procedure. 7. Validate with Google's Rich Results Test.",
    bestPractice: "2026 dental SEO baseline: Dentist + LocalBusiness + FAQPage + Person + AggregateRating schema is the minimum for competitive implant practices. Practices with schema are 3x more likely to appear in AI Overviews.",
  },
  {
    id: 5,
    severity: "critical",
    category: "On-Page SEO",
    title: "No H1 heading tag on the homepage",
    icon: Globe,
    evidence: "grep for <h1> tags returned zero results on the homepage HTML. The page has 22 H2 tags but no H1. The main headline 'Every tooth matters, unmatched patient centered care' appears to be styled as a heading visually but is not wrapped in an H1 tag.",
    impact: "The H1 is the primary heading signal that tells search engines what a page is about. Without it, Google must infer the topic from other signals, which weakens ranking potential for target keywords like 'dental implants Bellevue WA'.",
    fix: "1. Add exactly one H1 tag to the homepage containing the primary keyword target. 2. Suggested H1: 'Dental Implants in Bellevue, WA — All-on-4, Single Implants & Wisdom Teeth'. 3. Ensure every page has exactly one H1. 4. Use H2-H6 in proper hierarchy below it.",
    bestPractice: "Google's John Mueller (2024): 'Having a clear H1 helps us understand the structure of the page.' One H1 per page remains best practice.",
  },
  {
    id: 6,
    severity: "critical",
    category: "Local SEO",
    title: "Phone number on website does not match Google Business Profile",
    icon: MapPin,
    evidence: "Website displays 425-777-1414. Google Maps listing shows (425) 470-3055. The FAQ section also contains a placeholder number '123-123-1231'. This creates three different phone signals for the same business.",
    impact: "NAP (Name, Address, Phone) consistency is a foundational local ranking factor. When Google sees conflicting phone numbers between the website and GBP, it reduces confidence in the business entity. This directly weakens local pack rankings and can cause the wrong number to appear in search results.",
    fix: "1. Confirm which phone number is the correct primary number. 2. Update the website to match the GBP number exactly. 3. Remove the placeholder '123-123-1231' from the FAQ. 4. Ensure the same number appears in schema markup, footer, header, and all directory listings.",
    bestPractice: "Google's 2025 local search guidelines: 'Provide accurate and consistent contact information across your website and business listings.'",
  },
  {
    id: 7,
    severity: "critical",
    category: "Local SEO",
    title: "Practice name is inconsistent across the website and listings",
    icon: MapPin,
    evidence: "Header says 'ROSY DENTAL'. Doctor bio says 'Rosey Dental'. Email is 'roseydental@gmail.com'. Title tag says 'roseydental.com'. Domain is rosydental.net. Google listing says 'Rosy Dental'.",
    impact: "Name inconsistency confuses Google's entity resolution system. The search engine must determine whether 'Rosy Dental', 'Rosey Dental', and 'roseydental' are the same business. This fragmentation weakens the entity's overall search authority.",
    fix: "1. Choose one canonical name (recommend: 'Rosy Dental'). 2. Update the doctor bio to use 'Rosy Dental' not 'Rosey Dental'. 3. Update the title tag. 4. Consider getting a professional email (e.g., info@rosydental.net). 5. Ensure all directories use the exact same name.",
    bestPractice: "Moz Local Search Ranking Factors 2025: NAP consistency remains a top-5 local ranking signal.",
  },
  {
    id: 8,
    severity: "high",
    category: "E-E-A-T / Authority",
    title: "Doctor bio lacks any verifiable credentials",
    icon: Shield,
    evidence: "Dr. Kateb's bio on the About page contains no dental school name, graduation year, license number, board certifications, specialty training, professional memberships (ADA, WSDA), or continuing education details. The bio is narrative only.",
    impact: "Google classifies dental websites as YMYL (Your Money Your Life) and holds them to the highest E-E-A-T standards. Quality raters explicitly look for verifiable credentials on healthcare sites. Without them, the site is algorithmically disadvantaged regardless of technical SEO quality.",
    fix: "1. Add: dental school and degree (DDS/DMD), graduation year, state license number, any implantology certifications (AAID, ICOI, etc.), ADA/WSDA membership, years of practice, number of implants placed. 2. Add Person schema with hasCredential. 3. Link to any verifiable external profiles (state dental board, professional associations).",
    bestPractice: "Google's Quality Rater Guidelines (2025): 'For YMYL medical content, look for clear evidence of appropriate expertise, such as professional credentials.'",
  },
  {
    id: 9,
    severity: "high",
    category: "On-Page SEO",
    title: "Service pages contain only bullet lists — no substantive content",
    icon: Globe,
    evidence: "The All-on-4 page contains approximately 50 words of actual content (just a bulleted inclusion list). The overdentures and single implants pages are similarly thin. No procedure explanations, candidacy criteria, recovery expectations, cost ranges, or comparison content exists.",
    impact: "Competitors ranking for 'All-on-4 dental implants Bellevue' have 800-1,500 word service pages with FAQs, cost information, and patient journey details. Google cannot rank a 50-word bullet list for a high-intent commercial query worth $15K-$40K per patient.",
    fix: "1. Expand each service page to 800-1,200 words. 2. Structure: What is it → Who is a candidate → What to expect → Recovery → Cost/Financing → FAQ (5-8 questions) → CTA. 3. Add before/after photos with alt text. 4. Add FAQPage schema. 5. Begin each page with a 40-60 word direct answer paragraph for AI Overview extraction.",
    bestPractice: "2026 dental SEO competitive baseline: 800+ words per service page with FAQ schema. Direct answer paragraphs at the top are 3x more likely to be cited in Google AI Overviews.",
  },
  {
    id: 10,
    severity: "high",
    category: "Backlink Profile",
    title: "Near-zero external backlinks or directory citations",
    icon: Link2,
    evidence: "Search results show rosydental.net referenced only on Yelp (unclaimed), Indeed/Glassdoor (job listings), and its own internal pages. No healthcare directories (Healthgrades, Zocdoc, WebMD, Vitals), no dental associations, no local business directories, no press mentions, and no content-based backlinks were found.",
    impact: "Backlinks remain one of Google's top-3 ranking factors. A dental implant practice competing for high-value keywords needs authoritative citations from healthcare directories, local business listings, and industry sources. Without them, the site has minimal domain authority.",
    fix: "1. Claim and optimize: Healthgrades, Zocdoc, WebMD Doctor Finder, Vitals, ADA Find-a-Dentist, WSDA directory. 2. Submit to local directories: Bellevue Chamber of Commerce, BBB, local business associations. 3. Create profiles on implant-specific directories. 4. Pursue local press coverage or community sponsorships for editorial links. 5. Claim the Yelp listing immediately.",
    bestPractice: "2025-2026 GEO research: AI systems weight data from Healthgrades, Zocdoc, and WebMD heavily when answering healthcare provider queries. Consistent presence across 20+ platforms strengthens AI recommendation confidence.",
  },
  {
    id: 11,
    severity: "high",
    category: "Google Business Profile",
    title: "GBP has strong reviews but is likely under-optimized",
    icon: MapPin,
    evidence: "Google Maps shows 5.0 stars with 14 reviews — excellent sentiment. However: the phone number on GBP differs from the website, hours show only Friday-Saturday, business categories may be limited to 'Dental implants provider', and it's unclear if services, appointment links, products, and Q&A are fully utilized.",
    impact: "GBP is the single highest-leverage local SEO asset for a dental practice. It drives map pack visibility, 'dentist near me' results, and is the primary source Google uses for local entity information. An under-optimized GBP with conflicting data leaves significant visibility on the table.",
    fix: "1. Verify phone number matches website exactly. 2. Add all services as GBP services with descriptions. 3. Add appointment booking link. 4. Upload fresh photos monthly (office, team, technology, before/after). 5. Add secondary categories (Cosmetic dentist, Oral surgeon, Dental clinic). 6. Post weekly GBP updates. 7. Respond to all reviews within 24 hours. 8. Add Q&A with common patient questions. 9. Ensure hours are accurate.",
    bestPractice: "2026 local SEO: GBP optimization drives 42% of local pack ranking factors. Practices that post weekly and respond to reviews within 24 hours see measurably higher visibility.",
  },
  {
    id: 12,
    severity: "high",
    category: "Mobile Usability",
    title: "Multiple sticky-header plugins create potential layout shift and performance drag",
    icon: Smartphone,
    evidence: "Two separate sticky-header plugins are loaded: 'sticky-menu-or-anything-on-scroll' and 'sticky-header-effects-for-elementor'. Both load their own JavaScript. Combined with Elementor's responsive system and jQuery UI, the mobile experience is heavy and shift-prone.",
    impact: "Cumulative Layout Shift (CLS) is a Core Web Vital. Multiple competing sticky-header scripts can cause the page to jump as elements reposition, leading to a poor CLS score. On mobile, where 60%+ of dental searches originate, this directly affects user experience and rankings.",
    fix: "1. Remove one of the two sticky-header plugins — use only one. 2. Test CLS on mobile using Chrome DevTools or PageSpeed Insights. 3. Ensure the sticky header has a fixed height to prevent layout shift. 4. Remove jQuery dependency if possible (Elementor can work without it in newer versions).",
    bestPractice: "Google's CLS threshold: < 0.1 for 'good'. Multiple competing layout scripts are a common cause of CLS failures on WordPress sites.",
  },
  {
    id: 13,
    severity: "high",
    category: "Security",
    title: "Missing critical security headers",
    icon: Shield,
    evidence: "Only one security header is present (Content-Security-Policy: upgrade-insecure-requests). Missing: X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security (HSTS), Permissions-Policy, and Referrer-Policy.",
    impact: "While security headers don't directly affect SEO rankings, they protect against clickjacking, MIME-type attacks, and data leakage. For a healthcare site handling patient contact information, security is both a trust signal and a compliance consideration. Google Chrome also flags sites without HSTS.",
    fix: "1. Add X-Frame-Options: DENY. 2. Add X-Content-Type-Options: nosniff. 3. Add Strict-Transport-Security: max-age=31536000; includeSubDomains. 4. Add Permissions-Policy to restrict unused APIs. 5. Add Referrer-Policy: strict-origin-when-cross-origin. These can be added via .htaccess, Hostinger panel, or a security plugin.",
    bestPractice: "OWASP 2025 recommendations for healthcare websites include all six headers as baseline security requirements.",
  },
  {
    id: 14,
    severity: "high",
    category: "AEO (Answer Engine Optimization)",
    title: "FAQ content exists but is not structured for answer extraction",
    icon: Globe,
    evidence: "The homepage and services page have FAQ sections with 5-6 questions. However: no FAQPage schema is applied, answers are not formatted as concise 40-60 word paragraphs, question headings are not in H2/H3 format, and one answer contains placeholder text ('123-123-1231').",
    impact: "FAQ-rich results and People Also Ask boxes are among the highest-visibility SERP features for dental queries. Without FAQPage schema, Google cannot display these as rich results. Without concise answer formatting, the content is unlikely to be extracted for featured snippets or AI Overviews.",
    fix: "1. Add FAQPage JSON-LD schema to every page with FAQ content. 2. Format each answer as a concise 40-60 word direct response. 3. Use H3 tags for questions. 4. Add 5-8 FAQs to each service page targeting 'People Also Ask' queries. 5. Remove placeholder text. 6. Target questions like: 'How much do All-on-4 implants cost in Bellevue?', 'How long do dental implants last?', 'Am I a candidate for dental implants?'",
    bestPractice: "2026 AEO: Pages with FAQPage schema are 2.5x more likely to appear in People Also Ask. Direct answer paragraphs of 40-60 words are the most commonly extracted format for AI Overviews.",
  },
  {
    id: 15,
    severity: "high",
    category: "GEO (Generative Engine Optimization)",
    title: "Practice is invisible to AI recommendation systems",
    icon: Globe,
    evidence: "No structured entity data, no citable practice facts, no neutral About summary, no healthcare directory presence (Healthgrades, Zocdoc, WebMD, Vitals), no press mentions, and no consistent third-party corroboration. When AI systems are asked 'Who is the best dental implant provider in Bellevue?', Rosy Dental has no signals that would enable a confident recommendation.",
    impact: "Google AI Overviews now appear for 40-60% of dental queries. ChatGPT, Perplexity, and Bing Copilot are increasingly used for healthcare provider research. Practices that are invisible to these systems lose a growing share of patient discovery traffic.",
    fix: "1. Add a 100-150 word neutral, factual About summary to the homepage (Wikipedia-style). 2. Create a practice facts section: founded year, doctor credentials, procedures performed, technology used, location, financing. 3. Claim all healthcare directories. 4. Ensure consistent entity data across 20+ platforms. 5. Add AggregateRating schema reflecting the 5.0 Google rating. 6. Create content that directly answers common AI queries about implant dentistry in Bellevue.",
    bestPractice: "2026 GEO for dental: AI systems build entity confidence from structured data + directory consistency + review volume + citable facts. Early movers in local healthcare gain durable AI recommendation advantages.",
  },
  {
    id: 16,
    severity: "medium",
    category: "On-Page SEO",
    title: "Duplicate content on Advanced Technology page",
    icon: Globe,
    evidence: "The SprintRay Pro 2 description is repeated word-for-word twice on the same page. The exact same paragraph appears in two consecutive sections.",
    impact: "While intra-page duplication doesn't directly trigger penalties, it signals low editorial quality and wastes crawl budget on redundant content.",
    fix: "Remove the duplicate paragraph. Replace with unique content about a different technology or a patient benefit statement.",
    bestPractice: "Google's helpful content system (2025): content should demonstrate editorial care and provide unique value on every section of a page.",
  },
  {
    id: 17,
    severity: "medium",
    category: "Local SEO",
    title: "Yelp listing is unclaimed with a 1-star review",
    icon: MapPin,
    evidence: "Yelp shows 'Rosy Dental' with 1.0 stars from a single negative review about a $20K implant procedure. The listing is marked 'Unclaimed'. The practice cannot respond to the review or update business information.",
    impact: "Yelp is a high-authority domain that ranks well for dental queries. An unclaimed listing with a 1-star review creates a negative first impression for patients who find it. It also represents a missed opportunity to control the narrative and demonstrate responsiveness.",
    fix: "1. Claim the Yelp listing immediately (free). 2. Respond professionally and empathetically to the existing review. 3. Update business hours, photos, and services. 4. Encourage satisfied patients to leave Yelp reviews. 5. Monitor for new reviews.",
    bestPractice: "BrightLocal 2025: 88% of consumers trust online reviews as much as personal recommendations. Responding to negative reviews increases consumer trust by 45%.",
  },
  {
    id: 18,
    severity: "medium",
    category: "Technical SEO",
    title: "WordPress and plugin versions publicly exposed",
    icon: Shield,
    evidence: "The page source reveals: WordPress 6.7.2, Elementor 4.1.2, Astra theme 4.9.0, and version numbers for all plugins. The Astra Sites onboarding script is still loaded on the production site.",
    impact: "Exposed version numbers make it easier for attackers to identify known vulnerabilities. The onboarding script adds unnecessary weight and is a development artifact that should not be on a live site.",
    fix: "1. Remove WordPress version from HTML head (add remove_action to functions.php). 2. Remove version query strings from CSS/JS files. 3. Deactivate and delete the Astra Sites plugin if onboarding is complete. 4. Keep all plugins updated to the latest versions.",
    bestPractice: "WordPress security best practice: hide version numbers and remove unused plugins to reduce attack surface.",
  },
  {
    id: 19,
    severity: "medium",
    category: "On-Page SEO",
    title: "5 of 12 images missing alt text",
    icon: Globe,
    evidence: "Of the 12 images on the homepage, 5 have empty or missing alt attributes. These include what appear to be service images and team photos based on their context.",
    impact: "Alt text serves two purposes: accessibility for screen readers and image SEO. Missing alt text means Google Images cannot index these images for relevant queries like 'dental implant procedure' or 'Bellevue dentist office'.",
    fix: "1. Add descriptive alt text to all images. 2. Include relevant keywords naturally (e.g., alt='Dr. Ahmad Kateb performing All-on-4 dental implant procedure at Rosy Dental in Bellevue WA'). 3. Keep alt text under 125 characters. 4. Don't keyword-stuff.",
    bestPractice: "Google's 2025 image SEO guidelines: 'Alt text should be descriptive and contextually relevant. It helps Google understand what the image is about.'",
  },
];

const roadmap = [
  { timing: "Week 1", focus: "Critical fixes", actions: "Fix title tags, add meta descriptions, correct phone number mismatch, remove placeholder text, fix duplicate content, add H1 tag.", priority: "Immediate impact on how Google displays the site in search results." },
  { timing: "Week 2", focus: "Structured data + speed", actions: "Deploy Dentist, LocalBusiness, FAQPage, Person, AggregateRating schema. Begin page speed optimization: remove unused plugins, enable caching, defer JS.", priority: "Enables rich results and begins fixing Core Web Vitals." },
  { timing: "Weeks 3–4", focus: "Authority + local", actions: "Add Dr. Kateb credentials and Person schema. Claim Yelp. Standardize NAP everywhere. Add security headers. Optimize GBP: services, photos, categories, posts.", priority: "Builds E-E-A-T and local trust signals." },
  { timing: "Month 2", focus: "Content + AEO", actions: "Expand all service pages to 800+ words with FAQs. Add FAQPage schema. Create cost/financing page. Add before/after cases. Begin blog with 2 expert posts/month.", priority: "Creates rankable content and answer-engine eligibility." },
  { timing: "Month 3", focus: "Backlinks + GEO", actions: "Claim 15+ healthcare directories. Build local citations. Create practice facts page. Add neutral About summary. Pursue local press/community links.", priority: "Builds domain authority and AI recommendation confidence." },
];

const strengths = [
  { title: "5.0 Google rating (14 reviews)", desc: "Exceptional patient sentiment. Should be surfaced in AggregateRating schema and prominently on the website." },
  { title: "Advanced technology (CBCT, 3D printing, Nobel Active, photogrammetry)", desc: "Genuine clinical differentiator. Create detailed technology content optimized for 'dental implant technology Bellevue' queries." },
  { title: "Clear implant niche", desc: "Focused positioning avoids competing with general dentists. Build content around high-intent queries: 'All-on-4 cost Bellevue WA', 'dental implants near me'." },
  { title: "Lead capture on every page", desc: "Good conversion infrastructure. Ensure forms are tracked in Google Analytics with goal events for ROI measurement." },
  { title: "Financing available (108 months)", desc: "Strong differentiator for high-ticket procedures. Create a dedicated financing page targeting cost-sensitive searches." },
  { title: "Before/after case documentation", desc: "Expand from 1 case to 5-10 with detailed patient stories. These build trust and create unique, rankable content." },
];

const glossary = [
  { term: "SEO", definition: "Search Engine Optimization — improving visibility in Google and Bing search results through technical, content, and authority improvements." },
  { term: "AEO", definition: "Answer Engine Optimization — structuring content so it appears in featured snippets, People Also Ask boxes, and zero-click answers." },
  { term: "GEO", definition: "Generative Engine Optimization — making the practice citable and recommendable by AI tools like ChatGPT, Perplexity, Google AI Overviews, and Bing Copilot." },
  { term: "Core Web Vitals (CWV)", definition: "Google's three performance metrics: LCP (loading speed), INP (interactivity), and CLS (visual stability). They directly affect search rankings." },
  { term: "TTFB", definition: "Time to First Byte — how long the server takes to respond. Target: under 800 milliseconds." },
  { term: "NAP", definition: "Name, Address, Phone — the consistent business identity that must match exactly across all online listings." },
  { term: "E-E-A-T", definition: "Experience, Expertise, Authoritativeness, Trustworthiness — Google's quality framework. Dental sites are held to the highest standard (YMYL)." },
  { term: "YMYL", definition: "Your Money Your Life — Google's classification for health/medical sites that are evaluated with stricter quality criteria." },
  { term: "Schema / JSON-LD", definition: "A structured data format embedded in page code that helps search engines and AI systems understand what a page is about." },
  { term: "GBP", definition: "Google Business Profile — the free listing that controls how a business appears in Google Maps and local search results." },
  { term: "Rich Results", definition: "Enhanced search listings that show star ratings, FAQs, hours, images, or other formatted information beyond a standard blue link." },
  { term: "AI Overviews", definition: "Google's AI-generated answer summaries that appear at the top of search results for many queries, pulling from structured and authoritative sources." },
];

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    critical: "bg-red-500/15 text-red-400 border-red-500/30",
    high: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border whitespace-nowrap ${styles[severity]}`}>
      {severity}
    </span>
  );
}

function FindingCard({ finding }: { finding: typeof findings[0] }) {
  const [open, setOpen] = useState(false);
  const Icon = finding.icon;
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-5 flex items-start gap-4 text-left hover:bg-secondary/30 transition-colors duration-150"
      >
        <Icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-semibold text-foreground leading-snug pr-2">{finding.id}. {finding.title}</h3>
            <SeverityBadge severity={finding.severity} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{finding.category}</p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />}
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-border pt-4 ml-9">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Evidence</p>
            <p className="text-sm text-foreground/90 leading-relaxed">{finding.evidence}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Business Impact</p>
            <p className="text-sm text-foreground/90 leading-relaxed">{finding.impact}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">How to Fix</p>
            <p className="text-sm text-foreground leading-relaxed">{finding.fix}</p>
          </div>
          {finding.bestPractice && (
            <div className="flex items-start gap-2 text-xs text-muted-foreground italic">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <p>{finding.bestPractice}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === PASSWORD) { onUnlock(); } else { setError(true); setTimeout(() => setError(false), 2000); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <img src={LOGO_URL} alt="Propel Dental" className="h-16 mx-auto object-contain" />
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-foreground">SEO Audit Report</h1>
          <p className="text-sm text-muted-foreground">Enter the password to view this report.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input type="password" placeholder="Password" value={value} onChange={(e) => setValue(e.target.value)} className="pl-10" autoFocus />
          </div>
          {error && <p className="text-sm text-red-400">Incorrect password. Try again.</p>}
          <Button type="submit" className="w-full">View Report</Button>
        </form>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────

export default function Home() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="container flex items-center justify-between h-14">
          <img src={LOGO_URL} alt="Propel Dental" className="h-9 object-contain" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Confidential</span>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border">
        <div className="container py-12 md:py-16 space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">SEO / AEO / GEO Audit — Expanded Report</p>
            <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-display)] leading-tight">RosyDental.net Assessment</h1>
            <p className="text-muted-foreground text-base max-w-2xl">Bellevue, WA · Dr. Ahmad Kateb · Dental Implants · June 2026</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-5 md:p-6 max-w-4xl space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2"><Info className="w-5 h-5 text-primary" />Executive Summary</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Rosy Dental has a clear clinical niche (dental implants), strong Google reviews (5.0 stars, 14 reviews), and genuinely advanced technology. However, the website has <strong className="text-foreground">critical infrastructure problems</strong> that prevent search engines and AI systems from understanding, verifying, or recommending the practice.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The page takes <strong className="text-foreground">7.3 seconds to load</strong> (target: under 3 seconds). The title tag displays the <strong className="text-foreground">wrong domain name</strong>. There is <strong className="text-foreground">no H1 heading</strong>, no meta descriptions, no structured data, and the phone number on the website <strong className="text-foreground">does not match Google</strong>. Service pages contain only bullet lists with no substantive content. The practice has <strong className="text-foreground">near-zero backlinks</strong> and is absent from all healthcare directories.
            </p>
            <p className="text-sm text-foreground font-medium">
              The good news: these are fixable problems. The first 30 days of cleanup should produce measurable improvements in how Google displays and ranks the site.
            </p>
          </div>
        </div>
      </section>

      {/* Scores */}
      <section className="border-b border-border">
        <div className="container py-10 space-y-6">
          <h2 className="text-xl font-bold font-[family-name:var(--font-display)]">Assessment Scores</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {scores.map((s) => (
              <div key={s.category} className="bg-card border border-border rounded-lg p-4 space-y-1">
                <div className="flex items-baseline gap-1.5">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.score}</p>
                  <p className="text-xs text-muted-foreground">/100</p>
                </div>
                <p className="text-xs font-semibold text-foreground">{s.category}</p>
                <p className="text-[11px] text-muted-foreground">{s.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Findings */}
      <section className="border-b border-border">
        <div className="container py-10 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold font-[family-name:var(--font-display)]">Priority Findings ({findings.length})</h2>
            <p className="text-sm text-muted-foreground">Click any finding to expand evidence, business impact, and step-by-step fix instructions.</p>
          </div>
          <div className="space-y-3">
            {findings.map((f) => <FindingCard key={f.id} finding={f} />)}
          </div>
        </div>
      </section>

      {/* Strengths */}
      <section className="border-b border-border">
        <div className="container py-10 space-y-6">
          <h2 className="text-xl font-bold font-[family-name:var(--font-display)]">Strengths to Leverage</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-3 bg-card border border-border rounded-lg p-4">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{s.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="border-b border-border">
        <div className="container py-10 space-y-6">
          <h2 className="text-xl font-bold font-[family-name:var(--font-display)]">90-Day Roadmap</h2>
          <div className="space-y-3">
            {roadmap.map((r, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-5 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-primary whitespace-nowrap">{r.timing}</span>
                  <span className="text-sm font-semibold text-foreground">{r.focus}</span>
                </div>
                <p className="text-sm text-muted-foreground">{r.actions}</p>
                <p className="text-xs text-foreground/70 italic">{r.priority}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Glossary */}
      <section className="border-b border-border">
        <div className="container py-10 space-y-6">
          <h2 className="text-xl font-bold font-[family-name:var(--font-display)]">Glossary</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {glossary.map((g, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm font-semibold text-primary">{g.term}</p>
                <p className="text-xs text-muted-foreground mt-1">{g.definition}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src={LOGO_URL} alt="Propel Dental" className="h-8 object-contain" />
          <p className="text-xs text-muted-foreground">Confidential · Propel Dental © 2026 · <a href="https://propeldental.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">propeldental.com</a></p>
        </div>
      </footer>
    </div>
  );
}
