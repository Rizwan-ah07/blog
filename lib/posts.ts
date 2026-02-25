export type Tag = string;

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: Tag[];
  content: string;
  featured?: boolean;
};

export const posts: Post[] = [
  {
    slug: "week-1-first-day",
    title: "Week 1 — First Day, First Impressions & Getting Access to Everything",
    date: "2026-02-02",
    excerpt:
      "My first day as an intern: meeting the team, getting a mountain of system access requests approved, and staring at SAP for the first time.",
    tags: ["Lessons Learned", "SAP", "Teambuilding"],
    featured: true,
    content: `## The First Day

Walking into the office on day one was equal parts exciting and overwhelming. I had a badge, a laptop, and absolutely no idea what SAP was.

My supervisor gave me a quick tour and sat me down with a 40-page onboarding document. The first half was about company values. The second half was a list of systems I'd need access to.

## The Systems

By end of day one, I had submitted access requests for:

- **SAP** (the main ERP system — I still didn't fully understand what that meant)
- **Power BI** (for reporting — this one I was at least vaguely familiar with)
- The internal ticketing system
- Two file servers

It took three days for all the access to come through. In the meantime, I watched onboarding videos and tried to understand what an ERP actually does.

## First Impression of SAP

When I finally got access to SAP, I opened the first transaction code I was shown — **ME21N** (create purchase order) — and stared at it for a good five minutes before asking for help.

The interface is… a lot. But my colleague was patient and walked me through the basics. The logic behind it started to make sense once I understood *why* each field exists.

## Key Takeaways

- Don't panic when you don't understand something on day one. That's normal.
- Ask questions early — everyone here expects it from interns.
- SAP has its own language. Give yourself time to learn it.`,
  },
  {
    slug: "first-power-bi-dashboard",
    title: "Building My First Power BI Dashboard from a Real Dataset",
    date: "2026-02-09",
    excerpt:
      "I was handed a messy Excel export and told to turn it into a dashboard. Here's how I approached it, what I learned about DAX, and what I'd do differently.",
    tags: ["Power BI", "Wins", "Lessons Learned"],
    content: `## The Task

My supervisor dropped a file on my desk — an Excel export from SAP with about 3,000 rows of purchase order data — and asked me to build a dashboard showing spend by supplier, category, and month.

I had used Power BI maybe twice before this, for a school project. This felt completely different.

## Getting the Data In

The first step was connecting the Excel file to Power BI Desktop and cleaning the data in **Power Query**. The date column was formatted as text (classic), supplier names had inconsistent capitalisation, and two columns had been merged into one.

Power Query's split column and trim functions saved a lot of time here.

## My First DAX Measure

Once the data was clean, I needed a few calculated values. My first real DAX measure:

**Total Spend = SUM('Orders'[Net Value])**

Simple. But from there I built on it:

**Spend YTD = CALCULATE([Total Spend], DATESYTD('Date'[Date]))**

That one took me an hour to understand. The \`CALCULATE\` + \`DATESYTD\` pattern is everywhere in Power BI and once it clicked, a lot of other things started making sense too.

## The Result

I presented the dashboard the following Friday. Three visuals: a bar chart by supplier, a line chart by month, and a treemap by category. My supervisor asked me to add a slicer for department — which I hadn't thought of — and that turned out to be one of the most useful parts.

## What I'd Do Differently

Create the **date table** at the start. I added it halfway through and had to redo several relationships. Lesson learned.`,
  },
  {
    slug: "understanding-sap-purchase-to-pay",
    title: "Understanding the Purchase-to-Pay Process in SAP",
    date: "2026-02-13",
    excerpt:
      "My supervisor walked me through the full P2P flow in SAP — from purchase requisition to invoice verification. Here's my breakdown of how it all connects.",
    tags: ["SAP", "Lessons Learned"],
    content: `## What is Purchase-to-Pay?

Before this internship I'd never heard the term **Purchase-to-Pay (P2P)**. It refers to the full process a company goes through when buying something: identifying the need, getting approval, placing the order, receiving the goods, and finally paying the invoice.

In SAP, this entire flow is tracked and each step leaves a trail.

## The Steps in SAP

Here's the simplified version of what I learned:

**1. Purchase Requisition (PR) — Transaction: ME51N**
An internal request to buy something. Created by the department that needs it.

**2. Purchase Order (PO) — Transaction: ME21N**
The actual order sent to the vendor. Converts the PR into a formal commitment.

**3. Goods Receipt (GR) — Transaction: MIGO**
Records that the physical goods (or service) have been received. This is what triggers the three-way match.

**4. Invoice Verification — Transaction: MIRO**
The vendor's invoice is entered here and matched against the PO and GR. If the three match, payment is approved.

## The Three-Way Match

This was the concept that made the whole system click for me. SAP automatically checks:

- What was **ordered** (PO)
- What was **received** (GR)
- What was **invoiced** (Invoice)

If they match within tolerance, the invoice is approved. If not, it gets blocked for review. It's an incredibly clean way to prevent overpayments and fraud.

## What Surprised Me

How much of "business process" is really just good data hygiene. If a vendor sends the wrong invoice number, or a goods receipt is booked late, the whole flow gets delayed. The system is only as good as the people using it.`,
  },
  {
    slug: "migration-what-is-it",
    title: "What Even Is Data Migration? My First Explanation Attempt",
    date: "2026-02-17",
    excerpt:
      "After sitting in on two migration planning meetings, I tried to write down what data migration actually means in plain language. Here's my attempt.",
    tags: ["Migration", "Lessons Learned"],
    content: `## What I Knew Before

Before this internship, data migration to me meant moving files from one place to another. Copy, paste, done.

I was wrong.

## What Migration Actually Means in a Business Context

Data migration — as I now understand it — is the process of moving structured business data from one system to another while ensuring it stays **accurate, complete, and usable** in the new system.

In the project I'm shadowing, the company is migrating master data (vendors, materials, customers) from an older system into SAP. That sounds simple. It isn't.

## The Challenges

**1. Data quality**
The source data is often messy. Duplicate records, inconsistent formats, missing mandatory fields. Before you can migrate anything, you have to clean it.

**2. Mapping**
Every field in the old system needs to map to a field in the new system. Sometimes they don't align perfectly. A field called "Supplier Code" in one system might need to split into two fields in SAP.

**3. Validation**
After migration, you have to verify that what arrived matches what you sent. Row counts, totals, spot checks.

**4. Cutover planning**
The actual "go live" moment — when the old system is switched off and the new one takes over — has to be planned to the minute. You can't have both running at the same time with live data.

## My Takeaway

Migration is 20% technical and 80% planning, communication, and data governance. The boring parts are actually the most important parts.`,
  },
  {
    slug: "failing-at-a-dax-measure",
    title: "The DAX Measure That Took Me Two Days to Get Right",
    date: "2026-02-20",
    excerpt:
      "I needed to calculate the previous month's spend for a comparison card. What I thought was a simple measure turned into a two-day debugging session. Honest account inside.",
    tags: ["Power BI", "Fails", "Lessons Learned"],
    content: `## The Requirement

A simple card visual: **current month spend vs previous month spend**, with a percentage change.

I had already built **Total Spend**. Now I needed **Previous Month Spend**. How hard could it be?

## Attempt 1 — Completely Wrong

My first try:

**Prev Month = CALCULATE([Total Spend], PREVIOUSMONTH('Date'[Date]))**

This returned blank. Every time. I stared at it for an hour before asking a colleague. The problem: I was referencing the Date column directly instead of using a proper date table connected to my fact table. The relationship wasn't set up correctly.

## Attempt 2 — Closer, Still Wrong

After fixing the date table relationship:

**Prev Month = CALCULATE([Total Spend], DATEADD('Date'[Date], -1, MONTH))**

This returned numbers! Wrong numbers. In a filtered context (e.g., looking at only one supplier), it wasn't respecting the filter the way I expected. I didn't fully understand **filter context** yet.

## The Fix

Two days later, after reading the Microsoft DAX documentation and watching a 40-minute video:

**Prev Month Spend =
CALCULATE(
  [Total Spend],
  DATEADD('Date'[Date], -1, MONTH),
  ALL('Orders'[Supplier])
)**

Understanding when to use \`ALL()\` to remove a filter context — while keeping others — was the missing piece.

## What I Learned

DAX looks deceptively simple. It is not. Filter context is everything, and until you understand it intuitively, you'll keep getting wrong numbers that look right. The fix is to read the theory, not just copy formulas.`,
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getFeaturedPost(): Post {
  return posts.find((p) => p.featured) ?? posts[0];
}

export function getAllTags(): Tag[] {
  const tagSet = new Set<Tag>();
  posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet) as Tag[];
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
