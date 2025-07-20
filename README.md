## How to navigate this repo & the applied changes
- 3 available PRs opened against each other to make it easier to see changes by order of implementation
    1. `components_and_typescript` -> `main`
    2. `backend_changes` -> `components_and_typescript`
    3. `styling_improvements` -> `backend_changes`
- `styling_improvements` branch includes all changes

## Key Improvements

### **Frontend:**
- Full TypeScript implementation with proper interfaces
- Tailwind CSS with consistent design theme
- Modular component architecture
- Extracted `TableRow` component for reusability
- Proper prop typing and component separation
- Clean, maintainable code structure
- Loading & Error states
- Error handling
- Accessibility compliance

### **Backend:**
- Handle live, REST, request

### **Performance Optimizations**
- Debounce to prevent excessive API calls
- Moved filtering logic to server
- Correct useEffect dependency arrays
- Correct state management for the search form, as well as, other actions