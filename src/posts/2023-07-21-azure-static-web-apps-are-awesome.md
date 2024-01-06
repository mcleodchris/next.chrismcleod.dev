---
title: 'Azure Static Web Apps are Awesome!'
date: 2023-07-21
categories:
  - general-life
  - projects
tags:
  - azure
  - microsoft
  - static-web-apps
  - cloud-computing
authors:
  - chris
redirectFrom: ['/2023/07/21/azure-static-web-apps-are-awesome/']
---

 Azure Static Web Apps has become one of my new favourite tools for web development lately, so I wanted to do a quick write-up.

## What is Azure Static Web Apps?

So what is Azure Static Web Apps (SWA), and what can do for you? In a nutshell, it's a modern solution for web development hosted on the Azure cloud. There's no complex server setups and managing infrastructure - with Azure Static Web Apps, you can focus solely on building your front-end magic while Azure handles the rest. Sound useful, right? It absolutely is!

One important thing to make clear - while the name is "Static", and SWA doesn't support pages built dynamically on the server (using PHP/Rails/whatever) - your pages do not need to be basic, un-interactive HTML if you don't want them to be. Static Web Apps supports frameworks like React, Vue, Angular, .NET Blazor, static site generators like Gatsby and 11ty, and [more](https://learn.microsoft.com/en-gb/azure/static-web-apps/front-end-frameworks). On top of that, here's a list of things you get on the **free** tier that can spice up your app:

- Routing
- Authentication/Authorisation
- Serverless functions
- Integrate a database using GraphQL (currently in preview, but it's awesome)
- Custom domains
- CI/CD integration
- [CLI tooling](https://azure.github.io/static-web-apps-cli/)

## Learn and Experiment with Ideas

One of the coolest things about Azure Static Web Apps is how it encourages you to learn and experiment. As a developer, you love trying out new ideas, prototypes, and proof-of-concepts. In the last few weeks I've spun up several sites on SWA just to try out an idea or learn something. I'll be talking more about those in later posts.

Whether you want to build a personal website, an interactive landing page, API-driven frontend, or a progressive web app (PWA), Azure Static Web Apps can help you build it. And to top it off, getting started is a breeze!

## Getting Started Made Super Simple

Deploying to Azure Static Web Apps is super simple. The first time you try it out, you'll be pleasantly surprised by how smooth the process is. So, let me walk through the steps to get you started:

### Step 1: Create Your Azure Static Web App

To begin, head over to the official Azure portal and create your very own Azure Static Web App instance. It's free, and if it's your first Azure account, you get some credits to put towards any paid Azure services that might take your fancy. Don't worry about what's involved in creating the instance; Microsoft have comprehensive [documentation](https://docs.microsoft.com/azure/static-web-apps/overview) that will guide you through every step.

### Step 2: Set Up the Deployment Pipeline

Next up is setting up your deployment pipeline. Azure integrates seamlessly with your version control system. Whether you prefer GitHub, Bitbucket, or Azure Repos, Azure will create a pipeline for you and add it to your repository. Once connected, Azure will automatically build and deploy your app whenever you push new changes.

### Step 3: Experiment with Ideas

Now comes the fun part - experimenting with your ideas! Since Azure Static Web Apps are perfect for prototypes and proof-of-concepts (and production apps too!), you can quickly test different concepts without worrying about server resources. This means you get more time to iterate and refine your ideas!

## Embrace the Power of Serverless Architecture

Another reason why you'll love Azure Static Web Apps is its seamless integration with serverless architecture. With serverless APIs at your disposal, you can add dynamic functionalities to your static web apps without managing backend servers. It's like having the best of both worlds - the simplicity of static sites with the power of dynamic APIs!

As well as regular serverless functions, SWA now has "Database Connections" as a feature preview. With this you can easily hook up to, say, a free-tier Azure CosmosDB instance and - with a couple of configuration files - have a working GraphQL server for your site, including Role-Based Authentication, in minutes.

Serverless Functions and Database Connections have full support for Role-Based Access Control, if that's something you need.

## Boost Your Productivity with Continuous Integration

As a developer, you value productivity, and Azure Static Web Apps delivers it in spades. The beauty of continuous integration is that you can focus on writing code without the distraction of deployment headaches. Plus, you get instant feedback on every change you make, making collaboration with teammates a breeze. Each Pull Request automatically spins-up a preview site with a unique URL - see your changes live before merging in and deploying to Production!

## Learn with Microsoft Training Materials

Regular readers will know I'm a big fan of Microsoft learning resources. They offer a fantastic [learning path](https://learn.microsoft.com/azure/static-web-apps/?WT.mc_id=AZ-MVP-5004080) for Azure Static Web Apps, and in-depth documentation. Even if you're starting from scratch, you'll get up-to-speed in no time with the well-crafted tutorials and guides.

## Wrap Up

So, there you have it - a glimpse of why I think Azure Static Web Apps are genuinely awesome! They empower you to learn, experiment, and innovate with ease. With a user-friendly setup and seamless integration of serverless APIs, it's a real joy to use. 🎉
