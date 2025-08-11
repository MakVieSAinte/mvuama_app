REM Script d'installation des composants shadcn-vue pour Windows
@echo off

REM Composants de base
npx shadcn-vue@latest add button
npx shadcn-vue@latest add input
npx shadcn-vue@latest add label
npx shadcn-vue@latest add dialog
npx shadcn-vue@latest add card

REM Composants de formulaire
npx shadcn-vue@latest add select
npx shadcn-vue@latest add textarea
npx shadcn-vue@latest add checkbox
npx shadcn-vue@latest add popover
npx shadcn-vue@latest add calendar

REM Composant d'accordion
npx shadcn-vue@latest add accordion

REM Installer date-fns pour la manipulation des dates
npm install date-fns
