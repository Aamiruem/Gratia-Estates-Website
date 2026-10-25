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
  {
    slug: "site-visit-checklist-gurgaon",
    type: "checklist",
    title: "Site Visit Checklist: What to Check at a Gurgaon Project",
    excerpt:
      "A practical, printable checklist for your next site visit, from the approach road and construction quality to the paperwork you should ask to see.",
    date: "2026-10-20",
    category: "buying-guide",
    tags: ["site visit", "checklist", "due diligence", "construction quality"],
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Show apartment interior viewed during a site visit",
    authorId: "gratia-advisory",
    featured: false,
    takeaways: [
      "Visit on a weekday at peak hours to judge the real commute and traffic.",
      "Look past the sample flat: inspect the actual tower, site and surroundings.",
      "Ask for the HRERA registration and approvals during the visit, not after.",
    ],
    sections: [
      {
        id: "before-you-go",
        heading: "Before you go",
        paragraphs: [
          "A site visit is far more useful when you arrive with a plan. Shortlist the units and floors you want to see, and note the questions you want answered.",
        ],
        list: [
          "Note your budget ceiling, including all charges",
          "Pick two or three unit types and preferred floors",
          "Plan the drive at the time you would normally commute",
          "Carry a measuring tape and take photos and notes",
        ],
      },
      {
        id: "location-and-access",
        heading: "Location and access",
        paragraphs: [
          "Drive the last kilometre slowly. The condition of the approach road, nearby construction and the distance to daily needs matter as much as the project brochure.",
        ],
        list: [
          "Width and condition of the approach road",
          "Distance to schools, hospitals and markets",
          "Public transport and the nearest metro or bus stop",
          "Ongoing construction or vacant plots next to the project",
        ],
      },
      {
        id: "inside-the-project",
        heading: "Inside the project",
        paragraphs: [
          "A sample flat shows the best version of a home. Where possible, also see the real tower, the common areas and the stage of construction.",
        ],
        list: [
          "Construction progress matches what has been promised",
          "Natural light, ventilation and the view from your preferred floor",
          "Lifts, fire safety provisions and power backup",
          "Clubhouse, open spaces and parking layout",
        ],
      },
      {
        id: "paperwork-to-ask-for",
        heading: "Paperwork to ask for",
        paragraphs: [
          "Use the visit to collect documents you can verify later at home or with a lawyer.",
        ],
        table: {
          headers: ["Document", "Why it matters"],
          rows: [
            ["HRERA registration", "Confirms the project is registered and lets you check its status"],
            ["Approved layout and floor plans", "Shows what has been sanctioned for your unit"],
            ["Cost sheet", "Lists every charge so you can compare projects fairly"],
            ["Payment plan", "Shows how payments link to construction milestones"],
            ["Draft builder-buyer agreement", "Sets out possession date, specifications and penalties"],
          ],
        },
      },
    ],
    checklist: {
      title: "Take-along site visit checklist",
      items: [
        "Checked the approach road and surroundings",
        "Saw the actual tower and floor, not just the sample flat",
        "Checked light, ventilation and view",
        "Asked about possession timeline and delay terms",
        "Collected the cost sheet and payment plan",
        "Noted the HRERA registration number to verify online",
        "Took photos and notes for comparison",
      ],
    },
    faqs: [
      {
        q: "How long does a site visit usually take?",
        a: "Plan for one to two hours per project, including the drive around the neighbourhood. Visiting two projects in a day is usually comfortable.",
      },
      {
        q: "Should I visit more than once?",
        a: "Yes, if you are seriously considering a project. A second visit at a different time of day shows you traffic, noise and light conditions you may have missed.",
      },
    ],
  },

  {
    slug: "true-cost-of-buying-a-home-in-gurgaon",
    type: "article",
    title: "The True Cost of Buying a Home in Gurgaon",
    excerpt:
      "Base price is only the start. Here is every cost to budget for, from preferential location charges to stamp duty, GST and maintenance deposits.",
    date: "2026-10-12",
    category: "buying-guide",
    tags: ["cost", "stamp duty", "gst", "budget", "home loan"],
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Residential building and keys representing the cost of buying a home",
    authorId: "gratia-advisory",
    featured: false,
    takeaways: [
      "Ask every developer for a full cost sheet so you compare projects on the same basis.",
      "GST generally applies to under-construction homes, not completed ones with an occupancy certificate.",
      "Stamp duty and registration are set by the Haryana government; check current rates before you budget.",
    ],
    sections: [
      {
        id: "price-components",
        heading: "What the price is made of",
        paragraphs: [
          "Developers usually quote a base price per square foot. The amount you actually pay adds several other charges, which vary by project and unit.",
        ],
        table: {
          headers: ["Cost", "What it covers"],
          rows: [
            ["Base price", "The quoted price for the unit's area"],
            ["Preferential location charges (PLC)", "Extra for park-facing, corner or higher-floor units"],
            ["Parking", "Covered or open parking slots"],
            ["Club membership", "Access to the clubhouse and its facilities"],
            ["External and infrastructure development charges", "Contributions towards area infrastructure, where applicable"],
          ],
        },
      },
      {
        id: "government-charges",
        heading: "Taxes and government charges",
        paragraphs: [
          "GST generally applies to under-construction property and is not charged on a completed property that has received its occupancy certificate. Stamp duty and registration charges are payable when the property is registered in your name.",
          "Rates for stamp duty and registration are set by the Haryana government and can change, so confirm the current rates for your property before you finalise your budget.",
        ],
      },
      {
        id: "ongoing-costs",
        heading: "One-time and ongoing costs after purchase",
        paragraphs: [
          "Plan for costs that arrive at or after possession, so they do not stretch your budget at the last minute.",
        ],
        list: [
          "Interest-free maintenance security deposit",
          "Advance maintenance charges for the first months",
          "Utility connection charges for electricity and water",
          "Interiors, furnishing and moving costs",
        ],
      },
      {
        id: "loan-planning",
        heading: "Plan your home loan alongside the cost",
        paragraphs: [
          "Banks usually finance a share of the property value, so your down payment and the one-time charges come from your own funds. Use the EMI calculator below to test a comfortable monthly payment before you shortlist.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is GST charged on ready-to-move flats?",
        a: "GST is generally not charged on a completed property that has an occupancy certificate. It typically applies to under-construction property. Confirm the treatment for your specific unit with the developer and your adviser.",
      },
      {
        q: "How can I compare two projects fairly?",
        a: "Ask both developers for a full cost sheet for a similar unit and compare the all-in price, not just the base rate per square foot.",
      },
    ],
    tools: ["emi"],
  },

  {
    slug: "video-guide-courtyard-2-gurugram",
    type: "video",
    title: "Video Guide: Inside Courtyard 2 by Roots Developers",
    excerpt:
      "Watch the project introduction for Roots Courtyard 2 in Gurugram, and use our checklist to get the most out of any video walkthrough before you visit.",
    date: "2026-10-08",
    category: "video-guides",
    tags: ["video", "walkthrough", "roots developers", "gurugram"],
    image: "https://i.ytimg.com/vi/zYpaludLhtU/maxresdefault.jpg",
    imageAlt: "Courtyard 2 by Roots Developers video thumbnail",
    video: "https://www.youtube.com/watch?v=zYpaludLhtU",
    videoCredit: "Video published by RootsDevelopers on YouTube.",
    authorId: "gratia-advisory",
    featured: false,
    takeaways: [
      "Video tours are ideal for shortlisting before you spend time on site visits.",
      "Note what the video shows and what it leaves out, then ask about the gaps.",
      "Always confirm details from a video against official project documents.",
    ],
    sections: [
      {
        id: "about-the-video",
        heading: "About this video",
        paragraphs: [
          "This project introduction for Courtyard 2 in Gurugram was published by RootsDevelopers. It gives an overview of the community and its positioning, which is a helpful starting point before you plan a visit.",
        ],
      },
      {
        id: "how-to-watch",
        heading: "How to get the most from a video walkthrough",
        paragraphs: [
          "Developer videos show a project at its best. Watch with a list of questions and pause to note anything you want to verify in person.",
        ],
        list: [
          "Which parts are actual site footage and which are renders",
          "Views, open spaces and how close neighbouring buildings are",
          "Amenities shown and whether they are complete or planned",
          "Anything not shown, such as the approach road or parking",
        ],
      },
      {
        id: "next-steps",
        heading: "From video to site visit",
        paragraphs: [
          "If the project fits your brief, the next step is to see it in person. Use our site visit checklist and ask for the HRERA registration and cost sheet before you commit.",
        ],
      },
    ],
  },
];
