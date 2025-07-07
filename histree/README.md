## MHN History Patient Tree Application

The **Mutual hazard networks (MHNs) Algorithm** is a Cancer Progression Model to calculate both promoting and inhibitory relationships between mutations, enabling the reconstruction of the probabilistic tumor evolution from patient data that can be visualized in history trees.
<!-- Missing: base rates -->
<!-- Eine Quelle zu den Bäumen noch einfügen (Figure in einem Paper) -->

This project is an **interactive Web Application** to dynamically visualize MHN History Trees, making it much easier to explore tumor evolution pathways in real time.

## Features

- Visualization of MHN-based tumor development as an interactive tree
- Customizable view: threshold, eventfilter, scaling of edges, coloring, tooltip information, expand all button
- Upload and Download files 
<!-- what kind of files -->
- Theta matrix display of relationships
- Designed for bioinformaticians, oncologists and clinical researchers


## Tech Stack

Here's a brief high-level overview of the tech stack the MHN History Tree Application uses:

- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

- The MHN patient history tree is vizualized by using the package [D3.js](https://d3js.org/) with the [Collapsible Tree](https://observablehq.com/@d3/collapsible-tree) template.

- To ensure a consistent and visually appealing user interface, the UI component library [shadcn/ui](https://ui.shadcn.com/) was used. 

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
