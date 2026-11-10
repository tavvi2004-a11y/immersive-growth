---
minutes: 45
summary: Compounding is growth applied to what has already grown, so it multiplies instead of adding. Most of its result arrives at the end. The rule of 72 estimates doubling time. Skills, trust and reputation compound too.
warmup:
  - id: cp-w1
    type: numeric
    prompt: From the last lesson. You own 10% of a company, and it sells new shares so that a new investor owns 25% afterwards. What percentage do you own now?
    answer: 7.5
    unit: '%'
    unit_label: '%'
    hints:
      - After the new shares, the old owners share what is left. How much is that?
      - Your new stake is your old stake times the share the old owners keep.
    solution: 10% × (1 − 25%) = 7.5%.
  - id: cp-w2
    type: choice
    prompt: On the renting vs owning chart, why does the wage line come out **straight**?
    options:
      - text: Because each year adds the same amount, rate × hours
        correct: true
      - text: Because salaries rise with inflation
        why: In the model the rate is fixed, so there is no rise at all. Each year adds the same.
      - text: Because the company's growth rate is zero
        why: The company's growth affects the equity line, not the wage line.
    hints:
      - What is added to the total each year if rate and hours stay the same?
      - A line where every step adds the same amount is…?
    solution: Each year adds rate × hours, the same amount, which draws a straight line.
explain:
  prompt: Explain to a twelve year old why compound growth eventually beats any straight line, why most of the result arrives at the end, and how the rule of 72 works.
  rubric:
    - Compounding applies the growth rate to the growing total, so each step adds more than the last
    - Simple or linear growth adds a fixed amount each step
    - Because each doubling adds as much as everything before it, most of the final value comes in the last few periods
    - Doubling time is roughly 72 divided by the percentage growth rate
almanac:
  prompt: "Name one thing in your life you could compound for twenty years: a skill, a body of work, a set of relationships, an investment. What would you need to do every week to keep it compounding?"
practice:
  - id: cp-p1
    type: numeric
    prompt: You invest ₹1 lakh at 12% a year, compounded yearly. What is it worth after 6 years? (in rupees)
    answer: 197382
    tolerance: 0.005
    unit_label: ₹
    hints:
      - Each year the amount is multiplied by 1.12.
      - After 6 years that is ₹1,00,000 × 1.12 × 1.12 × 1.12 × 1.12 × 1.12 × 1.12, which is ₹1,00,000 × 1.12⁶.
    solution: ₹1,00,000 × 1.12⁶ ≈ ₹1,97,382. It almost exactly doubled, just as the rule of 72 predicts (72 ÷ 12 = 6 years).
  - id: cp-p2
    type: numeric
    prompt: Using the rule of 72, roughly how many years does money take to double at 9% a year?
    answer: 8
    tolerance: 0.02
    unit_label: years
    hints:
      - The rule is a single division.
      - Divide 72 by the growth rate written as a whole number.
    solution: 72 ÷ 9 = 8 years. (The exact answer is 8.04 years.)
  - id: cp-p3
    type: numeric
    prompt: ₹1 lakh grows at 10% a year for 30 years, compounded yearly. What is it worth at the end? (in rupees)
    answer: 1744940
    tolerance: 0.005
    unit_label: ₹
    hints:
      - Use the compounding formula, amount × (1 + rate)^years.
      - Compute 1.1 to the power 30, which is about 17.45.
    solution: ₹1,00,000 × 1.1³⁰ ≈ ₹17,44,940. With simple interest it would be ₹1,00,000 + 30 × ₹10,000 = ₹4,00,000. Same rate, more than four times the result.
  - id: cp-p4
    type: numeric
    prompt: Compounding works against you too. You leave ₹50,000 unpaid on a credit card at 36% a year, compounded yearly, for 3 years. What do you owe? (in rupees)
    answer: 125773
    tolerance: 0.005
    unit_label: ₹
    hints:
      - Same formula, but now it is your debt that grows. What is the yearly multiplier at 36%?
      - Compute ₹50,000 × 1.36 × 1.36 × 1.36.
    solution: ₹50,000 × 1.36³ ≈ ₹1,25,773. The debt more than doubled in three years. Real cards often compound monthly, which is even worse.
  - id: cp-p5
    type: numeric
    prompt: How many years does it take ₹1 lakh to grow to ₹1 crore at 12% a year? Give your best estimate to the nearest year.
    answer: 40.6
    tolerance: 0.05
    unit_label: years
    hints:
      - ₹1 lakh to ₹1 crore is a 100× increase. How many doublings make about 100? (2, 4, 8, …)
      - About 6.6 doublings make 100×. How long is each doubling at 12%, by the rule of 72?
    solution: 100× is about 6.64 doublings (2⁶·⁶⁴ ≈ 100). Each doubling takes about 6 years at 12%, so roughly 40 years. The exact answer is 40.6 years.
  - id: cp-p6
    type: choice
    prompt: On a **log scale** chart, steady compound growth looks like…
    options:
      - text: A curve that bends sharply upward
        why: That is how it looks on a normal scale.
      - text: A straight line sloping upward
        correct: true
      - text: A curve that flattens out
        why: A flattening curve on a log scale means the growth rate is falling.
      - text: A flat horizontal line
        why: Flat would mean no growth at all.
    hints:
      - On a log scale, each gridline is a fixed multiple of the one below, such as ×2 or ×10.
      - Steady compounding multiplies by the same factor every year. How far up does that move it each year on such a scale?
    solution: A log scale turns equal multiplications into equal steps, so steady compounding becomes a straight line. Try the toggle on the compounding chart.
review:
  - q: What is the formula for compound growth?
    a: Final = start × (1 + r)ⁿ, where r is the growth rate per period and n is the number of periods.
  - q: What is the rule of 72?
    a: Doubling time ≈ 72 ÷ growth rate in percent. At 8%, money doubles in about 9 years.
  - q: Why does most of compounding's result arrive at the end?
    a: Each doubling adds as much as everything before it combined. On the chessboard, the last square holds more grain than all the other squares together.
  - q: Why is the rule of 72 approximately true?
    a: Doubling needs (1 + r)ⁿ = 2, so n = ln 2 ÷ ln(1 + r) ≈ 0.693 ÷ r for small r. Using 72 instead of 69.3 corrects for typical rates around 8% and divides neatly.
---

:::puzzle
There is an old story, told about the invention of chess in India.

A king was so delighted with the new game that he offered its inventor any reward he wanted. The inventor asked for something that sounded modest: one grain of wheat on the first square of the board, two on the second, four on the third, and so on, doubling each time across all 64 squares.

The king laughed and agreed, and ordered a sack of wheat to be brought.

**Before you read on, guess. How much wheat is that? A sack? A granary? A city's worth?**
:::

:::theory Adding vs multiplying
There are two ways for something to grow.

**Simple growth** adds the same amount every period. Lend ₹1 lakh at 10% simple interest and you earn ₹10,000 a year, every year. After *n* years:

<div class="formula">start × (1 + r × n)</div>

**Compound growth** applies the rate to whatever you have *now*, including last year's growth. After one year you have start × (1 + r). After two, that whole amount grows again: start × (1 + r) × (1 + r). After *n* years:

<div class="formula">start × (1 + r)<sup>n</sup></div>

The difference looks tiny on paper. A multiplication instead of an addition. Watch what it does over time.

<viz-compound></viz-compound>

For the first few years the lines are nearly identical, which is exactly why people underestimate compounding. Then the green line leaves. Toggle the **log scale**, where each gridline is double the one below, and the compounding curve turns into a perfectly straight line. That is a useful trick: whenever something looks straight on a log chart, it is compounding at a steady rate.
:::

:::theory The chessboard, and why the end matters most
Back to the king. Square *n* holds 2<sup>n−1</sup> grains. Fill the board and see.

<viz-chessboard></viz-chessboard>

The full board needs 2<sup>64</sup> − 1 grains, about 18 quintillion, more than a thousand years of the entire world's wheat harvest. In versions of the story the king, realising he could never pay, either made the inventor his chief adviser or had him executed for being too clever. Mathematicians like to say both endings make the same point.

Now notice something stranger. Square 64 alone holds 2<sup>63</sup> grains, which is *one more* than all 63 squares before it combined. Each doubling adds as much as the whole history so far. So **most of the result of compounding arrives at the very end.**

This shows up in real lives. The writer Morgan Housel worked out in *The Psychology of Money* that of Warren Buffett's roughly $84.5 billion fortune at the time, about $81.5 billion came after Buffett's 65th birthday. Buffett is a great investor, but the deeper secret is that he started as a child and never stopped. Interrupt compounding and you lose the squares that matter most.
:::

:::theory The rule of 72, derived
How long does it take to double? We want the *n* where (1 + r)<sup>n</sup> = 2. Take natural logarithms of both sides:

<div class="formula">n = ln 2 ÷ ln(1 + r)</div>

For small rates, ln(1 + r) is very close to r itself, and ln 2 ≈ 0.693. So n ≈ 0.693 ÷ r, or with the rate in percent, **n ≈ 69.3 ÷ rate**.

Why do people say 72 and not 69? Two reasons. For typical rates of 6% to 10%, ln(1 + r) is a bit *smaller* than r, so the true answer is a bit *larger* than 69.3 ÷ rate, and 72 corrects for it. And 72 divides cleanly by 2, 3, 4, 6, 8, 9 and 12, which makes it easy to do in your head.

| Rate | Rule of 72 | Exact |
|---|---|---|
| 6% | 12.0 years | 11.9 years |
| 9% | 8.0 years | 8.0 years |
| 12% | 6.0 years | 6.1 years |
| 24% | 3.0 years | 3.2 years |

The rule gets worse at high rates, but for back-of-envelope thinking, it is one of the most useful pieces of arithmetic you will ever learn.
:::

:::theory Everything that compounds
Compounding is not only about money. Anything where today's growth makes tomorrow's growth easier compounds.

- **Knowledge.** Each idea you understand makes the next one easier to learn. This course is built on that: every lesson is a square on the chessboard.
- **Skills.** A good writer gets better faster than a beginner, because they can see more of what to fix.
- **Relationships and reputation.** Trust built over years makes each new deal easier than the last. Naval argues that all the returns in life, in wealth, relationships or knowledge, come from compound interest, which is why he says to play long term games with long term people.
- **Debt and bad habits.** Compounding has no morals. A credit card at 36% doubles your debt in about two years.

Two practical rules follow. **Start early**, because the last squares are the big ones. And **don't interrupt** it, because restarting puts you back on square one. That is also why the next lessons care so much about *what* you own: the thing that compounds is the thing that grows.
:::
