---
minutes: 45
summary: Code and media have almost zero marginal cost, so one piece of work can serve one person or a million for nearly the same cost. Nobody needs to give you permission to use them. That makes them the most powerful leverage, and also the most competitive.
warmup:
  - id: cm-w1
    type: numeric
    prompt: From the last lesson. You invest ₹10 lakh of your own plus ₹10 lakh borrowed at 12%. The ₹20 lakh earns 20% in a year. What is the return on your own money? (as a %)
    answer: 28
    unit: '%'
    unit_label: '%'
    hints:
      - Total earned on ₹20 lakh, minus interest on ₹10 lakh, divided by your ₹10 lakh.
      - (0.20 × 20 − 0.12 × 10) ÷ 10.
    solution: ₹4 lakh earned − ₹1.2 lakh interest = ₹2.8 lakh on ₹10 lakh, which is 28%.
  - id: cm-w2
    type: choice
    prompt: From positive sum games. What decides how much value a trade **creates**?
    options:
      - text: The price
        why: Price only decides how the value is shared.
      - text: What it is worth to the buyer minus what it costs the seller
        correct: true
      - text: How much profit the seller makes
        why: Profit is the seller's share, not the total.
    hints:
      - There were three numbers in every trade. Which two set the total?
      - The surplus chart showed that moving the price changed only the split.
    solution: Worth to the buyer minus cost to the seller. Price splits it.
explain:
  prompt: Explain what marginal cost is, why code and media have almost none, and what that means for how big a business built on them can get. Include one downside.
  rubric:
    - Marginal cost is the extra cost of serving one more customer or making one more copy
    - Average cost equals fixed cost divided by customers plus marginal cost, so it falls towards the marginal cost as customers grow
    - Software and recorded media can be copied and delivered almost free, so one piece of work can serve millions
    - Nobody has to give permission to write code or publish media
    - At least one downside, such as easy copying by competitors, global competition for attention, or winner take most outcomes
almanac:
  prompt: If you could make one piece of code or media that would still be helping people in ten years, what would it be about? What do you know that would make it hard to copy?
practice:
  - id: cm-p1
    type: numeric
    prompt: A sleep app costs ₹50 lakh a year to run (team, design, marketing) plus ₹5 per user in server costs. With 1,00,000 users, what is the **average cost per user**? (in rupees)
    answer: 55
    unit_label: ₹ per user
    hints:
      - Average cost = fixed cost ÷ users + marginal cost.
      - ₹50,00,000 ÷ 1,00,000 + ₹5.
    solution: ₹50 + ₹5 = ₹55 per user.
  - id: cm-p2
    type: numeric
    prompt: A studio costs ₹20 lakh a year in fixed costs plus ₹800 per session. With 10,000 sessions a year, what is the average cost per session? (in rupees)
    answer: 1000
    unit_label: ₹ per session
    hints:
      - Same formula as the app.
      - ₹20,00,000 ÷ 10,000 + ₹800.
    solution: ₹200 + ₹800 = ₹1,000. However many sessions it runs, the studio's average can never drop below ₹800.
  - id: cm-p3
    type: numeric
    prompt: What is the smallest whole number of users at which the app's average cost falls below the studio's floor of ₹800?
    answer: 6290
    abs_tol: 1
    tolerance: 0
    unit_label: users
    hints:
      - You need 50,00,000 ÷ users + 5 < 800.
      - Rearrange to users > 50,00,000 ÷ 795, then round up.
    solution: 50,00,000 ÷ 795 = 6,289.3, so 6,290 users. Beyond that, the app serves people more cheaply than the studio ever can.
  - id: cm-p4
    type: choice
    prompt: Which of these is **permissionless** leverage?
    options:
      - text: A bank loan to open a second studio
        why: A bank must approve it. That is capital, which is permissioned.
      - text: Hiring five coaches
        why: They must agree to join. That is labour, which is permissioned.
      - text: A podcast explaining the science of sleep
        correct: true
      - text: An investor's cheque
        why: The investor must agree. That is capital again.
    hints:
      - In which option does nobody else have to say yes before you start?
      - You can record and publish a podcast tonight.
    solution: Anyone can publish a podcast. Loans, hires and investment all need someone else's agreement.
  - id: cm-p5
    type: choice
    prompt: What is the **biggest catch** with code and media leverage?
    options:
      - text: It is illegal in many countries
        why: It isn't.
      - text: Because copying is nearly free for everyone, competition is global and attention is scarce
        correct: true
      - text: It needs a lot of capital to start
        why: The opposite. It can be started with almost none.
      - text: It cannot make money
        why: Many of the most valuable companies in the world are built on it.
    hints:
      - The same property that makes it powerful for you is available to everyone else.
      - If anyone can publish, what becomes the scarce thing?
    solution: Zero marginal cost and no permission are available to everyone. So you compete with the whole world for limited attention, and outcomes are winner take most.
review:
  - q: What is marginal cost?
    a: The extra cost of serving one more customer or producing one more unit.
  - q: How does average cost change as a business grows?
    a: Average cost = fixed ÷ quantity + marginal. It falls towards the marginal cost, so low marginal cost businesses get cheaper per customer almost without limit.
  - q: Why are code and media called permissionless leverage?
    a: Nobody has to agree before you write software or publish writing, audio or video, and copies serve extra people at almost no cost.
  - q: What changed when Gutenberg's press arrived around 1450?
    a: The marginal cost of a book collapsed. Copying went from months of a scribe's work to minutes of printing, and within about fifty years millions of books were printed in Europe.
---

:::puzzle
Before about 1450, a book in Europe was copied by hand. A skilled scribe might spend months on a single volume. Books were rare, expensive and owned mostly by monasteries, universities and the very rich.

Then Johannes Gutenberg in Mainz combined movable metal type, oil based ink and a screw press adapted from winemaking. Within about fifty years, presses across Europe had printed millions of books.

Today, a sleep coach in Bengaluru records a twenty minute wind down meditation. It can be played tonight by one person, or by a million people, at almost the same cost.

**What exactly changed, in 1450 and again now? And what does it do to who can become wealthy?**
:::

:::theory Marginal cost
Every business has two kinds of cost.

- **Fixed costs** are paid regardless of how many customers you serve: rent, salaries, building the product.
- **Marginal cost** is the *extra* cost of serving one more customer: a coach's hour, a towel, a server's few seconds of computing.

The average cost per customer is

<div class="formula">average cost = fixed cost ÷ customers + marginal cost</div>

As customers grow, the first term shrinks towards zero, and the average falls towards the marginal cost. So the marginal cost is a *floor*. A studio session needs a coach and a room, about ₹800 every time, forever. An app needs a few rupees of computing.

<viz-marginal></viz-marginal>

At a hundred customers, the studio is cheaper. Its fixed costs are lower. But the app's average keeps falling as it grows, and the studio's can't. Past a few thousand users, the app serves people more cheaply than the studio ever can.

That is what Gutenberg did to books. A scribe's marginal cost per book was months of skilled work. A press's was minutes and paper. And it is what the recorded meditation does to coaching.
:::

:::theory Leverage nobody has to approve
Labour needed people to join you. Capital needed lenders to trust you. Code and media need neither.

Naval calls code and media *permissionless* leverage, and argues they are the leverage behind most new fortunes. You don't need a bank's approval to publish a newsletter, or a hiring committee to write a piece of software. A teenager with a laptop has access to the same distribution as a large company.

Combine this with the surplus lesson. Every extra customer of a zero marginal cost product creates value (it is worth something to them) at almost no cost. So the surplus per extra customer is close to the full worth to the buyer. A product like that, once built, is a surplus machine that runs at nearly unlimited scale. It is the purest form of an asset that earns while you sleep.

Media is code's older sibling: writing, audio, video. Software runs as instructions. Media runs in people's minds. Both copy for free.
:::

:::theory The catch
The same properties that make code and media powerful make them brutal.

**Everyone else has them too.** If copying is free and nobody needs permission, the whole world can compete with you. A local studio competes with the three other studios in Indiranagar. A sleep app competes with every sleep app on earth.

**Attention becomes the scarce thing.** When supply is unlimited, what runs out is people's time to pay attention. That is why media businesses obsess over distribution and trust.

**Outcomes are winner take most.** When the best product can serve everyone at nearly no extra cost, the best tends to take most of the market. A few apps get most of the users and the rest get almost none. You will study this shape, the power law, in Thinking tools, and it is the single most important idea in venture capital.

So what protects you? Mostly two things this course will build up: **specific knowledge**, meaning knowledge that is hard for others to copy (next chapter), and **judgment** about what to build. Leverage multiplies them. It does not replace them.
:::
