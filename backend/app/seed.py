from sqlalchemy import func, select

from .database import SessionLocal
from .models import Video

SAMPLE_VIDEOS = (
    (
        "roots-courtyard-2",
        "Courtyard 2 by Roots Developers | A Nature-Connected, Future-Ready Community",
        "https://www.youtube.com/watch?v=zYpaludLhtU",
        "A project introduction to Roots Courtyard 2 in Gurugram, from the RootsDevelopers channel.",
    ),
    (
        "roots-developers-story",
        "40+ Years of Building the Future | Roots Developers",
        "https://www.youtube.com/watch?v=Eo3psI75DU4",
        "A short brand story published by RootsDevelopers.",
    ),
    (
        "roots-courtyard-gurugram",
        "Courtyard Gurugram | Where Nature Meets Modern Living",
        "https://www.youtube.com/watch?v=lSOWLF2PB0s",
        "A look at the Courtyard Gurugram community and its nature-led positioning, from RootsDevelopers.",
    ),
    (
        "roots-customer-story",
        "Happy Customer | Client Feedback",
        "https://www.youtube.com/watch?v=uIcblPg84s0",
        "A customer feedback video published by RootsDevelopers.",
    ),
    (
        "roots-courtyard-smiles",
        "It All Began with Smiles | Roots Courtyard 2",
        "https://www.youtube.com/watch?v=tEJo0qJSOAg",
        "A Courtyard 2 video published by RootsDevelopers.",
    ),
    (
        "roots-voices-of-trust",
        "Voices of Trust | Roots Developers",
        "https://www.youtube.com/watch?v=mH9yBnohESM",
        "A trust and customer-story video published by RootsDevelopers.",
    ),
    (
        "roots-growth-partners",
        "Growth Partner Testimonials | Roots Developers",
        "https://www.youtube.com/watch?v=kbEou2qv2Wg",
        "A growth-partner testimonial video published by RootsDevelopers.",
    ),
    (
        "roots-elevate",
        "Something Big Is Coming | Roots Developers",
        "https://www.youtube.com/watch?v=OENlqF8gBIA",
        "An upcoming development teaser published by RootsDevelopers.",
    ),
    (
        "roots-courtyard-phase-two",
        "Courtyard 2 Phase 2 | Roots Developers",
        "https://www.youtube.com/watch?v=defeBUfEtCw",
        "A Courtyard 2 Phase 2 video published by RootsDevelopers.",
    ),
    (
        "roots-growth-partners-story",
        "Hear About Us from Our Growth Partners",
        "https://www.youtube.com/watch?v=i4Js3elXw5I",
        "Growth partners share their perspective on Roots Developers.",
    ),
)


def seed_sample_videos() -> None:
    with SessionLocal() as db:
        existing_count = db.scalar(select(func.count()).select_from(Video))
        if existing_count:
            return

        db.add_all(
            [
                Video(
                    id=video_id,
                    title=title,
                    url=url,
                    description=description,
                )
                for video_id, title, url, description in SAMPLE_VIDEOS
            ]
        )
        db.commit()
