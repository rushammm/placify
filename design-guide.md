# Internship Platform Design Guide

A minimalist design system for a modern internship platform, inspired by contemporary web design principles with a focus on clean aesthetics and user experience.

## 🎨 Design Philosophy

Our design system emphasizes:
- **Minimalism**: Clean, uncluttered interfaces
- **Accessibility**: WCAG 2.1 AA compliant
- **Consistency**: Unified experience across all platforms
- **Dark Mode**: Full support for light and dark themes
- **Performance**: Lightweight and fast-loading components

## 🌈 Color Palette

### Primary Colors
- **Orange**: `#ff4e4e` - Main accent color for CTAs and highlights
- **Pure Black**: `#000000` - High contrast text
- **Pure White**: `#FFFFFF` - Clean backgrounds

### Neutral Grays
```
Gray 50:  #FAFAFA  (Lightest backgrounds)
Gray 100: #F5F5F5  (Card backgrounds)
Gray 200: #E5E5E5  (Borders)
Gray 300: #D4D4D4  (Inactive elements)
Gray 400: #A3A3A3  (Placeholder text)
Gray 500: #737373  (Secondary text)
Gray 600: #525252  (Primary text)
Gray 700: #404040  (Headings)
Gray 800: #262626  (Dark mode backgrounds)
Gray 900: #171717  (Darkest backgrounds)
```

### Semantic Colors
- **Success**: `#10B981` (Green)
- **Warning**: `#F59E0B` (Amber)
- **Error**: `#EF4444` (Red)
- **Info**: `#3B82F6` (Blue)

## 📝 Typography

### Font Stack
```css
font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
```

### Type Scale
- **H1**: `text-3xl` (30px) - Page titles
- **H2**: `text-2xl` (24px) - Section headers
- **H3**: `text-xl` (20px) - Subsection headers
- **H4**: `text-lg` (18px) - Card titles
- **Body**: `text-base` (16px) - Main content
- **Small**: `text-sm` (14px) - Secondary content
- **Caption**: `text-xs` (12px) - Metadata

### Font Weights
- **Regular**: 400 - Body text
- **Medium**: 500 - Emphasized text
- **Semibold**: 600 - Headings
- **Bold**: 700 - Strong emphasis

## 🧩 Component Library

### Buttons

#### Primary Button
```html
<button class="inline-flex items-center justify-center px-4 py-2 rounded-xl font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary bg-primary text-white hover:bg-blue-600 shadow-soft">
  Apply Now
</button>
```

#### Secondary Button
```html
<button class="inline-flex items-center justify-center px-4 py-2 rounded-xl font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary bg-transparent border border-gray-300 text-black hover:bg-gray-100">
  Cancel
</button>
```

#### Ghost Button
```html
<button class="inline-flex items-center justify-center px-4 py-2 rounded-xl font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary bg-transparent text-gray-700 hover:bg-gray-100">
  Learn More
</button>
```

### Form Elements

#### Input Field
```html
<input class="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white" placeholder="Enter your email">
```

#### Textarea
```html
<textarea class="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary resize-none dark:bg-gray-900 dark:border-gray-700 dark:text-white"></textarea>
```

#### Select Dropdown
```html
<select class="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white">
  <option>Choose an option</option>
</select>
```

### Cards

#### Base Card
```html
<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-2xl p-5 shadow-soft">
  <h3 class="text-xl font-medium mb-2">Card Title</h3>
  <p class="text-gray-700 dark:text-gray-300">Card content goes here.</p>
</div>
```

#### Internship Card
```html
<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-2xl p-6 shadow-soft hover:shadow-md transition-all duration-200 hover:border-primary/20">
  <h3 class="text-xl font-medium mb-2">Software Engineering Intern</h3>
  <p class="text-gray-700 dark:text-gray-300 mb-4">Join our dynamic team...</p>
  <div class="flex justify-between items-center">
    <span class="text-sm text-gray-500">Google</span>
    <button class="px-4 py-2 bg-primary text-white rounded-lg">Apply</button>
  </div>
</div>
```

### Status Badges

#### Application Status
```html
<!-- Pending -->
<span class="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
  Pending
</span>

<!-- Accepted -->
<span class="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
  Accepted
</span>

<!-- Rejected -->
<span class="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
  Rejected
</span>
```

### Navigation

#### Sidebar Link
```html
<a href="#" class="flex items-center px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors duration-200">
  <svg class="w-5 h-5 mr-3"><!-- Icon --></svg>
  Dashboard
</a>
```

#### Active Sidebar Link
```html
<a href="#" class="flex items-center px-3 py-2 rounded-xl bg-primary/10 text-primary font-medium">
  <svg class="w-5 h-5 mr-3"><!-- Icon --></svg>
  Internships
</a>
```

### Modals

#### Modal Overlay
```html
<div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
  <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl border border-gray-200 dark:border-gray-800">
    <h2 class="text-xl font-semibold text-black dark:text-white mb-4">Modal Title</h2>
    <p class="text-gray-700 dark:text-gray-300 mb-6">Modal content...</p>
    <div class="flex justify-end space-x-3">
      <button class="px-4 py-2 border border-gray-300 rounded-xl">Cancel</button>
      <button class="px-4 py-2 bg-primary text-white rounded-xl">Confirm</button>
    </div>
  </div>
</div>
```

### Tables

#### Data Table
```html
<div class="w-full border-collapse bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-soft">
  <table class="w-full">
    <thead class="bg-gray-50 dark:bg-gray-800">
      <tr>
        <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
        <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">John Doe</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm">
          <span class="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-xs">Active</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

## 📐 Spacing System

### Padding/Margin Scale
- **xs**: `2px` (0.125rem)
- **sm**: `4px` (0.25rem)
- **md**: `8px` (0.5rem)
- **lg**: `12px` (0.75rem)
- **xl**: `16px` (1rem)
- **2xl**: `24px` (1.5rem)
- **3xl**: `32px` (2rem)
- **4xl**: `48px` (3rem)

### Component Spacing
- **Tight**: `py-2` - Compact components
- **Element**: `py-4` - Standard spacing
- **Component**: `py-6` - Between components
- **Section**: `py-12` - Between major sections

## 🎯 Border Radius

- **Default**: `0.5rem` (8px) - Standard elements
- **Large**: `1rem` (16px) - Cards and containers
- **XL**: `1.25rem` (20px) - Special emphasis

## 🌓 Dark Mode

All components include dark mode variants using the `dark:` prefix. The system uses class-based dark mode toggling.

### Implementation
```html
<html class="dark">
  <!-- Dark mode styles automatically apply -->
</html>
```

## 📱 Responsive Breakpoints

- **sm**: `640px` - Small tablets
- **md**: `768px` - Large tablets
- **lg**: `1024px` - Laptops
- **xl**: `1280px` - Desktops
- **2xl**: `1536px` - Large screens

## ⚡ Animation Guidelines

### Transitions
- **Duration**: 200ms for micro-interactions
- **Easing**: `ease-in-out` for natural movement
- **Properties**: Transform, opacity, colors

### Examples
```css
.transition-base {
  transition: all 200ms ease-in-out;
}

.hover-lift:hover {
  transform: translateY(-2px);
}

.fade-in {
  animation: fadeIn 300ms ease-in-out;
}
```

## 🎪 States & Feedback

### Loading States
```html
<div class="animate-pulse bg-gray-200 dark:bg-gray-800 rounded h-4 w-24"></div>
```

### Empty States
```html
<div class="text-center py-12 text-gray-500 dark:text-gray-400">
  <p>No internships found</p>
</div>
```

### Error States
```html
<div class="text-center py-12 text-red-500 dark:text-red-400">
  <p>Something went wrong</p>
</div>
```

## 🛠️ Implementation Guidelines

### CSS Custom Properties
```css
:root {
  --color-primary: #4E94FF;
  --color-gray-50: #FAFAFA;
  --shadow-soft: 0 2px 8px rgba(0, 0, 0, 0.03);
  --border-radius: 0.5rem;
}
```

### Component Structure
1. **Base styles** - Core appearance
2. **Variants** - Different visual styles
3. **States** - Hover, focus, active, disabled
4. **Responsive** - Mobile-first approach
5. **Dark mode** - Alternative color schemes

## 📋 Usage Examples

### Complete Form
```html
<form class="space-y-4">
  <div>
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Email Address
    </label>
    <input 
      type="email" 
      class="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white"
      placeholder="you@example.com"
    >
  </div>
  
  <div>
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Message
    </label>
    <textarea 
      rows="4"
      class="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary resize-none dark:bg-gray-900 dark:border-gray-700 dark:text-white"
      placeholder="Tell us about yourself..."
    ></textarea>
  </div>
  
  <button class="w-full inline-flex items-center justify-center px-4 py-2 rounded-xl font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary bg-primary text-white hover:bg-blue-600 shadow-soft">
    Submit Application
  </button>
</form>
```

### Dashboard Layout
```html
<div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
  <!-- Sidebar -->
  <aside class="w-60 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 min-h-screen p-4">
    <nav class="space-y-2">
      <a href="#" class="flex items-center px-3 py-2 rounded-xl bg-primary/10 text-primary font-medium">
        Dashboard
      </a>
      <a href="#" class="flex items-center px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
        Internships
      </a>
    </nav>
  </aside>
  
  <!-- Main Content -->
  <main class="flex-1 bg-gray-50 dark:bg-gray-950 p-6">
    <h1 class="text-3xl font-bold tracking-tight text-black dark:text-white mb-6">
      Dashboard
    </h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Content cards -->
    </div>
  </main>
</div>
```

---

**Design Inspiration**: Minimalist, modern web design  
**Framework**: Tailwind CSS  
**Accessibility**: WCAG 2.1 AA compliant  
**Browser Support**: All modern browsers  
**Maintained by**: Internship Platform Team
