---
minutes: 40
summary: A lever trades distance for force, which multiplies what one person can move. In work, output behaves like judgment × leverage × effort. Effort adds a little, leverage multiplies a lot, and judgment decides whether the multiplying creates or destroys.
warmup:
  - id: oe-w1
    type: numeric
    prompt: From the last lesson. A session is worth ₹2,000 to a client, costs ₹700 to provide, and sells for ₹1,200. How much value does the trade create? (in rupees)
    answer: 1300
    unit_label: ₹
    hints:
      - Which two of the three numbers decide the total?
      - Worth − cost.
    solution: ₹2,000 − ₹700 = ₹1,300. The price only splits it.
  - id: oe-w2
    type: choice
    prompt: From renting vs owning. Which part of the time income formula has a hard physical limit?
    options:
      - text: The hourly rate
        why: Rates can grow a lot with skill and trust. They have soft limits, not hard ones.
      - text: The hours
        correct: true
      - text: Neither
        why: A week has 168 hours. That is a hard limit.
    hints:
      - Income = rate × hours. Which one can you never get more of?
      - How many hours are in a week, for anyone?
    solution: Hours. A week has only 168 of them, whoever you are.
explain:
  prompt: Explain how a physical lever multiplies force, and how the same idea applies to a person's work through judgment, leverage and effort.
  rubric:
    - A lever balances when force times distance from the pivot is equal on both sides, so a longer arm lets a small force move a large load
    - The cost is that your end moves further, so a lever trades distance for force
    - In work, output behaves like judgment × leverage × effort, where effort can only vary a few times but leverage can vary thousands of times
    - Judgment sets the direction, so leverage with bad judgment multiplies losses
almanac:
  prompt: Where in your work today are you adding effort when you could be adding leverage? And where would more leverage be dangerous because your judgment is not good enough yet?
practice:
  - id: oe-p1
    type: numeric
    prompt: You push down with the weight of 60 kg at the end of a lever 3 m from the pivot. The rock sits 0.5 m from the pivot on the other side. What is the heaviest rock you can lift? (in kg)
    answer: 360
    unit_label: kg
    hints:
      - At balance, force × distance is equal on both sides of the pivot.
      - 60 × 3 = load × 0.5. Solve for the load.
    solution: 60 × 3 = 180 = load × 0.5, so load = 360 kg. A six times multiplier.
  - id: oe-p2
    type: numeric
    prompt: You can push with 50 kg. The rock weighs 500 kg and sits 0.5 m from the pivot. How long must your side of the lever be? (in metres)
    answer: 5
    unit_label: m
    hints:
      - Same balance rule, but now the unknown is your distance.
      - 50 × d = 500 × 0.5.
    solution: 50 × d = 250, so d = 5 m.
  - id: oe-p3
    type: numeric
    prompt: Asha works 80 hours a week with no leverage (×1) and good judgment (0.8). Dev works 40 hours a week with ×100 leverage and decent judgment (0.5). Using output = judgment × leverage × effort, how many times greater is Dev's output than Asha's?
    answer: 31.25
    tolerance: 0.01
    unit_label: times
    hints:
      - Compute each person's output with the formula.
      - Asha is 0.8 × 1 × 80. Dev is 0.5 × 100 × 40. Divide Dev's by Asha's.
    solution: Asha = 64, Dev = 2,000, and 2,000 ÷ 64 = 31.25. Asha works twice as hard with better judgment, and still produces about 3% of Dev's output.
  - id: oe-p4
    type: choice
    prompt: A founder with poor judgment raises a lot of money and hires fast. What does the output equation predict?
    options:
      - text: The money and people will make up for the poor judgment
        why: Leverage multiplies judgment. It does not replace it.
      - text: Losses happen faster and bigger than they would have without leverage
        correct: true
      - text: Nothing changes, because effort is the same
        why: Leverage changed by a lot, so output changes by a lot, in whichever direction judgment points.
      - text: The company grows more slowly but safely
        why: Leverage speeds things up in whatever direction they were already going.
    hints:
      - Try it on the output chart. Set judgment negative, then add leverage.
      - What does multiplying a negative number by a bigger number do?
    solution: Leverage multiplies whatever direction judgment points in. With bad judgment, more leverage means faster, bigger losses.
  - id: oe-p5
    type: choice
    prompt: What does a lever make you **give up** in exchange for more force?
    options:
      - text: Nothing, it is free energy
        why: A lever doesn't create energy. Something has to be traded.
      - text: Your end has to move further than the load
        correct: true
      - text: The load moves faster than your hand
        why: The opposite. The load moves a shorter distance, so more slowly.
      - text: You need to be stronger
        why: The whole point is that you can be weaker.
    hints:
      - Watch the readout on the lever chart as you lengthen your side.
      - Work = force × distance. If the force on the rock is multiplied, what must happen to the distances?
    solution: Your end moves further. Force × distance (work) is the same on both sides, so more force on the rock means more distance for you.
review:
  - q: What is the law of the lever?
    a: At balance, force × distance from the pivot is the same on both sides. A long arm lets a small force move a big load, at the cost of moving further.
  - q: What is the output equation used in this course?
    a: Output ≈ judgment × leverage × effort. Effort varies a few times between people, leverage thousands of times, and judgment sets the direction.
  - q: Why is leverage dangerous with poor judgment?
    a: Leverage multiplies whatever direction you are heading. If judgment points the wrong way, leverage multiplies the losses.
  - q: What did Archimedes claim about the lever?
    a: That given a place to stand and a long enough lever, he could move the Earth. The point is that leverage can multiply a person's force without limit.
---

:::puzzle
Two founders in the same city, in the same year, each work seventy hours a week. They are equally bright and equally hungry.

Ten years later, one runs a pleasant café. The other runs a company used by forty million people.

The difference is not effort. Effort was the same. **So what multiplied one founder's hours a million times and not the other's?**

Some 2,200 years ago a Greek mathematician in Syracuse had a one line answer. He is said to have told the king, "Give me a place to stand, and I will move the Earth."
:::

:::theory The law of the lever
The mathematician was **Archimedes**, and the line was recorded by later writers such as Pappus of Alexandria. Archimedes had worked out the law of the lever properly, in a book called *On the Equilibrium of Planes*.

Picture a plank on a pivot. Push down on one side, and the other side lifts. The plank balances when

<div class="formula">your force × your distance = load × its distance</div>

So if your side is six times longer, you can lift six times your own push. Archimedes' boast about the Earth was this rule taken to its limit: with a long enough lever, any force can move any weight.

<viz-lever></viz-lever>

Notice the price. To lift the rock by 1 cm, a long lever makes you push your end down by many centimetres. A lever does not create energy. It *trades distance for force*. Keep that in mind, because every kind of leverage in business has a price too.
:::

:::theory Effort adds, leverage multiplies, judgment points
Now take the lever out of physics. In work, a useful model is

<div class="formula">output ≈ judgment × leverage × effort</div>

- **Effort** is how hard and how long you work. Between a lazy person and a driven one, it varies by perhaps two or three times.
- **Leverage** is what multiplies your work: people working with you, money working for you, software or media copying your work to millions. It varies by a factor of a thousand, or a million.
- **Judgment** is whether you are pointed in the right direction. It can be positive or negative.

Play with each one.

<viz-output></viz-output>

Doubling effort barely moves the bar. One notch of leverage moves it as much as working ten times harder. And when judgment goes negative, leverage stops being your friend and becomes a very efficient machine for destroying value.

Naval puts it this way: leverage is a force multiplier for your judgment. That is the answer to the puzzle. The second founder didn't work harder. They chose something with enormous leverage, and pointed it well.
:::

:::theory An honest word about effort
It would be easy to take the wrong lesson here and conclude that effort doesn't matter. It does, in three ways.

First, effort is usually what *earns* you leverage. Nobody gives capital or a team to someone who hasn't shown they can deliver. Second, effort spent learning compounds into judgment, the most valuable term in the equation. Third, at the start, before any leverage exists, effort is all you have.

What the equation says is subtler: once the basics are in place, an extra hour of effort is worth far less than a better choice of leverage or a better decision. Working smarter is not a slogan. It is multiplication beating addition.

The next two lessons look at the kinds of leverage one at a time. There are two old ones that need someone's permission, **labour** and **capital**, and two new ones that don't, **code** and **media**.
:::
