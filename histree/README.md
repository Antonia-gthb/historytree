<div align="center">
  <h1>🧬 MHN Patient History Tree Application 🌳</h1>
  <p><i>Visualize Genetic Event Histories in Tumors using Mutual Hazard Networks (MHNs)</i></p>
  <img src="/images/app_ganz_build.png" width="500"/>
</div>

# About the Project 💻	

This project is an **interactive web application** to dynamically visualize MHN Patient History Trees, making it much easier to explore tumor evolution pathways in real time.

The web application allows users to upload and visualize MHN-inferred genetic event orders (History Trees) in tumors and relationship effects between events (Theta Matrix) from JSON and CSV files. It is designed for scientists in biology, oncology, and bioinformatics, with or without programming background.


## What is MHN?	

The **Mutual Hazard Networks (MHNs) Algorithm** is a Cancer Progression Model (CPM) that takes into account both **promoting and inhibitory relationships** between genetic events as well as **cyclic dependencies**, enabling the reconstruction of **the most likely tumor evolution path for every tumor** in patient data. These paths can be visualized in History Trees 🌳.

<div align="center">
  <p><i>Example for a MHN Patient History Tree, Figure 5, Schill et al., 2023, modified</i></p>
   <img src="images/tree_modified_schill.png" width="600" alt="History Tree Paper Schill et al" />
</div>

#### <ins>The algorithm generates two files: </ins>

### 📄 CSV - Theta Matrix

The CSV contains:
- **multiplicative effects** between genetic events, promoting as well as inhibitory
- the **base rate** (natural likelihood) of each genetic event to occur
- the **observation rate** (likelihood for the presence of a genetic event to lead to clinical detection of the tumor)


<div align="center">
   <img src="theta_matrix.png" width="600" alt="theta matrix view in the web application" />
</div>

###  📄 JSON - History Tree

Based on the Theta Matrix, the algorithm infers the **order of occurrence** of genetic events for the History Tree, which is stored in the corresponding JSON file.

<div align="center">
   <img src="expandedtree.png" width="600" alt="mhn history tree view in the application with nodes expanded" />
</div>


## Features Overview

:heavy_check_mark: Theta matrix display of relationships between genetic events

:heavy_check_mark: Visualization of MHN-based tumor development as an interactive tree

:heavy_check_mark: Customizable view: threshold, event filtering, scaling of edges, coloring, tooltip information, expand all button

:heavy_check_mark: Upload JSON files for History Tree view and CSV files for visualization of Theta Matrix

:heavy_check_mark: Download SVG of History Tree

## Tech Stack 🔧

Here's a brief high-level overview of the tech stack the MHN History Tree application uses:

- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

- The History Tree and the Theta Matrix are visualized by using the package [D3.js](https://d3js.org/) with the [Collapsible Tree](https://observablehq.com/@d3/collapsible-tree) and [Heatmap with tooltip](https://d3-graph-gallery.com/graph/heatmap_tooltip.html) templates.

- To ensure a consistent and visually appealing user interface, the UI component library [shadcn/ui](https://ui.shadcn.com/) was used. 

- For code safety, [TypeScript](https://www.typescriptlang.org/) was used. 

<details>
<summary><h2>📋 Getting Started </h2></summary>

### ❗Requirements 

- Node.js (version 18 or later) [Download](https://nodejs.org/en/download)

- npm (included in Node.js download) 

- modern web browser (for example, Google Chrome or Mozilla Firefox)

### Download Project

 1. [Download Project ZIP](https://github.com/Antonia-gthb/histree/archive/refs/heads/main.zip)

<!-- Click the **green code button** button and select **Download ZIP** -->

 2. Extract the ZIP file:  Right-click → **Extract All**

 ### Start Project

 1. Open a terminal in the **unpacked project folder**  
   - Right-click the folder → **Open in Terminal**  
   - Or open a terminal manually and navigate to the folder using `cd`:
       - **Example for Windows**
        ```bash
        cd C:\Users\admin\Downloads\historytree
       ```
   
       -  **Example for macOS**
        ```bash
        cd ~/Downloads/historytree
       ```

  2. Install dependencies
   ```
  npm install
  ```

  3. Start the application
   ```
  npm start
  ```
   4. Open the application in your browser using the URL: 
   ```bash
  http://localhost:3000
  ```

   5. To stop the application, press:
   ```bash
   Ctrl + C (Windows)
   # or
   Control + C (macOS)
  ```
</details>

<details>
<summary><h2> 📚Learn More</h2></summary>

##### Modelling Cancer Progression using Mutual Hazard Networks:

📝 [Schill et al., 2019](https://doi.org/10.1093/bioinformatics/btz513)

##### Overcoming Observation Bias for Cancer Progression Modeling:


📝 [Schill et al., 2023](https://doi.org/10.1101/2023.12.03.569824)

<p>&nbsp;</p>

</details>

<details>
<summary><h2> 📷 Feature Demonstration </h2></summary>

<p>&nbsp;</p>

<div align="center">
  <h3>Change the color scheme 🖌️</h3>
 <img src="color_scheme.png" width="600" />
</div>

###
###

---

###

<p>&nbsp;</p>

<div align="center">
   <h3>Visualize specific genetic events ✅</h3>
   <img src="eventfilter.png" width="600" alt="event filtering" />
</div>

###
###

---

###

<p>&nbsp;</p>

<div align="center">
   <h3>Select a specific genetic event and highlight all paths in the tree that include it ✨</h3>
   <img src="highlighted_paths.png" width="600" alt="highlight paths" />
</div>

###
###

---

###

<p>&nbsp;</p>

<div align="center">
   <h3>Adjust the stroke width of the edges linearly to the patient count ↪️</h3>
   <img src="scaling.png" width="600" alt="edge scaling" />
</div>

###
###

---

###

<p>&nbsp;</p>

<div align="center">
   <h3>Filter data based on a minimum patient count 👥</h3>
   <img src="threshold.png" width="600" alt="threshold" />
</div>


</details>
