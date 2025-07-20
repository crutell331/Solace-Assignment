## How to navigate this repo & the applied changes
- 3 available PRs opened against `main` branch
- Branches are scoped to specific category of improvements and created in this order: 
    1. `components_and_typescript`
    2. `backend_changes` 
    3. `styling_improvements`
- `styling_improvements` branch includes all changes

## Key Improvements

### **Frontend:**
- Full TypeScript implementation with proper interfaces
- Tailwind CSS with consistent design theme
-  Modular component architecture
- Extracted `TableRow` component for reusability
- Proper prop typing and component separation
- Clean, maintainable code structure
- Loading & Error states
- Error handling
- Accessibility compliance

### **Backend:**
- Handle live, RESTful, requests

### **Performance Optimizations**
- Debounce to prevent excessive API calls
- Moved filtering logic to server
- Correct useEffect dependency arrays
- Correct state management for the search form, as well as, other actions