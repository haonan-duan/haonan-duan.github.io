---
permalink: /
title: ""
redirect_from: 
  - /about/
  - /about.html
---

<section class="card card--coral reveal" id="about">
  <header class="card__head">
    <h2 class="card__title"><span class="card__icon">👋</span>About</h2>
  </header>
<div markdown="1">

I am a researcher at [NVIDIA GEAR](https://research.nvidia.com/labs/gear/), working under the guidance of Dr. [Jim Fan](https://jimfan.me/) and Prof. [Yuke Zhu](https://yukezhu.me/). My research sits at the intersection of Multimodal Large Language Models and Robot Learning, with a specific focus on building foundation models for robotic perception and manipulation.

Previously, I was a researcher at SenseTime, where I worked on Vision-Language-Action models across pre-training, post-training, and their applications in multi-view generalization and human-robot interaction. I also contributed to video understanding, particularly agent-based reinforcement learning for long-horizon video reasoning.

I received my Ph.D. from the Institute of Automation, Chinese Academy of Sciences in 2024. My doctoral research focused on robotic dexterous grasping and human–robot interaction.

</div>
</section>

<section class="card card--amber reveal" id="news">
  <header class="card__head">
    <h2 class="card__title"><span class="card__icon">✨</span>News</h2>
    <span class="card__chip">{{ site.data.news.size }} updates</span>
  </header>
  <ul class="feed">
    {%- for n in site.data.news %}
    <li class="feed__item">
      <span class="feed__date">{{ n.date }}</span>
      <span class="feed__body">{{ n.body_html }}</span>
    </li>
    {%- endfor %}
  </ul>
</section>

<section class="card card--violet reveal" id="publications">
  <header class="card__head">
    <h2 class="card__title"><span class="card__icon">📄</span>Publications</h2>
    <span class="card__chip">{{ site.data.publications.size }} selected</span>
  </header>
  <p class="card__lede">
    See <a href="https://scholar.google.com/citations?user=4zO4UlcAAAAJ">Google Scholar</a> for the full list.
  </p>
  <div class="papers">
    {%- for pub in site.data.publications %}{% include paper-card.html pub=pub %}
    {%- endfor %}
  </div>
</section>

<section class="card card--sky reveal" id="education">
  <header class="card__head">
    <h2 class="card__title"><span class="card__icon">🎓</span>Education</h2>
  </header>
  <ul class="feed">
    {%- for e in site.data.education %}
    <li class="feed__item">
      <span class="feed__date">{{ e.date }}</span>
      <span class="feed__body">
        <strong>{{ e.degree }}</strong>, {{ e.org }}
        <span class="feed__meta">{{ e.where }}</span>
      </span>
    </li>
    {%- endfor %}
  </ul>
</section>

<section class="card card--mint reveal" id="experience">
  <header class="card__head">
    <h2 class="card__title"><span class="card__icon">💼</span>Experience</h2>
  </header>
  <ul class="feed">
    {%- for x in site.data.experience %}
    <li class="feed__item{% if x.current %} feed__item--current{% endif %}">
      <span class="feed__date">{{ x.date }}</span>
      <span class="feed__body">
        <strong>{{ x.role }}</strong>
        <span class="feed__meta">{{ x.org }}</span>
      </span>
    </li>
    {%- endfor %}
  </ul>
</section>
