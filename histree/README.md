## MHN History Patient Tree Application

The **Mutual hazard networks (MHNs) Algorithm** is a Cancer Progression Model to calculate both promoting and inhibitory relationships between mutations, enabling the reconstruction of the probabilistic tumor evolution from patient data that can be visualized in history trees.

This project is an **interactive Web Application** to dynamically visualize MHN History Trees, making it much easier to explore tumor evolution pathways in real time.

## Features

- Visualization of MHN-based tumor development as an interactive tree
- Customizable view: threshold, eventfilter, scaling of edges, coloring, tooltip information, expand all button
- Upload and Download files
- Theta matrix display of relationships
- Designed for bioinformaticians, oncologists and clinical researchers


## Tech Stack

Here's a brief high-level overview of the tech stack the MHN History Tree Application uses:

- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

- The MHN patient history tree is vizualized by using the package [D3.js](https://d3js.org/) with the [Collapsible Tree](https://observablehq.com/@d3/collapsible-tree) template.

- To ensure a consistent and visually appealing user interface, the UI component library [shadcn/ui](https://ui.shadcn.com/) was used. 

## Background

This application is part of a master's thesis with the aim of combining **methodical modelling with user-friendly visualization**. 

## How to use 

To work with the application, a JSON Order File and a CSV with promoting and inhibiting effects is necessary. 

Upload both files and use the features in the sidebar to adjust and examine the MHN Patient History.

Click the download button to download the SVG of the tree.

## Getting started




## Learn More

?

## Deployment


## License


