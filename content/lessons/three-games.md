---
minutes: 40
summary: Wealth, money and status look alike but are three different games. Wealth is assets that earn while you sleep. Money moves value between people. Status is a ranking where someone has to lose.
explain:
  prompt: Explain the difference between wealth, money and status to a curious twelve year old, and why someone with a big salary might not be wealthy.
  rubric:
    - Wealth is something you own that keeps producing value without your continuous time
    - Money is a tool for storing and moving value, a claim on other people's time and goods, and it produces nothing by itself
    - Status is a relative ranking, so one person rising means another falls (zero sum)
    - A salary is payment for time, so it stops when the work stops unless it is turned into assets
almanac:
  prompt: Look back at school, university and your work so far. Which of the three games have you mostly been playing, and what is one concrete way you could tilt the next year toward wealth?
practice:
  - id: tg-p1
    type: choice
    prompt: Which of these is **wealth**, in the sense of this lesson?
    options:
      - text: A job paying ₹40 lakh a year
        why: That is income for time. Stop working and it stops.
      - text: A library of 300 recorded yoga classes that people still buy every week
        correct: true
      - text: ₹2 lakh in cash in a drawer
        why: That is money. It stores value but produces nothing; it slowly loses value to inflation.
      - text: Being named Founder of the Year
        why: That is status. It is a ranking, and it produces nothing on its own.
    hints:
      - Apply the sleep test to each one. What is still producing value while its owner sleeps for a year?
      - Cash can be spent, but does it make anything new by sitting there?
    solution: The class library keeps selling without new work, so it is an asset that earns while you sleep. The salary needs time, the cash just sits, and the award is a ranking.
  - id: tg-p2
    type: numeric
    prompt: Kabir's flat earns ₹25,000 in rent a month. Maintenance and property tax cost him ₹4,000 a month. How much does the flat earn him in a year while he does no work at all? (in rupees)
    answer: 252000
    unit_label: ₹ a year
    hints:
      - First find what the flat earns him in one month after costs.
      - Then think about how many months there are in a year.
    solution: (25,000 − 4,000) × 12 = ₹2,52,000, about ₹2.5 lakh a year.
  - id: tg-p3
    type: numeric
    prompt: In the sleep test above, Kabir earns ₹26 lakh a year while working and ₹18 lakh while not working. What percentage of his income survives if he stops working?
    answer: 69.23
    tolerance: 0.02
    unit: '%'
    unit_label: '%'
    hints:
      - The share that survives is the not-working income divided by the working income.
      - Turn that fraction into a percentage by multiplying by 100.
    solution: 18 ÷ 26 = 0.692, so about 69% of his income survives. For Priya, the consultant, it is 0%.
  - id: tg-p4
    type: choice
    prompt: Ten friends are ranked from 1 to 10 by who has the most followers. Riya climbs from 6th to 3rd. What must be true?
    options:
      - text: Everyone's total followers went up
        why: Possibly, but rankings don't tell you that. Ranks can only be shared out, not grown.
      - text: At least one other friend dropped down the ranking
        correct: true
      - text: The group as a whole gained status
        why: The ranks 1 to 10 always add up to 55. The group's total status cannot change.
      - text: Nobody else was affected
        why: There are only so many places. Riya's three places came from somewhere.
    hints:
      - Add up the ranks 1 + 2 + … + 10. Can that total ever change?
      - If Riya takes 3rd place, what happened to whoever was 3rd?
    solution: Ranks always sum to 55, so Riya's rise must push others down. That is what zero sum means. Status is a fixed pie; wealth is not.
review:
  - q: What is Naval Ravikant's definition of wealth?
    a: Assets that earn while you sleep. Something you own that keeps producing value without your continuous time, like a business, property, a body of work or software.
  - q: What is the difference between money and wealth?
    a: Money stores and moves value; it is a claim on other people's time and goods, and it produces nothing by itself. Wealth produces value.
  - q: Why is status a zero sum game?
    a: Status is a ranking. The total number of places is fixed, so one person going up means someone else goes down.
  - q: What is the sleep test?
    a: Ask what keeps paying if you stop working for a year. That is your wealth. Everything else is income for time.
---

:::puzzle
Priya is a consultant in Bengaluru. She bills ₹30 lakh a year and works hard for every rupee of it.

Kabir runs a small recovery studio. He pays himself less than Priya earns, about ₹26 lakh a year once you add everything up, and he is not obviously the better worker.

Then both of them break a leg and spend a year on the sofa.

At the end of that year, one of them has earned nothing and the other has earned ₹18 lakh. One of them has spent their savings and the other has added to them. **Who was richer all along, and how could you have known before the accident?**
:::

:::theory Three things that look the same
People use three words as if they were one: *wealth*, *money* and *status*. Watch what happens when you pull them apart.

In 2018 the investor Naval Ravikant wrote a short thread called *How to Get Rich (without getting lucky)*. It became one of the most shared pieces of business writing of the decade, and its first move is to separate these words. He defined wealth this way:

> Wealth is having assets that earn while you sleep.

Notice what is *not* in that definition. Nothing about how much you earn, what car you drive, or what your title is. Only one question matters: **if you stopped, would it keep producing?**

Try it on Priya and Kabir. Switch them both to *not working*.

<viz-sleep-test></viz-sleep-test>

Priya's income was all fees for her time. Kabir's included things he *owns*: most of the studio's profits, a flat that pays rent, a few index funds. When the time stops, the ownership keeps going. That leftover is what wealth looks like from the outside.

So the honest answer to the puzzle: Kabir was wealthier all along, even when Priya's income was higher. You could have known by asking the sleep test before anything went wrong.
:::

:::theory Money is a ledger of favours
If wealth is assets, what is money?

Imagine a small island with no money at all. The fisher wants a new roof. The roofer doesn't want fish today. Trade jams. Now give everyone shells, and agree that shells can be swapped for anything. The fisher sells fish for shells today and buys roofing next month. Nothing new was *made* by the shells. They just let value move between people and across time.

That is all money is: a record that says *society owes you this much*. Naval puts it as "money is how we transfer time and wealth." It is enormously useful, but it is a claim, not a machine. ₹2 lakh in a drawer produces nothing. Inflation slowly makes it buy less every year.

This gives you a useful picture of how wealth gets built:

1. You trade **time** for **money** (a salary, a fee).
2. You trade **money** for **assets** (a business, property, shares, a body of work).
3. The **assets** produce more money, which buys more assets.

Most people stop at step one their whole lives. The rest of this course is about getting to steps two and three, and about skipping step one entirely by *building* assets directly.

<div class="aside"><b>Note</b>Money and wealth are not enemies. Money is how you buy assets and how you measure them. The mistake is only in confusing the measuring stick with the thing being measured.</div>
:::

:::theory Status, the game where someone must lose
The third game is the oldest one. Status is your place in a ranking: who is respected, admired, first.

Here is a strange fact about rankings. Rank ten people from 1 to 10 and add up their ranks: 1 + 2 + … + 10 = 55. Re-rank them any way you like. The total is *still* 55. Nobody can climb without somebody falling. That is what **zero sum** means: the pie is fixed, so the game is only about slicing it.

Naval's version: wealth creation is an evolutionarily recent *positive sum* game, while status is an old *zero sum* one. Our brains evolved in small groups where rank decided almost everything, so status pulls at us hard. It is why people buy things to be seen with, and why two founders can feel like rivals even when they are in completely different markets.

Wealth works differently. When Kabir's studio helps a client sleep better, the client is better off, Kabir is better off, and nobody had to lose. The pie got bigger. You will see exactly where that extra pie comes from in a few lessons.

A practical rule falls out of this: **notice which game you are playing.** Arguing to win, chasing titles, comparing salaries: status. Building something people want and owning a piece of it: wealth. Both are human. Only one of them compounds.
:::

:::theory Why a business is the classic asset
Of all the assets that earn while you sleep, the most common route to real wealth is the one you will study for the next two years: **owning a business.**

A business is a machine that takes in time, money and ideas, and turns them into something customers want more than they want their money. If the machine works, it keeps doing that whether or not the owner is in the room, and it can be grown, copied and sold.

That is why this university starts here. Every later course, from accounting to venture capital, is about building, running, judging or backing such machines. Hold on to the sleep test. You will use it on every company you ever evaluate, including your own.
:::
