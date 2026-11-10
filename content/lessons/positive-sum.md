---
minutes: 45
summary: A voluntary trade creates value equal to what the thing is worth to the buyer minus what it costs the seller. Price only splits that surplus. Businesses are machines for creating surplus again and again, and that repeated positive sum trade is where wealth comes from.
warmup:
  - id: ps-w1
    type: numeric
    prompt: From the last lesson. Using the rule of 72, how many years does money take to double at 8% a year?
    answer: 9
    tolerance: 0.02
    unit_label: years
    hints:
      - The rule of 72 is one division.
      - 72 ÷ 8 = ?
    solution: 72 ÷ 8 = 9 years.
  - id: ps-w2
    type: choice
    prompt: From the first lesson. Status is called zero sum because…
    options:
      - text: Nobody really gains anything from status
        why: People do gain, but only at someone else's expense.
      - text: It is a ranking, so one person rising means another must fall
        correct: true
      - text: It cannot be measured in rupees
        why: Many things cannot be measured in rupees and are still positive sum, like friendship.
    hints:
      - What happens to the sum of all ranks when people swap places?
      - Zero sum means the total stays the same, so gains equal losses.
    solution: A ranking has a fixed total, so one person's rise is someone else's fall.
explain:
  prompt: Explain where the value in a trade comes from, using a studio session as your example, and why the price does not change how much value is created.
  rubric:
    - Value created equals what it is worth to the buyer minus what it costs the seller to provide
    - Price decides how that surplus is split between buyer and seller, not how big it is
    - If the price is outside the range between cost and worth, no trade happens and no value is created
    - Both sides gaining is what makes it positive sum, unlike a ranking where one side's gain is another's loss
almanac:
  prompt: Think of the best purchase you made this year. How much more was it worth to you than you paid? Now think of something you could make or offer that would leave other people with that same feeling.
practice:
  - id: ps-p1
    type: numeric
    prompt: A sleep coaching session is worth ₹2,800 to a client. It costs the studio ₹1,100 to deliver. The price is ₹1,800. How much **total value** does the trade create? (in rupees)
    answer: 1700
    unit_label: ₹
    hints:
      - The price decides who gets the value, not how much there is. Which two numbers decide how much there is?
      - Value created = worth to buyer − cost to seller.
    solution: ₹2,800 − ₹1,100 = ₹1,700 of value created. The price is irrelevant to the total.
  - id: ps-p2
    type: numeric
    prompt: In the same trade, how much of that value does the **client** keep? (in rupees)
    answer: 1000
    unit_label: ₹
    hints:
      - The client's gain is the gap between what it is worth to them and what they pay.
      - ₹2,800 − ₹1,800.
    solution: Client surplus = ₹2,800 − ₹1,800 = ₹1,000. The studio keeps ₹1,800 − ₹1,100 = ₹700. Together, ₹1,700.
  - id: ps-p3
    type: choice
    prompt: The studio raises the price of that session to ₹3,000. What happens to the value created?
    options:
      - text: It rises, because the studio earns more per session
        why: Only if the trade happens. Would this client pay ₹3,000 for something worth ₹2,800 to them?
      - text: It stays at ₹1,700, but the studio keeps all of it
        why: The studio would keep all of it only at a price of exactly ₹2,800.
      - text: It falls to zero, because the client will not buy
        correct: true
      - text: It becomes negative
        why: Nobody is forced to trade, so the worst case is no trade at all.
    hints:
      - Use the surplus chart. What happens when the price slider goes past the worth marker?
      - Would you pay more for something than it is worth to you?
    solution: Above ₹2,800 the client walks away. No trade, no value created. Overpricing doesn't just reduce your share. It can destroy the whole trade.
  - id: ps-p4
    type: numeric
    prompt: In Ricardo's example, England needs 100 hours of labour for cloth and 120 for wine. Portugal needs 90 for cloth and 80 for wine. If each country makes one unit of each, then switches so Portugal makes two wines and England makes two cloths, how many labour hours does the world save in total?
    answer: 30
    unit_label: hours
    hints:
      - Before switching, add up each country's hours for one cloth and one wine.
      - After switching, Portugal uses 2 × 80 hours and England uses 2 × 100 hours. Compare the totals.
    solution: Before, Portugal uses 90 + 80 = 170 and England uses 100 + 120 = 220, a total of 390. After, Portugal uses 160 and England uses 200, a total of 360. That saves 30 hours, with the same goods produced.
  - id: ps-p5
    type: choice
    prompt: Which of these is a **positive sum** game?
    options:
      - text: Two companies bidding up the price of the same billboard
        why: Whatever one wins, the other loses, and the bidding just moves money to the billboard owner.
      - text: A tutor teaching a skill that raises a student's future earnings
        correct: true
      - text: Being voted best dressed at a party
        why: That is a ranking, so it is zero sum.
      - text: Friends betting on a cricket match
        why: The winners' gains are exactly the losers' losses. Zero sum.
    hints:
      - Ask of each one whether the total value in the world goes up after it happens.
      - In which one do both sides end up better off?
    solution: Teaching creates a new skill. The student gains more than they pay, the tutor gains more than their time costs, and the world has more capability than before.
review:
  - q: How much value does a voluntary trade create?
    a: The worth to the buyer minus the cost to the seller. Price only splits that surplus between them.
  - q: What is comparative advantage?
    a: David Ricardo's 1817 insight that two countries (or people) both gain by specialising in what they are relatively best at, even if one is better at everything.
  - q: What are zero sum, negative sum and positive sum games?
    a: In zero sum, gains equal losses (rankings, bets). In negative sum, the total shrinks (a casino, fights, fees). In positive sum, the total grows (trade, invention, teaching).
  - q: What is a business, in the language of this lesson?
    a: A machine for creating surplus repeatedly. Its profit is the share of that surplus it captures.
---

:::puzzle
A client walks into a sleep studio in Indiranagar and pays ₹1,500 for a session. It costs the studio about ₹900 to provide it.

The client leaves feeling it was easily worth ₹2,500. They slept better that night than they have in weeks. The studio is ₹600 better off. **Both of them walked away richer.**

Nobody printed money. No one was cheated. And yet there is more value in the world after the trade than before it.

**Where did it come from?**
:::

:::theory Value lives in the buyer's head
Every trade involves three numbers, not one.

- **Worth**: the most the buyer would happily pay. It lives in their head and depends on their life. A session is worth more to an exhausted new parent than to someone who sleeps fine.
- **Cost**: what it costs the seller to provide it.
- **Price**: what actually changes hands.

The value a trade creates is simply

<div class="formula">value created = worth to the buyer − cost to the seller</div>

and the price only decides how that is shared. Move the sliders.

<viz-surplus></viz-surplus>

Three things to notice. Move the price around inside the range, and the total never changes. Only the split does. Push the price above what it is worth and the trade vanishes, along with all the value it would have created. And when cost is above worth, no price can make the trade worth doing.

So the answer to the puzzle: the extra value came from the difference between how much the client wanted good sleep and how little it cost the studio to provide it. The trade *revealed* value that was sitting there unused.
:::

:::theory Three kinds of game
With this lens, you can sort almost any interaction by what happens to the total.

- **Zero sum.** Gains equal losses. Rankings, bets, two firms bidding for the same billboard. The total is fixed.
- **Negative sum.** The total shrinks. A casino takes a cut of every bet, a lawsuit pays lawyers from both sides, a price war burns both companies' margins.
- **Positive sum.** The total grows. Voluntary trade, invention, teaching, building.

Naval argues that wealth creation is a recent positive sum game, and status an ancient zero sum one. This is the deepest reason the sleep test from the first lesson works: assets that earn while you sleep are usually things that keep creating surplus for other people. Wealth is not taken. It is mostly made.
:::

:::theory Ricardo's surprise
In 1817 the economist David Ricardo found something that still surprises people. Suppose England needs 100 hours of labour to make a unit of cloth and 120 for wine. Portugal needs only 90 for cloth and 80 for wine. **Portugal is better at both.** Surely Portugal gains nothing by trading with England?

Look at the totals. If each country makes one cloth and one wine, Portugal spends 170 hours and England spends 220, a total of 390. Now let Portugal make two wines (160 hours) and England two cloths (200 hours), then trade one for one. The world has exactly the same goods for 360 hours. Thirty hours of human life appear out of nowhere.

The trick is that Portugal is *relatively* better at wine, and England is *relatively* less bad at cloth. That is **comparative advantage**, and it applies to people as much as to countries. Even if you are better than your assistant at everything, you both gain when you each do what you are relatively best at. You will see it again when you study hiring and teams.
:::

:::theory Business as a surplus machine
Put the pieces together. A business is a machine that creates surplus over and over: it finds things that are worth much more to customers than they cost to make, and then makes and sells them, again and again.

Its profit is the share of the surplus it keeps. Healthy businesses leave most of it with the customer, because customers who feel they got a great deal come back and tell friends. Greedy ones try to capture it all, raise prices toward the edge of what things are worth, and slowly lose the trade.

And now compounding returns. A trade that leaves both sides better off builds trust, and trust makes the next trade easier. Repeat that for twenty years and you have a brand, a reputation, a network. That is wealth in Naval's sense, assets that earn while you sleep, built one positive sum trade at a time.
:::
