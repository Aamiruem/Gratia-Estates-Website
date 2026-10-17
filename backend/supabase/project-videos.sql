-- Replace OWNER_EMAIL_REPLACE_ME with the owner's exact Supabase Auth email.
-- Enable Supabase email sign-ups if the owner will use the website sign-up form.
-- These policies still restrict every write to the configured owner email.

create table if not exists public.project_videos (
  id text primary key,
  title text not null,
  url text not null,
  description text not null default '',
  project_slug text,
  created_at timestamptz not null default now()
);

alter table public.project_videos enable row level security;

grant select on public.project_videos to anon, authenticated;
grant insert, update, delete on public.project_videos to authenticated;

drop policy if exists "Anyone can view project videos" on public.project_videos;
create policy "Anyone can view project videos"
  on public.project_videos
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Only the video owner can add videos" on public.project_videos;
create policy "Only the video owner can add videos"
  on public.project_videos
  for insert
  to authenticated
  with check (
    lower(auth.jwt() ->> 'email') = lower('OWNER_EMAIL_REPLACE_ME')
  );

drop policy if exists "Only the video owner can update videos" on public.project_videos;
create policy "Only the video owner can update videos"
  on public.project_videos
  for update
  to authenticated
  using (
    lower(auth.jwt() ->> 'email') = lower('OWNER_EMAIL_REPLACE_ME')
  )
  with check (
    lower(auth.jwt() ->> 'email') = lower('OWNER_EMAIL_REPLACE_ME')
  );

drop policy if exists "Only the video owner can delete videos" on public.project_videos;
create policy "Only the video owner can delete videos"
  on public.project_videos
  for delete
  to authenticated
  using (
    lower(auth.jwt() ->> 'email') = lower('OWNER_EMAIL_REPLACE_ME')
  );

insert into public.project_videos (id, title, url, description)
values
  ('roots-courtyard-2', 'Courtyard 2 by Roots Developers | A Nature-Connected, Future-Ready Community', 'https://www.youtube.com/watch?v=zYpaludLhtU', 'A project introduction to Roots Courtyard 2 in Gurugram, from the RootsDevelopers channel.'),
  ('roots-developers-story', '40+ Years of Building the Future | Roots Developers', 'https://www.youtube.com/watch?v=Eo3psI75DU4', 'A short brand story published by RootsDevelopers.'),
  ('roots-courtyard-gurugram', 'Courtyard Gurugram | Where Nature Meets Modern Living', 'https://www.youtube.com/watch?v=lSOWLF2PB0s', 'A look at the Courtyard Gurugram community and its nature-led positioning, from RootsDevelopers.'),
  ('roots-customer-story', 'Happy Customer | Client Feedback', 'https://www.youtube.com/watch?v=uIcblPg84s0', 'A customer feedback video published by RootsDevelopers.'),
  ('roots-courtyard-smiles', 'It All Began with Smiles | Roots Courtyard 2', 'https://www.youtube.com/watch?v=tEJo0qJSOAg', 'A Courtyard 2 video published by RootsDevelopers.'),
  ('roots-voices-of-trust', 'Voices of Trust | Roots Developers', 'https://www.youtube.com/watch?v=mH9yBnohESM', 'A trust and customer-story video published by RootsDevelopers.'),
  ('roots-growth-partners', 'Growth Partner Testimonials | Roots Developers', 'https://www.youtube.com/watch?v=kbEou2qv2Wg', 'A growth-partner testimonial video published by RootsDevelopers.'),
  ('roots-elevate', 'Something Big Is Coming | Roots Developers', 'https://www.youtube.com/watch?v=OENlqF8gBIA', 'An upcoming development teaser published by RootsDevelopers.'),
  ('roots-courtyard-phase-two', 'Courtyard 2 Phase 2 | Roots Developers', 'https://www.youtube.com/watch?v=defeBUfEtCw', 'A Courtyard 2 Phase 2 video published by RootsDevelopers.'),
  ('roots-growth-partners-story', 'Hear About Us from Our Growth Partners', 'https://www.youtube.com/watch?v=i4Js3elXw5I', 'Growth partners share their perspective on Roots Developers.')
on conflict (id) do nothing;
