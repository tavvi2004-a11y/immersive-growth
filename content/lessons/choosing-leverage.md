---
minutes: 60
summary: "Sundial, a Bengaluru sleep studio, can grow through capital (a second studio), code (an app) or labour (more coaches). Each has a different cost, risk, ceiling and reversibility. Choosing well means modelling the numbers and then judging what the numbers can't tell you."
warmup:
  - id: cl-w1
    type: numeric
    prompt: From code and media. A product has ₹30 lakh of fixed costs a year and ₹10 marginal cost per customer. With 60,000 customers, what is the average cost per customer? (in rupees)
    answer: 60
    unit_label: ₹
    hints:
      - Average = fixed ÷ customers + marginal.
      - ₹30,00,000 ÷ 60,000 + ₹10.
    solution: ₹50 + ₹10 = ₹60.
  - id: cl-w2
    type: choice
    prompt: From labour and capital. Borrowing money makes your return on your own money…
    options:
      - text: Always higher
        why: Only when the investment beats the interest rate.
      - text: Higher when the investment earns more than the interest rate, lower when it earns less
        correct: true
      - text: Always lower, because of interest
        why: Not when the investment earns more than the interest.
    hints:
      - Remember the two lines on the debt chart and where they crossed.
      - Debt makes the line steeper in both directions.
    solution: Debt amplifies in both directions. It helps above the interest rate and hurts below it.
  - id: cl-w3
    type: numeric
    prompt: From renting vs owning. You earn ₹1,500 an hour for 40 hours a week, 48 weeks a year. What do you earn in a year? (in rupees)
    answer: 2880000
    unit_label: ₹
    hints:
      - Rate × hours, with hours = 40 × 48.
      - 1,920 hours × ₹1,500.
    solution: ₹28,80,000, or ₹28.8 lakh.
explain:
  prompt: Recommend one option for Sundial and defend it. Use the kinds of leverage, the numbers, the risks, and what the model cannot tell you.
  rubric:
    - Names which kind of leverage each option uses (capital and labour, code, labour)
    - Uses at least one number from the model, such as three year cash, year three profit, or a breakeven
    - Weighs risk and reversibility, such as upfront capital at stake, debt, or whether the option can be scaled back
    - Weighs the ceiling, meaning how big each option can eventually get
    - Says what the model cannot capture or what Meera should test before committing
almanac:
  prompt: Meera's three options are a studio, an app and more coaches. If your own career were a business, what would be your studio, your app and your coaches? Which one are you investing in right now?
practice:
  - id: cl-p1
    type: numeric
    prompt: "Option C, hiring coaches. If 60% of the 400 new monthly slots fill, what yearly profit do the coaches add once fully running? (in rupees)"
    answer: 744000
    unit_label: ₹ a year
    hints:
      - Sessions a year = 400 × 12 × fill rate. Each earns ₹1,300 after consumables.
      - 400 × 12 × 0.6 × ₹1,300, then subtract the ₹30 lakh coach salaries.
    solution: 2,880 sessions × ₹1,300 = ₹37,44,000. Minus ₹30,00,000 in salaries = ₹7,44,000 a year.
  - id: cl-p2
    type: numeric
    prompt: "Option A, a second studio. What is the total cash it makes over three years after paying back its ₹60 lakh cost and three years of interest? (in rupees, negative if a loss)"
    answer: -720000
    unit_label: ₹
    hints:
      - Add the three years of profit (half in year 1), subtract the ₹60 lakh cost.
      - Then subtract interest, 12% of ₹20 lakh for three years.
    solution: ₹12L + ₹24L + ₹24L = ₹60L, minus the ₹60L cost, minus ₹7.2L interest = −₹7.2 lakh. The studio has only just paid for itself, but it keeps earning about ₹21.6 lakh a year after that.
  - id: cl-p3
    type: numeric
    prompt: "Option B, the app. How many paying subscribers by the end of year three does it need just to break even over the three years?"
    answer: 1942
    abs_tol: 1
    tolerance: 0
    unit_label: subscribers
    hints:
      - Over three years the app earns ₹3,348 × S × (0.05 + 0.25 + 0.70) = ₹3,348 × S, and costs ₹35L + 3 × ₹10L.
      - Solve ₹3,348 × S = ₹65,00,000 and round up.
    solution: 65,00,000 ÷ 3,348 = 1,941.5, so 1,942 subscribers. Below that it loses money over three years, above it every extra subscriber is nearly pure profit.
  - id: cl-p4
    type: numeric
    prompt: "With 1,500 subscribers at the end of year three, what yearly profit is the app making in year four, assuming subscribers hold steady? (in rupees)"
    answer: 4022000
    unit_label: ₹ a year
    hints:
      - Yearly contribution is ₹3,348 per subscriber, minus ₹10 lakh of upkeep.
      - 1,500 × ₹3,348 − ₹10,00,000.
    solution: ₹50,22,000 − ₹10,00,000 = ₹40,22,000 a year. The app loses money over the first three years at this level, but is the biggest earner afterwards.
  - id: cl-p5
    type: choice
    prompt: Meera's biggest fear is losing the savings she spent eight years building. Which option puts the least of her money at risk upfront?
    options:
      - text: A, the second studio
        why: It needs all ₹40 lakh of her savings plus a ₹20 lakh loan.
      - text: B, the app
        why: It needs ₹35 lakh upfront before any subscriber pays.
      - text: C, the coaches
        correct: true
      - text: They all risk the same
        why: Look at the upfront costs. They differ a lot.
    hints:
      - Which option needs money spent before a single extra rupee comes in?
      - Which one could be scaled back if demand is weak?
    solution: The coaches need no upfront capital and can be scaled to demand, with notice. The downside is a low ceiling. It is limited by her one building and by the number of early and late slots.
  - id: cl-p6
    type: choice
    prompt: Which option's eventual size is **not** limited by physical space or the number of people Meera employs?
    options:
      - text: A, the second studio
        why: Each studio has a fixed number of rooms. Growing means building more studios.
      - text: B, the app
        correct: true
      - text: C, the coaches
        why: Limited by the rooms in the one studio and by how many coaches she hires.
    hints:
      - Think about marginal cost. Which option can serve one more customer for about ₹20?
      - Which one could serve a customer in Pune or Dubai tomorrow?
    solution: The app. Its marginal cost is tiny and it is not tied to a building. That is why it has the highest ceiling, and also the widest range of outcomes.
review:
  - q: What are Sundial's three growth options and the leverage each uses?
    a: A second studio (capital and labour), a sleep app (code), and four more coaches in the existing studio (labour).
  - q: What four questions help compare growth options beyond the base case numbers?
    a: How much is at risk upfront, how reversible is it, how high is the ceiling, and how wide is the range of outcomes?
  - q: Why can't a spreadsheet make the decision on its own?
    a: Its outputs depend on assumptions nobody knows yet, such as how many subscribers an app will get. Judgment means testing the most uncertain assumption cheaply before committing.
  - q: What is a cheap test before building an app?
    a: Sell a product before building it, for example recorded programmes to existing clients, to measure real demand for the uncertain assumption.
---

:::puzzle
Meera opened **Sundial**, a sleep and recovery studio in Indiranagar, eight years ago. (Sundial is a fictional company. You will follow it through the whole university, from its first P&L to its Series A, and in the final curriculum you will decide whether to invest in it.)

The studio is full. Clients love it. It makes a steady ₹24 lakh a year in profit, and Meera has saved ₹40 lakh.

She can see three ways to grow:

- **A.** Open a second studio in Koramangala.
- **B.** Build a sleep app with her programmes.
- **C.** Hire four coaches and open early morning and late evening slots in the studio she has.

Her accountant says A, her developer friend says B, her studio manager says C. **Which kind of leverage is each, and which should she pick?** By the end of this lesson, you will be able to defend an answer.
:::

:::theory Sundial today
First, the business as it is.

| Per month | |
|---|---|
| Sessions | 600 |
| Average price | ₹1,500 |
| Revenue | ₹9,00,000 |
| Rent | ₹2,50,000 |
| Staff | ₹3,50,000 |
| Other costs | ₹1,00,000 |
| **Profit** | **₹2,00,000** |

That is ₹24 lakh a year. Apply the sleep test: Meera has a manager and coaches, so the studio mostly runs without her. It is a real asset, earning while she sleeps. But it is *full*. It cannot grow by doing more of the same.
:::

:::theory The three options, modelled
Every model is a set of assumptions. Here are Sundial's, so you can check them.

**A. A second studio (capital and labour).** Fit out costs ₹60 lakh. Meera puts in her ₹40 lakh and borrows ₹20 lakh at 12%, so ₹2.4 lakh a year in interest. Year one fills slowly and earns half a mature studio's profit, ₹12 lakh. Years two and three earn ₹24 lakh each.

**B. A sleep app (code).** An agency builds it for ₹35 lakh. Running it costs ₹10 lakh a year. Subscribers pay ₹299 a month and cost about ₹20 a month to serve, so each one contributes ₹279 × 12 = **₹3,348 a year**. If the app reaches *S* subscribers by the end of year three, the averages for the three years are roughly 5%, 25% and 70% of *S*.

**C. Four more coaches (labour).** Early and late slots add 400 sessions of capacity a month. Each filled session earns ₹1,500 minus ₹200 in consumables, so ₹1,300. The four coaches cost ₹30 lakh a year. In year one, half as many slots fill as later.

Now the two things nobody knows: how many subscribers the app gets, and how many new slots fill. Move them.

<viz-sundial></viz-sundial>

The gold bars show the cash each option makes over three years after paying for itself. The green bars show what it adds to yearly profit by year three, what it has *built*.
:::

:::theory Reading the chart like an investor
At the base case (1,500 subscribers, 60% fill), the coaches win on three year cash, the app wins on what it builds, and the studio sits in between. But base cases are guesses. The real information is in how the bars *move*.

- **The coaches** barely move into danger. Even at low fill, the loss is limited, there is no upfront cost, and staffing can be adjusted to demand. But the ceiling is low: one building, a fixed number of hours.
- **The studio** is predictable. Meera knows how to run one. But it puts all her savings plus debt at risk, and every further studio needs another ₹60 lakh and another yes from a bank.
- **The app** swings wildly. Drag subscribers from 500 to 5,000 and it goes from the worst option to the best by far. Its marginal cost is ₹20, so there is no ceiling from rooms or hours.

Four questions turn a spreadsheet into a decision:

1. **How much is at risk upfront?**
2. **How reversible is it?** Can it be scaled back if wrong?
3. **How high is the ceiling?**
4. **How wide is the range of outcomes?** And can you survive the bad end?
:::

:::theory Judgment: what the model can't see
The model can't tell Meera the one number that matters most for the app: how many people will pay. That is not a reason to give up. It is a reason to **test the riskiest assumption cheaply before committing.**

For example, before spending ₹35 lakh she could sell recorded sleep programmes to her existing clients for ₹999 each, using a simple payment link and audio files. That is media leverage, almost free to try. If hundreds buy, the app's subscriber assumption looks real. If ten buy, she has saved ₹35 lakh.

Notice the order this suggests. Use the safe, reversible option (coaches) to grow cash now, while running a cheap test of the uncapped option (the app). Commit capital only once the uncertainty has shrunk. There is no single right answer here, and that is the point. Leverage multiplies judgment, and judgment is mostly about which assumptions to test before you bet.

What Meera has that a competitor can't easily copy is eight years of knowing what actually helps people sleep. That is **specific knowledge**, and it is where the next chapter begins.
:::
