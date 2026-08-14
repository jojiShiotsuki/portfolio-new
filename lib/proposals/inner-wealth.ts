import type { Proposal } from './types';

/*
  Inner Wealth Solutions, Sydney. Prepared after the call with Tony Lu on 14 August 2026.

  Copy came from three independent drafts, three judges (factual accuracy, would-Tony-sign,
  does-it-read-human) and a merge. The commercial terms are Joji's own decisions, taken the
  same day, and nothing here is invented: where a term was not decided it was raised with him
  rather than written in.

  Two deliberate omissions, both recorded so nobody "helpfully" fills them in later:

  1. NO RANKING TABLE. The 7 August audit put five commercial Sydney terms between position 27
     and 42, but those figures are a week old and were never re-checked, so they are not in the
     document. The argument in "Where the site stands today" is written as a shape and holds
     whether a position moved or not. Add the table only once the terms have been re-run.
  2. NO TAX LINE. Joji's instruction. Prices are stated in Australian dollars and the document
     says nothing at all about GST.

  Five more gaps were opened deliberately on 15 August, after a review found them. Each one can
  only be closed by a fact or a decision Joji holds, so the copy is honest about the gap rather
  than filled in with something plausible. Do NOT invent any of these:

  3. NO CONTRACTING ENTITY OR ABN. The cover names a person. Whether Tony is contracting with a
     sole trader, a company, or something else, and under what ABN, is unanswered.
  4. NOTHING ABOUT WHO MAINTAINS THE SITE after launch. Neither option's includes list mentions
     updates, backups, security or uptime, and Wix used to do all of it invisibly.
  5. NO FIRST INVOICE DATE for Option B, so "what do I pay, and when, from signing" is unanswered
     while the build runs.
  6. NO FIGURE for hosting, now the only out of pocket cost Tony carries. Photography stopped
     being one on 14 August: there is no shoot, he sends what he has and licensed stock fills the
     rest, so the only spend left in that area is a stock licence, which is cleared before buying.
  7. NO RESPONSE TIME, and nothing about how articles are drafted or whose byline they carry.
*/
export const innerWealth: Proposal = {
  slug: 'inner-wealth-u3_c-eCtTSpj',
  client: 'Inner Wealth Solutions Pty Ltd',
  contact: 'Tony Lu',
  title: 'Website rebuild and ongoing SEO',
  subtitle: 'Rebuilding innerwealth.com.au off Wix, and the SEO that follows it',
  preparedBy: 'Joji Shiotsuki',
  preparedByRole: 'Web development and SEO',
  preparedByEmail: 'jojishiotsuki0@gmail.com',
  preparedOn: '2026-08-15',
  validUntil: '14 September 2026',

  /*
    Both verbatim from constants.tsx, where they already appear on the live portfolio.
    Chosen deliberately: Tony asked two questions on the call, one about timeline and one
    about how much of his own time this takes, and the first quote answers exactly that.
    The second one is there because he is buying leads, not a website.
  */
  testimonials: [
    {
      quote: 'The entire process was very well laid out. From the very first call with them, we were already informed about what we could expect, the deliverables for each week, etc. I can confidently say that with their services, the site they will develop or optimize for you will definitely have improvements. Communication is also never an issue with these guys. Time-bounded, clear, direct, and easy to plan with.',
      author: 'Sam',
      role: 'Owner',
      /* Full trading name. Truncated to "YOU%" it renders in the all caps attribution as
         "SAM, OWNER, YOU%", which reads as a template variable that failed to fill. */
      company: 'YOU% Nutrition',
    },
    {
      quote: 'Clear, direct communication and a structured approach to project delivery. Our new website has generated measurable improvements in leads and sales.',
      author: 'Noura',
      role: 'Head Graphic Designer',
      company: 'Spark Your Designs',
    },
  ],

  sections: [
    {
      id: 'welcome',
      heading: 'Welcome and thank you',
      blocks: [
        { kind: 'p', text: 'Thank you for the call on 14 August, and thanks to Mitchell for putting us in touch.' },
        { kind: 'p', text: 'You said the thing that matters most in the first few minutes. You are bringing on a new adviser, and you want that adviser as busy as possible, as quickly as possible. Everything in here is pointed at that. At the moment your enquiries come from your Google reviews, your Adviser Ratings reviews and people who already know you. That works, and it keeps you busy. It is also your own network, which is a hard thing to hand to somebody else.' },
        { kind: 'p', text: 'The site was built about six years ago on Wix and most of it has sat still since. What I would like to do is rebuild it on WordPress, keeping your branding exactly as it is, and then do the SEO that puts it in front of people looking for a financial planner in Sydney. You told me you have the patience for a six month lead time. That is the right expectation, and it is roughly how this work behaves.' },
        { kind: 'p', text: 'One thing I want to be straight about before you read on. I will not promise you a position in Google, because nobody controls that. What I can do is show you what we would build, what it costs, and how much of your time it takes. The work is done by a small team: one specialist on SEO, one on web design, and me across both.' },
        { kind: 'p', text: 'You asked me two questions on the call: what the timeline looks like given my other commitments, and how much of your own time the ongoing work needs. Both are answered under **Timeline, start date and what we need**.' },
        { kind: 'p', text: 'Have a read. If something in here is wrong or does not fit, tell me and I will change it.' },
        {
          kind: 'kv',
          rows: [
            { term: 'From', value: '**Joji Shiotsuki**' },
            { term: 'Role', value: 'Web development and SEO' },
            { term: 'Email', value: 'jojishiotsuki0@gmail.com' },
          ],
        },
      ],
    },

    {
      id: 'overview',
      heading: 'Overview',
      blocks: [
        /* No age for the practice. The only six in the record is the age of the WIX SITE, and the
           AFA placing is dated 2017, so "six years" was very likely wrong about the firm itself.
           Nothing in the vault records a founding year, so the number is out rather than guessed. */
        { kind: 'p', text: 'Inner Wealth Solutions has built the thing most planning firms never get: a practice that grows on reputation. A Certified Financial Planner, a top 6 placing for AFA Adviser of the Year, more than 100 five star reviews on Adviser Ratings and a Most Trusted Adviser badge. Clients arrive because other people send them.' },
        { kind: 'p', text: 'The opportunity now is not proving Inner Wealth is good at this. It is being found by the people already searching who do not know the name yet. Referrals are yours personally, and a new adviser cannot inherit them, so the work is to build a second source of enquiries that does not depend on you.' },
        { kind: 'p', text: 'The website is the part that has not kept up. Six pages on Wix, largely unchanged since about 2020, with no main heading on the homepage and search settings nobody has ever opened. Our role is to rebuild it as something you own and can add to, then do the ongoing SEO that puts it in front of Sydney buyers, so the demand is there when your new adviser is ready to work it.' },
      ],
    },

    {
      id: 'scope-of-work',
      heading: 'Scope of work',
      subheading: 'Two parts: build the site, then work on getting it found',
      blocks: [
        /* A "What we found" block opened this section until 14 August: four audited faults, and
           the callout inviting Tony to tap his own ABN and watch it dial. Removed on Joji's call,
           and the reason is a standing one rather than a matter of taste. Opening a redesign pitch
           with the list of faults you would fix hands the client a cheaper way to buy: four named
           problems read as a four item repair job, not a rebuild, and the AUD 2,000 starts being
           measured against fixing a footer. The faults still get fixed and they still appear below,
           as scope rather than as the argument for the work. Do not put them back at the top. */
        { kind: 'h3', text: 'Part one, the rebuild' },
        {
          kind: 'ul',
          items: [
            /* These bullets read as a repair list until 14 August: fix the numbers, update the team
               page, rebuild the existing pages. Every one was true and the sum of them was wrong,
               because a list of corrections is priced against the corrections. This is a new site,
               so the scope now leads with the two things that make it one, a new design and new
               copy on every page, and the corrections sit underneath as detail rather than as the
               job. Same work, stated at its real size. */
            '**A new website, designed from scratch on WordPress.** Not your Wix site moved across. Every page is laid out again, and your branding carries over exactly: same logo, same colours, same fonts, so it still reads as Inner Wealth to anyone who knows you. It just stops looking six years old.',
            '**New copy written for every page.** What is there now was written once and left. We write it again around what somebody is actually trying to work out when they land on you, and you see all of it before any of it goes live.',
            '**The pages the site does not have.** A homepage that leads down to pages describing how you take a client through the process, and those pages leading down to articles. Right now the homepage carries the whole site on its own, and there is nowhere else for search traffic to arrive.',
            '**Built for search from the first page**, rather than corrected afterwards: a real heading structure with an H1 on every page, and page titles and search settings written rather than left on the Wix factory default.',
            '**Your proof where buyers see it.** The CFP designation, the AFA placing, the Adviser Ratings reviews and the Most Trusted Adviser badge, on the pages people land on first.',
            /* Checked live on 14 August: the hero is a four slide carousel, all stock (a couple with
               floor plans, a family under a paper roof, a child in a cape, two deck chairs at sunset).
               "The stock hero photo of a smiling family" named one slide of four as if it were the
               whole hero, and it is the first thing he would check. Now it says what is there. */
            '**Real photographs wherever we can get them.** All four rotating hero slides on the site today are stock models. Pictures of you, the team and the office do more work than any of them, so we will use whatever you already have and ask you for the rest. Where a photograph is not practical to get, we will source properly licensed stock instead of leaving a gap.',
            '**Designed for the phone first**, so the phone version is the one designed properly rather than a second view generated from the desktop one.',
            '**The footer put right.** The three registration numbers set as text rather than tappable phone links, and the current year, credits and disclosures corrected.',
            '**Handover and a walkthrough**, so you can edit a page without calling anyone.',
          ],
        },
        { kind: 'h3', text: 'Part two, the ongoing SEO' },
        {
          kind: 'ul',
          items: [
            '**Keyword research first.** Before we write anything, we establish what people actually type, how far beyond Sydney it is worth reaching, and which of those searches are worth competing for. Whether "financial adviser Sydney" is even the right target has not been established, and we would rather find that out than assume it.',
            '**On-page work.** Titles, headings, page copy, the text search engines show in results, and internal links between pages. Corrected once at build, then maintained.',
            '**Technical work.** Speed, crawlability, indexing, structured data, and keeping Search Console clean so problems surface early instead of six months later.',
            '**Content.** Four articles a month, answering the questions your prospects ask before they book, written with you rather than around you. The process is in the next section.',
            '**Google Business Profile.** Managed and kept current, since it feeds the review engine that already brings you clients.',
            '**A monthly report and a review call.** What was published, what moved, what we are doing next, and what we are changing because of it.',
          ],
        },
        /* This paragraph used to open "because it comes up" and then answer with Google's position
           on content "regardless of how it was produced". For an Authorised Representative that
           raises the AI question and answers a different one. Joji has not told me what he wants
           said about how drafts are produced, so the question is not raised here at all and the
           paragraph states the part that is already committed: he approves it, and it is his. */
        { kind: 'p', text: 'One note on how the articles get written. We draft, your answers go into the draft, and you read the final version before anything is published. The test each article has to pass is whether it is accurate for your market and worth a prospect\'s time. That is why your input sits inside the process instead of being collected at the end.' },
        { kind: 'h3', text: 'Who does the work' },
        /* "The engagement is with me, not with the agency" answers the question a director's
           bookkeeper asks when a proposal volunteers twice that its author has a day job. The
           contracting entity and ABN are NOT here because Joji has not told me what they are. */
        /* The response commitment lives HERE and deliberately not in the terms. It is a service
           promise Joji intends to keep, not a clause he wants held to the letter on a bad week.

           It carries NO hour, twice on purpose. Joji works US hours and is usually up at 4pm Cebu,
           which is 6pm in Sydney, so a bare "4pm" in a document read in Sydney is wrong by two
           hours; and naming any window at all describes the day job, every reference to which came
           out of this document on 15 August. "The same day" is the whole promise. Do not add an
           hour, a timezone or a working pattern back to it. */
        { kind: 'p', text: 'A small team: a specialist on SEO, a specialist on web design, and me across both. Message me any time and you will have a reply the same day.' },
      ],
    },

    {
      id: 'timeline',
      heading: 'Timeline, start date and what we need',
      subheading: 'The two questions you asked on the call, answered',
      blocks: [
        { kind: 'h3', text: 'Timeline' },
        { kind: 'p', text: 'The build takes roughly three to six weeks of production time once we have access and your sign-off on content. Where it stretches is approvals rather than our end.' },
        { kind: 'p', text: 'Your existing site stays live and untouched the whole time. Nothing changes at innerwealth.com.au until you have seen the new site and said go.' },
        { kind: 'p', text: 'On SEO, realistically it takes three to six months before movement is meaningful, and I would not read much into the first couple of months. At that point we review what has moved and adjust. That fits the six month lead time you described, which is why the timing suits this well.' },
        /* A section headed "The agency job, and what it means for you" sat here, added because it
           was Tony's first question on the call. It was rewritten on 14 August to drop the day job
           and then REMOVED entirely on Joji's call on 15 August.

           Nothing load bearing went with it, which was checked rather than assumed: the build and
           SEO dates are still stated in the timeline paragraph above and again in the terms, the
           monthly report survives in the Option B includes and in its own paragraph, and the weekly
           article questions survive under how much of your time the ongoing work takes. What went
           is a restatement of all three in one place, plus a paragraph about response times that
           promised nothing, because Joji has never set one. */
        { kind: 'h3', text: 'What we need from you' },
        {
          kind: 'ul',
          items: [
            'Access to the Wix site, to the domain and wherever it is hosted, and to your Google Business Profile.',
            'There may be more we need access to once we are inside the site, depending on what it turns out to be connected to. We will tell you what and why as it comes up.',
            'Current team details for the team page.',
            /* Was "a window in your diary for photography, you book and pay the photographer".
               Removed 14 August on Joji's call: there is no shoot in this engagement. Tony sends
               what he has and licensed stock covers the rest, which also takes photography off the
               critical path, so the three to six week estimate no longer depends on a third party
               Tony has not hired yet. The same change is made in the timeline and in the terms;
               all four have to say one thing or the cheapest reading wins. */
            'Any photographs you already have of yourself, the team and the office.',
            'Your answers on content, described below.',
          ],
        },
        /* Two h3 sections were removed here on 15 August, both on Joji's call: "How much of your
           time the ongoing work takes" (the five questions a week, the four article cadence) and
           "Checking before anything goes up" (the Authorised Representative sign-off).

           The compliance half was checked before cutting, because it is the one thing in this
           document with a regulatory edge. It is NOT lost: the terms carry "Approval before
           publishing. We draft, you review, and nothing is published without your approval. Where
           something has to be checked by anyone else first, that step is scheduled in and we do not
           publish until it is cleared." That is the binding statement and it is still there. If the
           terms bullet is ever cut, this needs putting back somewhere, or the document stops saying
           an Authorised Representative approves his own content before it goes live. */
        { kind: 'h3', text: 'Reporting' },
        { kind: 'p', text: 'A monthly report in plain English: what was done, what moved, what is next. If you want to talk it through we will book a call. If you would rather just read it, that is completely fine as well.' },
      ],
    },
  ],

  options: [
    {
      id: 'website-only',
      name: 'Option A: Website only',
      price: 'AUD 2,000',
      cadence: 'one off',
      summary: 'The rebuild on its own, with no ongoing work.',
      includes: [
        'A new website designed from scratch on WordPress, your branding kept exactly as it is',
        'New copy written for every page',
        'Real heading structure and a page structure built for search',
        'The three footer phone links fixed, and the footer corrected',
        'Awards, reviews and credentials placed where buyers see them',
        'Designed for the phone first',
        'Handover, and a walkthrough of how to edit it',
        'Optional ongoing maintenance at AUD 100 a month, including small updates',
      ],
      lines: [
        { label: 'To start', amount: 'AUD 1,000', note: '50% before work begins' },
        { label: 'On completion', amount: 'AUD 1,000', note: '50% once the site is live and approved' },
      ],
    },
    {
      id: 'website-plus-seo',
      name: 'Option B: Website plus SEO',
      price: 'AUD 1,500',
      cadence: 'per month',
      /* The condition rides in the summary, directly under the price, because this is flowing body
         text on the card: it wraps cleanly at any width, where a long note on the amount row pushes
         "Included" onto a line of its own. A buyer now meets the giveaway and its condition in the
         same breath, on the card, instead of finding the condition alone in section 07. */
      summary: 'The same rebuild, not invoiced separately, plus the ongoing work that gets it found. If the monthly service ends inside the first three months, the AUD 2,000 build becomes payable.',
      recommended: true,
      highlight: 'Website build included at no charge',
      includes: [
        'Everything in Option A',
        'Keyword research and SEO strategy',
        'On-page and technical SEO, ongoing',
        'Four articles a month, written with your input',
        'Google Business Profile management',
        'Monthly report and a review call',
        'Site maintenance, backups, security and small edits included',
      ],
      lines: [
        /* The clawback rides on the line that makes the giveaway. It used to live only in section
           07, so a buyer who read the price card and the signature saw an unconditional free build
           twice and the condition zero times. Tony is precisely the reader who finds it late. */
        { label: 'Website build', amount: 'Included', note: 'Normally AUD 2,000, see summary' },
        { label: 'Monthly', amount: 'AUD 1,500', note: 'Ongoing, billed monthly' },
      ],
    },
  ],
  /* "The build costs you nothing" was the one unconditional version of the giveaway sitting next to
     the price. It now carries its condition, and says how the build is actually paid for. */
  /* optionsNote is deliberately absent. It carried the paragraph under the two cards recommending
     Option B in words, removed on Joji's call 15 August. The field is optional and Investment.tsx
     renders nothing when it is missing, so this is an absence rather than an empty paragraph.
     Nothing unique to the deal went with it: the clawback is still stated on the Option B card and
     again in the terms, and Option B is still marked recommended, which is what draws the outline
     and the "website build included at no charge" ribbon. What went is the argument in prose. */

  terms: [
    {
      id: 'terms',
      heading: 'Terms',
      subheading: 'Written plainly, and short enough to actually read',
      blocks: [
        { kind: 'h3', text: 'Who you are contracting with' },
        { kind: 'p', text: 'Me, Joji Shiotsuki, as an individual working with a small team: a specialist on SEO, a specialist on web design, and me across both. I am not an incorporated agency and I am not going to pretend to be one. I am based in Cebu in the Philippines, which is why invoices are paid by transfer through Wise rather than into an Australian bank account. The work does not change hands.' },
        { kind: 'h3', text: 'Money' },
        {
          kind: 'kv',
          rows: [
            { term: 'Option A', value: 'AUD 2,000 in total. 50% before work starts, 50% on completion. Completion means the new site is live and approved by you.' },
            { term: 'Option B', value: 'AUD 1,500 per month, billed monthly. The website build is included and not invoiced separately, subject to the three month condition below.' },
            /* "Invoices are issued monthly" sat three rows under Option A's one off 50/50 schedule,
               where there are exactly two invoices and neither is monthly. Scoped per option. */
            { term: 'Payment', value: 'By bank transfer through Wise. Option A is invoiced in two parts, 50% and 50%. Option B is invoiced monthly.' },
            { term: 'First invoice', value: 'Under Option A, the 50% deposit, before work starts. Under Option B, the first month at AUD 1,500, at the start of the work rather than at launch.' },
            { term: 'Work outside this proposal', value: 'AUD 100 per hour, quoted and agreed in writing before it starts. No surprise invoices.' },
          ],
        },
        { kind: 'h3', text: 'Ending the monthly service' },
        /* 15 AUGUST: the clawback window was CUT FROM SIX MONTHS TO THREE on Joji's call. Changed
           in four places: here, the Option B card summary, the options note under the two cards,
           and the Option B row in the payment table. "Six months" still appears three times in the
           document and none of them are this: Tony's own six month lead time in the welcome, the
           three to six month SEO horizon under Timeline, and a figure of speech about Search
           Console. Do not sweep those with a find and replace.

           The justification had to change with the number, not just the number. It read "six months
           is the three to six months set out under Timeline". Three months is not that range, it is
           the START of it, so it now says so.

           Four earlier drafting fixes, still standing:
           1. "There is no minimum term" is not true when an exit charge exists. It now says there
              is no lock-in period, with one condition, and the condition follows.
           2. Whether the AUD 2,000 is ON TOP of fees already paid was unstated. It is.
           3. Whether notice given inside the window counts was unstated. The trigger is when the
              service ENDS, which is what the recorded term says, so notice is not the test.
           4. The window was justified by "the same three to six months I described on the call".
              The vault record of the call does not contain that, so the justification points at
              the Timeline section, which Tony can check inside this document. */
        { kind: 'p', text: 'The SEO is an ongoing monthly service, not a fixed term contract. There is no lock-in period, with one condition, and you can stop it with 30 days notice at any time. The same applies in the other direction.' },
        { kind: 'p', text: 'The condition, and it is the only one in this document. Under Option B the AUD 2,000 website build is not invoiced to you, because the monthly work is what pays for it. If the monthly service ends inside the first three months, that AUD 2,000 becomes payable, in addition to the monthly fees already paid. The three months runs to the last month of service, whenever notice is given. After three months it does not apply, whatever happens. It also only applies if you end the service. If I end it inside three months, for any reason, the AUD 2,000 is not payable and never becomes payable. Three months is not an arbitrary number. It is where the three to six months set out under Timeline begins, and the earliest point at which there is anything worth judging.' },
        { kind: 'h3', text: 'Who looks after the site once it is live' },
        { kind: 'p', text: 'WordPress needs looking after in a way Wix does not, so this is worth being exact about rather than leaving you to find out.' },
        {
          kind: 'ul',
          items: [
            '**Under Option B this is included.** Keeping WordPress, its theme and its plugins up to date, backups, security, and small edits: a phone number, a paragraph, a price, a staff change, a new document to link. Send them over and they get done.',
            '**Bigger pieces of work are quoted first.** A new page you ask for, a change of layout, a new section, a rebuild of something we already built. Those are AUD 100 per hour, and you get the estimate before anything starts.',
            '**Under Option A maintenance is optional, at AUD 100 a month.** The site is yours, on hosting in your name. For that AUD 100 I keep WordPress, its theme and its plugins up to date, with backups, security and small updates included. If you would rather look after it yourself once the 30 day post-launch period ends, that is fine too, and nothing starts without you asking for it.',
          ],
        },
        { kind: 'h3', text: 'Costs that sit outside these fees' },
        /* Was "we will recommend a plan and set it up". Corrected 15 August: TONY opens the hosting
           account himself and then grants access, which is a different thing from Joji opening it
           in his name. It is the whole ownership point of the paragraph, and the old wording quietly
           undercut it by having the supplier create the account the client is told they own. */
        { kind: 'p', text: 'Moving off Wix means the site needs WordPress hosting, which the firm does not currently pay for. We will recommend a plan, you sign up for it in Inner Wealth\'s name and pay the host directly, and then you give us the access we need to build on it. It is a small monthly cost, the account is yours rather than ours, and you keep full ownership of it, so you are never locked to us by your own hosting.' },
        { kind: 'p', text: 'Domain renewal, any paid plugins and any licensed images also sit outside the fees above. Nothing in that category gets bought without clearing it with you first. Your Wix subscription is yours to cancel once the new site is live and you are happy, and not before.' },
        { kind: 'h3', text: 'The work' },
        {
          kind: 'ul',
          items: [
            '**Your existing site.** It stays live and unchanged until you have reviewed and approved the new one. The domain is pointed at the new site on your say-so.',
            '**Access.** The work needs access to the Wix site, the domain and its hosting, and the Google Business Profile. That access is used only for the work described here.',
            '**Design revisions.** Two rounds of revisions on the design direction are included. Beyond that, changes are quoted first.',
            '**Approval before publishing.** We draft, you review, and nothing is published without your approval. Where something has to be checked by anyone else first, that step is scheduled in and we do not publish until it is cleared.',
            '**Photography.** You send us the pictures you already have and we use those. Where there is a gap we use stock we are licensed to use commercially, and anything carrying a fee is cleared with you before it is bought. If you would rather have new photographs taken, that is yours to arrange and the build does not wait on it.',
            '**After launch.** For 30 days after the site goes live, anything not working as described here is fixed at no charge.',
            '**Ownership.** The finished site and its content are yours.',
          ],
        },
        { kind: 'h3', text: 'What is not promised' },
        { kind: 'p', text: 'Nobody can guarantee a position in Google, a volume of enquiries, or a date by which either arrives, and this proposal does not. What is committed is the work described here, done properly, reported monthly, and adjusted when the reporting says it should be.' },
        { kind: 'p', text: 'The three to six week build estimate is production time, and it assumes access and approvals arrive as scheduled. Delays on those move the date.' },
      ],
    },
  ],

  signature: {
    statement: 'I accept this proposal and the option selected above, on the terms set out in this document.',
    /* "A copy goes to you and to Joji" promised a delivery no code performs: the worker's only
       outbound mail goes to NOTIFY_EMAIL, and the signer's address is used as reply-to. Rather
       than assert a send that does not happen, the note now describes what signing does do. */
    note: 'Signing records your name, the option you chose, the date and time, and the version of this proposal you are looking at, and gives you a reference number to keep. If you would rather just reply to the email naming the option you want, that is equally fine.',
  },
};
