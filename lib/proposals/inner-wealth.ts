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
  6. NO FIGURES for hosting or photography, the two out of pocket costs Tony carries.
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
        { kind: 'p', text: 'Two things I want to be straight about before you read on. I work at a marketing agency and I do this alongside it, with a small team: one specialist on SEO, one on web design, and me across both and running the project. And I will not promise you a position in Google, because nobody controls that. What I can do is show you what we would build, what it costs, and how much of your time it takes.' },
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
        { kind: 'h3', text: 'What we found' },
        { kind: 'p', text: 'Checked live on 14 August. All of it is on the site now and you can see it yourself.' },
        {
          kind: 'ul',
          items: [
            '**Three registration numbers in your footer are tappable as phone numbers.** Wix did it automatically to your Authorised Representative number and both ABNs.',
            '**Your homepage has no main heading.** The count is zero. It is the first thing Google reads to work out what a page is for.',
            '**The search settings still hold the Wix factory default,** "Business, tagline". In six years nobody has opened them.',
            '**Six pages and no articles,** so there are six places a search can land and none of them answer a question anyone types.',
          ],
        },
        /* The demonstration stays: the vault records it as the one thing Tony can check on his own
           phone in ten seconds, and it sits in the regulated part of his footer. What went is the
           claim that it is "the whole problem", which the four bullets above it contradict. */
        { kind: 'callout', text: 'Open the site on your phone, scroll to the bottom and tap the ABN. It tries to call it. That is the kind of decision Wix makes for you, in the part of the footer that has to be right.' },
        { kind: 'h3', text: 'Part one, the rebuild' },
        {
          kind: 'ul',
          items: [
            '**Move off Wix onto WordPress, built from scratch.** Your branding stays exactly as it is: same colours, same fonts, same look. Nobody who knows Inner Wealth should feel that anything changed hands. What changes is what sits underneath, in a system we can work on and add to, and one that will not make decisions like the footer phone links on your behalf.',
            '**Rebuild the existing pages with a real heading structure**, starting with an H1 on every page.',
            '**Fix the three registration numbers** so they read as text instead of phone links, and correct the footer: current year, correct credits, correct disclosures.',
            '**Build the structure the site does not have today.** A homepage that leads down to pages describing how you take a client through the process, and those pages leading down to articles. Right now the homepage carries the whole site on its own, and there is nowhere else for search traffic to arrive.',
            '**Put the proof where buyers see it.** The CFP designation, the AFA placing, the Adviser Ratings reviews and the Most Trusted Adviser badge, on the pages people land on first.',
            /* Checked live on 14 August: the hero is a four slide carousel, all stock (a couple with
               floor plans, a family under a paper roof, a child in a cape, two deck chairs at sunset).
               "The stock hero photo of a smiling family" named one slide of four as if it were the
               whole hero, and it is the first thing he would check. Now it says what is there. */
            '**Replace the stock photography in the hero.** All four rotating slides are stock models. Photographs of you, the team and the office do more work than any of them.',
            '**Rebuild it mobile first**, so the phone version is the one designed properly rather than a second view generated from the desktop one.',
            '**Update the team page** with the current team.',
          ],
        },
        { kind: 'h3', text: 'Part two, the ongoing SEO' },
        {
          kind: 'ul',
          items: [
            '**Keyword research first.** Before we write anything, we establish what people in Sydney actually type and which of those searches are worth competing for. Whether "financial adviser Sydney" is even the right target has not been established, and we would rather find that out than assume it.',
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
        { kind: 'p', text: 'A small team: a specialist on SEO, a specialist on web design, and me doing both and managing them. I work at a marketing agency and run this alongside it. The engagement is with me, not with the agency. I am your point of contact throughout, so you are never chasing three people.' },
      ],
    },

    {
      id: 'timeline',
      heading: 'Timeline, start date and what we need',
      subheading: 'The two questions you asked on the call, answered',
      blocks: [
        { kind: 'h3', text: 'Timeline' },
        { kind: 'p', text: 'The build takes roughly three to four weeks of production time once we have access and your sign-off on content. Where it stretches is photography and approvals rather than our end.' },
        { kind: 'p', text: 'Your existing site stays live and untouched the whole time. Nothing changes at innerwealth.com.au until you have seen the new site and said go.' },
        { kind: 'p', text: 'On SEO, realistically it takes three to six months before movement is meaningful, and I would not read much into the first couple of months. At that point we review what has moved and adjust. That fits the six month lead time you described, which is why the timing suits this well.' },
        /* Tony's FIRST question, which the welcome section promises is answered in this section and
           which the document did not answer anywhere. It is the worry a careful buyer has about a
           supplier who has a day job, and dodging it is worse than addressing it. Everything here
           is already established elsewhere in the document: the agency job (:61, :130), the two
           specialists, the weekly article questions and the monthly report. No response time is
           promised, because Joji has not set one. That is an open question for him, not a gap to
           fill in with a number that sounds good. */
        { kind: 'h3', text: 'The agency job, and what it means for you' },
        { kind: 'p', text: 'This was your first question, so here is the direct answer. I work at a marketing agency and this runs alongside it. That is why the build is quoted at three to four weeks and why the SEO horizon is three to six months. Those are the numbers I can hold to with that job in place, and they already have the job in them.' },
        { kind: 'p', text: 'It is also why there are three of us. The SEO specialist and the designer each own their part of the work, so the project does not sit on one person\'s calendar. A heavy week at the agency costs a day on a schedule that has room for one.' },
        { kind: 'p', text: 'You will hear from me every week while content is running, through the questions on that week\'s article, and every month through the report. In between I am the one you contact, and if I ever go quiet for longer than you expect, say so and I will tell you where things actually are.' },
        { kind: 'h3', text: 'What we need from you' },
        {
          kind: 'ul',
          items: [
            'Access to the Wix site, to the domain and wherever it is hosted, and to your Google Business Profile. I will send a short list of exactly what to click, so it is one sitting rather than a back and forth.',
            'Current team details for the team page.',
            /* The photographer is Tony's cost and it is on the critical path, so it is surfaced here
               where he plans, not only in the terms. No figure: Joji has not given me one. */
            'A window in your diary for photography. You book and pay the photographer directly, and we supply the shot list and the brief so it is one short session.',
            'Your answers on content, described below.',
          ],
        },
        { kind: 'h3', text: 'How much of your time the ongoing work takes' },
        { kind: 'p', text: 'This was your second question, so here is the direct answer.' },
        { kind: 'p', text: 'We draft the article. Then we come back to you with about five questions on it, the ones only a planner with your experience can answer: how you actually handle that situation, what clients get wrong about it, what you would tell someone in that position. You answer however is quickest, typed or as a voice note. We fold your answers in, you read the final version and say yes or mark what is wrong, and it goes up.' },
        { kind: 'p', text: 'That is four articles a month, so roughly one set of questions a week. You are not writing the article, and you are not logging in to anything. If a month gets busy and the answers slow down, we slow the cadence with you rather than publishing without you.' },
        { kind: 'h3', text: 'Checking before anything goes up' },
        /* This was the one paragraph in the document that could have been sent to a plumber, in the
           highest stakes topic in it. The document already knows he is an Authorised Representative,
           because it corrects his AR number in the footer, so the "if" was pretending not to.
           It still ASKS rather than asserts: Joji cut the AFSL angle deliberately and the vault has
           "who signs off content, and how long do they take" as an open scoping question. Showing
           you know the shape and asking anyway is the honest version. */
        { kind: 'p', text: 'You are an Authorised Representative, so I am working on the assumption that what goes on the site has to be signed off before it is published. That is a scheduling fact and we plan around it. Tell me who does that check and how long they usually take, and we set the content dates to suit and send work in batches so you are not chasing approvals one page at a time.' },
        { kind: 'p', text: 'The registration numbers and disclosures on the site today carry across to the new site, corrected. Any standing wording your sign-off needs is built into the article template, so it is part of the page and nobody has to remember it. Nothing is published without your approval first.' },
        { kind: 'h3', text: 'Reporting' },
        { kind: 'p', text: 'A monthly report in plain English: what was done, what moved, what is next. If you want to talk it through we will book a call. If you would rather just read it, read it.' },
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
        'Full rebuild on WordPress, your branding kept exactly as it is',
        'Real heading structure and a page structure built for search',
        'The three footer phone links fixed, and the footer corrected',
        'Awards, reviews and credentials placed where buyers see them',
        'Rebuilt mobile first',
        'Handover, and a walkthrough of how to edit it',
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
      summary: 'The same rebuild, not invoiced separately, plus the ongoing work that gets it found. If the monthly service ends inside the first six months, the AUD 2,000 build becomes payable.',
      recommended: true,
      highlight: 'Website build included at no charge',
      includes: [
        'Everything in Option A',
        'Keyword research and SEO strategy',
        'On-page and technical SEO, ongoing',
        'Four articles a month, written with your input',
        'Google Business Profile management',
        'Monthly report and a review call',
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
  optionsNote: 'All figures are in Australian dollars. Option B is the one I would take. Under Option A you get a better site, and the enquiries keep coming from where they come from now, which is you. Under Option B the build is not invoiced to you; the monthly fee carries it, and it only becomes payable if the monthly service ends inside the first six months. Including the build is deliberate. It is the part that finishes, and I would rather be paid for the part that keeps mattering, which is the work putting you in front of people who are already searching. If Option A is the right size for the business right now, take it and we will build you a good site.',

  terms: [
    {
      id: 'terms',
      heading: 'Terms',
      subheading: 'Written plainly, and short enough to actually read',
      blocks: [
        { kind: 'h3', text: 'Money' },
        {
          kind: 'kv',
          rows: [
            { term: 'Currency', value: 'All amounts are in Australian dollars.' },
            { term: 'Option A', value: 'AUD 2,000 in total. 50% before work starts, 50% on completion. Completion means the new site is live and approved by you.' },
            { term: 'Option B', value: 'AUD 1,500 per month, billed monthly. The website build is included and not invoiced separately, subject to the six month condition below.' },
            /* "Invoices are issued monthly" sat three rows under Option A's one off 50/50 schedule,
               where there are exactly two invoices and neither is monthly. Scoped per option. */
            { term: 'Payment', value: 'By bank transfer through Wise. Option A is invoiced in two parts, 50% and 50%. Option B is invoiced monthly.' },
            { term: 'Work outside this proposal', value: 'AUD 100 per hour, quoted and agreed in writing before it starts. No surprise invoices.' },
          ],
        },
        { kind: 'h3', text: 'Ending the monthly service' },
        /* Four things were wrong here and all four were drafting, not commercial:
           1. "There is no minimum term" is not true when a six month exit charge exists. It now
              says there is no lock-in period, with one condition, and the condition follows.
           2. Whether the AUD 2,000 is ON TOP of fees already paid was unstated. It is.
           3. Whether notice given inside six months counts was unstated. The trigger is when the
              service ENDS, which is what the recorded term says, so notice is not the test.
           4. The six months was justified by "the same three to six months I described on the
              call". The vault record of the call does not contain that, so the justification now
              points at the Timeline section, which Tony can check inside this document. */
        { kind: 'p', text: 'The SEO is an ongoing monthly service, not a fixed term contract. There is no lock-in period, with one condition, and you can stop it with 30 days notice at any time. The same applies in the other direction.' },
        { kind: 'p', text: 'The condition, and it is the only one in this document. Under Option B the AUD 2,000 website build is not invoiced to you, because the monthly work is what pays for it. If the monthly service ends inside the first six months, that AUD 2,000 becomes payable, in addition to the monthly fees already paid. The six months runs to the last month of service, whenever notice is given. After six months it does not apply, whatever happens. Six months is not an arbitrary number. It is the three to six months set out under Timeline, which is how long this work needs before there is anything worth judging.' },
        { kind: 'h3', text: 'Costs that sit outside these fees' },
        { kind: 'p', text: 'Moving off Wix means the site needs WordPress hosting, which the firm does not currently pay for. We will recommend a plan and set it up, the account goes in Inner Wealth\'s name, and you pay the host directly. It is a small monthly cost and it is yours, not ours, so you are never locked to us by your own hosting.' },
        { kind: 'p', text: 'Domain renewal, any paid plugins and any licensed images also sit outside the fees above. Nothing in that category gets bought without clearing it with you first. Your Wix subscription is yours to cancel once the new site is live and you are happy, and not before.' },
        { kind: 'h3', text: 'The work' },
        {
          kind: 'ul',
          items: [
            '**Your existing site.** It stays live and unchanged until you have reviewed and approved the new one. The domain is pointed at the new site on your say-so.',
            '**Access.** The work needs access to the Wix site, the domain and its hosting, and the Google Business Profile. That access is used only for the work described here.',
            '**Design revisions.** Two rounds of revisions on the design direction are included. Beyond that, changes are quoted first.',
            '**Approval before publishing.** We draft, you review, and nothing is published without your approval. Where something has to be checked by anyone else first, that step is scheduled in and we do not publish until it is cleared.',
            '**Photography.** You arrange and pay the photographer. We supply the shot list and the brief so it is one short session, not a project.',
            '**After launch.** For 30 days after the site goes live, anything not working as described here is fixed at no charge.',
            '**Ownership.** The finished site and its content are yours.',
          ],
        },
        { kind: 'h3', text: 'What is not promised' },
        { kind: 'p', text: 'Nobody can guarantee a position in Google, a volume of enquiries, or a date by which either arrives, and this proposal does not. What is committed is the work described here, done properly, reported monthly, and adjusted when the reporting says it should be.' },
        { kind: 'p', text: 'The three to four week build estimate is production time, and it assumes access, photography and approvals arrive as scheduled. Delays on those move the date.' },
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
