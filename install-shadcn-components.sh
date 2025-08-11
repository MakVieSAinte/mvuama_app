#!/bin/bash

# Installer les composants shadcn-vue nécessaires pour le modal d'ajout de véhicule

# Composants de base
npx shadcn-vue@latest add button
npx shadcn-vue@latest add input
npx shadcn-vue@latest add label
npx shadcn-vue@latest add dialog
npx shadcn-vue@latest add card

# Composants de formulaire
npx shadcn-vue@latest add select
npx shadcn-vue@latest add textarea
npx shadcn-vue@latest add checkbox
npx shadcn-vue@latest add popover
npx shadcn-vue@latest add calendar

# Composant d'accordion
npx shadcn-vue@latest add accordion

# Installer date-fns pour la manipulation des dates
npm install date-fns
