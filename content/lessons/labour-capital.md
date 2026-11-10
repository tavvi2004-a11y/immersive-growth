---
minutes: 50
summary: Labour leverage is other people's time; it multiplies output through specialisation but pays a communication tax that grows with the square of team size. Capital leverage is other people's money; it amplifies returns in both directions. Both need someone's permission.
warmup:
  - id: lc-w1
    type: numeric
    prompt: From the lever lesson. You push with 40 kg on a 2 m arm. The load sits 0.5 m from the pivot. What load can you lift? (in kg)
    answer: 160
    unit_label: kg
    hints:
      - Force × distance balances on both sides.
      - 40 × 2 = load × 0.5.
    solution: 80 = load × 0.5, so 160 kg.
  - id: lc-w2
    type: numeric
    prompt: From compounding. ₹10 lakh grows at 15% a year for 2 years, compounded. What is it worth? (in rupees)
    answer: 1322500
    tolerance: 0.005
    unit_label: ₹
    hints:
      - Multiply by 1.15 each year.
      - ₹10,00,000 × 1.15 × 1.15.
    solution: ₹10,00,000 × 1.3225 = ₹13,22,500.
explain:
  prompt: Explain how hiring people and borrowing money each multiply what a founder can do, what each one costs, and why both are called permissioned leverage.
  rubric:
    - Labour leverage multiplies output through division of labour and specialisation
    - The number of possible communication lines grows as n(n − 1)/2, so coordination costs grow faster than team size
    - Debt raises the return on your own money when the investment earns more than the interest rate, and makes losses bigger when it earns less
    - Both are permissioned, because someone must agree to join you or lend to you
almanac:
  prompt: Think of a team you were part of that worked brilliantly, and one that didn't. How many people were in each, and how did they decide who needed to talk to whom?
practice:
  - id: lc-p1
    type: numeric
    prompt: A team has 12 people. How many distinct pairs of people could need to communicate?
    answer: 66
    unit_label: pairs
    hints:
      - Each of the 12 people could talk to each of the other 11, but that counts every pair twice.
      - n(n − 1)/2 with n = 12.
    solution: 12 × 11 ÷ 2 = 66 pairs. With 6 people it is only 15. Double the team, more than four times the lines.
  - id: lc-p2
    type: numeric
    prompt: In the team chart's model, useful output = n − c × pairs. With 12 people and c = 0.05, what is the useful output, in people's worth of work?
    answer: 8.7
    tolerance: 0.01
    unit_label: people's worth
    hints:
      - You found the pairs in the last question.
      - 12 − 0.05 × 66.
    solution: 12 − 3.3 = 8.7. Twelve salaries buy under nine people's worth of work, unless you organise so most pairs never need to talk.
  - id: lc-p3
    type: numeric
    prompt: You put in ₹10 lakh of your own and borrow ₹40 lakh at 10% interest. The whole ₹50 lakh earns 15% in a year. What return do you make on **your own** ₹10 lakh? (as a %)
    answer: 35
    unit: '%'
    unit_label: '%'
    hints:
      - Find the total profit on ₹50 lakh, then subtract the interest you owe on ₹40 lakh.
      - (15% × 50 lakh − 10% × 40 lakh) ÷ 10 lakh.
    solution: The investment earns ₹7.5 lakh and interest costs ₹4 lakh, leaving ₹3.5 lakh on your ₹10 lakh, which is 35%. Without debt you would have made 15%.
  - id: lc-p4
    type: numeric
    prompt: Same deal, but the investment only earns 5% this year. What return do you make on your own ₹10 lakh? (as a %, negative if a loss)
    answer: -15
    unit: '%'
    unit_label: '%'
    hints:
      - The interest is still owed whatever the investment does.
      - (5% × 50 lakh − 10% × 40 lakh) ÷ 10 lakh.
    solution: ₹2.5 lakh earned − ₹4 lakh interest = −₹1.5 lakh, which is −15%. Without debt you would have made +5%. Same investment, opposite outcome.
  - id: lc-p5
    type: numeric
    prompt: At what return on the investment does borrowing at 10% make **no difference** to your return on your own money? (as a %)
    answer: 10
    unit: '%'
    unit_label: '%'
    hints:
      - Look at where the two lines cross on the debt chart.
      - Borrowed money helps when it earns more than it costs. When exactly does it neither help nor hurt?
    solution: At 10%, the borrowed money earns exactly its interest, so the debt neither helps nor hurts. Above that it helps, below that it hurts.
  - id: lc-p6
    type: choice
    prompt: Why are labour and capital called **permissioned** leverage?
    options:
      - text: Because governments must license them
        why: Some regulation exists, but that isn't the point.
      - text: Because someone else has to agree, to join you or to fund you
        correct: true
      - text: Because they are slower than other leverage
        why: They can be fast. The point is who controls access.
      - text: Because they are expensive
        why: Cost is a separate issue.
    hints:
      - What do you need from another person before you can use their time or their money?
      - Can you hire someone who refuses to work for you?
    solution: You need someone else's yes. People must choose to join you, and lenders or investors must choose to fund you. Usually they say yes only after you have a track record.
review:
  - q: How many communication pairs exist in a team of n people?
    a: n(n − 1)/2. Coordination costs grow roughly with the square of team size.
  - q: What did Adam Smith's pin factory show?
    a: Division of labour. In 1776 he described ten workers, each doing a few steps, making about 48,000 pins a day, when one person alone might not make 20.
  - q: How does debt change the return on your own money?
    a: Return on equity = (asset return × total invested − interest × debt) ÷ your money. It amplifies gains when the asset beats the interest rate, and amplifies losses when it doesn't.
  - q: What is Brooks's law?
    a: Fred Brooks, 1975, The Mythical Man-Month. Adding people to a late software project makes it later, because new people need training and add communication lines.
---

:::puzzle
In 1776, Adam Smith described a small pin factory in *The Wealth of Nations*. One worker on their own, he wrote, could perhaps not make twenty pins in a day. But ten workers, each doing only a few of the eighteen or so steps, made about **48,000** pins a day between them. That is roughly 240 times the output per person.

Two centuries later, in 1975, a software manager named Fred Brooks wrote *The Mythical Man-Month* about his experience running IBM's huge operating system project. His most famous conclusion: **adding people to a late software project makes it later.**

Both men were describing real things. **How can adding people multiply output in one place and shrink it in another?**
:::

:::theory Labour leverage: other people's time
The oldest form of leverage is other people's hours. A founder alone has 168 hours a week. A founder with ten colleagues has the use of over a thousand.

But Smith's insight was that it is not just *more* hours. Splitting work lets each person specialise. They get faster at their steps, they don't waste time switching tasks, and the steps can be designed around tools. The whole becomes much more than the sum of its parts. This is comparative advantage from the last lesson, inside a single building.

Andy Grove, who ran Intel, put the manager's version of this precisely in *High Output Management* (1983): a manager's output is the output of the organisation they run. Once you lead people, your job is no longer your own work. It is making everyone else's work multiply.
:::

:::theory The communication tax
Now Brooks. With *n* people, the number of pairs who might need to talk is

<div class="formula">pairs = n(n − 1) ÷ 2</div>

Three people have 3 pairs. Ten have 45. Thirty have 435. Team size grows in a line, but communication grows roughly with the *square*. If each line costs a little of someone's time, the cost eventually overtakes the extra hands.

<viz-team></viz-team>

That is why a late software project gets later. New people need teaching (by the busiest people) and every new person adds lines. Smith's pin workers barely needed to talk. The steps were simple and fixed. Software, strategy and creative work are full of decisions that ripple across people.

The cure is not small teams forever. It is *structure*. Split work so most pairs never need to talk: small teams with clear owners and clean handoffs. You will come back to this properly in Hiring, teams and culture, and again in Scaling the organisation.
:::

:::theory Capital leverage: other people's money
The second old form of leverage is money that isn't yours. You borrow, add your own, and invest the total. If the investment earns more than the interest, the extra goes to you.

Here is the algebra. You put in *E* of your own, borrow *D* at interest rate *i*, and the whole lot earns return *R*:

<div class="formula">return on your money = (R × (E + D) − i × D) ÷ E</div>

With ₹10 lakh of yours and ₹40 lakh borrowed at 10%, an investment earning 15% returns 35% on your money. That is the lever. Now drop the return to 5%.

<viz-debt></viz-debt>

The interest is owed whatever happens, so a 5% year becomes a −15% year for you. Debt makes the line *steeper*. Steeper up, steeper down. It is the output equation again: capital multiplies the direction your judgment picked. This is why so many businesses that looked brilliant in good years collapse in the first bad one. It is also why lenders care so much about your record before they say yes.

Investors' money, equity rather than debt, is a different kind of capital leverage. It doesn't demand interest but takes a share of ownership. You met it as dilution two lessons ago, and you will meet it in depth in Finance and Raising money as a founder.
:::

:::theory The catch: permission
Notice what labour and capital have in common. To use other people's time, they must agree to join you. To use other people's money, they must agree to lend or invest. **Someone has to say yes.**

That is why they are called *permissioned* leverage, and why they are old. For most of history, the people who could get this permission were those who already had money, family connections or a track record. It takes years to earn trust, and the trust compounds.

The next lesson is about the two newest kinds of leverage, which don't need anyone's permission at all.
:::
