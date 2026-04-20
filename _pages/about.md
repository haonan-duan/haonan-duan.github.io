---
permalink: /
title: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<span class='anchor' id='about-me'></span>

I am a researcher at [NVIDIA GEAR](https://research.nvidia.com/labs/gear/), working under the guidence of Dr. [Jim Fan](https://jimfan.me/) and Prof. [Yuke Zhu](https://yukezhu.me/). My research sits at the intersection of Multimodal Large Language Models and Robot Learning, with a specific focus on building foundation models for robotic perception and manipulation.

Previously, I was a researcher at SenseTime, where I worked on Vision-Language-Action models across pre-training, post-training, and their applications in multi-view generalization and human-robot interaction. I also contributed to video understanding, particularly agent-based reinforcement learning for long-horizon video reasoning.

I received my Ph.D. from the Institute of Automation, Chinese Academy of Sciences in 2024. My doctoral research focused on robotic dexterous grasping and human–robot interaction.

# News
{% for n in site.data.news %}- *{{ n.date }}*: {{ n.body_html }}
{% endfor %}

# Publications

Please visit my [Google Scholar](https://scholar.google.com/citations?&user=4zO4UlcAAAAJ) page for full publications.

{% for pub in site.data.publications %}{% include paper-box.html pub=pub %}
{% endfor %}

# Education
- *2021 - 2024*, Ph.D., Institute of Automation, Chinese Academy of Sciences, Beijing, China.
- *2019 - 2021*, M.Sc., University of Pittsburgh, Pittsburgh, Pennsylvania, U.S.

# Experience
- *2026.01 - Now*, Researcher, NVIDIA GEAR.
- *2024.07 - 2025.09*, Senior Researcher, SenseTime Research.
- *2023.01 - 2023.06*, Algorithm Engineer Intern, NIO Autonomous Driving.
