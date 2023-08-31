---
title: How I use Generative AI to help write blog posts
date: 2023-08-31
tags:
  - blog
  - blogging
  - meta
  - AI
  - LLMs
  - generative AI
---
The rise of large language models (LLMs) like [ChatGPT](https://openai.com/blog/chatgpt/), [Anthropic's Claude](https://www.anthropic.com), [Google Bard](https://blog.google/products/search/bard-google-ai/), and [Bing Chat](https://www.microsoft.com/en-us/bing/bing-chat)with GPT-4 has opened up exciting new possibilities for augmenting creativity. Recently I started using generative AI tools to help me draft my blog posts. I find that AI can be a great way to generate ideas, outlines, and even full drafts of my posts. Coming up with the initial draft is often the hardest and most time consuming part of the blogging process, and using generative tools can be a big win. So how do I do use these tools?

## The process:

1. I ask ChatGPT, Bing Chat, Bard, and Claude for an outline based on a prompt. The prompt is a short sentence or phrase that describes the main idea or theme of the blog post. For example, for this post, the prompt could be `write an outline for a blog post titled "how I use generative AI to draft blog posts"`. Each tool will generate a different outline, with different headings and subheadings, based on the prompt.
2. I compare the outlines from the four tools and choose the one that best suits my purpose and intended audience. If necessary I tweak the outline to the shape of the post I want. I may also combine elements from different outlines or add my own headings and subheadings.
3. I then ask all the tools to write a first draft based on the outline. I provide each tool with the same outline prompt and ask them to generate a draft to a rough word count. Each tool will generate a different draft, with unique wording and style, based on the outline. Sometimes the drafts are *vastly* different to each other, which is interesting to see.
4. I compare and review the drafts. I read each draft carefully and evaluate its quality, coherence, readability, and tone. It's fascinating to see the different tones and styles that emerge in these drafts. I may also ask for specific changes to individual drafts such as "use {X} writing style" or "include a paragraph about {Y}".
5. I select the draft I consider closest to what I had in mind when I started. I may also consider other factors such as originality, creativity, and relevance.
6. I manually edit the draft to the final form, sometimes including elements from other drafts. I proofread and revise the draft to correct any errors, inconsistencies, or gaps in the content.
7. If something still isn't quite sitting right, I will ask one of the tools to review the text for suggested edits or to change the tone. I may also ask for feedback or suggestions from other tools or sources to improve the quality and clarity of the text.

I've found that this process helps me reduce the time to write blog posts significantly. LLMs can generate a lot of ideas and content quickly, and I can then focus on editing and polishing the final product.

## Lessons learned

- Be clear and specific in your prompts. The more specific you are, the better the AI tools will be able to understand what you want.
- Be willing to experiment. The AI tools are still under development, so you may need to try different prompts and settings to get the results you want.
- **Editing is a must.** The AI tools can generate some great words, but it's important to edit and revise it to make sure it's clear, concise, and error-free.

It's also important to use the right tools for the job. Not all generative AI tools are created equal. Some are better at generating ideas, while others are better at writing full drafts. It's also important to be aware of the limitations of these tools. They are also not perfect, and they can sometimes generate text that is inaccurate, biased, or offensive. Over time you will develop a sense of what each is good at.

As an example, I usually find Claude to be the most "eloquent", but equally, can get overly wordy and occasionally go on a tangent to meet a word count. Sometimes that works out for the better, but not always. On the other hand, Bard is usually the most "perfunctory"; it's snappy and to-the-point, but can sometimes produce text that is blunt in tone to the point of rudeness. I also find Bard most likely to [hallucinate](https://zapier.com/blog/ai-hallucinations/) things that weren't asked for[^1]. ChatGPT and its variants sit somewhere in the middle.

[^1]: I once asked Bard to reword some positive performance review feedback from a bullet-point list into a couple of paragraphs. It did it, but also added a whole lot of unasked for and very negative text about poor time management and lack of research skills - both things that were completely unrelated to anything I had written. I did not use its output on that occasion!

Ultimately, the best way to use generative AI is to use it as a starting point. They can help you to generate ideas, outlines, and even full drafts, but you will still need to edit the final output to make sure it's of a high quality to be posted under your name.

While there are certainly [ethical](https://ukfinancialservicesinsights.deloitte.com/post/102i7s2/risks-and-ethical-considerations-of-generative-ai) [concerns](https://www.computer.org/publications/tech-news/trends/ethical-concerns-on-ai-content-creation) around AI content generation, I believe there are also responsible ways we can thoughtfully harness these models as tools. With the right human oversight, LLMs can expand our capabilities and knowledge, or just make certain jobs easier. My writing has already benefited from the interplay of AI and human creativity.

Moving forward, I'm sure my processes will continue evolving as the AI capabilities advance. For now, this collaborative workflow allows me to tap into the strengths of both man and machine. I'm excited to see how generative AI continues to develop in the future.

---

## So what about this post?

How meta! My process for writing this post was basically no different to what I described above, only this time my first prompt included the outline of what I wanted to say as I had already figured that out. The starting prompt was:

```text
write a first draft blog post of roughly 500 words about how I use generative AI/LLMs to draft blog posts, based on the outline below:

- I ask ChatGPT, Bing Chat, Bard, and Claude2 for an outline based on a prompt.
- I edit the outline to the shape of the post I want.
- I then ask the 4 tools to write a first draft based on the outline.
- I compare and review the drafts. I may ask for specific changes such as "use {X} writing style" or "include a point about {Y}".
- I select the draft I consider best.
- I manually edit the draft to the final form, sometimes including elements from another draft.
- If something isn't quite right, I will ask the "winning" tool to review the text for suggested edits/tone
```

The "winner" of the first round, this time, was Google Bard. It provided a nice and coherent draft post which expanded on my outline without going on too many tangents. I felt it was a little slim on details in places, so I edited in selections from Claude and Bing Chat where something needed expanded on. Finally, I asked Claude to review and edit for consistent tone and writing style with the following prompt:

```text
review and suggest edits for the attached Markdown text. Ensure it has a consistent, approachable tone. Correct any grammar and spelling mistakes using UK English. Add hyperlinks to any tools referenced in the text. The final output should be in Markdown format.
```

The output was given one last proofread and minor edits such as adding the front-matter, before being posted as what you're reading right now!
