---
minutes: 45
summary: Income from time grows in a straight line and has a hard ceiling, because a week has only so many hours. Equity is a share of something that can grow without your hours, which removes the ceiling but adds risk and dilution.
warmup:
  - id: rv-w1
    type: choice
    prompt: From the last lesson, what is the **sleep test**?
    options:
      - text: Checking whether you work better after a good night's sleep
        why: Fun, but no. It is a test of what you own.
      - text: Asking what would keep earning if you stopped working for a year
        correct: true
      - text: Asking whether your salary is higher than your expenses
        why: That tells you about savings, not about wealth.
    hints:
      - It was the test that separated Priya from Kabir.
      - It is about what happens to income when the time stops.
    solution: The sleep test asks what keeps paying when you stop. That is your wealth.
  - id: rv-w2
    type: choice
    prompt: Which of these is a **zero sum** game?
    options:
      - text: Two people trading things they each value more than what they give up
        why: Both gain, so the total grows. That is positive sum.
      - text: Being ranked the best student in a class
        correct: true
      - text: Opening a bakery that a neighbourhood loves
        why: The bakery creates value for customers and owner alike.
    hints:
      - In which one does somebody have to lose for somebody else to win?
      - Think about what happens to the total of a ranking.
    solution: Rankings are zero sum. The places add up to the same total however they are shared.
explain:
  prompt: Explain why someone who only sells their time has a ceiling on what they can earn, and why owning equity removes that ceiling. Include one honest downside of equity.
  rubric:
    - Time income equals a rate multiplied by hours, and hours are physically limited, so it grows in a straight line up to a ceiling
    - Equity is a share of the value of something, and that value can grow without more of your hours
    - The value of a stake equals the ownership percentage multiplied by the value of the whole company
    - At least one honest downside, such as the company failing and the stake becoming worth nothing, or dilution shrinking the percentage
almanac:
  prompt: Ronald Wayne sold his Apple stake for $800 because he feared the risk. Where in your own life are you trading a possible upside for certainty, and is that trade still right for you?
practice:
  - id: rv-p1
    type: numeric
    prompt: You charge ₹2,500 an hour, work 45 hours a week, and work 48 weeks a year. What do you earn in a year? (in rupees)
    answer: 5400000
    unit_label: ₹ a year
    hints:
      - Income from time is rate × hours. How many hours do you work in a year?
      - 45 hours a week for 48 weeks is 2,160 hours. Now apply the rate.
    solution: ₹2,500 × 45 × 48 = ₹54,00,000, which is ₹54 lakh a year.
  - id: rv-p2
    type: numeric
    prompt: Same rate, but now you work an exhausting 100 hours every single week for 48 weeks. This is close to the true ceiling. What is it? (in rupees)
    answer: 12000000
    unit_label: ₹ a year
    hints:
      - Only the hours changed. What is 100 × 48?
      - Multiply those hours by the hourly rate.
    solution: ₹2,500 × 100 × 48 = ₹1,20,00,000, which is ₹1.2 crore. Even destroying your health, you can only a little more than double your income.
  - id: rv-p3
    type: numeric
    prompt: You own 2% of a company worth ₹20 crore today. If the company's value grows by 35% a year, what is your stake worth after 10 years? (in rupees, ignoring dilution)
    answer: 80426223
    tolerance: 0.02
    unit_label: ₹
    hints:
      - Growing by 35% means multiplying by 1.35 every year. After 10 years, the company is worth ₹20 crore × 1.35 × 1.35 × … ten times.
      - 1.35 to the power 10 is about 20.1. Find the company's value, then take your 2% of it.
    solution: ₹20 crore × 1.35¹⁰ ≈ ₹20 crore × 20.1 ≈ ₹402 crore. Your 2% is about ₹8.04 crore, from an asset that needed none of your extra hours to grow.
  - id: rv-p4
    type: numeric
    prompt: You own 10% of a startup. To raise money, the company creates new shares and sells them to an investor, who ends up owning 20% of the enlarged company. What percentage do you own now?
    answer: 8
    unit: '%'
    unit_label: '%'
    hints:
      - After the new shares are issued, what share of the company is left for all the old owners together?
      - Old owners now share 80% of the company. You owned a tenth of the old owners' part.
    solution: The old owners now share 80%. You owned 10% of the old company, so you own 10% × 80% = 8% now. This is dilution. Your slice is smaller, but if the money helps the company grow, it can be worth far more.
  - id: rv-p5
    type: choice
    prompt: Why does someone earning a high salary still face a ceiling, while an owner does not?
    options:
      - text: Because salaries are taxed and equity is not
        why: Both are taxed in different ways. Tax isn't what creates the ceiling.
      - text: Because salary is rate × hours and hours are limited, while a stake's value depends on the whole company's value
        correct: true
      - text: Because owners always earn more than employees
        why: Not always. Many owners earn less, and many stakes go to zero.
      - text: Because employers cap salaries by law
        why: There is no such law. The ceiling is set by time.
    hints:
      - Write down the formula for each kind of income. What limits each one?
      - Which formula contains a quantity that cannot grow past 24 hours a day?
    solution: Time income is rate × hours, and hours are capped. A stake is percent × company value, and company value has no fixed cap.
review:
  - q: What is the formula for income from renting your time, and what limits it?
    a: Income = hourly rate × hours. Hours are physically limited, so the income grows in a straight line up to a ceiling.
  - q: How do you work out what an equity stake is worth?
    a: Ownership percentage × the value of the whole company.
  - q: What is dilution?
    a: When a company issues new shares, existing owners each own a smaller percentage. Your new percentage = old percentage × (1 − share sold to new investors).
  - q: Who was Ronald Wayne?
    a: The third co-founder of Apple in 1976. He owned 10% and sold it back within two weeks for $800, because he feared being personally liable for the young company's debts.
---

:::puzzle
In April 1976, three men signed the papers that created Apple Computer. Steve Jobs and Steve Wozniak took 45% each. The third, an older engineer named **Ronald Wayne**, took 10% and was meant to be the adult in the room.

Twelve days later, Wayne sold his 10% back for **$800**.

His reason was not foolish. The company was a partnership, so its debts were partly his, and unlike the two young Steves he owned a house and savings that creditors could take. He chose certainty.

Apple later became one of the most valuable companies in history. Even after decades of new shares being issued, a 10% founding stake would have been worth many billions of dollars. No salary Wayne could ever have earned would come close.

**How can one signature be worth more than a lifetime of work?** And was Wayne actually wrong?
:::

:::theory The ceiling on time
Start with the simplest way to earn: you sell hours.

<div class="formula">income = rate × hours</div>

There are two levers in that formula. You can raise your **rate** by becoming more skilled, more trusted, more in demand. You can raise your **hours** by working more.

Hours run into a wall fast. A year has 8,760 hours. Take out sleep, food and being a human, and a heroic schedule gives you maybe 4,500 working hours a year. A normal one gives you about 2,000. So no matter how hard you push, hours can only roughly double.

Rate can grow more. A senior lawyer or surgeon might charge fifty times a junior's rate. But rate is also capped, because it is still one person's time, and clients compare it with the next best person's time.

Naval put it bluntly: you are not going to get rich renting out your time. Not because renting time is bad. Salaries pay for most of the world's life. But because the formula itself has a ceiling built in.
:::

:::theory Owning a piece
Now the other formula. If you own part of a company:

<div class="formula">value of your stake = your % × value of the company</div>

The company's value is not tied to *your* hours. It depends on how many customers it serves, how much they pay, how efficiently it runs, how long it can keep going. Those can grow while you sleep, and a company can grow every year on top of the year before.

Play with both formulas side by side. Push your hours to 80 and watch how little the orange line moves. Then nudge the growth rate and watch the green one.

<viz-time-equity></viz-time-equity>

Two things to notice. First, the wage line is *straight*. Every year adds the same amount. The equity line *bends upward*, because each year's growth is applied to a bigger company. You will study that bend properly in the next lesson. Second, at low growth, wages win. Equity is not magic. It wins only if the thing you own actually grows.
:::

:::theory The honest part: risk and dilution
If equity were simply better, everyone would choose it. Two forces make it harder.

**Risk.** Most new companies fail, and a stake in a failed company is worth nothing. A salary arrives every month. This is exactly what Wayne weighed, and given what he could lose, many careful people would have made his choice. The lesson is not "always take equity". It is *understand what you are trading*. He traded an uncapped upside for a capped downside.

**Dilution.** Companies raise money by creating new shares. If you own 10% and the company sells new shares so an investor ends up owning 20% of the enlarged company, everyone who was there before now shares the remaining 80%. Your stake becomes:

<div class="formula">10% × (1 − 20%) = 8%</div>

A smaller slice. But if the investor's money helps the company grow from ₹10 crore to ₹100 crore, your 8% of ₹100 crore beats 10% of ₹10 crore many times over. Dilution is a price, not a loss. You will meet it again, from the investor's side, in the venture capital curriculum.

<div class="aside"><b>Did you know</b>Wayne was later paid an extra $1,500 to give up any future claim, bringing his total to $2,300. He has said in interviews that he does not regret it, because he was protecting himself from a very real danger at the time.</div>
:::

:::theory Not either, but both
In practice the smartest careers mix the two. An early employee at a startup takes a salary *and* equity, often called ESOPs in India (employee stock options). A consultant can build a small product alongside client work. A doctor can open a clinic instead of only working shifts in someone else's.

The pattern is the one from the last lesson's three steps: use time to earn money, use money and effort to own assets, let assets do the earning. Equity is the most direct route to step two. And the most powerful version, which you will meet in the next chapter, is to *build* the asset yourself, so that your ownership comes from creating value rather than from buying it.
:::
