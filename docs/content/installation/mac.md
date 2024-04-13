+++
title = 'M1/M2 Mac-specific setup'
date = 2024-04-12T21:30:00Z
+++

### Why is it different?
There is an issue with pnpm (which is our package manager) within Docker on M1/M2 Macs. This means the Dev Container won't work (at least not out of the box).

### What are my options?
1. Try and figure out how to get the Dev Container working (advantage: you won't have to install anything directly)
2. Install the environment straight onto your Mac

### Instructions: Option 2
1. Don't setup Docker and don't open the repo in a Dev Container
2. Install Node version 20.11: https://nodejs.org/en/download
3. Run `curl -fsSL https://get.pnpm.io/install.sh | sh -` (from https://pnpm.io/installation)
4. Resume the instructions from [Getting started developing](/installation/developing/), starting at Step 1 (`pnpm i`)
