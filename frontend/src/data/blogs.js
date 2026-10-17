// Content lives here, separate from UI. To add an article, add one object.
// Section shape: { id, heading, paragraphs: [], list?: [], table?: { headers, rows } }
// Dates are ISO (YYYY-MM-DD). Category must match an id in categories.js.

export const posts = [
  {
    slug: "gurgaon-real-estate-market-guide",
    title: "Gurgaon Real Estate Market: A Practical Buyer’s Guide",
    excerpt:
      "Understand how location, developer profile, project stage and connectivity influence residential buying decisions in Gurgaon.",
    date: "2026-10-02",
    category: "market-insights",
    tags: ["gurgaon", "buyer guide", "micro-markets", "due diligence"],
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Residential and commercial towers in Gurgaon skyline",
    authorId: "gratia-advisory",
    featured: true,
    takeaways: [
      "The micro-market often matters as much as the project itself.",
      "Compare the full cost of ownership, not just the launch price.",
      "Verify RERA registration and approvals before paying any booking amount.",
    ],
    sections: [
      {
        id: "location",
        heading: "Start with the location",
        paragraphs: [
          "In Gurgaon, the right micro-market can be as important as the project itself. Commute patterns, road and metro access, nearby schools and hospitals, and the long-term development story all shape both daily living and resale value.",
          "Shortlist two or three micro-markets first, then compare projects inside them. Visit at peak hours on a weekday, not only on a quiet weekend.",
        ],
      },
      {
        id: "developer",
        heading: "Look at the developer’s track record",
        paragraphs: [
          "Review the developer’s delivered projects, not just the brochure for the new launch. Visit a completed society if you can and speak to residents about build quality, maintenance and handover experience.",
        ],
        list: [
          "Number of projects delivered and their possession timelines",
          "Complaints or disputes listed against past projects",
          "Quality of common areas and maintenance in delivered societies",
        ],
      },
      {
        id: "project-stage",
        heading: "Understand the project stage",
        paragraphs: [
          "A project can be at pre-launch, under construction, near possession or ready to move. Each stage changes your pricing, risk and payment structure, so decide which one fits your timeline before you start comparing prices.",
        ],
      },
      {
        id: "total-cost",
        heading: "Work out the total cost, not the headline price",
        paragraphs: [
          "Launch pricing rarely tells the whole story. Add every cost you are likely to face and compare projects on the same basis.",
        ],
        list: [
          "Base price and any preferential location charges",
          "Parking, club membership and other one-time charges",
          "GST where applicable, stamp duty and registration",
          "Maintenance deposit and monthly maintenance",
        ],
      },
      {
        id: "due-diligence",
        heading: "Do your due diligence",
        paragraphs: [
          "Before committing, review official project documentation, approvals, payment plans and the exact terms applicable to your unit. A professional advisory conversation can help you identify the questions you should ask.",
        ],
      },
    ],
    checklist: {
      title: "Before you book: due-diligence checklist",
      items: [
        "Project is registered with HRERA and the registration number matches the official site",
        "Land title and approvals reviewed with a lawyer",
        "Carpet area and super area clearly stated in the agreement",
        "Payment plan is linked to construction milestones",
        "Possession date and delay-compensation terms are written down",
        "All extra charges (parking, club, PLC) are listed in writing",
        "Maintenance charges and who will manage the society are confirmed",
      ],
    },
    faqs: [
      {
        q: "Which part of Gurgaon is best to buy in?",
        a: "There is no single best area. It depends on your budget, commute, and whether you are buying to live or to invest. Shortlist micro-markets by commute and social infrastructure first, then compare projects within them.",
      },
      {
        q: "Should I buy an under-construction or a ready-to-move property?",
        a: "Under-construction homes may offer a lower entry price and flexible payment plans but carry delivery risk. Ready homes cost more upfront but let you inspect the actual unit and move in sooner.",
      },
      {
        q: "How do I check if a project is RERA registered?",
        a: "Search the project on the official Haryana RERA website and confirm that the registration number, promoter name and validity period match what the developer has shared with you.",
      },
    ],
    tools: ["emi"],
  },

  {
    slug: "pre-launch-vs-launched-projects",
    title: "Pre-Launch vs Launched Projects: What Should You Choose?",
    excerpt:
      "A simple framework to compare entry pricing, timelines, risk, inventory and due diligence before making a property decision.",
    date: "2026-09-18",
    category: "buying-guide",
    tags: ["pre-launch", "launched projects", "risk", "pricing"],
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Modern residential building under construction",
    authorId: "gratia-advisory",
    featured: false,
    takeaways: [
      "Pre-launch can mean a lower entry price, but with less information to verify.",
      "A launched project gives you approvals, a floor plan and a clearer timeline to check.",
      "Never pay a booking amount before confirming RERA registration.",
    ],
    sections: [
      {
        id: "what-it-means",
        heading: "What pre-launch and launched actually mean",
        paragraphs: [
          "Pre-launch usually refers to a stage before the official sales launch, often with limited documentation available. A launched project has been formally opened for sale, with published pricing, plans and a payment schedule.",
          "Under RERA, promoters are expected to register a project before advertising or selling it, so always ask for the registration details first.",
        ],
      },
      {
        id: "comparison",
        heading: "Side-by-side comparison",
        paragraphs: [
          "Use this table as a starting point and adapt it to your own priorities.",
        ],
        table: {
          headers: ["Factor", "Pre-launch", "Launched"],
          rows: [
            ["Entry price", "Often lower", "Published price list"],
            [
              "Choice of units",
              "Wider, early selection",
              "Depends on remaining inventory",
            ],
            [
              "Documentation",
              "May be limited",
              "Approvals and plans available to review",
            ],
            ["Timeline clarity", "Lower", "Higher"],
            ["Risk level", "Higher", "Moderate"],
          ],
        },
      },
      {
        id: "decision-framework",
        heading: "A simple decision framework",
        paragraphs: [
          "Ask yourself three questions: how soon do you need the home, how much uncertainty can you accept, and can you verify the project’s documents independently? If the answer to the last question is no, a launched project is usually the safer route.",
        ],
      },
    ],
    checklist: {
      title: "Questions to ask before paying a booking amount",
      items: [
        "What is the HRERA registration number and validity?",
        "Is the booking amount refundable and under what conditions?",
        "What is the proposed possession date and the penalty for delay?",
        "Has the layout and floor plan been formally approved?",
        "Which charges are included in the quoted price?",
      ],
    },
    faqs: [
      {
        q: "Is pre-launch cheaper than a launched project?",
        a: "It is often priced lower to attract early buyers, but the final cost depends on additional charges and how prices move after launch. Compare the all-in cost, not just the base rate.",
      },
      {
        q: "Can I get a refund on a booking amount?",
        a: "That depends on the terms in your booking form or agreement. Read the cancellation and refund clauses carefully and get the terms in writing before you pay.",
      },
    ],
    tools: ["emi"],
  },

  {
    slug: "dwarka-expressway-investment-potential",
    title: "Why Dwarka Expressway Continues to Matter for Gurgaon Buyers",
    excerpt:
      "Explore the connectivity and infrastructure factors shaping demand across one of Gurgaon’s most discussed corridors.",
    date: "2026-09-04",
    category: "location-guide",
    tags: ["dwarka expressway", "connectivity", "infrastructure", "gurgaon"],
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Expressway corridor with residential towers alongside",
    authorId: "gratia-advisory",
    featured: false,
    takeaways: [
      "Connectivity drives demand, but neighbourhood readiness drives day-to-day living.",
      "Check what is operational today versus what is only planned.",
      "Buyers and investors need to weigh the corridor differently.",
    ],
    sections: [
      {
        id: "why-it-matters",
        heading: "Why this corridor gets so much attention",
        paragraphs: [
          "The Dwarka Expressway links Gurgaon with Delhi’s Dwarka side and the airport belt, which makes it relevant for professionals who commute to either city. Corridors with strong road links tend to attract both end-users and investors.",
        ],
      },
      {
        id: "connectivity",
        heading: "Connectivity: what to verify on the ground",
        paragraphs: [
          "Look at how long the real commute takes at peak hours, which roads are fully open, and what the nearest public transport options are. Distances on a map can be misleading.",
        ],
      },
      {
        id: "social-infrastructure",
        heading: "Social infrastructure and daily living",
        paragraphs: [
          "Schools, hospitals, retail and utilities decide how comfortable a neighbourhood is to live in. A fast-developing area may still be missing some of these today, so check what is operational versus planned.",
        ],
      },
      {
        id: "end-user-vs-investor",
        heading: "End-user or investor: different questions",
        paragraphs: [
          "If you plan to live there, focus on commute, community and possession timelines. If you plan to invest, look at rental demand, exit options and how much supply is being added nearby.",
        ],
      },
    ],
    checklist: {
      title: "Corridor due-diligence checklist",
      items: [
        "Confirm which road and transit links are operational versus announced",
        "Check the actual peak-hour commute to your workplace",
        "List schools, hospitals and retail within a practical distance",
        "Review how much new supply is launching nearby",
        "Compare the project’s price per sq ft with nearby launches",
      ],
    },
    faqs: [
      {
        q: "Is Dwarka Expressway a good option for investment?",
        a: "It can suit some investors, but returns depend on the specific project, entry price, rental demand and supply nearby. Treat it as one factor, not a guarantee.",
      },
      {
        q: "Is it suitable for end-users?",
        a: "Many families consider it for access to both Gurgaon and Delhi. Visit during peak hours and check how developed the surrounding neighbourhood already is.",
      },
    ],
    tools: ["emi"],
  },
];
