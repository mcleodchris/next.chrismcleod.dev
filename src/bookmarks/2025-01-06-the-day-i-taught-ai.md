---
date: 2025-01-06T14:09:47.133Z
title: The day I taught AI to read code like a Senior Developer
bookmarkOf: https://nmn.gl/blog/ai-senior-developer?utm_source=chrismcleoddotdevbookmarks
references:
  https://nmnGl/blog/aiSeniorDeveloper?utmSource=chrismcleoddotdevbookmarks:
    url: https://nmn.gl/blog/ai-senior-developer?utm_source=chrismcleoddotdevbookmarks
    children:
      - type: entry
        name: The day I taught AI to read code like a Senior Developer
        published: 2025-01-05T00:00:00+00:00
        content:
          html: |-
            <p><em>A messy experiment that changed how we think about AI code analysis</em></p>

            <p>Last week, I watched our AI choke on a React codebase - again. As timeout errors flooded my terminal, something clicked. We’d been teaching AI to read code like a fresh bootcamp grad, not a senior developer.</p>

            <p>Here’s what I mean.</p>

            <!--more-->

            <h2 id="the-bootcamp-vs-senior-mindset">The Bootcamp vs Senior Mindset</h2>

            <p>Remember your first day reading production code? Without any experience with handling mature codebases, you probably quickly get lost in the details<sup>[0]</sup></p>

            <p>But watch a senior dev review a massive PR:</p>

            <ul>
              <li>They jump straight to the core files</li>
              <li>Group changes by feature (“all auth changes, all db changes”)</li>
              <li>Build a mental model of architecture first</li>
              <li>Only then dive into implementation</li>
            </ul>

            <p>Obvious in hindsight, right? This realization led us to completely rewire our analyzer.</p>

            <h2 id="the-experiment">The Experiment</h2>

            <p>Instead of dumping files linearly, we built a context-aware grouping system:</p>

            <div class="language-typescript highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="kr">interface</span> <span class="nx">FileGroup</span> <span class="p">{</span>
              <span class="nl">files</span><span class="p">:</span> <span class="nx">ProjectFile</span><span class="p">[];</span>
              <span class="nl">totalSize</span><span class="p">:</span> <span class="kr">number</span><span class="p">;</span>
              <span class="nl">groupContext</span><span class="p">:</span> <span class="kr">string</span><span class="p">;</span> <span class="c1">// 'auth', 'database', etc.</span>
            <span class="p">}</span>

            <span class="k">export</span> <span class="kd">const</span> <span class="nx">groupFiles</span> <span class="o">=</span> <span class="p">(</span><span class="nx">files</span><span class="p">:</span> <span class="nx">ProjectFile</span><span class="p">[]):</span> <span class="nx">FileGroup</span><span class="p">[]</span> <span class="o">=&gt;</span> <span class="p">{</span>
              <span class="c1">// Group files by related functionality and size</span>
              <span class="kd">const</span> <span class="nx">fileInfos</span> <span class="o">=</span> <span class="nx">files</span><span class="p">.</span><span class="nx">map</span><span class="p">(</span><span class="nx">file</span> <span class="o">=&gt;</span> <span class="p">({</span>
                <span class="nx">file</span><span class="p">,</span>
                <span class="na">size</span><span class="p">:</span> <span class="nx">file</span><span class="p">.</span><span class="nx">content</span><span class="p">?.</span><span class="nx">length</span> <span class="o">||</span> <span class="mi">0</span><span class="p">,</span>
                <span class="na">context</span><span class="p">:</span> <span class="nx">getFileContext</span><span class="p">(</span><span class="nx">file</span><span class="p">.</span><span class="nx">path</span><span class="p">)</span>
              <span class="p">}));</span>

              <span class="c1">// Process larger, more important files first</span>
              <span class="nx">fileInfos</span><span class="p">.</span><span class="nx">sort</span><span class="p">((</span><span class="nx">a</span><span class="p">,</span> <span class="nx">b</span><span class="p">)</span> <span class="o">=&gt;</span> <span class="nx">b</span><span class="p">.</span><span class="nx">size</span> <span class="o">-</span> <span class="nx">a</span><span class="p">.</span><span class="nx">size</span><span class="p">);</span>

              <span class="kd">const</span> <span class="na">groups</span><span class="p">:</span> <span class="nx">FileGroup</span><span class="p">[]</span> <span class="o">=</span> <span class="p">[];</span>
              <span class="kd">let</span> <span class="nx">currentGroup</span> <span class="o">=</span> <span class="nx">createEmptyGroup</span><span class="p">();</span>

              <span class="k">for</span> <span class="p">(</span><span class="kd">const</span> <span class="p">{</span> <span class="nx">file</span><span class="p">,</span> <span class="nx">size</span><span class="p">,</span> <span class="nx">context</span> <span class="p">}</span> <span class="k">of</span> <span class="nx">fileInfos</span><span class="p">)</span> <span class="p">{</span>
                <span class="k">if</span> <span class="p">(</span><span class="nx">shouldStartNewGroup</span><span class="p">(</span><span class="nx">currentGroup</span><span class="p">,</span> <span class="nx">size</span><span class="p">,</span> <span class="nx">context</span><span class="p">))</span> <span class="p">{</span>
                  <span class="nx">groups</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">currentGroup</span><span class="p">);</span>
                  <span class="nx">currentGroup</span> <span class="o">=</span> <span class="nx">createNewGroup</span><span class="p">(</span><span class="nx">file</span><span class="p">,</span> <span class="nx">size</span><span class="p">,</span> <span class="nx">context</span><span class="p">);</span>
                <span class="p">}</span> <span class="k">else</span> <span class="p">{</span>
                  <span class="nx">addFileToGroup</span><span class="p">(</span><span class="nx">currentGroup</span><span class="p">,</span> <span class="nx">file</span><span class="p">,</span> <span class="nx">size</span><span class="p">);</span>
                <span class="p">}</span>
              <span class="p">}</span>

              <span class="k">return</span> <span class="nx">groups</span><span class="p">;</span>
            <span class="p">}</span>
            </code></pre></div></div>

            <p>Then we changed how we prompt the AI. Instead of “analyze this file”, we give it context about the feature group first:</p>

            <div class="language-typescript highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="kd">const</span> <span class="nx">buildGroupPrompt</span> <span class="o">=</span> <span class="p">(</span><span class="nx">group</span><span class="p">:</span> <span class="nx">FileGroup</span><span class="p">):</span> <span class="kr">string</span> <span class="o">=&gt;</span> <span class="p">{</span>
              <span class="k">return</span> <span class="s2">`
                Analyzing authentication system files:
                - Core token validation logic
                - Session management
                - Related middleware
                
                Focus on:
                1. How these integrate with existing auth patterns
                2. Security implications
                3. Performance impact on other systems

                Files to analyze:
                </span><span class="p">${</span><span class="nx">formatFiles</span><span class="p">(</span><span class="nx">group</span><span class="p">.</span><span class="nx">files</span><span class="p">)}</span><span class="s2">
              `</span><span class="p">;</span>
            <span class="p">}</span>
            </code></pre></div></div>

            <h2 id="the-holy-shit-moment">The Holy Shit Moment</h2>

            <p>The results broke our benchmark script. We thought it was a bug.</p>

            <p>The AI went from:</p>
            <div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>"This file contains authentication logic using JWT tokens"
            </code></pre></div></div>

            <p>To:</p>
            <div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>"Warning: This auth change could impact websocket connections.
            The token refresh logic shares patterns with the notification 
            service (added last month), suggesting a potential race 
            condition during high-traffic socket reconnects.

            Related PR: #1234 (merged last week) modified the same
            retry logic. Consider adding backoff."
            </code></pre></div></div>

            <p>That’s senior dev level awareness. It was catching connections we hadn’t explicitly taught it about.</p>

            <h2 id="what-actually-changed">What Actually Changed?</h2>

            <p>The magic isn’t in fancy ML or bigger models. It’s in mirroring how senior devs think:</p>

            <ol>
              <li><strong>Context First</strong>: We front-load system understanding before diving into code</li>
              <li><strong>Pattern Matching</strong>: Group similar files to spot repeated approaches</li>
              <li><strong>Impact Analysis</strong>: Consider changes in relation to the whole system</li>
              <li><strong>Historical Understanding</strong>: Track why code evolved certain ways</li>
            </ol>

            <h2 id="the-unexpected-side-effects">The Unexpected Side Effects</h2>

            <p>The system started catching things we didn’t design for:</p>

            <ul>
              <li>Spotting copy-pasted code across different features</li>
              <li>Flagging inconsistent error handling patterns</li>
              <li>Warning about potential performance bottlenecks</li>
              <li>Suggesting architectural improvements based on usage patterns</li>
            </ul>

            <h2 id="why-this-matters">Why This Matters</h2>

            <p>Every few days there’s a new “AI-powered IDE” on Product Hunt. They’re solving the wrong problem. Making code suggestions without deep context is like having a brilliant junior dev who just joined yesterday - they’ll write clean code that subtly breaks everything.</p>

            <p>The key isn’t better code generation. It’s better code understanding.</p>

            <h2 id="open-questions">Open Questions</h2>

            <p>We’re still figuring out:</p>

            <ul>
              <li>When to refresh vs preserve historical understanding</li>
              <li>How to handle conflicting patterns in different parts of the system</li>
              <li>Whether to expose uncertainty in the analysis</li>
            </ul>

            <h2 id="whats-next">What’s Next?</h2>

            <p>I’m curious if we can teach AI to spot other senior dev instincts:</p>

            <ul>
              <li>Identifying tech debt before it happens</li>
              <li>Suggesting architectural improvements</li>
              <li>Catching security issues from usage patterns</li>
              <li>Understanding unwritten team conventions</li>
            </ul>

            <p>The problem isn’t making AI write more code. It’s teaching it to think about code the way experienced developers do.</p>

            <p><small>
            [0] Previously said <em>You probably did what I did - start at line 1, read every file top to bottom, get lost in the details.</em>, edited in response to <a href="https://news.ycombinator.com/item?id=42602156">feedback from advael</a>
            </small></p>
          text: |-
            A messy experiment that changed how we think about AI code analysis

            Last week, I watched our AI choke on a React codebase - again. As timeout errors flooded my terminal, something clicked. We’d been teaching AI to read code like a fresh bootcamp grad, not a senior developer.

            Here’s what I mean.



            The Bootcamp vs Senior Mindset

            Remember your first day reading production code? Without any experience with handling mature codebases, you probably quickly get lost in the details[0]

            But watch a senior dev review a massive PR:


              They jump straight to the core files
              Group changes by feature (“all auth changes, all db changes”)
              Build a mental model of architecture first
              Only then dive into implementation


            Obvious in hindsight, right? This realization led us to completely rewire our analyzer.

            The Experiment

            Instead of dumping files linearly, we built a context-aware grouping system:

            interface FileGroup {
              files: ProjectFile[];
              totalSize: number;
              groupContext: string; // 'auth', 'database', etc.
            }

            export const groupFiles = (files: ProjectFile[]): FileGroup[] => {
              // Group files by related functionality and size
              const fileInfos = files.map(file => ({
                file,
                size: file.content?.length || 0,
                context: getFileContext(file.path)
              }));

              // Process larger, more important files first
              fileInfos.sort((a, b) => b.size - a.size);

              const groups: FileGroup[] = [];
              let currentGroup = createEmptyGroup();

              for (const { file, size, context } of fileInfos) {
                if (shouldStartNewGroup(currentGroup, size, context)) {
                  groups.push(currentGroup);
                  currentGroup = createNewGroup(file, size, context);
                } else {
                  addFileToGroup(currentGroup, file, size);
                }
              }

              return groups;
            }


            Then we changed how we prompt the AI. Instead of “analyze this file”, we give it context about the feature group first:

            const buildGroupPrompt = (group: FileGroup): string => {
              return `
                Analyzing authentication system files:
                - Core token validation logic
                - Session management
                - Related middleware
                
                Focus on:
                1. How these integrate with existing auth patterns
                2. Security implications
                3. Performance impact on other systems

                Files to analyze:
                ${formatFiles(group.files)}
              `;
            }


            The Holy Shit Moment

            The results broke our benchmark script. We thought it was a bug.

            The AI went from:
            "This file contains authentication logic using JWT tokens"


            To:
            "Warning: This auth change could impact websocket connections.
            The token refresh logic shares patterns with the notification 
            service (added last month), suggesting a potential race 
            condition during high-traffic socket reconnects.

            Related PR: #1234 (merged last week) modified the same
            retry logic. Consider adding backoff."


            That’s senior dev level awareness. It was catching connections we hadn’t explicitly taught it about.

            What Actually Changed?

            The magic isn’t in fancy ML or bigger models. It’s in mirroring how senior devs think:


              Context First: We front-load system understanding before diving into code
              Pattern Matching: Group similar files to spot repeated approaches
              Impact Analysis: Consider changes in relation to the whole system
              Historical Understanding: Track why code evolved certain ways


            The Unexpected Side Effects

            The system started catching things we didn’t design for:


              Spotting copy-pasted code across different features
              Flagging inconsistent error handling patterns
              Warning about potential performance bottlenecks
              Suggesting architectural improvements based on usage patterns


            Why This Matters

            Every few days there’s a new “AI-powered IDE” on Product Hunt. They’re solving the wrong problem. Making code suggestions without deep context is like having a brilliant junior dev who just joined yesterday - they’ll write clean code that subtly breaks everything.

            The key isn’t better code generation. It’s better code understanding.

            Open Questions

            We’re still figuring out:


              When to refresh vs preserve historical understanding
              How to handle conflicting patterns in different parts of the system
              Whether to expose uncertainty in the analysis


            What’s Next?

            I’m curious if we can teach AI to spot other senior dev instincts:


              Identifying tech debt before it happens
              Suggesting architectural improvements
              Catching security issues from usage patterns
              Understanding unwritten team conventions


            The problem isn’t making AI write more code. It’s teaching it to think about code the way experienced developers do.


            [0] Previously said You probably did what I did - start at line 1, read every file top to bottom, get lost in the details., edited in response to feedback from advael
        url: https://nmn.gl/blog/ai-senior-developer
      - type: card
        url: https://nmn.gl/blog/ai-senior-developer?utm_source=chrismcleoddotdevbookmarks
        name: |-
          ’s Blog
              
              Thoughts on AI, startups, and life by Namanyay.
              Made with ❤
              © Copyright 2010 – 2025
---

> Making code suggestions without deep context is like having a brilliant junior dev who just joined yesterday - they’ll write clean code that subtly breaks everything.
