## MHN History Patient Tree Application :dna: :computer:	

**Visualize genetic event histories using Mutual Hazard Networks (MHNs)**

This web application allows users to upload and visualize MHN-inferred genetic event orders (History Trees) in tumors from CSV and JSON files. It is designed for scientists in biology, oncology, and bioinformatics, with or without programming background.


## What is MHN?

:woman_technologist:	
:technologist:	
:woman_scientist:	
:scientist:	
:woman_health_worker:	
:health_worker:	

:point_right:	
:speech_balloon:	

The **Mutual hazard networks (MHNs) Algorithm** is a Cancer Progression Model that considers both promoting and inhibitory relationships between genetic events as well as cyclic dependencies, enabling the reconstruction of the probabilistic tumor evolution from patient data that can be visualized in history trees.
<!-- Missing: base rates -->
<!-- Eine Quelle zu den Bäumen noch einfügen (Figure in einem Paper) -->

This project is an **interactive Web Application** to dynamically visualize MHN History Trees, making it much easier to explore tumor evolution pathways in real time.

## Features

:heavy_check_mark: Visualization of MHN-based tumor development as an interactive tree
:heavy_check_mark: Customizable view: threshold, eventfilter, scaling of edges, coloring, tooltip information, expand all button
:heavy_check_mark: Upload JSON files for History Tree View and CSV files for vizualisation of Theta Matrix
:heavy_check_mark: Download SVG of History Tree
:heavy_check_mark: Theta matrix display of relationships

:wrench:	## Tech Stack

Here's a brief high-level overview of the tech stack the MHN History Tree Application uses:

- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

- The MHN patient history tree is vizualized by using the package [D3.js](https://d3js.org/) with the [Collapsible Tree](https://observablehq.com/@d3/collapsible-tree) template.

- To ensure a consistent and visually appealing user interface, the UI component library [shadcn/ui](https://ui.shadcn.com/) was used. 

- For code safety, TypeScript [TypeScript](https://www.typescriptlang.org/) was used. 

:green_circle:	:high_brightness: :clipboard:		## Getting Started

:memo:
:pencil:

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

\subsection{Starting the Project}

\begin{enumerate}
    \item A terminal must be opened in the \textbf{unpacked project folder} by right-clicking on the folder and selecting \enquote{Open in Terminal}.
    
    As an alternative, a terminal can be opened manually and navigated to the project folder using the \code{cd} command:
    
      \faTerminal~Windows: Click on the \faMicrosoft~button or the \faSearch~symbol in the taskbar and search for \enquote{Terminal}. \\[0.5em]
     \faFolder~For example:
    \code{cd C:\textbackslash Users\textbackslash admin\textbackslash Downloads\textbackslash mhn-history-tree}
      
      \faTerminal~macOS: Open the Launchpad and enter \enquote{Terminal} in the search field. \\[0.5em]
    \faFolder~ For example: 
    \code{cd \textasciitilde/Downloads/mhn-history-tree}

    \item The required dependencies are installed by entering and executing:\\[0.5em]
    \code{npm install}\\[0.5em]
    This step is only necessary during the initial setup.

    \item The development server is started using the command:\\[0.5em]
    \code{npm run dev}

    \item Once the server is running, the application can be accessed in a web browser via:\\[0.5em]
    \code{http://localhost:3000}
\end{enumerate}

  \begin{figure}[htbp] % [htbp]
                \centering
                \includegraphics[scale=0.2]{user_guide/localhost_app_initial_render.png} 
                \caption{Initial user interface after starting the app locally with \footnotesize{\code{http://localhost:3000}}.}
   \end{figure} 

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

:books:	## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

