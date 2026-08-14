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
      company: 'YOU%',
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
      subheading: 'Where the practice is, and where the website is',
      blocks: [
        { kind: 'p', text: 'Inner Wealth Solutions has spent six years building something most planning firms never get: a practice that grows on reputation. A Certified Financial Planner, a top 6 placing for AFA Adviser of the Year, more than 100 five star reviews on Adviser Ratings and a Most Trusted Adviser badge. Clients arrive because other people send them.' },
        { kind: 'p', text: 'That is a strong position and it is also a limit. Referrals are yours personally, and a new adviser cannot inherit them. The opportunity now is not proving the firm is good at this, it is being findable by the people who are already searching for it and do not know the name yet.' },
        { kind: 'p', text: 'The website is the part that has not kept up. Six pages, built on Wix about six years ago, largely unchanged since. It is not costing the firm anything today because nothing is asked of it. It is also not able to carry what comes next.' },
        { kind: 'h3', text: 'What we heard on the call' },
        { kind: 'p', text: 'Reading this back so you can check we have it right.' },
        { kind: 'p', text: '**The new adviser is the reason for doing this now.** In your words: "I\'m bringing on a new advisor. So I want that new advisor to be as busy as possible, as quick as possible." They are new to financial planning and cannot advise independently yet, so you expect to carry the advice work yourself for at least another six months. You want the demand there when they are ready.' },
        { kind: 'p', text: '**You are not in a rush.** "I still got the patience for like a six month lead time to get all this." Good, because this kind of work does not reward impatience, and I would rather set an honest pace than sell you a fast one.' },
        { kind: 'p', text: '**The business does not advertise.** Google reviews and Adviser Ratings reviews generate enough leads to keep you busy. That is a strong position to be in. It is also why the website has never had to earn its keep, and at the moment it does not.' },
        { kind: 'p', text: '**You are hands off with the site, deliberately.** "Pretty hands off. If there\'s things to change like links and financial services guides and privacy policy updates, I\'ll go in. But that\'s the limit." The site was set up six years ago when you started the business, and the team page has not been updated since. Nothing in this proposal asks you to learn a website.' },
        { kind: 'p', text: '**You raised the mobile point yourself.** "I don\'t mind the flow, but I think from a mobile friendly perspective it can be better. And this was six years ago, so it\'s pre AI stuff." The flow stays. What changes is the build underneath it.' },
        { kind: 'p', text: '**One service, one journey.** You were clear that you do not sell a list of products: "it\'s just financial planning services all in one together, it\'s not multiple services, it\'s just about the journey and how we do things." That shapes what we build. We are not going to invent service lines you do not offer.' },
        { kind: 'p', text: 'One more thing worth saying plainly. The Search Console and Bing Webmaster Tools accounts set up recently are the right accounts to have, and you were right that the work is not wasted. We would use those and build on them rather than start again.' },

        { kind: 'h3', text: 'Where the site stands today' },
        { kind: 'p', text: 'Re-checked live on 14 August 2026. Everything here is something you can check yourself.' },
        { kind: 'p', text: '**Three registration numbers in your footer have been turned into phone links.** Wix did this automatically. It treated your Authorised Representative number (closing bracket included), your ABN and Prosperitas\' ABN as phone numbers. On a mobile, tapping one tries to dial it.' },
        { kind: 'callout', text: 'Open the site on your phone, scroll to the bottom and tap the ABN. It takes ten seconds, and it is the clearest example of the platform making a decision nobody approved.' },
        { kind: 'p', text: '**Your homepage has no main heading.** The count of H1 headings on it is zero. That is the heading Google reads first to work out what a page is for, and there is not one on the page.' },
        { kind: 'p', text: '**The site\'s keyword setting still holds Wix\'s factory default, "Business, tagline".** That text does nothing either way for your rankings. What it tells us is simpler: in six years nobody has opened the SEO settings on this site.' },
        { kind: 'p', text: '**The site is six pages**, home, about, services, our team, testimonials and contact, with no articles. That gives a search six places to land, and none of them answer a question someone might be typing into Google.' },
        { kind: 'p', text: '**The footer still credits a previous agency and reads copyright 2020**, and the team page is the one you already told us is out of date.' },
        { kind: 'p', text: '**On mobile it works, and it can be better.** Your words, and we agree with them. Wix serves a separate mobile view and it functions. It is dated, and it is not built the way a site aiming to be found in 2026 needs to be built.' },
        { kind: 'h3', text: 'The gap that costs you' },
        { kind: 'p', text: 'The faults above are fixable in a fortnight. The bigger issue is visibility. Every commercial Sydney search term we checked sits on page three or worse, and almost nobody scrolls that far. For the searches that matter, the firm is not in the running.' },
        { kind: 'p', text: 'Set that against what the firm actually is.' },
        {
          kind: 'ul',
          items: [
            'Certified Financial Planner',
            'Top 6 for AFA Adviser of the Year, 2017',
            'More than 100 five star reviews on Adviser Ratings',
            'A Most Trusted Adviser badge',
          ],
        },
        { kind: 'p', text: 'That is a stronger record than most planning firms in Sydney can show, and Google has it parked where nobody looks.' },
      ],
    },

    {
      id: 'scope-of-work',
      heading: 'Scope of work',
      subheading: 'Two parts: build the site, then work on getting it found',
      blocks: [
        { kind: 'h3', text: 'Part one, the rebuild' },
        {
          kind: 'ul',
          items: [
            '**Move off Wix onto WordPress, built from scratch.** Your branding stays exactly as it is: same colours, same fonts, same look. Nobody who knows Inner Wealth should feel that anything changed hands. What changes is what sits underneath, in a system we can work on and add to, and one that will not make decisions like the footer phone links on your behalf.',
            '**Rebuild the existing pages with a real heading structure**, starting with an H1 on every page.',
            '**Fix the three registration numbers** so they read as text instead of phone links, and correct the footer: current year, correct credits, correct disclosures.',
            '**Build the structure the site does not have today.** A homepage that leads down to pages describing how you take a client through the process, and those pages leading down to articles. Right now the homepage carries the whole site on its own, and there is nowhere else for search traffic to arrive.',
            '**Put the proof where buyers see it.** The CFP designation, the AFA placing, the Adviser Ratings reviews and the Most Trusted Adviser badge, on the pages people land on first.',
            '**Replace the stock hero photo** of a smiling family with real photography of you and the practice.',
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
        { kind: 'p', text: 'One note on how the content gets written, because it comes up. Google\'s stated position is that it rewards helpful content regardless of how it was produced, and acts against unhelpful content produced at scale. So the standard we hold to is whether an article is accurate for your market and worth reading. That is why your input is built into the process rather than bolted on at the end.' },
        { kind: 'h3', text: 'Who does the work' },
        { kind: 'p', text: 'A small team: a specialist on SEO, a specialist on web design, and me doing both and managing them. I work at a marketing agency and run this alongside it. I am your point of contact throughout, so you are never chasing three people.' },
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
        { kind: 'h3', text: 'What we need from you' },
        {
          kind: 'ul',
          items: [
            'Access to the Wix site, to the domain and wherever it is hosted, and to your Google Business Profile. I will send a short list of exactly what to click, so it is one sitting rather than a back and forth.',
            'Current team details for the team page.',
            'A window in your diary for photography.',
            'Your answers on content, described below.',
          ],
        },
        { kind: 'h3', text: 'How much of your time the ongoing work takes' },
        { kind: 'p', text: 'This was your second question, so here is the direct answer.' },
        { kind: 'p', text: 'We draft the article. Then we come back to you with about five questions on it, the ones only a planner with your experience can answer: how you actually handle that situation, what clients get wrong about it, what you would tell someone in that position. You answer however is quickest, typed or as a voice note. We fold your answers in, you read the final version and say yes or mark what is wrong, and it goes up.' },
        { kind: 'p', text: 'That is four articles a month, so roughly one set of questions a week. You are not writing the article, and you are not logging in to anything. If a month gets busy and the answers slow down, we slow the cadence with you rather than publishing without you.' },
        { kind: 'h3', text: 'Checking before anything goes up' },
        { kind: 'p', text: 'If anything on the site has to be checked by someone else before it is published, we build that step into the schedule rather than working around it. Tell us how long that check usually takes and we set the content dates to suit, and we send work in batches so you are not chasing approvals one page at a time. Nothing is published without your approval first.' },
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
      summary: 'The same rebuild, included at no charge, plus the ongoing work that gets it found.',
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
        { label: 'Website build', amount: 'Included', note: 'Normally AUD 2,000' },
        { label: 'Monthly', amount: 'AUD 1,500', note: 'Ongoing, billed monthly' },
      ],
    },
  ],
  optionsNote: 'All figures are in Australian dollars. Option B is the one I would take. Under Option A you get a better site, and the enquiries keep coming from where they come from now, which is you. Under Option B the build costs you nothing and the monthly fee goes into the part that puts the site in front of people who are already searching. Including the build is deliberate: it is the part that finishes, and I would rather be paid for the part that keeps mattering. If Option A is the right size for the business right now, take it and we will build you a good site.',

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
            { term: 'Option B', value: 'AUD 1,500 per month, billed monthly, with the website build included at no charge.' },
            { term: 'Payment', value: 'By bank transfer through Wise. Invoices are issued monthly.' },
            { term: 'Work outside this proposal', value: 'AUD 100 per hour, quoted and agreed in writing before it starts. No surprise invoices.' },
          ],
        },
        { kind: 'h3', text: 'Ending the monthly service' },
        { kind: 'p', text: 'The SEO is an ongoing monthly service, not a fixed term contract. There is no minimum term and you can stop it with 30 days notice at any time. The same applies in the other direction.' },
        { kind: 'p', text: 'One condition, and it is the only one in this document. Under Option B the AUD 2,000 website build is included at no charge because the monthly work is what pays for it. If you end the monthly service within the first six months, the AUD 2,000 build becomes payable. After six months it does not, whatever happens. Six months is not an arbitrary number: it is the point at which this work has had a fair run, which is the same three to six months I described on the call.' },
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
    note: 'Signing records your name, the option you chose, the date and time, and the version of this proposal you are looking at. A copy goes to you and to Joji. If you would rather just reply to the email naming the option you want, that is equally fine.',
  },
};
