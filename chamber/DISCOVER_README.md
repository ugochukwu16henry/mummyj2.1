# UYO Chamber of Commerce - Discover Page

## Overview
The discover page showcases 8 points of interest in Uyo, Akwa Ibom State, Nigeria. It uses CSS Grid with named grid areas for responsive layout across different screen sizes.

## Features Implemented

### 1. Responsive Grid Layout
- **Large screens (1025px+)**: 4x2 grid layout
- **Medium screens (641px-1024px)**: 3x3 grid layout with last card spanning 2 columns
- **Small screens (320px-640px)**: Single column layout

### 2. Visit Tracking
Uses localStorage to track user visits and display appropriate messages:
- First visit: "Welcome! Let us know if you have any questions."
- Same day return: "Back so soon! Awesome!"
- Multiple days: "You last visited n days ago."

### 3. Image Hover Effects
CSS hover effects applied to images on medium and large screens only (not on mobile).

### 4. Data Structure
JSON data stored in `data/discover-items.mjs` with 8 items of interest including:
- Ibom Plaza
- Godswill Akpabio International Stadium
- Ibom Connection
- Akwa Ibom State Secretariat
- Ibom Tropicana Entertainment Centre
- University of Uyo
- Akwa Ibom International Airport
- Le Meridien Ibom Hotel & Golf Resort

## Files Created/Modified

### New Files:
- `discover.html` - Main discover page
- `scripts/discover.js` - JavaScript module for discover functionality
- `data/discover-items.mjs` - JSON data for points of interest

### Modified Files:
- `styles/chamber.css` - Added discover page styles with grid areas
- `index.html` - Updated navigation link to point to discover.html

## Image Requirements
The page expects WebP format images (300x200px) for each location:
- ibom-plaza.webp
- stadium.webp
- ibom-connection.webp
- secretariat.webp
- tropicana.webp
- uniuyo.webp
- airport.webp
- meridien.webp

## Grid Areas Implementation
Uses CSS `grid-template-areas` for named grid positioning:
- Each card is assigned to a specific grid area (card1, card2, etc.)
- Different layouts for different screen sizes
- Responsive breakpoints at 640px and 1024px

## Dark Mode Support
Includes dark mode styles for all discover page elements to maintain consistency with the site theme.